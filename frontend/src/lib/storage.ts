import { Preset } from '@/components/NoiseActions';

const HISTORY_KEY = 'noiseGoneHistory';
const MAX_HISTORY_ITEMS = 5;

export interface HistoryItem {
  id: string;
  fileName: string;
  dateISO: string;
  preset: Preset;
  durationSec: number;
  sizeBytes: number;
  outputBlobUrl: string; // Внимание: этот URL действителен только для текущей сессии
}

type NewHistoryItem = Omit<HistoryItem, 'id' | 'dateISO'>;

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
};

export const addToHistory = (item: NewHistoryItem) => {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    dateISO: new Date().toISOString(),
  };

  const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  // Перед удалением данных, освобождаем Blob URL'ы
  const history = getHistory();
  history.forEach(item => {
    if (item.outputBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.outputBlobUrl);
    }
  });
  localStorage.removeItem(HISTORY_KEY);
};

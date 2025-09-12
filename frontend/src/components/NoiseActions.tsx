import { Speech, Podcast, Music } from 'lucide-react';

export type Preset = 'speech' | 'podcast' | 'music';

interface NoiseActionsProps {
  onActionSelect: (preset: Preset) => void;
  disabled: boolean;
}

const actions: { id: Preset; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'speech', label: 'Речь', icon: Speech, description: 'Четкий голос, удаление шума' },
  { id: 'podcast', label: 'Подкаст', icon: Podcast, description: 'Студийное качество, компрессия' },
  { id: 'music', label: 'Музыка', icon: Music, description: 'Мягкая нормализация громкости' },
];

export const NoiseActions = ({ onActionSelect, disabled }: NoiseActionsProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
        <h3 className="font-semibold mb-4 text-center text-lg">Выберите пресет обработки</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
            <button
                key={action.id}
                onClick={() => onActionSelect(action.id)}
                disabled={disabled}
                className="flex flex-col items-center justify-center p-6 border rounded-lg transition-all 
                           hover:bg-violet-50 hover:border-violet-400 hover:shadow-lg focus:outline-none 
                           focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:bg-gray-100 
                           disabled:cursor-not-allowed disabled:text-gray-400"
                aria-label={`Применить пресет ${action.label}`}
            >
                <action.icon className="w-10 h-10 mb-2 text-violet-600" aria-hidden="true" />
                <span className="text-base font-medium">{action.label}</span>
                <span className="text-xs text-gray-500">{action.description}</span>
            </button>
        ))}
        </div>
    </div>
  );
};

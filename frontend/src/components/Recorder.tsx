import { Mic, StopCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import * as analytics from '@/lib/analytics';

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const Recorder = ({ onRecordingComplete }: RecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Запись аудио не поддерживается в вашем браузере.");
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      analytics.track('record_started');
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach(track => track.stop()); // Освобождаем микрофон
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        onRecordingComplete(audioBlob);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Не удалось получить доступ к микрофону. Проверьте разрешения в настройках браузера.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return (
    <div className="p-10 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center">
        <Mic className="w-12 h-12 mx-auto text-gray-400 mb-4" aria-hidden="true" />
        <p className="text-gray-600 mb-4">Или запишите аудио с микрофона</p>
        {!isRecording ? (
            <button 
                onClick={startRecording} 
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Начать запись"
            >
                Начать запись
            </button>
        ) : (
            <button 
                onClick={stopRecording}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Остановить запись"
            >
                Остановить ({formatTime(recordingTime)})
            </button>
        )}
    </div>
  );
};

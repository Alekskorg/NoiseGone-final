import { Download, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import * as analytics from '@/lib/analytics';

interface PlayerProps {
  src: string;
  fileName: string;
}

export const Player = ({ src, fileName }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => {
      if (audio) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }
    };
    const setAudioTime = () => audio && setCurrentTime(audio.currentTime);

    audio?.addEventListener('loadeddata', setAudioData);
    audio?.addEventListener('timeupdate', setAudioTime);
    return () => {
      audio?.removeEventListener('loadeddata', setAudioData);
      audio?.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleDownload = () => {
    analytics.track('download_clicked', { fileName });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h3 className="font-semibold text-lg mb-4 text-center">Результат готов!</h3>
      <audio ref={audioRef} src={src} className="hidden" onEnded={() => setIsPlaying(false)} preload="auto" />

      <div className="flex items-center gap-4">
        <button onClick={togglePlayPause} className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2" aria-label={isPlaying ? "Пауза" : "Воспроизвести"}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <div className="w-full">
            <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
            <input 
                type="range" 
                value={duration ? currentTime : 0} 
                max={duration || 0}
                onChange={(e) => {
                    if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                aria-label="Прокрутка аудио"
            />
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <a
          href={src}
          download={fileName}
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Download size={20} />
          Скачать результат
        </a>
      </div>
    </div>
  );
};

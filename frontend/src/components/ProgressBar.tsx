interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const displayProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full text-center">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-violet-600 h-4 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${displayProgress}%` }}
          role="progressbar"
          aria-valuenow={displayProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-center text-sm mt-2 font-medium text-gray-600">
        Обработка... {displayProgress.toFixed(0)}%
      </p>
    </div>
  );
};

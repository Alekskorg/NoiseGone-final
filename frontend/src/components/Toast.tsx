import { useEffect } from 'react';
import { XCircle, CheckCircle, Info } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
};

const colors = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800'
}

export const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 flex items-center gap-4 p-4 rounded-lg border shadow-lg max-w-sm animate-toast-in ${colors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-grow">{message}</p>
      <button onClick={onClose} aria-label="Закрыть уведомление" className="flex-shrink-0 opacity-70 hover:opacity-100">&times;</button>
    </div>
  );
};

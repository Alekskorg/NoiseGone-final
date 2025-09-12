import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropzoneUploaderProps {
  onFileAccepted: (file: File) => void;
}

export const DropzoneUploader = ({ onFileAccepted }: DropzoneUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: {
        'audio/wav': ['.wav'],
        'audio/mpeg': ['.mp3'],
        'audio/mp4': ['.m4a'],
        'audio/ogg': ['.ogg'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-violet-600 bg-violet-50' : 'border-gray-300'}
        ${isFocused ? 'outline-none ring-2 ring-violet-500 ring-offset-2' : ''}
        hover:border-violet-400`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-4" aria-hidden="true" />
      {isDragActive ? (
        <p className="text-violet-600">Отпустите файл для загрузки</p>
      ) : (
        <p className="text-gray-600">Перетащите файл сюда или кликните для выбора</p>
      )}
      <p className="text-sm text-gray-400 mt-2">WAV, MP3, M4A, OGG (до 50MB)</p>
    </div>
  );
};

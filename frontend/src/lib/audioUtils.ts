import { FFmpeg } from '@ffmpeg/ffmpeg';

export const validateFile = (file: Blob, { maxMB, allowedExts }: { maxMB: number; allowedExts: string[] }): string | null => {
    if (file.size > maxMB * 1024 * 1024) {
        return `Файл слишком большой. Максимальный размер: ${maxMB}MB.`;
    }
    
    if (file instanceof File) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !allowedExts.includes(extension)) {
            return `Неподдерживаемый формат файла. Разрешены: ${allowedExts.join(', ')}.`;
        }
    }

    return null;
};

export const getDurationViaWebAudio = (file: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!e.target?.result) return reject('Failed to read file');
            audioContext.decodeAudioData(e.target.result as ArrayBuffer)
                .then(buffer => resolve(buffer.duration))
                .catch(err => reject(`Ошибка декодирования аудио: ${err.message}`));
        };
        reader.onerror = () => reject('File reader error');
        reader.readAsArrayBuffer(file);
    });
};

export const ensureWavMono48k = async (ffmpeg: FFmpeg, inputPath: string, outputPath: string): Promise<void> => {
    await ffmpeg.exec(['-i', inputPath, '-ar', '48000', '-ac', '1', outputPath]);
};

export const createSafeFileName = (originalName: string, preset: string): string => {
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.') || originalName;
    const safeName = nameWithoutExt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return `${safeName}_${preset}.wav`;
};

export const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
        if (error.message.includes('not enough memory')) {
            return 'Недостаточно памяти. Попробуйте файл меньшего размера.';
        }
        return error.message;
    }
    return 'Произошла неизвестная ошибка.';
};

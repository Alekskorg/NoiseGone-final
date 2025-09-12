import { useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { DropzoneUploader } from '@/components/DropzoneUploader';
import { Recorder } from '@/components/Recorder';
import { NoiseActions, Preset } from '@/components/NoiseActions';
import { Player } from '@/components/Player';
import { ProgressBar } from '@/components/ProgressBar';
import { Toast, ToastProps } from '@/components/Toast';
import { useFfmpegNoise } from '@/hooks/useFfmpegNoise';
import * as audioUtils from '@/lib/audioUtils';
import * as storage from '@/lib/storage';
import * as analytics from '@/lib/analytics';

type AppState = 'idle' | 'loading' | 'processing' | 'success' | 'error';

const Home: NextPage = () => {
    const [state, setState] = useState<AppState>('loading');
    const [inputFile, setInputFile] = useState<File | null>(null);
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

    const { loadIfNeeded, processAudio, progress } = useFfmpegNoise();

    useEffect(() => {
        const init = async () => {
            const loaded = await loadIfNeeded();
            if (loaded) {
                setState('idle');
            } else {
                setToast({ message: 'Не удалось загрузить модуль обработки.', type: 'error' });
                setState('error');
            }
        };
        init();
    }, [loadIfNeeded]);
    
    const handleFileAccepted = useCallback(async (file: Blob) => {
        const validationError = audioUtils.validateFile(file, {
            maxMB: 50,
            allowedExts: ['wav', 'mp3', 'm4a', 'ogg'],
        });

        if (validationError) {
            setToast({ message: validationError, type: 'error' });
            return;
        }

        const inputAsFile = file instanceof File ? file : new File([file], "recording.wav", { type: "audio/wav" });
        setInputFile(inputAsFile);
        analytics.track('upload_started', { name: inputAsFile.name, size: inputAsFile.size });
    }, []);

    const handleAction = useCallback(async (preset: Preset) => {
        if (!inputFile) return;

        setState('processing');
        analytics.track('process_started', { preset, fileName: inputFile.name });

        try {
            const url = await processAudio(inputFile, preset);
            if (url) {
                const duration = await audioUtils.getDurationViaWebAudio(inputFile);
                storage.addToHistory({
                    fileName: inputFile.name,
                    preset,
                    outputBlobUrl: url,
                    durationSec: duration,
                    sizeBytes: inputFile.size,
                });
                setOutputUrl(url);
                setState('success');
                analytics.track('process_done', { preset });
            } else {
                throw new Error('Обработка не вернула результат.');
            }
        } catch (err: any) {
            console.error(err);
            const errorMessage = audioUtils.getErrorMessage(err);
            setToast({ message: `Ошибка обработки: ${errorMessage}`, type: 'error' });
            setState('error');
            analytics.track('process_error', { error: errorMessage });
        }
    }, [inputFile, processAudio]);

    const resetState = () => {
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setInputFile(null);
        setOutputUrl(null);
        setState('idle');
    };

    return (
        <>
            <Head>
                <title>NoiseGone — Чистый звук за 10 секунд</title>
            </Head>
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                        Чистый звук за 10 секунд
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Удалите фоновый шум, эхо и другие помехи из ваших аудио.
                        Вся обработка происходит безопасно на вашем устройстве.
                    </p>
                </div>

                <div className="w-full mt-10 space-y-6">
                    {state === 'loading' && <p className="text-center">Загрузка модуля обработки...</p>}
                    
                    {state === 'idle' && !inputFile && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DropzoneUploader onFileAccepted={handleFileAccepted} />
                            <Recorder onRecordingComplete={handleFileAccepted} />
                        </div>
                    )}
                    
                    {inputFile && (
                        <>
                            <div className="p-4 bg-white rounded-lg shadow text-center">
                                <p className="font-medium text-gray-700">Файл: {inputFile.name}</p>
                            </div>

                            {state === 'processing' && <ProgressBar progress={progress} />}

                            {!outputUrl && state !== 'processing' && (
                                <NoiseActions onActionSelect={handleAction} disabled={state !== 'idle' && state !== 'error'} />
                            )}
                        </>
                    )}

                    {outputUrl && (
                        <div className="w-full space-y-4">
                            <Player
                                src={outputUrl}
                                fileName={audioUtils.createSafeFileName(inputFile?.name || 'audio', 'processed')}
                            />
                            <button
                                onClick={resetState}
                                className="w-full text-center text-violet-600 hover:underline"
                            >
                                Обработать другой файл
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
    );
};

export default Home;

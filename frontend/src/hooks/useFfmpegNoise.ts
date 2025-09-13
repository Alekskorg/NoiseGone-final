'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useState, useRef, useCallback } from 'react';
import * as audioUtils from '@/lib/audioUtils';

export type Preset = 'speech' | 'podcast' | 'music';

// Синглтон для FFmpeg
let ffmpegInstance: FFmpeg | null = null;

export const useFfmpegNoise = () => {
  const [isReady, setIsReady] = useState(!!ffmpegInstance);
  const [progress, setProgress] = useState(0);
  const ffmpegRef = useRef<FFmpeg | null>(ffmpegInstance);

  const loadIfNeeded = useCallback(async (): Promise<boolean> => {
    if (ffmpegRef.current?.loaded) {
      setIsReady(true);
      return true;
    }
    try {
      const ffmpeg = new FFmpeg();

      ffmpeg.on('log', ({ message }) => console.log(message));
      ffmpeg.on('progress', ({ progress }) => setProgress(progress)); // 0..1

      // Если файлы лежат в /public/ffmpeg
      await ffmpeg.load({
        coreURL: '/ffmpeg/ffmpeg-core.js',
        wasmURL: '/ffmpeg/ffmpeg-core.wasm',
      });

      ffmpegRef.current = ffmpeg;
      ffmpegInstance = ffmpeg;
      setIsReady(true);
      return true;
    } catch (e) {
      console.error('Failed to load ffmpeg.wasm:', e);
      setIsReady(false);
      return false;
    }
  }, []);

  const processAudio = useCallback(
    async (file: File, preset: Preset): Promise<string | null> => {
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg || !isReady) throw new Error('FFmpeg is not loaded.');

      const inputFileName = `input_${file.name}`;
      const tempFileName = `temp_${file.name}.wav`;
      const outputFileName = `output_${file.name}.wav`;

      let outputUrl: string | null = null;

      try {
        await ffmpeg.writeFile(inputFileName, await fetchFile(file));

        let currentInput = inputFileName;
        if (preset === 'speech' || preset === 'podcast') {
          await audioUtils.ensureWavMono48k(ffmpeg, inputFileName, tempFileName);
          currentInput = tempFileName;
        }

        let command: string[];
        switch (preset) {
          case 'speech':
            command = [
              '-i', currentInput,
              '-af', 'aformat=channel_layouts=mono,afftdn=nf=-20,loudnorm=I=-16:TP=-1.5:LRA=11',
              outputFileName,
            ];
            break;
          case 'podcast':
            command = [
              '-i', currentInput,
              '-af',
              'aformat=channel_layouts=mono,highpass=f=80,lowpass=f=12000,afftdn=nf=-25,compand=attacks=0:decays=0.3:points=-80/-80|-18/-18|-12/-10|0/-3,loudnorm=I=-16:TP=-1.5:LRA=11',
              outputFileName,
            ];
            break;
          case 'music':
          default:
            command = ['-i', currentInput, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=14', outputFileName];
            break;
        }

        await ffmpeg.exec(command);

        // readFile -> Uint8Array
        const data = (await ffmpeg.readFile(outputFileName)) as Uint8Array;

        // ВАЖНО: делаем КОПИЮ, чтобы уйти от SharedArrayBuffer
        const copy = new Uint8Array(data); // создаёт новый ArrayBuffer
        const blob = new Blob([copy], { type: 'audio/wav' });

        outputUrl = URL.createObjectURL(blob);
        return outputUrl;
      } catch (error) {
        console.error('Error during FFmpeg processing:', error);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        throw error;
      } finally {
        try {
          if (await ffmpeg.exists(inputFileName)) await ffmpeg.deleteFile(inputFileName);
          if (await ffmpeg.exists(tempFileName)) await ffmpeg.deleteFile(tempFileName);
          if (await ffmpeg.exists(outputFileName)) await ffmpeg.deleteFile(outputFileName);
        } catch (cleanupError) {
          console.error('Error during FFmpeg file cleanup:', cleanupError);
        }
      }
    },
    [isReady]
  );

  return { loadIfNeeded, processAudio, isReady, progress };
};


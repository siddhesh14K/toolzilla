import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Type definitions
interface WorkerMessage {
  type: 'init' | 'compress' | 'trim';
  payload?: any;
}

interface CompressionPayload {
  file: File;
  compressionLevel: 'low' | 'medium' | 'high';
  outputFormat: 'mp4' | 'webm';
}

interface TrimPayload {
  file: File;
  startTime: number;
  endTime: number;
  format: string;
}

interface CompressionSettings {
  crf: number;
  preset: string;
}

const compressionSettings: Record<string, CompressionSettings> = {
  low: { crf: 23, preset: 'medium' },
  medium: { crf: 28, preset: 'faster' },
  high: { crf: 33, preset: 'veryfast' }
};

let ffmpeg: FFmpeg | null = null;

const initFFmpeg = async () => {
  if (ffmpeg) return;
  
  ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}ffmpeg-core.wasm`, 'application/wasm'),
    workerURL: await toBlobURL(`${baseURL}ffmpeg-core.worker.js`, 'text/javascript'),
  });
};

// Progress tracking helper
const updateProgress = (total: number, current: number) => {
  self.postMessage({
    type: 'progress',
    payload: Math.round((current / total) * 100)
  });
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { type, payload } = e.data;

    switch (type) {
      case 'init':
        await initFFmpeg();
        self.postMessage({ type: 'initialized' });
        break;

      case 'compress': {
        if (!ffmpeg) throw new Error('FFmpeg not initialized');

        const { file, compressionLevel, outputFormat } = payload as CompressionPayload;
        
        // Write input file
        await ffmpeg.writeFile('input', await fetchFile(file));

        // Set compression parameters based on level
        const settings = compressionSettings[compressionLevel];

        // Build FFmpeg command
        const compressArgs = [
          '-i', 'input',
          '-c:v', outputFormat === 'mp4' ? 'libx264' : 'libvpx-vp9',
          '-crf', settings.crf.toString(),
          ...(outputFormat === 'mp4' ? ['-preset', settings.preset] : ['-b:v', '0']),
          '-c:a', outputFormat === 'mp4' ? 'aac' : 'libopus',
          '-b:a', '128k',
          'output.' + outputFormat
        ];

        // Run compression
        await ffmpeg.exec(compressArgs);

        // Read output
        const compressedData = await ffmpeg.readFile('output.' + outputFormat);
        
        // Cleanup
        await ffmpeg.deleteFile('input');
        await ffmpeg.deleteFile('output.' + outputFormat);

        const blob = new Blob([compressedData], { type: `video/${outputFormat}` });
        const buffer = await blob.arrayBuffer();
        self.postMessage({
          type: 'compressed',
          payload: blob
        }, {
          transfer: [buffer]
        });
        break;
      }

      case 'trim': {
        if (!ffmpeg) throw new Error('FFmpeg not initialized');

        const { file, startTime, endTime, format } = payload as TrimPayload;
        
        // Write input file
        await ffmpeg.writeFile('input', await fetchFile(file));
        updateProgress(100, 10);

        // Get keyframe at the nearest position before start time
        const seekArgs = [
          '-i', 'input',
          '-ss', startTime.toString(),
          '-to', endTime.toString(),
          '-c', 'copy',
          '-avoid_negative_ts', 'make_zero',
          '-f', format,
          'output.' + format
        ];

        // Run trim operation
        await ffmpeg.exec(seekArgs);
        updateProgress(100, 90);

        // Read output
        const trimData = await ffmpeg.readFile('output.' + format);
        updateProgress(100, 95);
        
        // Cleanup
        await ffmpeg.deleteFile('input');
        await ffmpeg.deleteFile('output.' + format);
        updateProgress(100, 100);

        const blob = new Blob([trimData], { type: `video/${format}` });
        const buffer = await blob.arrayBuffer();
        self.postMessage({
          type: 'trimmed',
          payload: blob
        }, {
          transfer: [buffer]
        });
        break;
      }

      default:
        throw new Error('Unknown command');
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      payload: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

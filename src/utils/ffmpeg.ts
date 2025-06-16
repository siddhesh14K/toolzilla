import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  size: number;
}

// Singleton FFmpeg instance
let ffmpeg: FFmpeg | null = null;
let isLoading = false;
let loadError: Error | null = null;

// Constants
const FFMPEG_BASE_URL = '/ffmpeg/'; // We'll serve these files locally
const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

export const initFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  if (isLoading) {
    // Wait for existing loading process
    let retries = 0;
    while (isLoading && retries < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      retries++;
    }
    if (ffmpeg) return ffmpeg;
    if (loadError) throw loadError;
  }

  isLoading = true;
  loadError = null;

  try {
    ffmpeg = new FFmpeg();
    
    // Load FFmpeg with WASM from local files
    await Promise.race([
      ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_BASE_URL}ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}ffmpeg-core.wasm`, 'application/wasm'),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('FFmpeg initialization timeout')), TIMEOUT)
      )
    ]);

    return ffmpeg;
  } catch (error) {
    loadError = error instanceof Error ? error : new Error('Failed to initialize FFmpeg');
    ffmpeg = null;
    throw loadError;
  } finally {
    isLoading = false;
  }
};

export const cleanupFFmpeg = async () => {
  if (!ffmpeg) return;
  
  try {
    // List and cleanup all files
    const fileNames = await Promise.all([
      'input',
      'output.mp4',
      'output.webm',
      'output.gif'
    ].map(async name => {
      try {
        await ffmpeg?.readFile(name);
        return name;
      } catch {
        return null;
      }
    }));

    // Delete existing files
    await Promise.all(
      fileNames.filter(Boolean).map(name => 
        ffmpeg!.deleteFile(name!).catch(() => {})
      )
    );
  } catch (error) {
    console.error('FFmpeg cleanup error:', error);
  }
};

export const getVideoMetadata = async (file: File): Promise<VideoMetadata> => {
  const instance = await initFFmpeg();
  const fileName = 'input_' + Date.now();

  try {
    await instance.writeFile(fileName, await fetchFile(file));
    
    const ffprobeResult = await Promise.race([
      instance.exec(['-i', fileName, '-hide_banner']),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Metadata extraction timeout')), TIMEOUT)
      )
    ]) as { stderr: string };
    
    // More robust metadata parsing
    const durationMatch = ffprobeResult.stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.?\d*)/);
    const duration = durationMatch
      ? parseFloat(durationMatch[1]) * 3600 + 
        parseFloat(durationMatch[2]) * 60 + 
        parseFloat(durationMatch[3])
      : 0;

    const resolution = ffprobeResult.stderr.match(/Stream.*Video.*\s(\d{2,})x(\d{2,})/);
    const width = parseInt(resolution?.[1] || '0');
    const height = parseInt(resolution?.[2] || '0');
    const bitrate = parseInt(ffprobeResult.stderr.match(/bitrate: (\d+) kb\/s/)?.[1] || '0');

    if (!duration || !width || !height) {
      throw new Error('Failed to extract video metadata. The file might be corrupted.');
    }

    return {
      duration,
      width,
      height,
      bitrate,
      size: file.size
    };
  } finally {
    // Cleanup temporary file
    await instance.deleteFile(fileName).catch(() => {});
  }
};

const handleProgress = (callback?: (progress: number) => void) => {
  return (event: { progress: number; time: number }) => {
    if (callback) {
      callback(Math.round(event.progress * 100));
    }
  };
};

export const compressVideo = async (
  file: File,
  compressionLevel: 'low' | 'medium' | 'high',
  outputFormat: 'mp4' | 'webm',
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const instance = await initFFmpeg();
  const inputName = 'input_' + Date.now();
  const outputName = 'output_' + Date.now() + '.' + outputFormat;

  try {
    // Check file validity
    const metadata = await getVideoMetadata(file);
    if (!metadata.duration) {
      throw new Error('Invalid video file');
    }

    await instance.writeFile(inputName, await fetchFile(file));

    // Configure compression settings
    const compressionSettings = {
      low: { crf: 23, preset: 'medium' },
      medium: { crf: 28, preset: 'faster' },
      high: { crf: 33, preset: 'veryfast' }
    }[compressionLevel];

    let args: string[] = ['-i', inputName];
    
    if (outputFormat === 'mp4') {
      args = args.concat([
        '-c:v', 'libx264',
        '-crf', compressionSettings.crf.toString(),
        '-preset', compressionSettings.preset,
        '-c:a', 'aac',
        '-b:a', '128k'
      ]);
    } else {
      args = args.concat([
        '-c:v', 'libvpx-vp9',
        '-crf', compressionSettings.crf.toString(),
        '-b:v', '0',
        '-c:a', 'libopus',
        '-b:a', '128k'
      ]);
    }

    args.push(outputName);

    // Set up progress tracking
    if (onProgress) {
      const progressCallback = handleProgress(onProgress);
      instance.on('progress', progressCallback);
      // Store the callback for cleanup
      (instance as any)._progressCallback = progressCallback;
    }

    // Execute with timeout
    await Promise.race([
      instance.exec(args),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Video compression timeout')), TIMEOUT * 2)
      )
    ]);

    // Read and validate output
    const data = await instance.readFile(outputName);
    if (!data || !(data instanceof Uint8Array)) {
      throw new Error('Failed to compress video');
    }

    return new Blob([data], { type: `video/${outputFormat}` });
  } finally {
    // Cleanup
    await Promise.all([
      instance.deleteFile(inputName).catch(() => {}),
      instance.deleteFile(outputName).catch(() => {})
    ]);
    instance.off('progress', handleProgress(onProgress));
  }
};

export const createGif = async (
  file: File,
  fps: number,
  width: number,
  height: number,
  startTime: number,
  duration: number,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  const instance = await initFFmpeg();
  const inputName = 'input_' + Date.now();
  const outputName = 'output.gif';

  try {
    onProgress?.(0);
    await instance.writeFile(inputName, await fetchFile(file));
    onProgress?.(10);

    // Extract frames with specified parameters
    const args = [
      '-i', inputName,
      '-ss', startTime.toString(),
      '-t', duration.toString(),
      '-vf', `fps=${fps},scale=${width}:${height}:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=single[p];[s1][p]paletteuse=new=1`,
      '-f', 'gif',
      outputName
    ];

    // Set up progress tracking
    if (onProgress) {
      instance.on('progress', ({ progress }) => {
        onProgress(10 + progress * 0.8); // Scale progress from 10% to 90%
      });
    }

    await Promise.race([
      instance.exec(args),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('GIF creation timeout')), TIMEOUT * 2)
      )
    ]);

    onProgress?.(90);
    const data = await instance.readFile(outputName);
    if (!data || !(data instanceof Uint8Array)) {
      throw new Error('Failed to create GIF');
    }

    onProgress?.(100);
    return new Blob([data], { type: 'image/gif' });
  } finally {
    // Cleanup
    await Promise.all([
      instance.deleteFile(inputName).catch(() => {}),
      instance.deleteFile(outputName).catch(() => {})
    ]);
    if ((instance as any)._progressCallback) {
      instance.off('progress', (instance as any)._progressCallback);
      delete (instance as any)._progressCallback;
    }
  }
};

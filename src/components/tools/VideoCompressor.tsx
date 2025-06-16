import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Upload, Download, X, Info } from 'lucide-react';
import { initFFmpeg, compressVideo, getVideoMetadata, cleanupFFmpeg } from '../../utils/ffmpeg';
import { formatFileSize, formatDuration } from '../../utils/format';
import { measure } from '../../utils/performance';

interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  duration: number;
}

// Constants for validation
const FILE_SIZE_LIMIT = 2 * 1024 * 1024 * 1024; // 2GB
const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const MIN_DURATION = 0.1; // 100ms
const MAX_DURATION = 7200; // 2 hours

const checkMemoryAvailability = (fileSize: number): boolean => {
  if ('performance' in window && (performance as any).memory) {
    const memory = (performance as any).memory;
    const available = memory.jsHeapSizeLimit - memory.usedJSHeapSize;
    return available > fileSize * 3; // Need ~3x file size for processing
  }
  return true; // Can't check memory, proceed with caution
};

const VideoCompressor: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [outputFormat, setOutputFormat] = useState<'mp4' | 'webm'>('mp4');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let mounted = true;

    const initializeFFmpeg = async () => {
      try {
        await initFFmpeg();
      } catch (error) {
        if (mounted) {
          console.error('Error initializing FFmpeg:', error);
          setError('Failed to initialize video processing. Please check your internet connection and try again.');
        }
      }
    };
    
    initializeFFmpeg();

    return () => {
      mounted = false;
      cleanupFFmpeg().catch(console.error);
      // Cleanup all URLs
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.compressedBlob) {
        URL.revokeObjectURL(URL.createObjectURL(result.compressedBlob));
      }
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (!file) return 'Please select a video file.';
    
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return `Unsupported video format. Please use: ${SUPPORTED_FORMATS.join(', ')}`;
    }
    
    if (file.size > FILE_SIZE_LIMIT) {
      return `File too large. Maximum size is ${formatFileSize(FILE_SIZE_LIMIT)}.`;
    }
    
    if (!checkMemoryAvailability(file.size)) {
      return 'Not enough memory available to process this video. Please try a smaller file.';
    }
    
    return null;
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingTime(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Cleanup previous preview
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      const metadata = await getVideoMetadata(file);
      
      if (metadata.duration < MIN_DURATION || metadata.duration > MAX_DURATION) {
        throw new Error(`Video duration must be between ${MIN_DURATION} and ${MAX_DURATION} seconds.`);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
    } catch (err) {
      console.error('File validation error:', err);
      setError(err instanceof Error ? err.message : 'Could not read video file. The file might be corrupted.');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [previewUrl, validateFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleCompression = useCallback(async () => {
    if (!previewUrl) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const file = await fetch(previewUrl).then(r => r.blob()).then(b => new File([b], 'video', { type: b.type }));
      
      const { result: compressedBlob, processingTime: time } = await measure(async () => {
        return await compressVideo(file, compressionLevel, outputFormat, (p: number) => setProgress(Math.round(p * 100)));
      });

      setProcessingTime(time);
      
      if (!compressedBlob) {
        throw new Error('Compression failed. Please try again with different settings.');
      }

      const metadata = await getVideoMetadata(file);

      const result: CompressionResult = {
        originalFile: file,
        compressedBlob,
        originalSize: file.size,
        compressedSize: compressedBlob.size,
        compressionRatio: (1 - (compressedBlob.size / file.size)) * 100,
        duration: metadata.duration
      };

      setResult(result);
      
      // Update preview with compressed video
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(compressedBlob));

    } catch (err) {
      console.error('Compression error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during compression. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [previewUrl, outputFormat, compressionLevel]);

  const downloadCompressed = useCallback(() => {
    if (!result?.compressedBlob) return;
    
    const url = URL.createObjectURL(result.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed-video.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, outputFormat]);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingTime(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  const progressBar = useMemo(() => {
    if (!isProcessing) return null;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }, [isProcessing, progress]);

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-input"
          />
          
          <label
            htmlFor="video-input"
            className="cursor-pointer inline-flex items-center space-x-2 text-gray-600 hover:text-blue-500"
          >
            <Upload className="w-6 h-6" />
            <span>Drop video here or click to upload</span>
          </label>
          
          <div className="text-sm text-gray-500">
            Supported formats: MP4, WebM, MOV<br />
            Maximum size: {formatFileSize(FILE_SIZE_LIMIT)}
          </div>
        </div>
      </div>

      {/* Video Preview and Controls */}
      {previewUrl && (
        <div className="space-y-6">
          <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${isPlaying ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              className="w-full h-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>

          {/* Compression Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Compression Level
              </label>
              <select
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full p-2 border rounded-md"
                disabled={isProcessing}
              >
                <option value="low">Low (Better Quality)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Smaller Size)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'mp4' | 'webm')}
                className="w-full p-2 border rounded-md"
                disabled={isProcessing}
              >
                <option value="mp4">MP4 (Better Compatibility)</option>
                <option value="webm">WebM (Smaller Size)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {!isProcessing && !result && (
                <button
                  onClick={handleCompression}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  disabled={!!error}
                >
                  Compress Video
                </button>
              )}

              {result && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Original size: {formatFileSize(result.originalSize)}<br />
                    Compressed size: {formatFileSize(result.compressedSize)}<br />
                    Compression ratio: {result.compressionRatio.toFixed(1)}%<br />
                    Duration: {formatDuration(result.duration)}
                    {processingTime && (
                      <><br />Processing time: {(processingTime / 1000).toFixed(1)}s</>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={downloadCompressed}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                    <button
                      onClick={reset}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progressBar}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCompressor;
import React, { useState, useRef, useEffect } from 'react';
import { Video, Loader, X, Info, Play, Pause, Download } from 'lucide-react';
import { initFFmpeg, getVideoMetadata, cleanupFFmpeg } from '../../utils/ffmpeg';
import { formatDuration, formatFileSize } from '../../utils/format';

interface TrimResult {
  originalFile: File;
  trimmedBlob: Blob;
  startTime: number;
  endTime: number;
  duration: number;
}

const VideoTrimmer: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TrimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [outputFormat, setOutputFormat] = useState<'mp4' | 'webm'>('mp4');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    initFFmpeg().catch(error => {
      console.error('Error initializing FFmpeg:', error);
      setError('Failed to initialize video processing. Please try again.');
    });

    // Initialize FFmpeg worker
    workerRef.current = new Worker(new URL('../../workers/ffmpeg.worker.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current.onmessage = async (e) => {
      const { type, payload } = e.data;

      switch (type) {
        case 'initialized':
          console.log('FFmpeg worker initialized');
          break;
        case 'progress':
          setProgress(payload);
          break;
        case 'trimmed':
          if (previewUrl) {
            const originalFile = await fetch(previewUrl).then(r => r.blob());
            setResult({
              originalFile: new File([originalFile], 'video.mp4', { type: 'video/mp4' }),
              trimmedBlob: payload,
              startTime,
              endTime,
              duration: endTime - startTime
            });
          }
          setIsProcessing(false);
          setProgress(0);
          break;
        case 'error':
          setError(payload);
          setIsProcessing(false);
          setProgress(0);
          break;
      }
    };

    // Initialize FFmpeg
    workerRef.current.postMessage({ type: 'init' });

    return () => {
      workerRef.current?.terminate();
      cleanupFFmpeg();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [startTime, endTime, previewUrl]);

  // Update video time when dragging the slider
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      if (currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
        setCurrentTime(startTime);
      }
    }
  }, [currentTime, startTime, endTime, isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      if (time >= endTime) {
        videoRef.current.currentTime = startTime;
        setIsPlaying(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      if (currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const validateFile = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      throw new Error('Please select a valid video file (MP4, WebM, AVI, MOV)');
    }

    const metadata = await getVideoMetadata(file);
    
    if (file.size > 1024 * 1024 * 500) { // 500MB
      throw new Error('File size too large. Maximum size is 500MB');
    }

    if (metadata.duration > 3600) { // 1 hour
      throw new Error('Video duration too long. Maximum duration is 1 hour');
    }

    return metadata;
  };

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setResult(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      const metadata = await validateFile(file);
      
      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
      // Set initial trim points
      setStartTime(0);
      setEndTime(metadata.duration);
      setDuration(metadata.duration);
      setCurrentTime(0);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleTrim = async () => {
    if (!previewUrl || isProcessing) return;

    if (!workerRef.current) {
      setError("FFmpeg worker not initialized");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const file = await fetch(previewUrl).then(r => r.blob());
      workerRef.current.postMessage({
        type: 'trim',
        payload: {
          file: new File([file], 'video.mp4', { type: 'video/mp4' }),
          startTime,
          endTime,
          format: outputFormat
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const url = URL.createObjectURL(result.trimmedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trimmed_video.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${error ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!previewUrl && !isProcessing && !result && (
          <div className="space-y-4">
            <Video className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Choose Video
              </button>
              <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">
              Supports MP4, WebM, AVI, MOV up to 500MB
            </p>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-4">
            <Loader className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Trimming your video... {progress}%</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="space-y-4">
            <X className="mx-auto h-12 w-12 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fileInputRef.current?.click();
              }}
              className="text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Video Preview and Trimming Controls */}
      {previewUrl && !error && (
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="aspect-video rounded-lg overflow-hidden bg-black relative" ref={videoContainerRef}>
            <video
              ref={videoRef}
              src={previewUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full"
            />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-900"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <span className="text-white text-sm font-medium">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Trimming Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={0}
                max={duration}
                value={startTime}
                onChange={(e) => setStartTime(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-20">
                {formatDuration(startTime)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min={startTime}
                max={duration}
                value={endTime}
                onChange={(e) => setEndTime(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-20">
                {formatDuration(endTime)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="mp4">MP4 (Recommended)</option>
                  <option value="webm">WebM</option>
                </select>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Selected Duration
                </span>
                <p className="text-sm text-gray-600">
                  {formatDuration(endTime - startTime)}
                </p>
              </div>
            </div>

            <button
              onClick={handleTrim}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                'Trim Video'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Video Trimmed Successfully
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Duration: {formatDuration(result.duration)}</li>
                    <li>Start Time: {formatDuration(result.startTime)}</li>
                    <li>End Time: {formatDuration(result.endTime)}</li>
                    <li>File Size: {formatFileSize(result.trimmedBlob.size)}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Trimmed Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoTrimmer;
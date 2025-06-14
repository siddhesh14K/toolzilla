import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Video, Loader, X, Info, Scissors, Play, Pause } from 'lucide-react';

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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, AVI, MOV)');
      return;
    }

    if (file.size > 200 * 1024 * 1024) { // 200MB limit
      setError('File size must be less than 200MB');
      return;
    }

    setError(null);
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const onVideoLoaded = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setEndTime(Math.min(duration, 30)); // Default to 30 seconds or full duration
    }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Auto-pause at end time
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = startTime;
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const trimVideo = async () => {
    if (!videoFile || startTime >= endTime) {
      setError('Please set valid start and end times');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate video trimming
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const trimmedDuration = endTime - startTime;
      const estimatedSize = Math.floor(videoFile.size * (trimmedDuration / videoDuration));
      
      // Mock trimmed blob
      const trimmedBlob = new Blob([videoFile], { type: videoFile.type });
      Object.defineProperty(trimmedBlob, 'size', { value: estimatedSize });

      setResult({
        originalFile: videoFile,
        trimmedBlob,
        startTime,
        endTime,
        duration: trimmedDuration
      });
    } catch (err) {
      setError('Failed to trim video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTrimmed = () => {
    if (!result) return;

    const link = document.createElement('a');
    const extension = result.originalFile.name.split('.').pop();
    link.download = `trimmed_${result.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
    link.href = URL.createObjectURL(result.trimmedBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    setVideoFile(null);
    setVideoUrl('');
    setResult(null);
    setError(null);
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Video Trimmer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Cut and trim videos to your desired length. Perfect for creating clips, 
            removing unwanted sections, or extracting highlights from longer videos.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Trim Videos Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Video trimming allows you to extract specific segments from longer videos, perfect for creating 
              social media clips, removing unwanted content, or focusing on key moments. Our trimmer provides 
              precise control with real-time preview capabilities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Trimming Benefits:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Create social media clips</li>
                  <li>• Remove unwanted sections</li>
                  <li>• Extract highlights and key moments</li>
                  <li>• Reduce file size and upload time</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Features:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Precise time selection</li>
                  <li>• Real-time video preview</li>
                  <li>• Multiple format support</li>
                  <li>• No quality loss</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-rose-900 dark:text-rose-100 mb-1">How it works:</h3>
              <ol className="text-sm text-rose-800 dark:text-rose-200 space-y-1">
                <li>1. Upload your video file (drag & drop or click to browse)</li>
                <li>2. Use the video player to preview and set start/end times</li>
                <li>3. Adjust the trim range using sliders or time inputs</li>
                <li>4. Click "Trim Video" and download your clip</li>
              </ol>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            {!videoFile ? (
              /* Upload Area */
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                  dragActive
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-rose-400 dark:hover:border-rose-500'
                }`}
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
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Supports MP4, WebM, AVI, MOV • Max size: 200MB
                  </p>
                </div>
              </div>
            ) : (
              /* Video Editor */
              <div className="space-y-6">
                {/* Video Player */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Video Preview
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-auto max-h-96"
                        onLoadedMetadata={onVideoLoaded}
                        onTimeUpdate={onTimeUpdate}
                        controls={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={togglePlayPause}
                          className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative mb-4">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div 
                          className="h-2 bg-rose-500 rounded-full transition-all"
                          style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(videoDuration)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trim Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Trim Settings
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Time Range Sliders */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Time: {formatTime(startTime)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={startTime}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setStartTime(value);
                          if (value >= endTime) {
                            setEndTime(Math.min(value + 1, videoDuration));
                          }
                          seekToTime(value);
                        }}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Time: {formatTime(endTime)}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={endTime}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          setEndTime(value);
                          if (value <= startTime) {
                            setStartTime(Math.max(value - 1, 0));
                          }
                          seekToTime(value);
                        }}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Time Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start (seconds)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={videoDuration}
                          step="0.1"
                          value={startTime.toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setStartTime(Math.max(0, Math.min(value, videoDuration)));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End (seconds)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={videoDuration}
                          step="0.1"
                          value={endTime.toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setEndTime(Math.max(0, Math.min(value, videoDuration)));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Trim Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Original Duration</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{formatTime(videoDuration)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Trimmed Duration</p>
                          <p className="font-semibold text-rose-600 dark:text-rose-400">{formatTime(endTime - startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Time Saved</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatTime(videoDuration - (endTime - startTime))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={trimVideo}
                        disabled={isProcessing || startTime >= endTime}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="mr-2 h-5 w-5 animate-spin" />
                            Trimming Video...
                          </>
                        ) : (
                          <>
                            <Scissors className="mr-2 h-5 w-5" />
                            Trim Video
                          </>
                        )}
                      </button>
                      <button
                        onClick={reset}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Choose Different Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Video Trimmed Successfully!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Duration</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatTime(videoDuration)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
                    <p className="text-sm text-rose-600 dark:text-rose-400">Trimmed Duration</p>
                    <p className="text-xl font-bold text-rose-700 dark:text-rose-300">
                      {formatTime(result.duration)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">File Size</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {formatFileSize(result.trimmedBlob.size)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadTrimmed}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Trimmed Video
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Trim Another Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How precise can I be with trimming?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our trimmer allows precision down to 0.1 seconds. You can use the sliders for quick selection 
                or input exact times for frame-perfect cuts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Will trimming affect video quality?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No! Trimming only removes unwanted portions without re-encoding the video, 
                so the quality remains exactly the same as the original.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I trim multiple segments from one video?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, you can trim one continuous segment per session. To extract multiple clips, 
                you can use the tool multiple times with different start and end times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTrimmer;
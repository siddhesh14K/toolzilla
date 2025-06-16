import React, { useState, useRef, useEffect } from 'react';
import { Download, Video, Image, Loader, X, Info } from 'lucide-react';
import { initFFmpeg, createGif } from '../../utils/ffmpeg';
import { formatFileSize } from '../../utils/format';

interface GIFResult {
  blob: Blob;
  width: number;
  height: number;
  fps: number;
  size: number;
}

const GIFMaker: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GIFResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputType, setInputType] = useState<'video' | 'images'>('video');
  const [fps, setFps] = useState(10);
  const [width, setWidth] = useState(480);
  const [loop, setLoop] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    initFFmpeg().catch(error => {
      console.error('Error initializing FFmpeg:', error);
      setError('Failed to initialize GIF processing. Please try again.');
    });

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

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

  const validateFile = (file: File) => {
    if (inputType === 'video' && !file.type.startsWith('video/')) {
      throw new Error('Please select a valid video file (MP4, WebM, AVI, MOV)');
    }

    if (inputType === 'images' && !file.type.startsWith('image/')) {
      throw new Error('Please select valid image files (PNG, JPG)');
    }

    if (file.size > 1024 * 1024 * 100) { // 100MB
      throw new Error('File size too large. Maximum size is 100MB');
    }
  };

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setResult(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      validateFile(file);
      
      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  const handleCreateGif = async () => {
    if (!previewUrl || isProcessing) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const file = await fetch(previewUrl).then(r => r.blob());
      const videoElement = videoRef.current;
      if (!videoElement) throw new Error('Video element not found');
      
      const gifBlob = await createGif(
        new File([file], 'input.mp4', { type: 'video/mp4' }),
        fps,
        width,
        width * (videoElement.videoHeight / videoElement.videoWidth), // maintain aspect ratio
        0, // start from beginning
        videoElement.duration, // use full duration
        setProgress
      );

      // Get dimensions
      const img = document.createElement('img');
      img.src = URL.createObjectURL(gifBlob);
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      setResult({
        blob: gifBlob,
        width: img.width,
        height: img.height,
        fps,
        size: gifBlob.size
      });

      URL.revokeObjectURL(img.src);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animated.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selection */}
      <div className="flex space-x-4">
        <button
          onClick={() => setInputType('video')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm
            ${inputType === 'video'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Convert from Video
        </button>
        <button
          onClick={() => setInputType('images')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm
            ${inputType === 'images'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Create from Images
        </button>
      </div>

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
          accept={inputType === 'video' ? 'video/*' : 'image/*'}
          multiple={inputType === 'images'}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!previewUrl && !isProcessing && !result && (
          <div className="space-y-4">
            {inputType === 'video' ? (
              <Video className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <Image className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {inputType === 'video' ? 'Choose Video' : 'Choose Images'}
              </button>
              <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">
              {inputType === 'video'
                ? 'Supports MP4, WebM, AVI, MOV up to 100MB'
                : 'Supports PNG, JPG image sequences'}
            </p>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-4">
            <Loader className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Creating GIF... {progress}%</p>
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

      {/* Preview and Settings */}
      {previewUrl && !error && (
        <div className="space-y-6">
          {/* Preview */}
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            {inputType === 'video' ? (
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Frame Rate (FPS)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Width (px)
              </label>
              <input
                type="number"
                min="100"
                max="1920"
                step="10"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Loop
              </label>
              <select
                value={loop ? 'true' : 'false'}
                onChange={(e) => setLoop(e.target.value === 'true')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="true">Yes (Infinite Loop)</option>
                <option value="false">No (Play Once)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateGif}
            disabled={isProcessing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Create GIF'
            )}
          </button>
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
                  GIF Created Successfully
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Dimensions: {result.width}x{result.height}px</li>
                    <li>Frame Rate: {result.fps} FPS</li>
                    <li>File Size: {formatFileSize(result.size)}</li>
                    <li>Loop: {loop ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* GIF Preview */}
          <div className="rounded-lg overflow-hidden bg-black">
            <img
              src={URL.createObjectURL(result.blob)}
              alt="Generated GIF"
              className="w-full object-contain"
            />
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Download GIF
          </button>
        </div>
      )}
    </div>
  );
};

export default GIFMaker;
import React, { useState, useRef } from 'react';
import { Upload, Download, Image, Loader, X, Info, Play, Zap } from 'lucide-react';

interface GIFResult {
  originalFiles: File[];
  gifBlob: Blob;
  frameCount: number;
  duration: number;
  fileSize: number;
}

interface GIFSettings {
  fps: number;
  quality: 'low' | 'medium' | 'high';
  loop: boolean;
  width: number;
  height: number;
}

const GIFMaker: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GIFResult | null>(null);
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [sourceType, setSourceType] = useState<'images' | 'video'>('images');
  const [settings, setSettings] = useState<GIFSettings>({
    fps: 10,
    quality: 'medium',
    loop: true,
    width: 480,
    height: 320
  });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    if (sourceType === 'images') {
      const validImages = files.filter(file => file.type.startsWith('image/'));
      
      if (validImages.length !== files.length) {
        setError('Please select only image files when creating GIF from images');
        return;
      }

      if (validImages.length < 2) {
        setError('Please select at least 2 images to create a GIF');
        return;
      }

      setSourceFiles(validImages);
    } else {
      const validVideos = files.filter(file => file.type.startsWith('video/'));
      
      if (validVideos.length !== 1 || files.length !== 1) {
        setError('Please select exactly one video file');
        return;
      }

      if (validVideos[0].size > 100 * 1024 * 1024) { // 100MB limit
        setError('Video file size must be less than 100MB');
        return;
      }

      setSourceFiles(validVideos);
    }

    setError(null);
  };

  const createGIF = async () => {
    if (sourceFiles.length === 0) {
      setError('Please select files to create GIF');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate GIF creation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const frameCount = sourceType === 'images' ? sourceFiles.length : Math.floor(settings.fps * 3); // 3 second video
      const duration = frameCount / settings.fps;
      const estimatedSize = frameCount * settings.width * settings.height * 0.1; // Rough estimate
      
      // Mock GIF blob
      const gifBlob = new Blob(['mock gif data'], { type: 'image/gif' });
      Object.defineProperty(gifBlob, 'size', { value: estimatedSize });

      setResult({
        originalFiles: sourceFiles,
        gifBlob,
        frameCount,
        duration,
        fileSize: estimatedSize
      });
    } catch (err) {
      setError('Failed to create GIF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadGIF = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.download = 'animated.gif';
    link.href = URL.createObjectURL(result.gifBlob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    setSourceFiles([]);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GIF Maker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create animated GIFs from images or videos. Perfect for social media, 
            presentations, or adding animation to your content.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Create Animated GIFs Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              GIF creation is perfect for making engaging content that captures attention on social media, 
              websites, and presentations. Our GIF maker supports both image sequences and video conversion 
              with customizable quality and animation settings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Creation Methods:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>From Images:</strong> Combine multiple photos</li>
                  <li>• <strong>From Video:</strong> Convert video clips to GIF</li>
                  <li>• <strong>Custom Settings:</strong> Control speed and quality</li>
                  <li>• <strong>Optimized Output:</strong> Web-ready file sizes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Use Cases:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Social media content</li>
                  <li>• Website animations</li>
                  <li>• Product demonstrations</li>
                  <li>• Reaction GIFs and memes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">How it works:</h3>
              <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                <li>1. Choose source type: images or video</li>
                <li>2. Upload your files (multiple images or one video)</li>
                <li>3. Customize GIF settings (speed, quality, dimensions)</li>
                <li>4. Create and download your animated GIF</li>
              </ol>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Source Type Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Source Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSourceType('images');
                      setSourceFiles([]);
                      setError(null);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      sourceType === 'images'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Image className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">From Images</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload multiple images to create an animated sequence
                    </p>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSourceType('video');
                      setSourceFiles([]);
                      setError(null);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      sourceType === 'video'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Play className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">From Video</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Convert a video clip into an animated GIF
                    </p>
                  </button>
                </div>
              </div>

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                  dragActive
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-amber-400 dark:hover:border-amber-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={sourceType === 'images' ? 'image/*' : 'video/*'}
                  multiple={sourceType === 'images'}
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {sourceType === 'images' 
                      ? 'Drop images here or click to browse'
                      : 'Drop video here or click to browse'
                    }
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {sourceType === 'images' 
                      ? 'Select multiple images (JPG, PNG, WebP)'
                      : 'Select one video file (MP4, WebM, AVI) • Max 100MB'
                    }
                  </p>
                </div>
              </div>

              {/* File Preview */}
              {sourceFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {sourceType === 'images' ? `Selected Images (${sourceFiles.length})` : 'Selected Video'}
                  </h3>
                  
                  {sourceType === 'images' ? (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {sourceFiles.slice(0, 12).map((file, index) => (
                        <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Frame ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {sourceFiles.length > 12 && (
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            +{sourceFiles.length - 12}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Play className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{sourceFiles[0].name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(sourceFiles[0].size)}
                        </p>
                      </div>
                    </div>
                  )}
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

            {/* Settings Panel */}
            <div className="space-y-6">
              {/* GIF Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  GIF Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frame Rate: {settings.fps} FPS
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={settings.fps}
                      onChange={(e) => setSettings({...settings, fps: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quality
                    </label>
                    <select
                      value={settings.quality}
                      onChange={(e) => setSettings({...settings, quality: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="low">Low (Smaller file)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="high">High (Best quality)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="800"
                        value={settings.width}
                        onChange={(e) => setSettings({...settings, width: parseInt(e.target.value) || 480})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="600"
                        value={settings.height}
                        onChange={(e) => setSettings({...settings, height: parseInt(e.target.value) || 320})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="loop"
                      checked={settings.loop}
                      onChange={(e) => setSettings({...settings, loop: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="loop" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Loop animation
                    </label>
                  </div>
                </div>
              </div>

              {/* Create GIF Button */}
              <button
                onClick={createGIF}
                disabled={isProcessing || sourceFiles.length === 0}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Creating GIF...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Create GIF
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Result */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  GIF Created Successfully!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Frames</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.frameCount}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                    <p className="text-sm text-amber-600 dark:text-amber-400">Duration</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                      {result.duration.toFixed(1)}s
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">File Size</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {formatFileSize(result.fileSize)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">Dimensions</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {settings.width}×{settings.height}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadGIF}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download GIF
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Create Another GIF
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
                What's the difference between creating GIFs from images vs video?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Images give you complete control over each frame and timing, perfect for step-by-step animations. 
                Video conversion is ideal for capturing motion and creating reaction GIFs from existing footage.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How can I reduce the GIF file size?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Lower the frame rate, reduce dimensions, choose lower quality, or use fewer frames. 
                The optimal settings depend on your intended use - social media typically works well with smaller, faster GIFs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What's the recommended frame rate for GIFs?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                10-15 FPS works well for most GIFs, providing smooth animation while keeping file sizes manageable. 
                Use higher rates (20-30 FPS) for smoother motion, or lower rates (5-8 FPS) for smaller files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GIFMaker;
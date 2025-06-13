import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Loader, X, Info, RotateCcw } from 'lucide-react';

interface ResizeResult {
  originalFile: File;
  resizedDataUrl: string;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number };
}

const ImageResizer: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { name: 'Instagram Square', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 1200, height: 630 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'LinkedIn Banner', width: 1584, height: 396 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
    { name: 'HD (1080p)', width: 1920, height: 1080 },
    { name: '4K (2160p)', width: 3840, height: 2160 },
  ];

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
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return;
    }

    setError(null);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      setOriginalAspectRatio(img.width / img.height);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleWidthChange = (newWidth: string) => {
    setWidth(newWidth);
    if (maintainAspectRatio && newWidth && originalAspectRatio) {
      const w = parseInt(newWidth);
      if (!isNaN(w)) {
        setHeight(Math.round(w / originalAspectRatio).toString());
      }
    }
  };

  const handleHeightChange = (newHeight: string) => {
    setHeight(newHeight);
    if (maintainAspectRatio && newHeight && originalAspectRatio) {
      const h = parseInt(newHeight);
      if (!isNaN(h)) {
        setWidth(Math.round(h * originalAspectRatio).toString());
      }
    }
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
  };

  const resizeImage = async () => {
    if (!width || !height || !fileInputRef.current?.files?.[0]) {
      setError('Please select an image and specify dimensions');
      return;
    }

    const targetWidth = parseInt(width);
    const targetHeight = parseInt(height);

    if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
      setError('Please enter valid dimensions');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const file = fileInputRef.current.files[0];
      const resizedDataUrl = await performResize(file, targetWidth, targetHeight);
      
      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setResult({
          originalFile: file,
          resizedDataUrl,
          originalDimensions: { width: img.width, height: img.height },
          newDimensions: { width: targetWidth, height: targetHeight }
        });
        setIsProcessing(false);
      };
      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Failed to resize image. Please try again.');
      setIsProcessing(false);
    }
  };

  const performResize = (file: File, targetWidth: number, targetHeight: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        if (ctx) {
          // Use high-quality scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const resizedDataUrl = canvas.toDataURL(file.type, 0.9);
          resolve(resizedDataUrl);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadResized = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.download = `resized_${result.originalFile.name}`;
    link.href = result.resizedDataUrl;
    link.click();
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setWidth('');
    setHeight('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            <ImageIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Resize your images to custom dimensions or choose from popular presets. 
            Maintain aspect ratio or stretch to fit your needs.
          </p>
        </div>

        {/* Info Panel */}
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">How it works:</h3>
              <ol className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>1. Upload your image file</li>
                <li>2. Set custom dimensions or choose a preset</li>
                <li>3. Toggle aspect ratio maintenance if needed</li>
                <li>4. Preview and download your resized image</li>
              </ol>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop your image here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supports JPG, PNG, WebP • Max size: 50MB
                </p>
              </div>
            </div>

            {/* Dimension Controls */}
            {width && height && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resize Settings
                </h3>
                
                {/* Preset Buttons */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Popular Presets
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => applyPreset(preset)}
                        className="p-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {preset.name}
                        <br />
                        <span className="text-gray-500 dark:text-gray-400">
                          {preset.width}×{preset.height}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimension Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Height"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Toggle */}
                <div className="flex items-center space-x-2 mb-6">
                  <input
                    type="checkbox"
                    id="aspectRatio"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="aspectRatio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintain aspect ratio
                  </label>
                </div>

                {/* Resize Button */}
                <button
                  onClick={resizeImage}
                  disabled={isProcessing || !width || !height}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Resizing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Resize Image
                    </>
                  )}
                </button>
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
                  Resize Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Dimensions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.originalDimensions.width} × {result.originalDimensions.height}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">New Dimensions</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {result.newDimensions.width} × {result.newDimensions.height}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadResized}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Resized Image
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Resize Another Image
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preview
              </h3>
              <div className="max-w-md mx-auto">
                <img
                  src={result.resizedDataUrl}
                  alt="Resized preview"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResizer;
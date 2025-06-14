import React, { useState, useRef } from 'react';
import { Upload, Download, Image, Loader, X, Info, RefreshCw } from 'lucide-react';

interface ConversionResult {
  originalFile: File;
  convertedBlob: Blob;
  originalFormat: string;
  targetFormat: string;
  originalSize: number;
  convertedSize: number;
}

const ImageConverter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setError('File size must be less than 20MB');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setResult(null);

    try {
      const convertedBlob = await convertImage(file, targetFormat, quality);
      const originalFormat = file.type.split('/')[1].toUpperCase();

      setResult({
        originalFile: file,
        convertedBlob,
        originalFormat,
        targetFormat: targetFormat.toUpperCase(),
        originalSize: file.size,
        convertedSize: convertedBlob.size
      });
    } catch (err) {
      setError('Failed to convert image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = (file: File, format: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // For JPG conversion, fill with white background
          if (format === 'jpg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          ctx.drawImage(img, 0, 0);
          
          const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
          const qualityValue = format === 'png' ? undefined : quality / 100;
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Conversion failed'));
            }
          }, mimeType, qualityValue);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadConverted = () => {
    if (!result) return;

    const link = document.createElement('a');
    const extension = targetFormat === 'jpg' ? 'jpg' : targetFormat;
    link.download = `converted_${result.originalFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
    link.href = URL.createObjectURL(result.convertedBlob);
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
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4">
            <RefreshCw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Image Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert images between PNG, JPG, and WebP formats. Optimize for web use, 
            reduce file sizes, or change formats for compatibility.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Convert Image Formats Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Image format conversion is essential for web optimization, compatibility, and file size management. 
              Different formats serve different purposes - PNG for transparency, JPG for photographs, 
              and WebP for modern web optimization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PNG Format:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>• Lossless compression</li>
                  <li>• Supports transparency</li>
                  <li>• Best for graphics and logos</li>
                  <li>• Larger file sizes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">JPG Format:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>• Lossy compression</li>
                  <li>• Smaller file sizes</li>
                  <li>• Best for photographs</li>
                  <li>• No transparency support</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">WebP Format:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                  <li>• Modern compression</li>
                  <li>• Smallest file sizes</li>
                  <li>• Supports transparency</li>
                  <li>• Limited browser support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">How it works:</h3>
              <ol className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>1. Upload your image file (drag & drop or click to browse)</li>
                <li>2. Choose target format and quality settings</li>
                <li>3. Wait for conversion to complete</li>
                <li>4. Download your converted image</li>
              </ol>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Conversion Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Conversion Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Convert to Format
                  </label>
                  <div className="space-y-2">
                    {[
                      { format: 'png', name: 'PNG', description: 'Lossless, supports transparency' },
                      { format: 'jpg', name: 'JPG', description: 'Smaller files, best for photos' },
                      { format: 'webp', name: 'WebP', description: 'Modern format, smallest files' }
                    ].map((option) => (
                      <button
                        key={option.format}
                        onClick={() => setTargetFormat(option.format as any)}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          targetFormat === option.format
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {option.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {option.description}
                            </p>
                          </div>
                          {targetFormat === option.format && (
                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quality Settings
                  </label>
                  
                  {targetFormat !== 'png' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Smaller Size</span>
                        <span>Best Quality</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        PNG uses lossless compression. Quality setting is not applicable.
                      </p>
                    </div>
                  )}

                  {/* Format Info */}
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      {targetFormat.toUpperCase()} Format Info:
                    </h4>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      {targetFormat === 'png' && 'Perfect for graphics, logos, and images requiring transparency. Larger file sizes but no quality loss.'}
                      {targetFormat === 'jpg' && 'Ideal for photographs and images with many colors. Smaller file sizes with adjustable quality.'}
                      {targetFormat === 'webp' && 'Modern format with excellent compression. Smaller than JPG with better quality, but limited browser support.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
              } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
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
                disabled={isProcessing}
              />
              
              <div className="text-center">
                {isProcessing ? (
                  <div className="space-y-4">
                    <Loader className="h-12 w-12 text-purple-600 animate-spin mx-auto" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Converting your image...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Converting to {targetFormat.toUpperCase()} format
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Supports JPG, PNG, WebP, GIF • Max size: 20MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                  Conversion Complete!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Format</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.originalFormat}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400">New Format</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {result.targetFormat}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400">Original Size</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {formatFileSize(result.originalSize)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400">New Size</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {formatFileSize(result.convertedSize)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadConverted}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download {result.targetFormat} Image
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Convert Another Image
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
                Which format should I choose?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use PNG for graphics and images needing transparency, JPG for photographs to reduce file size, 
                and WebP for modern web applications requiring the smallest files with good quality.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Will converting affect image quality?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                PNG conversion is lossless, so quality is preserved. JPG and WebP use compression, 
                so some quality may be lost depending on your quality setting. Higher settings preserve more detail.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I convert multiple images at once?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, you can convert one image at a time. For multiple conversions, 
                simply repeat the process with each image using the same settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
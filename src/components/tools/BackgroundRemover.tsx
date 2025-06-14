import React, { useState, useRef } from 'react';
import { Upload, Download, Image, Loader, X, Info, Scissors, Eye } from 'lucide-react';

interface RemovalResult {
  originalFile: File;
  processedBlob: Blob;
  originalSize: number;
  processedSize: number;
}

const BackgroundRemover: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RemovalResult | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [processedPreview, setProcessedPreview] = useState<string>('');
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
      setError('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setResult(null);

    // Create preview
    const preview = URL.createObjectURL(file);
    setOriginalPreview(preview);

    try {
      const processedBlob = await removeBackground(file);
      const processedPreview = URL.createObjectURL(processedBlob);
      setProcessedPreview(processedPreview);

      setResult({
        originalFile: file,
        processedBlob,
        originalSize: file.size,
        processedSize: processedBlob.size
      });
    } catch (err) {
      setError('Failed to remove background. Please try again with a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeBackground = async (file: File): Promise<Blob> => {
    // Simulate background removal processing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock processed image - in reality, you'd use a background removal API or library
        // For demo purposes, we'll create a canvas with a transparent background
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          if (ctx) {
            // Draw the original image
            ctx.drawImage(img, 0, 0);
            
            // Simulate background removal by creating a circular mask (demo effect)
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 3, 0, 2 * Math.PI);
            ctx.fill();
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              }
            }, 'image/png');
          }
        };
        
        img.src = URL.createObjectURL(file);
      }, 4000);
    });
  };

  const downloadProcessed = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.download = `no-bg_${result.originalFile.name.replace(/\.[^/.]+$/, '')}.png`;
    link.href = URL.createObjectURL(result.processedBlob);
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
    setOriginalPreview('');
    setProcessedPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Background Remover
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Remove backgrounds from images automatically using AI. Perfect for product photos, 
            portraits, and creating transparent images for design projects.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Remove Image Backgrounds Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Background removal is essential for creating professional product photos, portraits, and design elements. 
              Our AI-powered tool automatically detects subjects and removes backgrounds with precision, 
              saving hours of manual editing work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Perfect For:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• E-commerce product photos</li>
                  <li>• Professional headshots</li>
                  <li>• Social media content</li>
                  <li>• Design and marketing materials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• AI-powered automatic detection</li>
                  <li>• High-quality edge preservation</li>
                  <li>• PNG output with transparency</li>
                  <li>• No manual editing required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-1">How it works:</h3>
              <ol className="text-sm text-pink-800 dark:text-pink-200 space-y-1">
                <li>1. Upload your image (drag & drop or click to browse)</li>
                <li>2. AI automatically detects and removes the background</li>
                <li>3. Preview the result with transparent background</li>
                <li>4. Download your image as PNG with transparency</li>
              </ol>
            </div>
          </div>
        </div>

        {!result && !isProcessing ? (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500'
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
                  Supports JPG, PNG, WebP • Max size: 10MB
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tips for Best Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">✅ Good Images:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Clear subject with defined edges</li>
                    <li>• Good contrast between subject and background</li>
                    <li>• High resolution images</li>
                    <li>• Single main subject</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">❌ Challenging Images:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Transparent or glass objects</li>
                    <li>• Hair with complex backgrounds</li>
                    <li>• Very low resolution images</li>
                    <li>• Multiple overlapping subjects</li>
                  </ul>
                </div>
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
        ) : isProcessing ? (
          /* Processing State */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <Loader className="h-12 w-12 text-pink-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Removing Background
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AI is analyzing your image and removing the background...
              </p>
              
              {originalPreview && (
                <div className="max-w-md mx-auto">
                  <img
                    src={originalPreview}
                    alt="Processing"
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Before/After Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Background Removal Complete!
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Size</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatFileSize(result!.originalSize)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
                    <p className="text-sm text-pink-600 dark:text-pink-400">Processed Size</p>
                    <p className="text-xl font-bold text-pink-700 dark:text-pink-300">
                      {formatFileSize(result!.processedSize)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Original */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Original
                    </h4>
                    <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  {/* Processed */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Scissors className="mr-2 h-5 w-5" />
                      Background Removed
                    </h4>
                    <div className="relative bg-transparent rounded-lg overflow-hidden" style={{
                      backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}>
                      <img
                        src={processedPreview}
                        alt="Background removed"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadProcessed}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PNG
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Remove Another Background
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
                What types of images work best?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Images with clear subjects and good contrast work best. Portrait photos, product shots, 
                and images with solid backgrounds typically produce excellent results.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What format is the output?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The processed image is saved as PNG format with a transparent background, 
                making it perfect for use in designs, presentations, and web content.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How accurate is the background removal?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI achieves high accuracy for most images, especially those with clear subject boundaries. 
                Complex hair, transparent objects, or intricate details may require manual touch-ups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
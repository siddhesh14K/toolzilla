import React, { useState, useRef } from 'react';
import { Download, Image as ImageIcon, Loader, X, Info } from 'lucide-react';
import { removeBackground, replaceBackground, getImageDimensions } from '../../utils/image';
import { formatFileSize } from '../../utils/format';

interface RemovalResult {
  originalFile: File;
  removedBgBlob: Blob;
  width: number;
  height: number;
}

const REMOVE_BG_API_KEY = process.env.VITE_REMOVE_BG_API_KEY || '';

const BackgroundRemover: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RemovalResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file (PNG, JPG)');
    }

    if (file.size > 1024 * 1024 * 10) { // 10MB
      throw new Error('File size too large. Maximum size is 10MB');
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
      
      // Start processing
      setIsProcessing(true);
      setProgress(0);

      if (!REMOVE_BG_API_KEY) {
        throw new Error('API key not configured. Please add VITE_REMOVE_BG_API_KEY to your environment.');
      }
      
      const removedBgBlob = await removeBackground(file, REMOVE_BG_API_KEY, setProgress);
      const dimensions = await getImageDimensions(removedBgBlob);

      setResult({
        originalFile: file,
        removedBgBlob,
        width: dimensions.width,
        height: dimensions.height
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownload = async (withBackground: boolean = false) => {
    if (!result) return;
    
    try {
      const finalBlob = withBackground
        ? await replaceBackground(result.removedBgBlob, backgroundColor)
        : result.removedBgBlob;
      
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `removed_bg_${withBackground ? 'with_bg' : 'transparent'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download image');
    }
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
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!previewUrl && !isProcessing && !result && (
          <div className="space-y-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Choose Image
              </button>
              <p className="mt-2 text-sm text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">
              Supports PNG, JPG up to 10MB
            </p>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-4">
            <Loader className="mx-auto h-12 w-12 text-primary animate-spin" />
            <p className="text-sm text-gray-600">Removing background... {progress}%</p>
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

      {/* Preview and Results */}
      {(previewUrl || result) && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            {previewUrl && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Original</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Result Image */}
            {result && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Result</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-[url('/checkerboard.png')] bg-repeat">
                  <img
                    src={URL.createObjectURL(result.removedBgBlob)}
                    alt="Result"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Background Color Options */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm"
                    style={{ backgroundColor: backgroundColor }}
                  />
                  {showColorPicker && (
                    <div className="absolute left-0 top-12 z-10">
                      <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="absolute"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  Choose background color (optional)
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleDownload(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download with Transparency
                </button>

                <button
                  onClick={() => handleDownload(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download with Background Color
                </button>
              </div>
            </div>
          )}

          {/* Image Info */}
          {result && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Background Removed Successfully
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Dimensions: {result.width}x{result.height}px</li>
                      <li>Original Size: {formatFileSize(result.originalFile.size)}</li>
                      <li>Result Size: {formatFileSize(result.removedBgBlob.size)}</li>
                      <li>Format: PNG with transparency</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundRemover;
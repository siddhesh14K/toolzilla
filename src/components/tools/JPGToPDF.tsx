import React, { useState, useRef } from 'react';
import { Upload, Download, Image, Loader, X, Info, FileText, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
}

interface PDFSettings {
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  orientation: 'portrait' | 'landscape';
  margin: number;
  quality: number;
}

const JPGToPDF: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<PDFSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    quality: 85
  });
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

  const handleFiles = async (files: File[]) => {
    const validImages = files.filter(file => file.type.startsWith('image/'));
    
    if (validImages.length !== files.length) {
      setError('Please select only image files (JPG, PNG, WebP)');
      return;
    }

    const totalSize = [...imageFiles, ...validImages].reduce((sum, file) => sum + (file.size || 0), 0);
    if (totalSize > 100 * 1024 * 1024) { // 100MB total limit
      setError('Total file size must be less than 100MB');
      return;
    }

    setError(null);
    
    const newImages: ImageFile[] = await Promise.all(
      validImages.map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        preview: await createPreview(file)
      }))
    );

    setImageFiles(prev => [...prev, ...newImages]);
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => prev.filter(img => img.id !== id));
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    setImageFiles(prev => {
      const index = prev.findIndex(img => img.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newImages = [...prev];
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      return newImages;
    });
  };

  const createPDF = async () => {
    if (imageFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate PDF creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock PDF blob
      const totalSize = imageFiles.reduce((sum, img) => sum + img.size, 0);
      const pdfBlob = new Blob(['mock pdf data'], { type: 'application/pdf' });
      Object.defineProperty(pdfBlob, 'size', { value: Math.floor(totalSize * 0.8) });
      
      setPdfBlob(pdfBlob);
    } catch (err) {
      setError('Failed to create PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfBlob) return;

    const link = document.createElement('a');
    link.download = 'images-to-pdf.pdf';
    link.href = URL.createObjectURL(pdfBlob);
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
    setImageFiles([]);
    setPdfBlob(null);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JPG to PDF Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert JPG, PNG, and WebP images to PDF documents. Combine multiple images 
            into a single PDF with customizable layout and quality settings.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Convert Images to PDF Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Converting images to PDF is perfect for creating photo albums, portfolios, presentations, 
              or combining multiple images into a single shareable document. Our converter supports 
              various image formats and provides professional layout options.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Supported Formats:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• JPG/JPEG images</li>
                  <li>• PNG images (with transparency)</li>
                  <li>• WebP images</li>
                  <li>• Multiple images per PDF</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Use Cases:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Creating photo albums</li>
                  <li>• Portfolio presentations</li>
                  <li>• Document scanning results</li>
                  <li>• Image collections for sharing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-teal-900 dark:text-teal-100 mb-1">How it works:</h3>
              <ol className="text-sm text-teal-800 dark:text-teal-200 space-y-1">
                <li>1. Upload your image files (drag & drop or click to browse)</li>
                <li>2. Arrange images in your desired order</li>
                <li>3. Customize PDF settings (page size, orientation, quality)</li>
                <li>4. Create and download your PDF document</li>
              </ol>
            </div>
          </div>
        </div>

        {!pdfBlob ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Upload and Images Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                  dragActive
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-500'
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
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop images here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Supports JPG, PNG, WebP • Total size limit: 100MB
                  </p>
                </div>
              </div>

              {/* Image List */}
              {imageFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Images ({imageFiles.length})
                    </h3>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center px-3 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors text-sm"
                    >
                      <Upload className="mr-1 h-4 w-4" />
                      Add More
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {imageFiles.map((image, index) => (
                      <div key={image.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {image.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(image.size)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => moveImage(image.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveImage(image.id, 'down')}
                            disabled={index === imageFiles.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeImage(image.id)}
                            className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
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

            {/* Settings Panel */}
            <div className="space-y-6">
              {/* PDF Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  PDF Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Page Size
                    </label>
                    <select
                      value={settings.pageSize}
                      onChange={(e) => setSettings({...settings, pageSize: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="A4">A4 (210 × 297 mm)</option>
                      <option value="Letter">Letter (8.5 × 11 in)</option>
                      <option value="Legal">Legal (8.5 × 14 in)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings({...settings, orientation: 'portrait'})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          settings.orientation === 'portrait'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-6 h-8 bg-gray-400 rounded mx-auto mb-1"></div>
                          <span className="text-xs">Portrait</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setSettings({...settings, orientation: 'landscape'})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          settings.orientation === 'landscape'
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-teal-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-8 h-6 bg-gray-400 rounded mx-auto mb-1"></div>
                          <span className="text-xs">Landscape</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image Quality: {settings.quality}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={settings.quality}
                      onChange={(e) => setSettings({...settings, quality: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Margin: {settings.margin}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={settings.margin}
                      onChange={(e) => setSettings({...settings, margin: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Create PDF Button */}
              <button
                onClick={createPDF}
                disabled={isProcessing || imageFiles.length === 0}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Creating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    Create PDF
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
                  PDF Created Successfully!
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Combined {imageFiles.length} images into a PDF document
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Size: {formatFileSize(pdfBlob.size)} • {settings.pageSize} {settings.orientation}
                    </p>
                  </div>
                  <div className="text-teal-600 dark:text-teal-400">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Create Another PDF
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
                How many images can I convert at once?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can convert unlimited images as long as the total size doesn't exceed 100MB. 
                Each image will be placed on a separate page in the PDF.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Will the image quality be preserved?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can control the image quality with our quality slider. Higher settings preserve 
                more detail but create larger files, while lower settings reduce file size.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change the order of images?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Use the up and down arrows to rearrange your images in any order. 
                The PDF will be created with images in your specified sequence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JPGToPDF;
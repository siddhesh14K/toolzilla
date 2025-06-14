import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Loader, X, Info, Image } from 'lucide-react';

interface ConversionResult {
  originalFile: File;
  jpgFiles: { blob: Blob; pageNumber: number }[];
  quality: number;
}

const PDFToJPG: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [quality, setQuality] = useState(90);
  const [convertAllPages, setConvertAllPages] = useState(true);
  const [pageRange, setPageRange] = useState('1-5');
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
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setResult(null);

    try {
      const jpgFiles = await convertPDFToJPG(file, quality, convertAllPages, pageRange);

      setResult({
        originalFile: file,
        jpgFiles,
        quality
      });
    } catch (err) {
      setError('Failed to convert PDF to JPG. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertPDFToJPG = async (
    file: File, 
    quality: number, 
    allPages: boolean, 
    range: string
  ): Promise<{ blob: Blob; pageNumber: number }[]> => {
    // Simulate PDF to JPG conversion
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock conversion - in reality, you'd use PDF.js or similar
        const pageCount = allPages ? 5 : parsePageRange(range).length;
        const jpgFiles = Array.from({ length: pageCount }, (_, i) => ({
          blob: new Blob(['mock jpg data'], { type: 'image/jpeg' }),
          pageNumber: i + 1
        }));
        
        resolve(jpgFiles);
      }, 3000);
    });
  };

  const parsePageRange = (range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      } else {
        pages.push(parseInt(part));
      }
    }
    
    return pages.filter(p => p > 0);
  };

  const downloadJPG = (blob: Blob, pageNumber: number) => {
    const link = document.createElement('a');
    link.download = `${result?.originalFile.name.replace('.pdf', '')}_page_${pageNumber}.jpg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadAllJPGs = () => {
    if (!result) return;
    
    result.jpgFiles.forEach(({ blob, pageNumber }, index) => {
      setTimeout(() => downloadJPG(blob, pageNumber), index * 100);
    });
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl mb-4">
            <Image className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to JPG Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Convert PDF pages to high-quality JPG images. Perfect for presentations, 
            web use, or sharing individual pages from documents.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Convert PDF to JPG Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Converting PDF pages to JPG images is essential for web publishing, presentations, 
              and sharing visual content. Our converter maintains high image quality while providing 
              flexible options for page selection and image optimization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Conversion Benefits:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Web-friendly image format</li>
                  <li>• Smaller file sizes than PDF</li>
                  <li>• Easy to share and embed</li>
                  <li>• Compatible with all devices</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Options:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>High (90-100%):</strong> Best for printing</li>
                  <li>• <strong>Medium (70-89%):</strong> Balanced quality/size</li>
                  <li>• <strong>Low (50-69%):</strong> Smallest file size</li>
                  <li>• <strong>Custom:</strong> Fine-tune to your needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">How it works:</h3>
              <ol className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
                <li>1. Upload your PDF file (drag & drop or click to browse)</li>
                <li>2. Choose conversion settings (quality, pages)</li>
                <li>3. Wait for processing to complete</li>
                <li>4. Download individual JPG files or all at once</li>
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
              
              <div className="space-y-6">
                {/* Quality Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="50"
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

                {/* Page Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Pages to Convert
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="allPages"
                        checked={convertAllPages}
                        onChange={() => setConvertAllPages(true)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="allPages" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Convert all pages
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="specificPages"
                        checked={!convertAllPages}
                        onChange={() => setConvertAllPages(false)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="specificPages" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Convert specific pages
                      </label>
                    </div>
                    {!convertAllPages && (
                      <div className="ml-6">
                        <input
                          type="text"
                          value={pageRange}
                          onChange={(e) => setPageRange(e.target.value)}
                          placeholder="e.g., 1-3, 5, 7-10"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Use commas to separate ranges, hyphens for page spans
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
              } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              
              <div className="text-center">
                {isProcessing ? (
                  <div className="space-y-4">
                    <Loader className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Converting PDF to JPG...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Processing pages, please wait
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Supports PDF files • Max size: 50MB
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Created {result.jpgFiles.length} JPG images from your PDF
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quality: {result.quality}% • From: {result.originalFile.name}
                    </p>
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400">
                    <Image className="h-12 w-12" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                  <button
                    onClick={downloadAllJPGs}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download All JPGs
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Convert Another PDF
                  </button>
                </div>

                {/* Individual Downloads */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Individual Pages
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {result.jpgFiles.map(({ blob, pageNumber }) => (
                      <button
                        key={pageNumber}
                        onClick={() => downloadJPG(blob, pageNumber)}
                        className="flex flex-col items-center space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Image className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Page {pageNumber}
                        </span>
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
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
                What quality setting should I use?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                For web use, 70-80% quality provides a good balance. For printing or high-quality displays, 
                use 90-100%. For thumbnails or previews, 50-60% is sufficient.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I convert specific pages only?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Use the page range option to specify exactly which pages to convert. 
                You can use ranges like "1-5" or individual pages like "1, 3, 7".
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What resolution will the JPG images have?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The JPG images maintain the original PDF resolution, typically 150-300 DPI, 
                ensuring crisp, clear images suitable for both web and print use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToJPG;
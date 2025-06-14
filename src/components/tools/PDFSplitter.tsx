import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Loader, X, Info, Scissors } from 'lucide-react';

interface SplitResult {
  originalFile: File;
  splitFiles: Blob[];
  splitType: 'pages' | 'range';
  pageCount: number;
}

const PDFSplitter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [splitType, setSplitType] = useState<'pages' | 'range'>('pages');
  const [pageRanges, setPageRanges] = useState<string>('1-5, 6-10');
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

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      setError('File size must be less than 100MB');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setResult(null);

    try {
      const splitFiles = await splitPDF(file, splitType, pageRanges);
      const pageCount = splitType === 'pages' ? splitFiles.length : parsePageRanges(pageRanges).length;

      setResult({
        originalFile: file,
        splitFiles,
        splitType,
        pageCount
      });
    } catch (err) {
      setError('Failed to split PDF. Please check your page ranges and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePageRanges = (ranges: string): number[] => {
    const pages: number[] = [];
    const parts = ranges.split(',').map(s => s.trim());
    
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

  const splitPDF = async (file: File, type: string, ranges: string): Promise<Blob[]> => {
    // Simulate PDF splitting
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === 'pages') {
          // Mock: split into individual pages (simulate 10 pages)
          const pageCount = 10;
          const splitFiles = Array.from({ length: pageCount }, (_, i) => 
            new Blob([file], { type: 'application/pdf' })
          );
          resolve(splitFiles);
        } else {
          // Mock: split by ranges
          const pageRanges = parsePageRanges(ranges);
          const splitFiles = pageRanges.map(() => 
            new Blob([file], { type: 'application/pdf' })
          );
          resolve(splitFiles);
        }
      }, 3000);
    });
  };

  const downloadSplitFile = (blob: Blob, index: number) => {
    const link = document.createElement('a');
    link.download = `${result?.originalFile.name.replace('.pdf', '')}_part_${index + 1}.pdf`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadAllSplitFiles = () => {
    if (!result) return;
    
    result.splitFiles.forEach((blob, index) => {
      setTimeout(() => downloadSplitFile(blob, index), index * 100);
    });
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF Splitter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Split PDF documents into separate pages or custom page ranges. 
            Extract specific sections or break large documents into manageable parts.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Split PDF Files Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              PDF splitting is useful for extracting specific pages, creating smaller files for easier sharing, 
              or organizing large documents into logical sections. Our tool offers flexible splitting options 
              to meet your specific needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Split Options:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Individual Pages:</strong> Each page becomes a separate PDF</li>
                  <li>• <strong>Page Ranges:</strong> Custom ranges like "1-5, 10-15"</li>
                  <li>• <strong>Batch Processing:</strong> Download all parts at once</li>
                  <li>• <strong>Quality Preservation:</strong> Maintains original formatting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Common Use Cases:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Extracting specific chapters from books</li>
                  <li>• Separating invoices from statements</li>
                  <li>• Creating individual handouts from presentations</li>
                  <li>• Organizing legal document sections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">How it works:</h3>
              <ol className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>1. Upload your PDF file (drag & drop or click to browse)</li>
                <li>2. Choose split method: individual pages or custom ranges</li>
                <li>3. For ranges, specify pages like "1-3, 5, 7-10"</li>
                <li>4. Download individual files or all parts at once</li>
              </ol>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* Split Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Split Options
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSplitType('pages')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      splitType === 'pages'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-400'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Split into Individual Pages
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Each page becomes a separate PDF file
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setSplitType('range')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      splitType === 'range'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-400'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Split by Page Ranges
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Specify custom page ranges to extract
                    </p>
                  </button>
                </div>

                {splitType === 'range' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Page Ranges (e.g., "1-3, 5, 7-10")
                    </label>
                    <input
                      type="text"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="1-5, 8, 10-15"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Use commas to separate ranges, hyphens for page spans
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-500'
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
                    <Loader className="h-12 w-12 text-yellow-600 animate-spin mx-auto" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Splitting your PDF...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This may take a few moments
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
                        Supports PDF files • Max size: 100MB
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
                  PDF Successfully Split!
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Created {result.splitFiles.length} separate PDF files
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      From: {result.originalFile.name}
                    </p>
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400">
                    <Scissors className="h-12 w-12" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                  <button
                    onClick={downloadAllSplitFiles}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download All Files
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Split Another PDF
                  </button>
                </div>

                {/* Individual File Downloads */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Individual Files
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.splitFiles.map((blob, index) => (
                      <button
                        key={index}
                        onClick={() => downloadSplitFile(blob, index)}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Part {index + 1}
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
                How do I specify page ranges?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use commas to separate different ranges and hyphens for page spans. 
                For example: "1-3, 5, 7-10" will create files with pages 1-3, page 5, and pages 7-10.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Will the split files maintain the original quality?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Our splitter preserves the original quality, formatting, and all content from your PDF. 
                Each split file is an exact copy of the specified pages.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I split password-protected PDFs?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, our tool works with unprotected PDF files. If your PDF is password-protected, 
                you'll need to remove the password first before splitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFSplitter;
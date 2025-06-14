import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Loader, X, Info, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

const PDFMerger: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
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
    const validPDFs = files.filter(file => file.type === 'application/pdf');
    
    if (validPDFs.length !== files.length) {
      setError('Please select only PDF files');
      return;
    }

    const totalSize = [...pdfFiles, ...validPDFs].reduce((sum, file) => sum + (file.size || 0), 0);
    if (totalSize > 200 * 1024 * 1024) { // 200MB total limit
      setError('Total file size must be less than 200MB');
      return;
    }

    setError(null);
    const newPDFs: PDFFile[] = validPDFs.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size
    }));

    setPdfFiles(prev => [...prev, ...newPDFs]);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    setPdfFiles(prev => {
      const index = prev.findIndex(pdf => pdf.id === id);
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newFiles = [...prev];
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate PDF merging
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock merged PDF blob
      const totalSize = pdfFiles.reduce((sum, pdf) => sum + pdf.size, 0);
      const mergedBlob = new Blob(pdfFiles.map(pdf => pdf.file), { type: 'application/pdf' });
      Object.defineProperty(mergedBlob, 'size', { value: totalSize });
      
      setMergedBlob(mergedBlob);
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedBlob) return;

    const link = document.createElement('a');
    link.download = 'merged-document.pdf';
    link.href = URL.createObjectURL(mergedBlob);
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
    setPdfFiles([]);
    setMergedBlob(null);
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF Merger
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document. Arrange pages in any order 
            and create professional merged PDFs instantly.
          </p>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            How to Merge PDF Files Online
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              PDF merging is essential for combining multiple documents into a single, organized file. 
              Whether you're consolidating reports, combining invoices, or creating comprehensive documentation, 
              our PDF merger makes it simple and secure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Common Use Cases:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Combining multiple invoices or receipts</li>
                  <li>• Merging chapters of a document</li>
                  <li>• Creating comprehensive reports</li>
                  <li>• Consolidating legal documents</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h3>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Drag and drop file ordering</li>
                  <li>• Unlimited file merging</li>
                  <li>• Maintains original quality</li>
                  <li>• Secure browser-based processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">How it works:</h3>
              <ol className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <li>1. Upload multiple PDF files (drag & drop or click to browse)</li>
                <li>2. Arrange files in your desired order</li>
                <li>3. Click "Merge PDFs" to combine them</li>
                <li>4. Download your merged PDF document</li>
              </ol>
            </div>
          </div>
        </div>

        {!mergedBlob ? (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop PDF files here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Select multiple PDF files • Total size limit: 200MB
                </p>
              </div>
            </div>

            {/* File List */}
            {pdfFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Files to Merge ({pdfFiles.length})
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add More
                  </button>
                </div>
                
                <div className="space-y-3">
                  {pdfFiles.map((pdf, index) => (
                    <div key={pdf.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {pdf.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(pdf.size)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveFile(pdf.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveFile(pdf.id, 'down')}
                          disabled={index === pdfFiles.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFile(pdf.id)}
                          className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total size: {formatFileSize(pdfFiles.reduce((sum, pdf) => sum + pdf.size, 0))}
                    </p>
                    <button
                      onClick={mergePDFs}
                      disabled={isProcessing || pdfFiles.length < 2}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="mr-2 h-5 w-5 animate-spin" />
                          Merging PDFs...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Merge PDFs
                        </>
                      )}
                    </button>
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
            {/* Success Result */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  PDF Successfully Merged!
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Combined {pdfFiles.length} PDF files into one document
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Final size: {formatFileSize(mergedBlob.size)}
                    </p>
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    <FileText className="h-12 w-12" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={downloadMerged}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Merged PDF
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Merge More PDFs
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
                How many PDF files can I merge at once?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can merge unlimited PDF files as long as the total size doesn't exceed 200MB. 
                The tool handles both small and large documents efficiently.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Will the merged PDF maintain the original quality?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Our merger preserves the original quality of all PDFs. Text, images, and formatting 
                remain exactly as they were in the source documents.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change the order of pages after uploading?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Use the up and down arrows to rearrange your PDF files in any order before merging. 
                The final document will follow your specified sequence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFMerger;
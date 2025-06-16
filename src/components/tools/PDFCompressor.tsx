import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, FileText, X, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { formatFileSize } from '../../utils/format';
import { measure } from '../../utils/performance';

interface CompressionResult {
  originalFile: File;
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  pageCount: number;
}

// Constants for validation and processing
const FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
const MIN_FILE_SIZE = 1024; // 1KB
const MAX_PAGES = 1000;

const checkMemoryAvailability = (fileSize: number): boolean => {
  if ('performance' in window && (performance as any).memory) {
    const memory = (performance as any).memory;
    const available = memory.jsHeapSizeLimit - memory.usedJSHeapSize;
    return available > fileSize * 2;
  }
  return true;
};

const PDFCompressor: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../workers/pdf.worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case 'progress':
          setProgress(payload);
          break;
        case 'compressed':
          handleCompressionComplete(payload);
          break;
        case 'error':
          setError(payload);
          setIsProcessing(false);
          break;
      }
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (result?.compressedBlob) {
      URL.revokeObjectURL(URL.createObjectURL(result.compressedBlob));
    }
  }, [previewUrl, result]);

  // File validation
  const validateFile = useCallback(async (file: File): Promise<string | null> => {
    if (!file) return 'Please select a PDF file.';
    
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are supported.';
    }
    
    if (file.size < MIN_FILE_SIZE) {
      return 'File is too small to compress.';
    }

    if (file.size > FILE_SIZE_LIMIT) {
      return `File too large. Maximum size is ${formatFileSize(FILE_SIZE_LIMIT)}.`;
    }
    
    if (!checkMemoryAvailability(file.size)) {
      return 'Not enough memory available to process this PDF. Please try a smaller file.';
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      if (pageCount > MAX_PAGES) {
        return `PDF has too many pages. Maximum is ${MAX_PAGES} pages.`;
      }

      return null;
    } catch (err) {
      return 'Invalid or corrupted PDF file.';
    }
  }, []);

  // File selection handler
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    cleanup();
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingTime(null);

    const validationError = await validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  }, [cleanup, validateFile]);

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    cleanup();
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingTime(null);

    const validationError = await validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  }, [cleanup, validateFile]);

  // Compression handlers
  const handleCompressionComplete = useCallback((compressedBlob: Blob) => {
    if (!previewUrl) return;

    const createResult = async () => {
      try {
        const file = await fetch(previewUrl).then(r => r.blob()).then(b => 
          new File([b], 'input.pdf', { type: 'application/pdf' })
        );

        const result: CompressionResult = {
          originalFile: file,
          compressedBlob,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
          compressionRatio: (1 - (compressedBlob.size / file.size)) * 100,
          pageCount: (await PDFDocument.load(await file.arrayBuffer())).getPageCount()
        };

        if (result.compressedSize >= result.originalSize) {
          throw new Error('Compression did not reduce file size. The PDF might already be optimized.');
        }

        setResult(result);
        cleanup();
        setPreviewUrl(URL.createObjectURL(compressedBlob));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process compression result.');
      } finally {
        setIsProcessing(false);
      }
    };

    createResult();
  }, [previewUrl, cleanup]);

  const compressPDF = useCallback(async () => {
    if (!previewUrl || !workerRef.current) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const file = await fetch(previewUrl).then(r => r.blob()).then(b => 
        new File([b], 'input.pdf', { type: 'application/pdf' })
      );

      const { processingTime } = await measure(async () => {
        const arrayBuffer = await file.arrayBuffer();
        workerRef.current?.postMessage({
          type: 'compress',
          payload: {
            pdfBuffer: arrayBuffer,
            compressionLevel
          }
        }, [arrayBuffer]);
      });

      setProcessingTime(processingTime);
    } catch (err) {
      console.error('Compression error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during compression. Please try again.');
      setIsProcessing(false);
    }
  }, [previewUrl, compressionLevel]);

  // Download handler
  const downloadCompressed = useCallback(() => {
    if (!result?.compressedBlob) return;
    
    const url = URL.createObjectURL(result.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  // Reset handler
  const reset = useCallback(() => {
    cleanup();
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingTime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [cleanup]);

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-input"
          />
          
          <label
            htmlFor="pdf-input"
            className="cursor-pointer inline-flex items-center space-x-2 text-gray-600 hover:text-blue-500"
          >
            <Upload className="w-6 h-6" />
            <span>Drop PDF here or click to upload</span>
          </label>
          
          <div className="text-sm text-gray-500">
            Maximum file size: {formatFileSize(FILE_SIZE_LIMIT)}
          </div>
        </div>
      </div>

      {/* PDF Preview and Controls */}
      {previewUrl && (
        <div className="space-y-6">
          {/* PDF Preview */}
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={previewUrl + '#toolbar=0'}
              className="w-full h-full"
              title="PDF Preview"
            />
          </div>

          {/* Compression Controls */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Compression Level
            </label>
            <select
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full p-2 border rounded-md"
              disabled={isProcessing}
            >
              <option value="low">Low (Better Quality)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Smaller Size)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {!isProcessing && !result && (
                <button
                  onClick={compressPDF}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  disabled={!!error}
                >
                  <FileText className="w-4 h-4 mr-2 inline" />
                  Compress PDF
                </button>
              )}

              {isProcessing && (
                <div className="text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Processing... {progress}%</p>
                </div>
              )}

              {result && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Original size: {formatFileSize(result.originalSize)}<br />
                    Compressed size: {formatFileSize(result.compressedSize)}<br />
                    Compression ratio: {result.compressionRatio.toFixed(1)}%<br />
                    Pages: {result.pageCount}
                    {processingTime && (
                      <><br />Processing time: {(processingTime / 1000).toFixed(1)}s</>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={downloadCompressed}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download
                    </button>
                    <button
                      onClick={reset}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PDFCompressor;
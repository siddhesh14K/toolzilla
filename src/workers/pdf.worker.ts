import { PDFDocument, PDFDict, PDFName, PDFNumber } from 'pdf-lib';

interface WorkerMessage {
  type: 'compress';
  payload: {
    pdfBuffer: ArrayBuffer;
    compressionLevel: 'low' | 'medium' | 'high';
  };
}

const CHUNK_SIZE = 10; // Process 10 pages at a time

const updateProgress = (progress: number) => {
  self.postMessage({ type: 'progress', payload: progress });
};

const compressImageStream = async (xObject: PDFDict) => {
  try {
    const maybeSubtype = xObject.get(PDFName.of('Subtype'));
    if (maybeSubtype?.toString() === '/Image') {
      const bitsPerComponent = xObject.get(PDFName.of('BitsPerComponent'));
      const colorSpace = xObject.get(PDFName.of('ColorSpace'));

      if (bitsPerComponent instanceof PDFNumber && bitsPerComponent.asNumber() > 4) {
        xObject.set(PDFName.of('BitsPerComponent'), PDFNumber.of(4));
      }

      if (colorSpace?.toString() === '/DeviceRGB') {
        xObject.set(PDFName.of('ColorSpace'), PDFName.of('DeviceGray'));
      }
    }
  } catch (err) {
    console.warn('Failed to compress image:', err);
  }
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { type, payload } = e.data;

    switch (type) {
      case 'compress': {
        const { pdfBuffer } = payload;

        // Load PDF
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pageCount = pdfDoc.getPageCount();

        // Process pages in chunks
        for (let i = 0; i < pageCount; i += CHUNK_SIZE) {
          const chunk = pdfDoc.getPages().slice(i, i + CHUNK_SIZE);
          
          for (const page of chunk) {
            // Access resources safely using PDFName
            const resources = page.node.get(PDFName.of('Resources'));
            
            if (resources instanceof PDFDict) {
              // Process images
              const xObjects = resources.get(PDFName.of('XObject'));
              if (xObjects instanceof PDFDict) {
                const entries = xObjects.entries();
                for (const [, xObject] of entries) {
                  if (xObject instanceof PDFDict) {
                    await compressImageStream(xObject);
                  }
                }
              }
            }
          }

          // Update progress
          updateProgress(Math.round((i + chunk.length) / pageCount * 100));
        }

        // Save with compression
        const compressedPdfBytes = await pdfDoc.save({
          useObjectStreams: true
        });

        // Send result back as transferable
        self.postMessage({
          type: 'compressed',
          payload: compressedPdfBytes
        }, {
          transfer: [compressedPdfBytes.buffer]
        });
        break;
      }
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      payload: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

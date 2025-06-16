export interface ToolSEOData {
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  metaDescription: string;
  h1: string;
  slug: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const toolsSEOData: Record<string, ToolSEOData> = {
  pdfCompressor: {
    primaryKeyword: "compress pdf online free",
    secondaryKeywords: [
      "reduce pdf size online",
      "pdf size reducer",
      "compress pdf file",
      "online pdf compressor"
    ],
    title: "Compress PDF Online Free - Reduce PDF Size Without Losing Quality",
    metaDescription: "Compress PDF files online for free. Reduce PDF size without losing quality. Fast, secure, and easy to use. No registration required. Try our PDF compressor now!",
    h1: "Compress PDF Online Free",
    slug: "compress-pdf-online",
    faqs: [
      {
        question: "How can I compress a PDF file online for free?",
        answer: "Simply drag and drop your PDF file into our compressor, choose your compression level (low, medium, or high), and click 'Compress PDF'. Your compressed file will be ready to download in seconds."
      },
      {
        question: "Is it safe to compress PDF files online?",
        answer: "Yes, our PDF compression tool is completely secure. Files are processed in your browser, never uploaded to our servers, and automatically deleted after processing."
      },
      {
        question: "What's the maximum PDF file size I can compress?",
        answer: "You can compress PDF files up to 100MB for free. The compressed file size will depend on the content and compression level you choose."
      },
      {
        question: "Will PDF compression affect the quality?",
        answer: "Our smart compression algorithm maintains the best possible quality while reducing file size. You can choose different compression levels based on your needs."
      }
    ]
  },
  imageResizer: {
    primaryKeyword: "resize image for passport photo",
    secondaryKeywords: [
      "passport photo size online",
      "resize image online",
      "photo size converter",
      "picture resizer online"
    ],
    title: "Resize Image for Passport Photo Online - Free Photo Size Converter",
    metaDescription: "Resize your photos to passport size online for free. Perfect for ID, visa, and passport applications. Easy-to-use image resizer with precise measurements.",
    h1: "Resize Image for Passport Photo Online",
    slug: "resize-image-online",
    faqs: [
      {
        question: "What are the standard passport photo sizes?",
        answer: "Standard passport photo sizes vary by country: US (2x2 inches), UK (35x45mm), EU (35x45mm), India (35x45mm). Our tool supports all international formats."
      },
      {
        question: "How do I resize my photo for passport online?",
        answer: "Upload your photo, select your country's passport format, and our tool will automatically resize and crop your image to meet the exact requirements."
      }
    ]
  },
  // Add more tools with their SEO data...
};

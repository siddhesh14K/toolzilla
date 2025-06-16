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
  videoCompressor: {
    primaryKeyword: "compress video online free",
    secondaryKeywords: [
      "reduce video file size",
      "video size reducer",
      "compress mp4 online",
      "video compression tool",
      "compress video without losing quality"
    ],
    title: "Free Online Video Compressor - Reduce Video Size Without Quality Loss",
    metaDescription: "Compress video files online for free. Fast browser-based video compression with adjustable quality. No upload needed - process videos securely in your browser.",
    h1: "Compress Video Online Free",
    slug: "compress-video-online",
    faqs: [
      {
        question: "How can I compress a video online for free?",
        answer: "Upload your video to our online compressor, choose your desired compression level (low, medium, or high), select output format (MP4 or WebM), and click 'Compress'. Your compressed video will be processed right in your browser."
      },
      {
        question: "Is it safe to compress videos online with your tool?",
        answer: "Yes, our tool processes videos directly in your browser using WebAssembly technology. Your videos are never uploaded to any server, ensuring complete privacy and security."
      },
      {
        question: "What's the maximum video file size I can compress?",
        answer: "You can compress videos up to 2GB in size. The actual limit may vary based on your device's memory. For best results, we recommend videos under 1GB."
      },
      {
        question: "Will video compression affect the quality?",
        answer: "Our tool uses smart compression algorithms to maintain the best possible quality while reducing file size. You can choose between low, medium, and high compression levels to balance quality and size reduction."
      }
    ]
  },
  videoTrimmer: {
    primaryKeyword: "trim video online free",
    secondaryKeywords: [
      "cut video online",
      "video trimming tool",
      "online video cutter",
      "clip video online",
      "split video online"
    ],
    title: "Free Online Video Trimmer - Cut and Edit Videos Instantly",
    metaDescription: "Trim videos online for free. Cut unwanted parts from your videos with frame-accurate precision. Browser-based, secure, and no upload required.",
    h1: "Trim Video Online Free",
    slug: "trim-video-online",
    faqs: [
      {
        question: "How do I trim a video online?",
        answer: "Simply upload your video, use the slider to select the start and end points of your clip, preview the selection, and click 'Trim'. The trimmed video will be processed in your browser and ready to download."
      },
      {
        question: "Is your video trimmer accurate?",
        answer: "Yes, our video trimmer provides frame-accurate cutting using professional-grade FFmpeg technology. You can precisely select your start and end points with frame-level control."
      },
      {
        question: "Does trimming reduce video quality?",
        answer: "No, our trimmer uses lossless cutting technology that preserves the original video quality. There's no re-encoding involved in the trimming process."
      },
      {
        question: "What video formats are supported?",
        answer: "Our trimmer supports most common video formats including MP4, WebM, MOV, and AVI. The output will be in the same format as your input video to maintain quality."
      }
    ]
  },
  gifMaker: {
    primaryKeyword: "create gif from video online",
    secondaryKeywords: [
      "video to gif converter",
      "make gif online",
      "gif creator free",
      "convert video to gif",
      "animated gif maker"
    ],
    title: "Free Video to GIF Converter - Create GIFs Online",
    metaDescription: "Convert videos to GIFs online for free. Create high-quality animated GIFs from video clips with customizable settings. No upload needed - process locally.",
    h1: "Create GIF from Video Online Free",
    slug: "video-to-gif-online",
    faqs: [
      {
        question: "How do I create a GIF from a video?",
        answer: "Upload your video, select the portion you want to convert, adjust GIF settings like FPS and quality, then click 'Create GIF'. Your animated GIF will be created right in your browser."
      },
      {
        question: "What's the best FPS for GIFs?",
        answer: "For smooth animation, we recommend 15-24 FPS. Lower FPS (10-12) results in smaller file sizes, while higher FPS (20-24) gives smoother animation but larger files."
      },
      {
        question: "How can I optimize my GIF size?",
        answer: "You can reduce GIF size by lowering the FPS, reducing dimensions, or using our quality settings. Our tool automatically optimizes colors and dithering for the best balance."
      },
      {
        question: "What's the maximum duration for GIFs?",
        answer: "You can create GIFs up to 30 seconds long. For best results and reasonable file sizes, we recommend keeping GIFs under 10 seconds."
      }
    ]
  }
}

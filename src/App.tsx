import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Zap } from 'lucide-react';
import { initPerformanceMonitoring } from './utils/performance';
import Header from './components/Header';
import Navigation from './components/Navigation';

// Lazy load components
const HomePage = lazy(() => import('./components/HomePage'));
const ToolsPage = lazy(() => import('./components/ToolsPage'));
const SearchPage = lazy(() => import('./components/SearchPage'));

// Lazy load tool components
const ImageCompressor = lazy(() => import('./components/tools/ImageCompressor'));
const ImageResizer = lazy(() => import('./components/tools/ImageResizer'));
const FinanceCalculators = lazy(() => import('./components/tools/FinanceCalculators'));
const PDFToText = lazy(() => import('./components/tools/PDFToText'));
const TextToPDF = lazy(() => import('./components/tools/TextToPDF'));
const PDFCompressor = lazy(() => import('./components/tools/PDFCompressor'));
const PDFMerger = lazy(() => import('./components/tools/PDFMerger'));
const PDFSplitter = lazy(() => import('./components/tools/PDFSplitter'));
const PDFToJPG = lazy(() => import('./components/tools/PDFToJPG'));
const JPGToPDF = lazy(() => import('./components/tools/JPGToPDF'));
const VideoCompressor = lazy(() => import('./components/tools/VideoCompressor'));
const VideoTrimmer = lazy(() => import('./components/tools/VideoTrimmer'));
const GIFMaker = lazy(() => import('./components/tools/GIFMaker'));
const BackgroundRemover = lazy(() => import('./components/tools/BackgroundRemover'));
const ImageConverter = lazy(() => import('./components/tools/ImageConverter'));

// Lazy load page components
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage'));
const TermsPage = lazy(() => import('./components/pages/TermsPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const BlogPage = lazy(() => import('./components/pages/BlogPage'));

export type PageType = 
  | 'home' 
  | 'tools'
  | 'search'
  | 'image-compressor' 
  | 'image-resizer' 
  | 'image-converter'
  | 'background-remover'
  | 'finance-calculators' 
  | 'pdf-to-text' 
  | 'text-to-pdf'
  | 'pdf-compressor'
  | 'pdf-merger'
  | 'pdf-splitter'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  | 'video-compressor'
  | 'video-trimmer'
  | 'gif-maker'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'blog';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize performance monitoring in production
    initPerformanceMonitoring();
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderPage = () => {
    const LoadingFallback = () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );

    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (currentPage) {
            case 'home':
              return <HomePage onNavigate={setCurrentPage} />;
            case 'tools':
              return <ToolsPage onNavigate={setCurrentPage} />;
            case 'search':
              return <SearchPage onNavigate={setCurrentPage} />;
            case 'image-compressor':
              return <ImageCompressor />;
            case 'image-resizer':
              return <ImageResizer />;
            case 'image-converter':
              return <ImageConverter />;
            case 'background-remover':
              return <BackgroundRemover />;
            case 'finance-calculators':
              return <FinanceCalculators />;
            case 'pdf-to-text':
              return <PDFToText />;
            case 'text-to-pdf':
              return <TextToPDF />;
            case 'pdf-compressor':
              return <PDFCompressor />;
            case 'pdf-merger':
              return <PDFMerger />;
            case 'pdf-splitter':
              return <PDFSplitter />;
            case 'pdf-to-jpg':
              return <PDFToJPG />;
            case 'jpg-to-pdf':
              return <JPGToPDF />;
            case 'video-compressor':
              return <VideoCompressor />;
            case 'video-trimmer':
              return <VideoTrimmer />;
            case 'gif-maker':
              return <GIFMaker />;
            case 'about':
              return <AboutPage />;
            case 'privacy':
              return <PrivacyPage />;
            case 'terms':
              return <TermsPage />;
            case 'contact':
              return <ContactPage />;
            case 'blog':
              return <BlogPage onNavigate={setCurrentPage} />;
            default:
              return <HomePage onNavigate={setCurrentPage} />;
          }
        })()}
      </Suspense>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <Navigation 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className={`transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm' : ''}`}>
        {renderPage()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">ToolZilla</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fast, free, and reliable online tools for professionals and everyday users. 
                Compress images, convert files, calculate finances, and more.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 ToolZilla. All rights reserved.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Image Tools</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('image-compressor')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Image Compressor</button></li>
                <li><button onClick={() => setCurrentPage('image-resizer')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Image Resizer</button></li>
                <li><button onClick={() => setCurrentPage('image-converter')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Image Converter</button></li>
                <li><button onClick={() => setCurrentPage('background-remover')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Background Remover</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PDF & Video Tools</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('pdf-compressor')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">PDF Compressor</button></li>
                <li><button onClick={() => setCurrentPage('video-compressor')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Video Compressor</button></li>
                <li><button onClick={() => setCurrentPage('gif-maker')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">GIF Maker</button></li>
                <li><button onClick={() => setCurrentPage('finance-calculators')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Finance Calculators</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
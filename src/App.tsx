import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Image, 
  Calculator, 
  FileText, 
  Download, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Zap
} from 'lucide-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ImageCompressor from './components/tools/ImageCompressor';
import ImageResizer from './components/tools/ImageResizer';
import FinanceCalculators from './components/tools/FinanceCalculators';
import PDFToText from './components/tools/PDFToText';
import TextToPDF from './components/tools/TextToPDF';
import AboutPage from './components/pages/AboutPage';
import PrivacyPage from './components/pages/PrivacyPage';
import TermsPage from './components/pages/TermsPage';
import ContactPage from './components/pages/ContactPage';
import BlogPage from './components/pages/BlogPage';

export type PageType = 
  | 'home' 
  | 'image-compressor' 
  | 'image-resizer' 
  | 'finance-calculators' 
  | 'pdf-to-text' 
  | 'text-to-pdf'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'blog';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
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
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'finance-calculators':
        return <FinanceCalculators />;
      case 'pdf-to-text':
        return <PDFToText />;
      case 'text-to-pdf':
        return <TextToPDF />;
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('image-compressor')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Image Compressor</button></li>
                <li><button onClick={() => setCurrentPage('image-resizer')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Image Resizer</button></li>
                <li><button onClick={() => setCurrentPage('finance-calculators')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Finance Calculators</button></li>
                <li><button onClick={() => setCurrentPage('pdf-to-text')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">PDF to Text</button></li>
                <li><button onClick={() => setCurrentPage('text-to-pdf')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Text to PDF</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentPage('about')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">About Us</button></li>
                <li><button onClick={() => setCurrentPage('blog')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Blog</button></li>
                <li><button onClick={() => setCurrentPage('contact')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</button></li>
                <li><button onClick={() => setCurrentPage('privacy')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</button></li>
                <li><button onClick={() => setCurrentPage('terms')} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
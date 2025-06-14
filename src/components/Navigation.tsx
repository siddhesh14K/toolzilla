import React from 'react';
import { 
  Home, 
  Image, 
  Calculator, 
  FileText, 
  Download, 
  Info, 
  Shield, 
  FileText as Terms, 
  Mail, 
  BookOpen,
  Search,
  Grid3X3,
  Video,
  Scissors,
  RefreshCw,
  Zap
} from 'lucide-react';
import { PageType } from '../App';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    onClose();
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tools', label: 'All Tools', icon: Grid3X3 },
    { id: 'search', label: 'Search Tools', icon: Search },
    
    // Image Tools
    { id: 'image-compressor', label: 'Image Compressor', icon: Image, category: 'Image Tools' },
    { id: 'image-resizer', label: 'Image Resizer', icon: Image, category: 'Image Tools' },
    { id: 'image-converter', label: 'Image Converter', icon: RefreshCw, category: 'Image Tools' },
    { id: 'background-remover', label: 'Background Remover', icon: Scissors, category: 'Image Tools' },
    
    // PDF Tools
    { id: 'pdf-compressor', label: 'PDF Compressor', icon: FileText, category: 'PDF Tools' },
    { id: 'pdf-merger', label: 'PDF Merger', icon: FileText, category: 'PDF Tools' },
    { id: 'pdf-splitter', label: 'PDF Splitter', icon: FileText, category: 'PDF Tools' },
    { id: 'pdf-to-jpg', label: 'PDF to JPG', icon: FileText, category: 'PDF Tools' },
    { id: 'jpg-to-pdf', label: 'JPG to PDF', icon: FileText, category: 'PDF Tools' },
    { id: 'pdf-to-text', label: 'PDF to Text', icon: FileText, category: 'PDF Tools' },
    { id: 'text-to-pdf', label: 'Text to PDF', icon: Download, category: 'PDF Tools' },
    
    // Video Tools
    { id: 'video-compressor', label: 'Video Compressor', icon: Video, category: 'Video Tools' },
    { id: 'video-trimmer', label: 'Video Trimmer', icon: Video, category: 'Video Tools' },
    { id: 'gif-maker', label: 'GIF Maker', icon: Zap, category: 'Video Tools' },
    
    // Finance Tools
    { id: 'finance-calculators', label: 'Finance Calculators', icon: Calculator, category: 'Finance Tools' },
    
    // Pages
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: Terms },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Main';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Navigation */}
      <nav
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto h-full">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {category !== 'Main' && (
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {category}
                </h3>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id as PageType)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              {category !== 'Main' && <div className="border-b border-gray-200 dark:border-gray-700 my-3"></div>}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
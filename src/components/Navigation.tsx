import React from 'react';
import { Home, Image, Calculator, FileText, Download, Info, Shield, FileText as Terms, Mail, BookOpen } from 'lucide-react';
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
    { id: 'image-compressor', label: 'Image Compressor', icon: Image },
    { id: 'image-resizer', label: 'Image Resizer', icon: Image },
    { id: 'finance-calculators', label: 'Finance Calculators', icon: Calculator },
    { id: 'pdf-to-text', label: 'PDF to Text', icon: FileText },
    { id: 'text-to-pdf', label: 'Text to PDF', icon: Download },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: Terms },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

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
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as PageType)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
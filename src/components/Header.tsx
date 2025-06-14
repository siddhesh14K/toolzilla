import React from 'react';
import { Zap, Menu, X, Moon, Sun, BookOpen, Search, Grid3X3 } from 'lucide-react';
import { PageType } from '../App';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ToolZilla
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => onNavigate('tools')}
              className={`flex items-center space-x-1 font-medium transition-colors ${
                currentPage === 'tools'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span>All Tools</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className={`flex items-center space-x-1 font-medium transition-colors ${
                currentPage === 'search'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
            
            <button
              onClick={() => onNavigate('blog')}
              className={`flex items-center space-x-1 font-medium transition-colors ${
                currentPage === 'blog'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';
import { PageType } from '../App';

interface SearchPageProps {
  onNavigate: (page: PageType) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools = [
    // Image Tools
    { id: 'image-compressor', name: 'Image Compressor', description: 'Compress JPG, PNG, WebP images without quality loss', category: 'Image Tools', keywords: ['compress', 'reduce', 'size', 'jpg', 'png', 'webp'], popular: true },
    { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to custom dimensions or presets', category: 'Image Tools', keywords: ['resize', 'dimensions', 'scale', 'crop'], popular: true },
    { id: 'image-converter', name: 'Image Converter', description: 'Convert between PNG, JPG, WebP formats', category: 'Image Tools', keywords: ['convert', 'format', 'png', 'jpg', 'webp'], popular: false },
    { id: 'background-remover', name: 'Background Remover', description: 'Remove backgrounds from images automatically', category: 'Image Tools', keywords: ['background', 'remove', 'transparent', 'cutout'], popular: true },

    // PDF Tools
    { id: 'pdf-compressor', name: 'PDF Compressor', description: 'Reduce PDF file size while maintaining quality', category: 'PDF Tools', keywords: ['pdf', 'compress', 'reduce', 'size'], popular: true },
    { id: 'pdf-merger', name: 'PDF Merger', description: 'Combine multiple PDF files into one', category: 'PDF Tools', keywords: ['pdf', 'merge', 'combine', 'join'], popular: true },
    { id: 'pdf-splitter', name: 'PDF Splitter', description: 'Split PDF into separate pages or ranges', category: 'PDF Tools', keywords: ['pdf', 'split', 'separate', 'pages'], popular: false },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to high-quality JPG images', category: 'PDF Tools', keywords: ['pdf', 'jpg', 'convert', 'image'], popular: true },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF documents', category: 'PDF Tools', keywords: ['jpg', 'pdf', 'convert', 'document'], popular: true },
    { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract text from PDF files with OCR support', category: 'PDF Tools', keywords: ['pdf', 'text', 'extract', 'ocr'], popular: false },
    { id: 'text-to-pdf', name: 'Text to PDF', description: 'Convert text to beautifully formatted PDF', category: 'PDF Tools', keywords: ['text', 'pdf', 'convert', 'format'], popular: false },

    // Video Tools
    { id: 'video-compressor', name: 'Video Compressor', description: 'Compress videos for web, social media, or storage', category: 'Video Tools', keywords: ['video', 'compress', 'reduce', 'mp4'], popular: true },
    { id: 'video-trimmer', name: 'Video Trimmer', description: 'Cut and trim videos to desired length', category: 'Video Tools', keywords: ['video', 'trim', 'cut', 'edit'], popular: true },
    { id: 'gif-maker', name: 'GIF Maker', description: 'Create animated GIFs from images or videos', category: 'Video Tools', keywords: ['gif', 'animated', 'create', 'video'], popular: true },

    // Finance Tools
    { id: 'finance-calculators', name: 'Finance Calculators', description: 'EMI, loan, and compound interest calculators', category: 'Finance Tools', keywords: ['emi', 'loan', 'interest', 'calculator', 'finance'], popular: true }
  ];

  const categories = ['all', 'Image Tools', 'PDF Tools', 'Video Tools', 'Finance Tools'];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const popularSearches = [
    'compress image',
    'pdf merger',
    'video compressor',
    'background remover',
    'emi calculator',
    'gif maker',
    'pdf to jpg',
    'image resizer'
  ];

  const recentSearches = [
    'compress pdf',
    'resize image',
    'video trimmer',
    'jpg to pdf'
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Search Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find the perfect tool for your needs. Search by name, description, or functionality.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for tools, features, or file types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm || selectedCategory !== 'all' ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Search Results ({filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'})
            </h2>
            
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  No tools found matching your search.
                </p>
                <p className="text-gray-400 dark:text-gray-500">
                  Try different keywords or browse all tools.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                    onClick={() => onNavigate(tool.id as PageType)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {tool.popular && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                            {tool.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        Use Tool
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Search Suggestions */
          <div className="space-y-8">
            {/* Popular Searches */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Popular Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(search)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by Category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Browse by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.slice(1).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {category}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tools.filter(tool => tool.category === category).length} tools
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
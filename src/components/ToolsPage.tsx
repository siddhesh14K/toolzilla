import React, { useState } from 'react';
import { 
  Image, 
  FileText, 
  Video, 
  Calculator, 
  Search, 
  Filter,
  Zap,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { PageType } from '../App';
import SEOHead from './SEO/SEOHead';
import StructuredData from './SEO/StructuredData';
import { toolsSEOData } from '../data/seoKeywords';

interface ToolsPageProps {
  onNavigate: (page: PageType) => void;
}

interface Tool {
  id: PageType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  color: string;
  popular: boolean;
  new?: boolean;
  seoKey?: string;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const tools: Tool[] = [
    // Image Tools
    {
      id: 'image-compressor',
      name: 'Image Compressor',
      description: 'Compress JPG, PNG, WebP images without quality loss',
      icon: Image,
      category: 'Image Tools',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      seoKey: 'imageCompressor'
    },
    {
      id: 'image-resizer',
      name: 'Image Resizer',
      description: 'Resize images to custom dimensions or presets',
      icon: Image,
      category: 'Image Tools',
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert between PNG, JPG, WebP formats',
      icon: Image,
      category: 'Image Tools',
      color: 'from-purple-500 to-purple-600',
      popular: false
    },
    {
      id: 'background-remover',
      name: 'Background Remover',
      description: 'Remove backgrounds from images automatically',
      icon: Image,
      category: 'Image Tools',
      color: 'from-pink-500 to-pink-600',
      popular: true,
      new: true
    },

    // PDF Tools
    {
      id: 'pdf-compressor',
      name: 'PDF Compressor',
      description: 'Reduce PDF file size while maintaining quality',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-red-500 to-red-600',
      popular: true
    },
    {
      id: 'pdf-merger',
      name: 'PDF Merger',
      description: 'Combine multiple PDF files into one',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-orange-500 to-orange-600',
      popular: true
    },
    {
      id: 'pdf-splitter',
      name: 'PDF Splitter',
      description: 'Split PDF into separate pages or ranges',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-yellow-500 to-yellow-600',
      popular: false
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert PDF pages to high-quality JPG images',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-indigo-500 to-indigo-600',
      popular: true
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert JPG images to PDF documents',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-teal-500 to-teal-600',
      popular: true
    },
    {
      id: 'pdf-to-text',
      name: 'PDF to Text',
      description: 'Extract text from PDF files with OCR support',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-cyan-500 to-cyan-600',
      popular: false
    },
    {
      id: 'text-to-pdf',
      name: 'Text to PDF',
      description: 'Convert text to beautifully formatted PDF',
      icon: FileText,
      category: 'PDF Tools',
      color: 'from-emerald-500 to-emerald-600',
      popular: false
    },

    // Video Tools
    {
      id: 'video-compressor',
      name: 'Video Compressor',
      description: 'Compress videos for web, social media, or storage',
      icon: Video,
      category: 'Video Tools',
      color: 'from-violet-500 to-violet-600',
      popular: true,
      new: true
    },
    {
      id: 'video-trimmer',
      name: 'Video Trimmer',
      description: 'Cut and trim videos to desired length',
      icon: Video,
      category: 'Video Tools',
      color: 'from-rose-500 to-rose-600',
      popular: true,
      new: true
    },
    {
      id: 'gif-maker',
      name: 'GIF Maker',
      description: 'Create animated GIFs from images or videos',
      icon: Video,
      category: 'Video Tools',
      color: 'from-amber-500 to-amber-600',
      popular: true,
      new: true
    },

    // Finance Tools
    {
      id: 'finance-calculators',
      name: 'Finance Calculators',
      description: 'EMI, loan, and compound interest calculators',
      icon: Calculator,
      category: 'Finance Tools',
      color: 'from-slate-500 to-slate-600',
      popular: true
    }
  ];

  const categories = ['all', 'Image Tools', 'PDF Tools', 'Video Tools', 'Finance Tools'];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularTools = tools.filter(tool => tool.popular);
  const newTools = tools.filter(tool => tool.new);

  const currentTool = tools.find(tool => tool.id === location.pathname.split('/').pop());
  const seoData = currentTool?.seoKey ? toolsSEOData[currentTool.seoKey] : null;

  return (
    <>
      {seoData && (
        <>
          <SEOHead
            title={seoData.title}
            description={seoData.metaDescription}
            keywords={[seoData.primaryKeyword, ...seoData.secondaryKeywords].join(', ')}
            canonicalUrl={`https://freetoolsfree.in/${seoData.slug}`}
          />
          <StructuredData
            type="WebPage"
            data={seoData}
            url={`https://freetoolsfree.in/${seoData.slug}`}
          />
          {seoData.faqs && seoData.faqs.length > 0 && (
            <StructuredData
              type="FAQPage"
              data={seoData}
              url={`https://freetoolsfree.in/${seoData.slug}`}
            />
          )}
        </>
      )}
      
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              All Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our complete collection of professional-grade online tools. 
              Fast, secure, and completely free to use.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
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
                    {category === 'all' ? 'All Tools' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Tools Section */}
          {selectedCategory === 'all' && searchTerm === '' && (
            <div className="mb-16">
              <div className="flex items-center space-x-2 mb-8">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Most Popular</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularTools.slice(0, 4).map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                      onClick={() => onNavigate(tool.id)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                      <div className="p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          Use Tool
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* New Tools Section */}
          {selectedCategory === 'all' && searchTerm === '' && newTools.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center space-x-2 mb-8">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Tools</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                      onClick={() => onNavigate(tool.id)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                      <div className="p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                            New
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          Try Now
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tools Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {selectedCategory === 'all' ? 'All Tools' : selectedCategory}
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                ({filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'})
              </span>
            </h2>
            
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No tools found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                      onClick={() => onNavigate(tool.id)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                      <div className="p-6">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl mb-4`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {tool.name}
                          </h3>
                          {tool.popular && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {tool.new && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {tool.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          Use Tool
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a Custom Tool?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Can't find what you're looking for? Let us know what tool you need!
            </p>
            <button 
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Request a Tool
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolsPage;
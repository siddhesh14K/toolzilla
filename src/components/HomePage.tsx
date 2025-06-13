import React from 'react';
import { Image, Calculator, FileText, Download, ArrowRight, Zap, Star, Users, Clock } from 'lucide-react';
import { PageType } from '../App';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: 'image-compressor',
      title: 'Image Compressor',
      description: 'Compress images without losing quality. Support for JPG, PNG, WebP formats.',
      icon: Image,
      color: 'from-blue-500 to-blue-600',
      steps: ['Upload your image', 'Choose compression level', 'Download compressed file']
    },
    {
      id: 'image-resizer',
      title: 'Image Resizer',
      description: 'Resize images to custom dimensions or select from presets while maintaining quality.',
      icon: Image,
      color: 'from-green-500 to-green-600',
      steps: ['Upload image file', 'Set new dimensions', 'Download resized image']
    },
    {
      id: 'finance-calculators',
      title: 'Finance Calculators',
      description: 'EMI Calculator, Loan Repayment Estimator, and Compound Interest Calculator.',
      icon: Calculator,
      color: 'from-purple-500 to-purple-600',
      steps: ['Enter financial details', 'View calculations', 'Download report']
    },
    {
      id: 'pdf-to-text',
      title: 'PDF to Text',
      description: 'Extract text from PDF files instantly with OCR support for scanned documents.',
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      steps: ['Upload PDF file', 'Extract text content', 'Copy or download text']
    },
    {
      id: 'text-to-pdf',
      title: 'Text to PDF',
      description: 'Convert text to beautifully formatted PDF with styling templates.',
      icon: Download,
      color: 'from-red-500 to-red-600',
      steps: ['Enter your text', 'Choose template', 'Generate & download PDF']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'All processing happens locally in your browser for maximum speed and privacy.'
    },
    {
      icon: Star,
      title: 'Professional Quality',
      description: 'Industry-standard algorithms ensure the best results for all your files.'
    },
    {
      icon: Users,
      title: 'User Friendly',
      description: 'Intuitive interface designed for both beginners and professionals.'
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Access all tools 24/7 from any device with a modern web browser.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-16 w-16 text-blue-600 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
              ToolZilla
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Fast & Free Online Tools That Work
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Professional-grade tools for image processing, document conversion, and financial calculations. 
            All tools work entirely in your browser for maximum privacy and speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('image-compressor')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Image Compressor
            </button>
            <button 
              onClick={() => onNavigate('finance-calculators')}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Explore All Tools
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose ToolZilla?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Professional Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Each tool is designed with precision and optimized for performance. Choose from our collection of professional-grade utilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${tool.color}`} />
                  <div className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">How it works:</h4>
                      <ol className="space-y-2">
                        {tool.steps.map((step, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <button
                      onClick={() => onNavigate(tool.id as PageType)}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-300 transition-all duration-200 group-hover:shadow-lg"
                    >
                      Use Tool
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust ToolZilla for their daily tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('image-compressor')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start with Image Tools
            </button>
            <button 
              onClick={() => onNavigate('finance-calculators')}
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Try Finance Calculators
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
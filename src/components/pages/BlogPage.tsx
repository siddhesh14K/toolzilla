import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Search, Tag, TrendingUp, Star } from 'lucide-react';
import { PageType } from '../../App';
import { blogPosts, getBlogPostsByCategory, getFeaturedBlogPosts } from '../../data/blogContent';
import BlogSEO from '../SEO/BlogSEO';

interface BlogPageProps {
  onNavigate: (page: PageType) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['all', 'PDF Tools', 'Image Tools', 'Video Tools', 'Calculators', 'Tips & Tricks'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = getFeaturedBlogPosts();

  return (
    <>
      <BlogSEO
        title="Free Online Tools Blog - Tips, Guides & Tutorials"
        description="Expert guides on PDF compression, image optimization, video editing, and financial calculations. Learn to use free online tools effectively with step-by-step tutorials."
        keywords="online tools blog, pdf compression guide, image optimization tips, emi calculator tutorial, free tools tutorials"
        slug=""
        publishDate="2025-01-15"
        modifiedDate="2025-01-15"
        category="Blog"
        readTime="5 min read"
      />
      
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              FreeToolsFree Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Expert tips, tutorials, and insights to help you master online tools and boost your productivity. 
              Learn from comprehensive guides on PDF tools, image optimization, video editing, and financial planning.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
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
                    {category === 'all' ? 'All Posts' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Posts */}
          {selectedCategory === 'all' && searchTerm === '' && (
            <div className="mb-16">
              <div className="flex items-center space-x-2 mb-8">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map(post => (
                  <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.keywords.slice(0, 3).map(keyword => (
                          <span key={keyword} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            <Tag className="h-3 w-3" />
                            <span>{keyword}</span>
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Read Full Article
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {selectedCategory === 'all' ? 'Latest Articles' : `${selectedCategory} Articles`}
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.keywords.slice(0, 2).map(keyword => (
                          <span key={keyword} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            <Tag className="h-3 w-3" />
                            <span>{keyword}</span>
                          </span>
                        ))}
                        {post.keywords.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                            +{post.keywords.length - 2} more
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Tips</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest tutorials, tool updates, and productivity tips delivered to your inbox. 
              Join thousands of users who trust FreeToolsFree for their daily tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              No spam, unsubscribe anytime. Read our <button onClick={() => onNavigate('privacy')} className="underline hover:text-white">privacy policy</button>.
            </p>
          </div>

          {/* Related Tools CTA */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Try Our Free Online Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Put your knowledge to practice with our comprehensive collection of free online tools.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => onNavigate('image-compressor')}
                className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium">Image Compressor</span>
              </button>
              <button 
                onClick={() => onNavigate('pdf-compressor')}
                className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <span className="text-red-600 dark:text-red-400 font-medium">PDF Compressor</span>
              </button>
              <button 
                onClick={() => onNavigate('finance-calculators')}
                className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <span className="text-green-600 dark:text-green-400 font-medium">EMI Calculator</span>
              </button>
              <button 
                onClick={() => onNavigate('video-compressor')}
                className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <span className="text-purple-600 dark:text-purple-400 font-medium">Video Compressor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
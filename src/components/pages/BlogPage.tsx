import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Search, Tag, TrendingUp } from 'lucide-react';
import { PageType } from '../../App';

interface BlogPageProps {
  onNavigate: (page: PageType) => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Ultimate Guide to Image Compression: Quality vs File Size',
      excerpt: 'Learn how to achieve the perfect balance between image quality and file size for web optimization, email attachments, and storage efficiency.',
      content: `Image compression is a crucial skill in today's digital world. Whether you're optimizing images for your website, reducing file sizes for email attachments, or managing storage space, understanding compression techniques can save you time and improve performance.

## Understanding Image Compression

Image compression reduces file size by removing redundant data while preserving visual quality. There are two main types:

### Lossy Compression
- Permanently removes some image data
- Smaller file sizes
- Best for photographs and complex images
- JPEG is the most common lossy format

### Lossless Compression
- Preserves all original image data
- Larger file sizes than lossy
- Best for graphics with sharp edges
- PNG is a popular lossless format

## Best Practices for Web Images

1. **Choose the Right Format**
   - JPEG for photographs
   - PNG for graphics with transparency
   - WebP for modern browsers (best compression)

2. **Optimize Quality Settings**
   - 80-85% quality for most web images
   - 90-95% for high-quality displays
   - 60-75% for thumbnails

3. **Consider Image Dimensions**
   - Resize images to display dimensions
   - Use responsive images for different screen sizes
   - Implement lazy loading for better performance

## Tools and Techniques

ToolZilla's Image Compressor uses advanced algorithms to:
- Maintain visual quality while reducing file size
- Support multiple formats (JPEG, PNG, WebP)
- Process images locally for privacy
- Provide real-time compression previews

## Measuring Success

Track these metrics to evaluate compression effectiveness:
- File size reduction percentage
- Visual quality assessment
- Page load speed improvement
- User engagement metrics

Remember, the goal is finding the sweet spot between quality and performance for your specific use case.`,
      author: 'Sarah Chen',
      date: '2025-01-15',
      readTime: '8 min read',
      category: 'Image Tools',
      tags: ['compression', 'optimization', 'web performance'],
      featured: true
    },
    {
      id: '2',
      title: 'PDF to Text Conversion: When and Why You Need It',
      excerpt: 'Discover the benefits of converting PDFs to text format, from accessibility improvements to content repurposing and data extraction.',
      content: `PDF to text conversion is an essential process for many digital workflows. Understanding when and how to convert PDFs to text can significantly improve your productivity and content accessibility.

## Why Convert PDF to Text?

### Accessibility Benefits
- Screen readers can better interpret plain text
- Easier navigation for visually impaired users
- Better compatibility with assistive technologies

### Content Repurposing
- Extract quotes and citations for research
- Repurpose content for different formats
- Create summaries and abstracts
- Translate content more effectively

### Data Processing
- Extract data for analysis
- Import content into databases
- Process large volumes of documents
- Automate content workflows

## Common Use Cases

1. **Academic Research**
   - Extract citations from research papers
   - Create literature reviews
   - Analyze large document collections

2. **Business Operations**
   - Process invoices and receipts
   - Extract data from reports
   - Convert legacy documents

3. **Legal and Compliance**
   - Search through legal documents
   - Extract specific clauses
   - Create searchable archives

## Best Practices

### Before Conversion
- Ensure PDF quality is good
- Check for password protection
- Verify text is selectable (not scanned)

### During Conversion
- Choose appropriate output format
- Preserve formatting when needed
- Handle special characters correctly

### After Conversion
- Review extracted text for accuracy
- Clean up formatting issues
- Verify completeness

## Handling Different PDF Types

### Text-based PDFs
- Direct text extraction
- High accuracy
- Preserves formatting

### Scanned PDFs
- Requires OCR technology
- May need manual review
- Consider image quality

### Mixed Content PDFs
- Combine extraction methods
- Handle images and text separately
- Maintain document structure

ToolZilla's PDF to Text converter handles all these scenarios automatically, providing clean, accurate text extraction with privacy protection.`,
      author: 'Michael Rodriguez',
      date: '2025-01-12',
      readTime: '6 min read',
      category: 'Document Tools',
      tags: ['pdf', 'text extraction', 'accessibility'],
      featured: false
    },
    {
      id: '3',
      title: 'Financial Planning Made Easy: Using EMI and Loan Calculators',
      excerpt: 'Master your finances with comprehensive guides on EMI calculations, loan planning, and investment strategies using online calculators.',
      content: `Financial planning is crucial for achieving your life goals. Understanding how to use EMI and loan calculators effectively can help you make informed decisions about borrowing and investing.

## Understanding EMI Calculations

EMI (Equated Monthly Installment) is the fixed amount you pay monthly for loans. The calculation considers:

### Key Components
- **Principal Amount**: The loan amount borrowed
- **Interest Rate**: Annual percentage rate charged
- **Tenure**: Loan duration in months or years

### EMI Formula
EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)

Where:
- P = Principal loan amount
- r = Monthly interest rate
- n = Number of monthly installments

## Types of Loans and Their Considerations

### Home Loans
- Longest tenure (up to 30 years)
- Lowest interest rates
- Tax benefits available
- Consider prepayment options

### Personal Loans
- Higher interest rates
- Shorter tenure (1-5 years)
- No collateral required
- Quick processing

### Car Loans
- Moderate interest rates
- Asset-backed security
- Depreciation considerations
- Insurance requirements

## Smart Borrowing Strategies

1. **Compare Interest Rates**
   - Shop around different lenders
   - Consider processing fees
   - Look for special offers

2. **Choose Optimal Tenure**
   - Longer tenure = lower EMI, higher total interest
   - Shorter tenure = higher EMI, lower total interest
   - Balance affordability with cost

3. **Plan for Prepayments**
   - Reduce total interest burden
   - Shorten loan tenure
   - Improve credit score

## Using Loan Calculators Effectively

### Before Applying
- Determine affordable EMI amount
- Compare different loan scenarios
- Plan for additional costs

### During Application
- Verify lender calculations
- Understand all charges
- Review terms and conditions

### After Approval
- Track payment schedules
- Plan prepayment strategies
- Monitor interest rate changes

## Investment Planning

### Compound Interest Power
- Start investing early
- Regular contributions matter
- Time is your biggest asset
- Reinvest returns for growth

### SIP Calculations
- Systematic Investment Plans
- Rupee cost averaging benefits
- Disciplined investing approach
- Long-term wealth creation

ToolZilla's financial calculators provide accurate, instant calculations to help you plan your financial future with confidence.`,
      author: 'Priya Sharma',
      date: '2025-01-10',
      readTime: '10 min read',
      category: 'Finance',
      tags: ['emi', 'loans', 'financial planning', 'investment'],
      featured: true
    },
    {
      id: '4',
      title: 'Image Resizing for Social Media: Platform-Specific Guidelines',
      excerpt: 'Complete guide to image dimensions and optimization for Facebook, Instagram, Twitter, LinkedIn, and other social media platforms.',
      content: `Social media success often depends on visual content. Understanding platform-specific image requirements ensures your content looks professional and engages your audience effectively.

## Platform-Specific Dimensions

### Instagram
- **Feed Posts**: 1080 × 1080 px (square)
- **Stories**: 1080 × 1920 px (9:16 ratio)
- **Reels**: 1080 × 1920 px (9:16 ratio)
- **IGTV Cover**: 420 × 654 px (1:1.55 ratio)

### Facebook
- **Feed Posts**: 1200 × 630 px (1.91:1 ratio)
- **Cover Photo**: 820 × 312 px
- **Stories**: 1080 × 1920 px (9:16 ratio)
- **Event Cover**: 1920 × 1080 px

### Twitter
- **In-stream Photo**: 1200 × 675 px (16:9 ratio)
- **Header Photo**: 1500 × 500 px (3:1 ratio)
- **Profile Photo**: 400 × 400 px (square)

### LinkedIn
- **Company Page Cover**: 1192 × 220 px
- **Personal Cover**: 1584 × 396 px
- **Post Images**: 1200 × 627 px
- **Profile Photo**: 400 × 400 px

## Optimization Best Practices

### File Size Considerations
- Keep images under 1MB for faster loading
- Use JPEG for photographs
- Use PNG for graphics with transparency
- Consider WebP for better compression

### Quality Guidelines
- Maintain high resolution for clarity
- Avoid pixelation and blur
- Test on different devices
- Consider mobile viewing experience

### Content Strategy
- Use consistent branding
- Maintain aspect ratios
- Plan for text overlays
- Consider accessibility

## Tools and Workflow

### Batch Processing
- Resize multiple images simultaneously
- Maintain consistent quality
- Save time on repetitive tasks
- Standardize your content

### Template Creation
- Create templates for each platform
- Maintain brand consistency
- Speed up content creation
- Ensure proper dimensions

### Quality Control
- Preview on different devices
- Check compression artifacts
- Verify text readability
- Test loading speeds

## Common Mistakes to Avoid

1. **Wrong Aspect Ratios**
   - Images get cropped unexpectedly
   - Important content may be hidden
   - Unprofessional appearance

2. **Poor Quality**
   - Pixelated or blurry images
   - Over-compressed files
   - Inconsistent quality across posts

3. **Ignoring Mobile Users**
   - Most social media consumption is mobile
   - Test on various screen sizes
   - Ensure readability on small screens

## Advanced Techniques

### Responsive Images
- Create multiple sizes for different uses
- Optimize for various screen densities
- Use appropriate formats for each platform

### A/B Testing
- Test different image sizes
- Compare engagement rates
- Optimize based on performance data

ToolZilla's Image Resizer makes it easy to create perfectly sized images for any social media platform, with presets for popular dimensions and quality optimization.`,
      author: 'Alex Thompson',
      date: '2025-01-08',
      readTime: '7 min read',
      category: 'Image Tools',
      tags: ['social media', 'image resizing', 'optimization'],
      featured: false
    },
    {
      id: '5',
      title: 'Text to PDF: Creating Professional Documents Online',
      excerpt: 'Learn how to convert text to beautifully formatted PDFs with proper styling, headers, footers, and professional layouts.',
      content: `Creating professional PDF documents from text content is essential for business communications, reports, and documentation. Understanding formatting options and best practices ensures your documents make the right impression.

## Why Convert Text to PDF?

### Professional Presentation
- Consistent formatting across devices
- Print-ready documents
- Professional appearance
- Brand consistency

### Document Security
- Prevent unauthorized editing
- Maintain formatting integrity
- Password protection options
- Digital signatures support

### Universal Compatibility
- Readable on any device
- Consistent appearance
- No software dependencies
- Archive-friendly format

## Formatting Best Practices

### Typography Choices
- **Serif Fonts**: Times New Roman, Georgia (formal documents)
- **Sans-serif Fonts**: Arial, Helvetica (modern, clean look)
- **Monospace Fonts**: Courier New (code, technical content)

### Layout Principles
- Consistent margins (1-1.5 inches)
- Appropriate line spacing (1.15-1.5)
- Logical heading hierarchy
- White space for readability

### Color and Design
- High contrast for readability
- Consistent color scheme
- Professional color choices
- Accessibility considerations

## Document Structure

### Headers and Footers
- Company branding
- Page numbers
- Document title
- Date and version

### Content Organization
- Clear section headings
- Logical flow
- Table of contents for long documents
- Consistent formatting

### Visual Elements
- Appropriate use of bold and italics
- Bullet points and numbered lists
- Tables for data presentation
- Images and charts when relevant

## Common Document Types

### Business Reports
- Executive summary
- Data analysis
- Recommendations
- Professional formatting

### Proposals
- Cover page
- Project overview
- Timeline and budget
- Terms and conditions

### Manuals and Guides
- Step-by-step instructions
- Screenshots and diagrams
- Index and references
- Version control

### Legal Documents
- Formal language
- Precise formatting
- Signature blocks
- Compliance requirements

## Quality Assurance

### Before Conversion
- Proofread content thoroughly
- Check formatting consistency
- Verify all information
- Review document structure

### After Conversion
- Test on different devices
- Check print quality
- Verify links and references
- Ensure accessibility compliance

### Distribution Considerations
- File size optimization
- Email attachment limits
- Web download speeds
- Mobile viewing experience

## Advanced Features

### Interactive Elements
- Clickable table of contents
- Internal document links
- External URL links
- Form fields

### Accessibility Features
- Alt text for images
- Proper heading structure
- High contrast colors
- Screen reader compatibility

### Security Options
- Password protection
- Editing restrictions
- Printing limitations
- Digital rights management

ToolZilla's Text to PDF converter provides professional formatting options, customizable templates, and quality output for all your document needs.`,
      author: 'Jennifer Liu',
      date: '2025-01-05',
      readTime: '9 min read',
      category: 'Document Tools',
      tags: ['pdf creation', 'document formatting', 'professional documents'],
      featured: false
    }
  ];

  const categories = ['all', 'Image Tools', 'Document Tools', 'Finance', 'Tips & Tricks'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            ToolZilla Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Expert tips, tutorials, and insights to help you master online tools and boost your productivity.
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
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                    <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      Read More
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
            {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
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
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                    <button className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm">
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
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get the latest tips, tutorials, and tool updates delivered to your inbox. 
            Join thousands of users who trust ToolZilla for their productivity needs.
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
            No spam, unsubscribe anytime. Read our privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
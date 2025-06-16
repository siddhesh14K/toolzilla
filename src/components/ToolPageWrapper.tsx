import React from 'react';
import SEOHead from './SEO/SEOHead';
import StructuredData from './SEO/StructuredData';
import { toolsSEOData } from '../data/seoKeywords';

interface ToolPageWrapperProps {
  seoKey: string;
  children: React.ReactNode;
}

const ToolPageWrapper: React.FC<ToolPageWrapperProps> = ({ seoKey, children }) => {
  const seoData = toolsSEOData[seoKey];
  const url = `https://freetoolsfree.in/${seoData.slug}`;

  if (!seoData) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoData.title}
        description={seoData.metaDescription}
        keywords={[seoData.primaryKeyword, ...seoData.secondaryKeywords].join(', ')}
        canonicalUrl={url}
      />
      <StructuredData
        type="WebPage"
        data={seoData}
        url={url}
      />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {seoData.h1}
        </h1>
        
        {/* Tool Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {children}
        </div>
        
        {/* FAQs Section */}
        {seoData.faqs && seoData.faqs.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {seoData.faqs.map((faq, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <StructuredData
              type="FAQPage"
              data={seoData}
              url={url}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ToolPageWrapper;

import React from 'react';
import { ToolSEOData } from '../../data/seoKeywords';

interface StructuredDataProps {
  type: 'Tool' | 'Article' | 'FAQ' | 'HowTo' | 'Calculator' | 'WebPage' | 'FAQPage';
  data: any;
  url: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data, url }) => {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org"
    };

    switch (type) {
      case 'WebPage':
        return {
          ...baseSchema,
          "@type": "WebPage",
          "name": data.title,
          "description": data.metaDescription,
          "url": url,
          "mainEntity": {
            "@type": "WebApplication",
            "name": data.h1,
            "applicationCategory": "UtilityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        };

      case 'FAQPage':
        return {
          ...baseSchema,
          "@type": "FAQPage",
          "mainEntity": data.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      case 'Tool':
        return {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": data.name,
          "description": data.description,
          "url": data.url,
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };

      case 'Article':
        return {
          ...baseSchema,
          "@type": "Article",
          "headline": data.headline,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Organization",
            "name": "FreeToolsFree.in"
          },
          "publisher": {
            "@type": "Organization",
            "name": "FreeToolsFree.in",
            "logo": {
              "@type": "ImageObject",
              "url": "https://freetoolsfree.in/logo.png"
            }
          },
          "datePublished": data.datePublished,
          "dateModified": data.dateModified,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          }
        };

      case 'HowTo':
        return {
          ...baseSchema,
          "@type": "HowTo",
          "name": data.name,
          "description": data.description,
          "image": data.image,
          "totalTime": data.totalTime,
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": "0"
          },
          "supply": data.supplies || [],
          "tool": data.tools || [],
          "step": data.steps.map((step: any, index: number) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text,
            "image": step.image
          }))
        };

      case 'Calculator':
        return {
          ...baseSchema,
          "@type": "WebApplication",
          "name": data.name,
          "description": data.description,
          "url": data.url,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          },
          "featureList": [
            "EMI Calculation",
            "Loan Amount Calculation", 
            "Interest Rate Calculation",
            "Tenure Calculation",
            "Amortization Schedule"
          ]
        };

      default:
        return baseSchema;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateSchema())
      }}
    />
  );
};

export default StructuredData;
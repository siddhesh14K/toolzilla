import React from 'react';

interface StructuredDataProps {
  type: 'Tool' | 'Article' | 'FAQ' | 'HowTo' | 'Calculator';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org"
    };

    switch (type) {
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
            "priceCurrency": "INR"
          },
          "aggregateRating": data.rating && {
            "@type": "AggregateRating",
            "ratingValue": data.rating.value,
            "ratingCount": data.rating.count
          },
          "featureList": data.features || []
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

      case 'FAQ':
        return {
          ...baseSchema,
          "@type": "FAQPage",
          "mainEntity": data.questions.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
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

  React.useEffect(() => {
    const schema = generateSchema();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [type, data]);

  return null;
};

export default StructuredData;
import React from 'react';
import SEOHead from './SEOHead';
import StructuredData from './StructuredData';

interface ToolSEOProps {
  toolName: string;
  description: string;
  keywords: string;
  slug: string;
  category: string;
  features: string[];
  faqData?: Array<{question: string; answer: string}>;
  howToSteps?: Array<{name: string; text: string; image?: string}>;
}

const ToolSEO: React.FC<ToolSEOProps> = ({
  toolName,
  description,
  keywords,
  slug,
  category,
  features,
  faqData,
  howToSteps
}) => {
  const canonicalUrl = `https://freetoolsfree.in/${slug}`;
  
  const toolData = {
    name: toolName,
    description: description,
    url: canonicalUrl,
    features: features,
    rating: {
      value: 4.8,
      count: 1250
    }
  };

  const breadcrumbs = [
    { name: "Home", url: "https://freetoolsfree.in/" },
    { name: "Tools", url: "https://freetoolsfree.in/tools" },
    { name: category, url: `https://freetoolsfree.in/tools/${category.toLowerCase().replace(' ', '-')}` },
    { name: toolName, url: canonicalUrl }
  ];

  const howToData = howToSteps ? {
    name: `How to use ${toolName}`,
    description: `Step-by-step guide to use ${toolName} online for free`,
    image: `https://freetoolsfree.in/images/${slug}-guide.jpg`,
    totalTime: "PT2M",
    steps: howToSteps
  } : null;

  return (
    <>
      <SEOHead
        title={`${toolName} - Free Online Tool | FreeToolsFree.in`}
        description={description}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
        ogImage={`https://freetoolsfree.in/images/${slug}-og.jpg`}
        breadcrumbs={breadcrumbs}
      />
      <StructuredData type="Tool" data={toolData} />
      {faqData && <StructuredData type="FAQ" data={{ questions: faqData }} />}
      {howToData && <StructuredData type="HowTo" data={howToData} />}
    </>
  );
};

export default ToolSEO;
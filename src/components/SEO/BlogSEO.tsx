import React from 'react';
import SEOHead from './SEOHead';
import StructuredData from './StructuredData';

interface BlogSEOProps {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  publishDate: string;
  modifiedDate: string;
  category: string;
  readTime: string;
  image?: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  keywords,
  slug,
  publishDate,
  modifiedDate,
  category,
  readTime,
  image = "https://freetoolsfree.in/blog-default.jpg"
}) => {
  const canonicalUrl = `https://freetoolsfree.in/blog/${slug}`;
  
  const articleData = {
    headline: title,
    description: description,
    image: image,
    datePublished: publishDate,
    dateModified: modifiedDate,
    url: canonicalUrl
  };

  const breadcrumbs = [
    { name: "Home", url: "https://freetoolsfree.in/" },
    { name: "Blog", url: "https://freetoolsfree.in/blog" },
    { name: category, url: `https://freetoolsfree.in/blog/category/${category.toLowerCase()}` },
    { name: title, url: canonicalUrl }
  ];

  return (
    <>
      <SEOHead
        title={`${title} | FreeToolsFree.in Blog`}
        description={description}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
        ogImage={image}
        ogType="article"
        breadcrumbs={breadcrumbs}
      />
      <StructuredData type="Article" data={articleData} />
    </>
  );
};

export default BlogSEO;
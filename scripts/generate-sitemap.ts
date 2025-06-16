import fs from 'fs';
import path from 'path';
import { toolsSEOData } from '../src/data/seoKeywords';

const SITE_URL = 'https://freetoolsfree.in';

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  // Start XML content
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add tool pages
  Object.entries(toolsSEOData).forEach(([_, data]) => {
    sitemap += `
  <url>
    <loc>${SITE_URL}/${data.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Close XML
  sitemap += '\n</urlset>';

  // Write to file
  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemap
  );

  console.log('Sitemap generated successfully!');
}

generateSitemap();

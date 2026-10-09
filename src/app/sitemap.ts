import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://boxmoc.com';
  
  // In production, you would fetch dynamic IDs (like blog posts) from your database
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/waitlist',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}

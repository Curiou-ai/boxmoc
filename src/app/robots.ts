import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/creator/billing',
        '/creator/profile',
        '/api/',
      ],
    },
    sitemap: 'https://boxmoc.com/sitemap.xml',
  };
}

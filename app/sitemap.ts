import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://curiopay.vercel.app';
  
  // Define your main routes
  const routes = [
    '',
    '/register',
    '/login',
    '/dashboard',
    '/features',
    '/pricing',
    '/about',
    '/contact',
    '/legal/privacy',
    '/legal/terms',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
} 
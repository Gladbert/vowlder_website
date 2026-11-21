import type { APIRoute } from 'astro';
import { themes } from '../data/themes';
import { guides } from '../data/guide';

/** Hand-rolled so the project stays dependency-free; 40-ish URLs, all static. */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://vowlder.com')).href.replace(/\/$/, '');

  const pages = [
    { path: '/', priority: '1.0' },
    { path: '/themes', priority: '0.9' },
    { path: '/packages', priority: '0.9' },
    { path: '/packages/basic', priority: '0.6' },
    { path: '/packages/premium', priority: '0.6' },
    { path: '/packages/signature', priority: '0.6' },
    { path: '/custom', priority: '0.8' },
    { path: '/process', priority: '0.7' },
    { path: '/about', priority: '0.6' },
    { path: '/faq', priority: '0.6' },
    { path: '/guide', priority: '0.7' },
    { path: '/contact', priority: '0.8' },
    { path: '/privacy', priority: '0.2' },
    { path: '/terms', priority: '0.2' },
  ];

  const urls = [
    ...pages.map((page) => ({ loc: `${base}${page.path}`, priority: page.priority })),
    ...themes.map((theme) => ({ loc: `${base}/themes/${theme.slug}/`, priority: '0.8' })),
    ...guides.map((guide) => ({ loc: `${base}/guide/${guide.slug}/`, priority: '0.6' })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${url.loc}</loc><changefreq>monthly</changefreq><priority>${url.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

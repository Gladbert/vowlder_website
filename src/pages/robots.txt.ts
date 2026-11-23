import type { APIRoute } from 'astro';

/** Generated from the same `site` value as canonical and og:image, so they cannot drift. */
export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://vowlder.com')).href.replace(/\/$/, '');
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

import type { APIRoute } from 'astro';
import { renderOgCard } from '../../lib/og';
import { themes } from '../../data/themes';

export const GET: APIRoute = async () => {
  const png = await renderOgCard({
    eyebrow: `Catalogue ${new Date().getFullYear()}`,
    title: 'Vowlder',
    meta: `${themes.length} digital wedding invitation themes`,
    bg: '#f7f3ec',
    ink: '#2b2320',
    accent: '#856436',
    line: '#ded4c5',
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
  });
};

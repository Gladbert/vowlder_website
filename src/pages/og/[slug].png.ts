import type { APIRoute } from 'astro';
import { renderOgCard } from '../../lib/og';
import { rupiah, themes } from '../../data/themes';

export function getStaticPaths() {
  return themes.map((theme) => ({ params: { slug: theme.slug }, props: { theme } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { theme } = props;
  const png = await renderOgCard({
    eyebrow: `${theme.category} · ${theme.tier}`,
    title: theme.name,
    meta: `${rupiah(theme.price)} — undangan pernikahan digital`,
    bg: theme.palette.bg,
    ink: theme.palette.ink,
    accent: theme.palette.accent,
    line: theme.palette.line,
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000' },
  });
};

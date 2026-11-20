import sharp from 'sharp';

/** WhatsApp reads og:image from the static HTML, so every theme needs its own file. */
const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export interface OgCard {
  eyebrow: string;
  title: string;
  meta: string;
  bg: string;
  ink: string;
  accent: string;
  line: string;
}

export function renderOgCard(card: OgCard) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${card.bg}"/>
  <rect x="80" y="112" width="1040" height="1" fill="${card.line}"/>
  <rect x="80" y="516" width="1040" height="1" fill="${card.line}"/>
  <text x="80" y="184" fill="${card.accent}" font-family="DejaVu Sans, Helvetica, sans-serif" font-size="21" letter-spacing="6">${escapeXml(
    card.eyebrow.toUpperCase()
  )}</text>
  <text x="80" y="330" fill="${card.ink}" font-family="DejaVu Serif, Georgia, serif" font-size="86">${escapeXml(
    card.title
  )}</text>
  <text x="80" y="400" fill="${card.ink}" fill-opacity="0.62" font-family="DejaVu Sans, Helvetica, sans-serif" font-size="25">${escapeXml(
    card.meta
  )}</text>
  <text x="80" y="572" fill="${card.accent}" font-family="DejaVu Sans, Helvetica, sans-serif" font-size="21" letter-spacing="5">VOWLDER.COM</text>
</svg>`;

  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

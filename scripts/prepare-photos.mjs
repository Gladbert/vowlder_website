// One-off asset prep: pull the real wedding photos out of the Wedding-inv guest app,
// downscale to 1080px WebP so the whole portfolio stays small.
// Read-only on the source repo. Run: node scripts/prepare-photos.mjs
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const SRC = '/home/gladbert/gladbert/Wedding-inv/apps/guest/dist/src/assets/images';
const OUT = 'public/photos';

const files = {
  cover: 'cover_background.webp',
  groom: 'groom_portrait.webp',
  bride: 'bride_portrait.webp',
  hero1: 'hero_slide_1.webp',
  couple: 'prewedding_couple_hero_1789399481614.jpg',
  kyoto: 'japan_sepia_gion_1789399840966.jpg',
  fuji: 'japan_sepia_fuji_1789399888659.webp',
  candid: 'prewedding_candid_laugh_1789399500660.jpg',
  lake: 'gallery_1791461823047_L5070707.webp',
  shibuya: 'gallery_1791480221524_L5090442.webp',
  bamboo: 'japan_sepia_bamboo_1789399855253.webp',
  shrine: 'japan_sepia_shrine_1789399867599.webp',
  // Extracted for the newer themes, so no two designs share a photograph.
  pool1: 'hero_slide_2.webp',
  pool2: 'hero_slide_3.webp',
  pool3: 'hero_slide_4.webp',
  pool4: 'gallery_1791480419015_L5050034.webp',
  pool5: 'gallery_1791480440474_PXDS2650.webp',
  pool6: 'gallery_1791480474336_L5090759.webp',
  pool7: 'gallery_1791480611808_L5060417.webp',
  pool8: 'prewedding_sunset_coast_1789399515265.webp',
};

mkdirSync(OUT, { recursive: true });

for (const [name, file] of Object.entries(files)) {
  const out = join(OUT, `${name}.webp`);
  const info = await sharp(join(SRC, file))
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toFile(out);
  console.log(`${name}.webp  ${Math.round(info.size / 1024)} KB  ${info.width}x${info.height}`);
}

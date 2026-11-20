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
};

mkdirSync(OUT, { recursive: true });

for (const [name, file] of Object.entries(files)) {
  const out = join(OUT, `${name}.webp`);
  const info = await sharp(join(SRC, file))
    .resize({ width: 1080, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out);
  console.log(`${name}.webp  ${Math.round(info.size / 1024)} KB  ${info.width}x${info.height}`);
}

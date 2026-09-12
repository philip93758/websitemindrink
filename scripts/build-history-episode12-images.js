import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { EPISODE12_ASSETS, EPISODE12_IMAGES, imageVariant, imageWidths } from './history-episode12-config.js';

const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Usage: node scripts/build-history-episode12-images.js <source-directory> [path-to-sharp]');
// Sharp is an authoring tool only, not a website or deployment dependency.
const sharp = createRequire(import.meta.url)(process.argv[3] || 'sharp');
const target = resolve(import.meta.dirname, '..', EPISODE12_ASSETS);
const images = Object.values(EPISODE12_IMAGES).map(image => {
  const source = join(resolve(sourceDirectory), '_assets', 'selected', image.file);
  if (createHash('sha256').update(readFileSync(source)).digest('hex') !== image.sha256) {
    throw new Error(`Original differs from the approved selection: ${image.file}`);
  }
  return { ...image, source };
});
mkdirSync(target, { recursive: true });
for (const image of images) {
  copyFileSync(image.source, join(target, image.file));
  for (const width of imageWidths(image)) {
    await sharp(image.source).resize({ width, withoutEnlargement: true }).webp({ quality: 84 })
      .toFile(join(target, imageVariant(image, width)));
  }
  console.log(`Preserved original and generated proportional WebP sizes: ${image.file}`);
}

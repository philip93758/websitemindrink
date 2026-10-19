import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { EPISODE13_ASSETS, EPISODE13_IMAGES, episode13Variant, episode13Widths } from './history-episode13-config.js';

// Optional local authoring tool. No network calls, installs, cropping or runtime
// image processing. Originals must already match the selected credited files.
const sharp = createRequire(import.meta.url)(process.argv[2] || 'sharp');
const target = resolve(import.meta.dirname, '..', EPISODE13_ASSETS);
for (const image of Object.values(EPISODE13_IMAGES)) {
  const bytes = readFileSync(join(target, image.file));
  if (createHash('sha256').update(bytes).digest('hex') !== image.sha256) throw new Error(`Unexpected original: ${image.file}`);
  const metadata = await sharp(bytes).metadata();
  if (metadata.width !== image.width || metadata.height !== image.height) throw new Error(`Unexpected image dimensions: ${image.file}`);
}
for (const image of Object.values(EPISODE13_IMAGES)) {
  for (const width of episode13Widths(image)) {
    await sharp(join(target, image.file)).resize({ width, withoutEnlargement: true }).webp({ quality: 84 })
      .toFile(join(target, episode13Variant(image, width)));
  }
  console.log(`Generated proportional WebP variants; original preserved: ${image.file}`);
}

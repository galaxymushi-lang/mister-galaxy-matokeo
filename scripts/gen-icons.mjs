import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const svg = readFileSync(join(process.cwd(), 'public', 'icons', 'icon.svg'));

async function generate() {
  await sharp(svg).resize(192, 192).png().toFile(join(process.cwd(), 'public', 'icons', 'icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(join(process.cwd(), 'public', 'icons', 'icon-512.png'));
  await sharp(svg).resize(512, 512).png().toFile(join(process.cwd(), 'public', 'icons', 'icon-maskable.png'));
  console.log('Icons generated!');
}

generate();

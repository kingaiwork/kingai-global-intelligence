import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');

const entries = [
  'index.html',
  'country.html',
  'media.html',
  'compare.html',
  'methodology.html',
  'sources.html',
  '404.html',
  'assets',
  'data',
  'i18n',
  '.well-known',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  '_headers',
  'sw.js'
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of entries) {
  const src = path.join(root, entry);
  try {
    const s = await stat(src);
    await cp(src, path.join(out, entry), {
      recursive: s.isDirectory(),
      force: true
    });
  } catch (error) {
    if (error?.code === 'ENOENT') {
      if (['robots.txt', 'sitemap.xml', 'sw.js'].includes(entry)) {
        continue;
      }
    }
    throw error;
  }
}

for (const required of ['index.html', '404.html', 'assets', 'data']) {
  await stat(path.join(out, required));
}

console.log(`Cloudflare Pages output ready: ${out}`);

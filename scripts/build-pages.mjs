import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
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
      if (['robots.txt', 'sitemap.xml', 'sw.js'].includes(entry)) continue;
    }
    throw error;
  }
}

for (const required of ['index.html', '404.html', 'assets', 'data']) {
  await stat(path.join(out, required));
}
await stat(path.join(out, 'assets', 'kingai-ui-2026.css'));

const supportTag = '<script src="https://kefu.kingai.work/auto.js" data-site="global-intelligence" async data-kingai-customer-os="1"></script>';
const uiTag = '<link rel="stylesheet" href="/assets/kingai-ui-2026.css" data-kingai-ui-2026="1">';
let normalized = 0;

async function normalizeHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await normalizeHtml(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const before = await readFile(file, 'utf8');
    let html = before;
    if (!html.includes('data-kingai-ui-2026') && html.includes('</head>')) html = html.replace('</head>', `${uiTag}</head>`);
    if (!html.includes('data-kingai-customer-os') && html.includes('</body>')) html = html.replace('</body>', `${supportTag}</body>`);
    if (html !== before) {
      await writeFile(file, html);
      normalized += 1;
    }
  }
}

await normalizeHtml(out);
console.log(`Cloudflare Pages output ready: ${out}; normalized public HTML=${normalized}`);

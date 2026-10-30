// Bundle one module into a single self-contained HTML file (no other files needed).
//   node scripts/bundle.mjs csa              → dist/csa.html           (open offline, email, put on a USB)
//   node scripts/bundle.mjs csa --artifact   → dist/csa.artifact.html  (page content only, for publishing as a Claude artifact)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mod = process.argv[2];
const artifact = process.argv.includes('--artifact');
if (!mod) { console.error('Usage: node scripts/bundle.mjs <module-folder> [--artifact]'); process.exit(1); }
const dir = join(root, mod);

let html = readFileSync(join(dir, 'index.html'), 'utf8');
// inline local stylesheets (Google Fonts links stay as links)
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) =>
  /^https?:/.test(href) ? m : `<style>\n${readFileSync(join(dir, href), 'utf8')}\n</style>`);
// inline local scripts
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) =>
  /^https?:/.test(src) ? m : `<script>\n${readFileSync(join(dir, src), 'utf8').replace(/<\/script/gi, '<\\/script')}\n</script>`);
// a single file has no hub page to link back to
html = html.replace('</head>', '<script>window.STUDY_STANDALONE = true;</script>\n</head>');

let out = html;
if (artifact) {
  const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'))
    .replace(/<meta charset[^>]*>\s*/i, '').replace(/<meta name="viewport"[^>]*>\s*/i, '');
  const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
  out = head.trim() + '\n' + body.trim() + '\n';
}
mkdirSync(join(root, 'dist'), { recursive: true });
const file = join(root, 'dist', `${mod.replace(/[\\/]+$/, '')}${artifact ? '.artifact' : ''}.html`);
writeFileSync(file, out);
console.log(`Wrote ${file} (${Math.round(out.length / 1024)} KB)`);

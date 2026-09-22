import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
const root = resolve('dist');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
if (!html.includes('Running') || (html.match(/<h1[ >]/g) || []).length !== 1) throw new Error('Titre ou contenu attendu absent');
if (/127\.0\.0\.1|localhost|C:\\\\Users/i.test(html)) throw new Error('Référence locale dans le site');
const files = readdirSync(root, { recursive: true }).filter(f => /\.(html|css)$/.test(f));
let checked = 0;
for (const file of files) {
  const text = readFileSync(resolve(root, file), 'utf8');
  const refs = extname(file) === '.css'
    ? [...text.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m => m[1])
    : [...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|data:|#|mailto:)/.test(ref)) continue;
    if (ref.startsWith('/')) throw new Error('Chemin incompatible avec GitHub Pages: ' + ref);
    const target = resolve(dirname(resolve(root, file)), decodeURIComponent(ref.split(/[?#]/)[0]));
    if (!target.startsWith(root) || !existsSync(target)) throw new Error('Asset manquant: ' + ref);
    checked++;
  }
}
for (const asset of ['bench.webp','squat.webp','row.webp']) {
  if (!existsSync(resolve(root, 'assets', asset))) throw new Error('Exercice manquant: ' + asset);
}
const unexpected = readdirSync(root, { recursive: true }).filter(f => /\.(apk|jks|keystore|env)$/.test(f));
if (unexpected.length) throw new Error('Fichier privé dans le site');
console.log('Site vérifié : ' + checked + ' références locales, trois exercices, aucun APK ni clé.');

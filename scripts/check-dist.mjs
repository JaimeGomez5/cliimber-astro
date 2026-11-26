// Revisión automática de la web compilada (dist/). La lanza GitHub Actions en cada cambio (ver .github/workflows/ci.yml)
// y se puede lanzar a mano con: npm run check
// Falla si encuentra:
//  1. Enlaces o recursos internos que apuntan a archivos que no existen.
//  2. Rayas largas (—) en el texto de las páginas (regla de copy de CLAUDE.md).
//  3. Páginas sin <title> o sin meta description.
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) {
  console.error('No existe dist/. Ejecuta antes: npm run build');
  process.exit(1);
}

const htmls = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) htmls.push(p);
  }
})(DIST);

const errores = [];
const existe = (url) => {
  const limpio = decodeURIComponent(url.split(/[?#]/)[0]);
  const p = path.join(DIST, limpio);
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
  if (fs.existsSync(path.join(p, 'index.html'))) return true;
  if (fs.existsSync(p + '.html')) return true;
  return false;
};

for (const file of htmls) {
  const rel = '/' + path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');

  // 1. Enlaces internos (href, src, poster) que empiezan por /
  for (const m of html.matchAll(/\s(?:href|src|poster)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    if (!existe(url)) errores.push(`${rel}: enlace roto ${url}`);
  }

  // 2. Rayas largas en el texto visible (fuera de scripts y estilos)
  const texto = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (texto.includes('—')) errores.push(`${rel}: contiene una raya larga (—) en el texto`);

  // 3. SEO mínimo (la 404 se libra de la descripción)
  if (!/<title>[^<]+<\/title>/.test(html)) errores.push(`${rel}: sin <title>`);
  if (!rel.startsWith('/404') && !/<meta name="description" content="[^"]+"/.test(html)) errores.push(`${rel}: sin meta description`);
}

if (errores.length) {
  console.error(`Revisión: ${errores.length} problema(s)\n` + errores.map((e) => ' - ' + e).join('\n'));
  process.exit(1);
}
console.log(`Revisión OK: ${htmls.length} páginas, sin enlaces rotos, sin rayas largas y con título y descripción.`);

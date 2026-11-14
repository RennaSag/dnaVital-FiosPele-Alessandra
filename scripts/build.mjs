// Gera a pasta dist/ pronta para publicar no Cloudflare.
//   1. Compila o Tailwind (src/tailwind.css -> assets/css/tailwind.css)
//   2. Copia só os arquivos do site para dist/
//   3. Adiciona ?v=<hash> nos CSS/JS do index.html (cache longo sem risco de versão velha)
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');

const INCLUIR = ['index.html', '404.html', 'favicon.ico', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'assets'];
const IGNORAR = new Set(['desktop.ini', 'Thumbs.db', '.DS_Store']);

console.log('> Compilando Tailwind...');
execSync('npx tailwindcss -i src/tailwind.css -o assets/css/tailwind.css --minify', { cwd: raiz, stdio: 'inherit' });

console.log('> Montando dist/...');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

function copiar(origem, destino) {
  const st = fs.statSync(origem);
  if (st.isDirectory()) {
    fs.mkdirSync(destino, { recursive: true });
    for (const nome of fs.readdirSync(origem)) {
      if (IGNORAR.has(nome) || nome.startsWith('.')) continue;
      copiar(path.join(origem, nome), path.join(destino, nome));
    }
  } else {
    fs.copyFileSync(origem, destino);
  }
}
for (const item of INCLUIR) {
  const origem = path.join(raiz, item);
  if (fs.existsSync(origem)) copiar(origem, path.join(dist, item));
}

console.log('> Versionando CSS/JS...');
const hash = (arq) => createHash('sha256').update(fs.readFileSync(arq)).digest('hex').slice(0, 10);
for (const pagina of ['index.html', '404.html']) {
  const arq = path.join(dist, pagina);
  if (!fs.existsSync(arq)) continue;
  const html = fs.readFileSync(arq, 'utf8').replace(
    /(href|src)="(\/?assets\/(?:css|js)\/[^"?#]+\.(?:css|js))"/g,
    (m, attr, rel) => {
      const alvo = path.join(dist, rel.replace(/^\//, ''));
      return fs.existsSync(alvo) ? `${attr}="${rel}?v=${hash(alvo)}"` : m;
    }
  );
  fs.writeFileSync(arq, html);
}

let total = 0, qtd = 0;
(function somar(d) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n), s = fs.statSync(p);
    if (s.isDirectory()) somar(p); else { total += s.size; qtd++; }
  }
})(dist);
console.log(`> Pronto: dist/ com ${qtd} arquivos (${(total / 1024 / 1024).toFixed(2)} MB).`);

# Deploy no Cloudflare: Clínica DNA Vital Fios e Pele

Site estático. **Não precisa de variáveis de ambiente, segredos nem banco de dados.**
Toda a configuração já está no projeto:

| Arquivo | Para que serve |
|---|---|
| `wrangler.jsonc` | Configuração do Cloudflare (nome `dna-vital`, publica a pasta `dist/`) |
| `_headers` | Cabeçalhos de segurança e de cache |
| `404.html` | Página exibida quando o endereço não existe |
| `manifest.webmanifest` | Permite instalar o site como aplicativo no celular |
| `robots.txt` + `sitemap.xml` | Liberam o site para o Google |
| `package.json` + `scripts/build.mjs` | Gera a pasta `dist/` (só o que vai para o ar) |
| `tailwind.config.js` + `src/tailwind.css` | Cores e fontes do Tailwind |
| `.node-version` | Versão do Node usada no build do Cloudflare |

## Opção 1: pelo painel, ligado ao GitHub (recomendado)

Assim, cada `git push` publica sozinho.

1. Envie o projeto para um repositório no GitHub.
2. No painel do Cloudflare: **Workers & Pages → Create → Import a repository** e escolha o repositório.
3. Confira os campos (normalmente já vêm preenchidos):
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Variáveis de ambiente:** nenhuma
4. Clique em **Deploy**. O site fica em `https://dna-vital.<sua-conta>.workers.dev`.
5. Para usar o domínio próprio: no projeto, vá em **Settings → Domains & Routes → Add → Custom domain**.

> Se preferir criar como **Pages** em vez de Workers: Build command `npm run build` e
> Build output directory `dist`. O `_headers` e o `404.html` funcionam igual.

## Opção 2: pelo terminal, do seu computador

```
npm install
npx wrangler login     (só na primeira vez: abre o navegador para autorizar)
npm run deploy
```

## No dia a dia

- **Ver o site como no Cloudflare:** `npm run preview` e abra http://localhost:8787
- **Mudou classes do Tailwind no HTML/JS?** Rode `npm run build` para atualizar
  `assets/css/tailwind.css`. Enquanto edita, `npm run dev:css` atualiza sozinho.
  (No deploy pelo GitHub o Cloudflare roda o build automaticamente.)
- Pode continuar abrindo o `index.html` direto no navegador para testar.
- **Não edite** `assets/css/tailwind.css` nem a pasta `dist/`: são gerados pelo build.

## Domínio do site

O endereço oficial previsto é `https://dnavital.usetap.com.br/`. Ele aparece em:

- `SITE_URL` no `assets/js/main.js` (links compartilhados, QR Code, Whats Direct);
- `og:url`, `og:image`, `canonical` e o JSON-LD (`url` e `image`) no `index.html`;
- `robots.txt`;
- `sitemap.xml`.

Se o domínio mudar, troque em todos esses lugares.

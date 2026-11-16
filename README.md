# Clínica DNA Vital Fios e Pele: Landing Page

Cartão digital premium da **Clínica Capilar DNA Vital Fios e Pele**, em Canaã dos Carajás - PA.
Site estático (HTML + CSS + JS puros), publicado no Cloudflare Workers (Static Assets).

## A empresa

Clínica capilar da terapeuta **Alessandra Souza** (na beleza desde 2013, terapeuta capilar desde
2020, formada pelo complexo DNA Vital em Florianópolis - SC). A trajetória completa, enviada pela
cliente, está na seção `#trajetoria`.

Procedimentos (lista enviada pela cliente), além da avaliação capilar com tricoscopia:

- Terapia Capilar (indicações tiradas da fachada: queda, calvície, alopecia areata, caspa,
  dermatite, seborreia, psoríase, oleosidade)
- Ozonioterapia
- Escova Terapêutica (inclui a Escova Ozonizada)
- Laserterapia
- ILIBterapia
- Reposição de Massa
- Coloração
- Tratamento de Fios

Endereço: Rua Angelim, 192 · Nova Canaã, Canaã dos Carajás - PA, 68356-013.
Atendimento: segunda a sexta, 9h00 às 18h00; sábado, 9h00 às 12h00. WhatsApp: (94) 99175-4846.
PIX: chave celular (94) 99175-4846 (o botão copia `+5594991754846`).

**Paleta:** tirada do logo (`Captures/Logos.pdf`): marinho `#012C4C` e azul `#599FCB`.
O fundo `#EAF2F8` e a escala 50..950 foram derivados dessas duas cores.
O azul do logo não passa em contraste para texto pequeno no fundo claro (2,9:1), por isso os
textos pequenos usam o tom escurecido `#2B6E9B` (5,5:1 no branco).

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Tailwind CSS | 3.4.5 | Utilidades de estilo, compiladas no build (sem CDN) |
| Font Awesome Free | 6.5.2 | Ícones (local, em `assets/vendor/`) |
| Lenis | 1.1.13 | Rolagem suave |
| qrcodejs | 1.0.0 | QR Code do modal Compartilhar |
| Wrangler | 4 | Preview local e deploy no Cloudflare |
| Google Fonts | | Cormorant Garamond e Montserrat |

## Funcionalidades

- Header em cápsula com menu sanduíche no celular
- Status "Aberto/Fechado" em tempo real (fuso de Belém)
- Card da terapeuta com filosofia de atendimento e resumo de diferenciais
- Bloco "Seu cabelo está dando sinais?": a pessoa marca os sinais e o botão envia a lista pelo WhatsApp (`initSinais()` no main.js)
- Seções numeradas (01 a 06), Resultados em faixa escura e chamada final antes do rodapé
- Perguntas frequentes (`#duvidas`, com `<details>` nativo, sem JS) e marcação FAQPage para o Google
- Link "Pular para o conteúdo" para quem navega pelo teclado
- Tratamentos em cards "sticky" em cascata, com passo a passo (avaliação, protocolo, acompanhamento)
- Trajetória da terapeuta com linha do tempo e "Continuar lendo" (`<details>`, sem JS)
- Resultados e Antes & Depois em "Coming soon" (o carrossel e o comparador voltam ao preencher
  `FOTOS_RESULTADOS` e `CASOS_BA` no main.js e restaurar o HTML)
- Carrossel infinito das fotos do espaço (`FOTOS_SALAO`) com arraste, inércia e foto ampliada
- Carrossel de depoimentos
- Localização com mapa do Google, rota e botão de avaliação no Google
- Modal PIX e modal Compartilhar (copiar link, WhatsApp, compartilhar nativo, Whats Direct,
  instalar como aplicativo, QR Code)
- Salvar contato (vCard)
- Botão flutuante do WhatsApp
- Links diretos: `#compartilhar` e `#pix` abrem os modais

## Estrutura

```
index.html              página principal
404.html                página de erro (caminhos absolutos)
favicon.ico             ícone (16/32/48)
manifest.webmanifest    PWA
robots.txt, sitemap.xml SEO
_headers                cabeçalhos de segurança e cache do Cloudflare
wrangler.jsonc          configuração do Cloudflare
tailwind.config.js      paleta (marinho, nevoa, celeste) e fontes
src/tailwind.css        entrada do Tailwind
scripts/build.mjs       gera dist/
assets/css/styles.css   efeitos próprios (carrossel, modais, lightbox, hero...)
assets/css/tailwind.css GERADO pelo build (não editar)
assets/js/main.js       toda a interatividade
assets/js/smooth-scroll.js integração do Lenis
assets/img/             logos, ícones e fotos otimizadas
assets/vendor/          Font Awesome, Lenis e qrcodejs
```

## Onde ficam os dados

- **Bloco de configuração no topo do `assets/js/main.js`:** WhatsApp, nome, `SITE_URL`,
  casos do Antes & Depois, fotos dos resultados, fotos do espaço, horários e fuso.
- **Links fixos no `index.html`:** WhatsApp de cada botão (cada um com a sua mensagem),
  Instagram, Maps, avaliação do Google, iframe do mapa, depoimentos e PIX.
- Os horários da seção Localização (HTML) e o `HORARIOS` (JS) precisam bater.

## Build e deploy

```
npm install
npm run build      # compila o Tailwind e monta dist/
npm run preview    # testa como no Cloudflare (http://localhost:8787)
npm run deploy     # publica
```

Detalhes em `DEPLOY.md`.

## Observações técnicas

- O brilho do título, a borda girando e o autoplay dos carrosséis **não** respeitam
  "reduzir animações" de propósito (o Windows costuma vir com isso ligado).
- Os cards de tratamento precisam de `position: sticky !important`, porque o `.glare-hover`
  define `position: relative`.
- No celular os carrosséis usam a rolagem nativa (modo `.is-native`); no computador, transform
  com arraste e inércia.
- Instalar como aplicativo (PWA) só funciona em HTTPS.
- O botão de copiar funciona até abrindo o arquivo direto do computador (file://).
- Os detalhes visuais (fios no hero, anel da foto, ornamentos, passos) são estáticos: sem blur e
  sem animação extra.

## Ainda "Coming soon"

- Anos de clínica (sem data de abertura)
- Beneficiário e instituição do PIX
- Fotos de resultados e de antes e depois (as artes antigas do Instagram foram removidas a pedido)
- Depoimentos do Google (há 1 depoimento real, publicado no Instagram, e 3 cards reservados)

## Fotos

Originais em `../Captures/Fotos/` (1 a 7). Versões em `assets/img/`:
`clinica-fachada`, `clinica-sala-01`, `clinica-sala-02`, `laserterapia` (3:4, carrossel do espaço),
`alessandra-retrato` (hero, 4:5), `alessandra-perfil-redondo` (card da terapeuta),
`alessandra-microscopio-redondo` (chamada final) e `alessandra-tricoscopia` (trajetória, 3:2).

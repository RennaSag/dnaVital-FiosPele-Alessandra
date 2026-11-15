/* =========================================================
   Clínica DNA Vital Fios e Pele — Scripts
========================================================= */

/* 1. CONFIGURAÇÃO (tudo o que muda de cliente para cliente) */
const WHATS_NUMERO = '5594991754846';
const NOME_NEGOCIO = 'Clínica DNA Vital Fios e Pele';
const SITE_URL = 'https://dnavitalcanaa.usetap.com.br/';
// Celular/tablet: carrosséis usam a rolagem nativa (rápida, com a inércia do próprio aparelho)
const TELA_TOQUE = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* Antes e depois (fotos publicadas no Instagram da clínica) */
const CASOS_BA = [
  { nome: 'Queda e falhas: 4 meses de tratamento', antes: 'assets/img/antes-depois-01-antes.jpg', depois: 'assets/img/antes-depois-01-depois.jpg' },
  { nome: 'Mais volume e menos queda', antes: 'assets/img/antes-depois-02-antes.jpg', depois: 'assets/img/antes-depois-02-depois.jpg' }
];

/* Resultados e tratamentos (artes do Instagram). quadrado: true = arte 1:1 */
const FOTOS_RESULTADOS = [
  { src: 'assets/img/resultado-01.jpg', tag: 'Antes & Depois', titulo: '4 Meses de Tratamento', quadrado: true },
  { src: 'assets/img/resultado-02.jpg', tag: 'Depoimento', titulo: 'Mais Volume, Menos Queda', quadrado: true },
  { src: 'assets/img/resultado-03.jpg', tag: 'Novidade', titulo: 'Escova Ozonizada', quadrado: true },
  { src: 'assets/img/resultado-04.jpg', tag: 'Alopecia Areata', titulo: 'A Solução na Terapia Capilar' },
  { src: 'assets/img/resultado-06.jpg', tag: 'Saúde Hormonal', titulo: 'Menopausa e os Fios', quadrado: true },
  { src: 'assets/img/resultado-05.jpg', tag: 'Alopecia Areata', titulo: 'Estratégia e Acompanhamento' },
  { src: 'assets/img/resultado-07.jpg', tag: 'Emagrecimento', titulo: 'Queda na Escova?' },
  { src: 'assets/img/resultado-08.jpg', tag: 'Saúde Integral', titulo: 'Cuidar de Dentro para Fora', quadrado: true },
  { src: 'assets/img/resultado-09.jpg', tag: 'Fibra Capilar', titulo: 'Ciência na Reconstrução' }
];

/* Fotos do espaço: ainda sem fotos (a seção mostra "Coming soon"). Ao receber, preencha e troque o HTML pelo carrossel. */
const FOTOS_SALAO = [];

// [abre, fecha] em minutos, índice 0 = domingo. null = fechado. Tem que bater com a lista da seção Localização.
const HORARIOS = [null, [540, 1080], [540, 1080], [540, 1080], [540, 1080], [540, 1080], null];
const FUSO = 'America/Belem'; // Canaã dos Carajás - PA

/* 2. ANTES E DEPOIS */
function renderTabsBA() {
  const wrap = document.getElementById('ba-tabs');
  if (!wrap) return;
  CASOS_BA.forEach((c, i) => {
    const b = document.createElement('button');
    b.id = `ba-tab-${i}`;
    b.type = 'button';
    b.className = 'ba-tab-btn';
    b.textContent = String(i + 1);
    b.setAttribute('aria-label', c.nome);
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => mudarCasoBA(i));
    // Carrega as fotos antes do clique, para a troca ser instantânea
    b.addEventListener('pointerenter', () => preCarregarBA(i), { once: true });
    b.addEventListener('touchstart', () => preCarregarBA(i), { once: true, passive: true });
    wrap.appendChild(b);
  });
}

function preCarregarBA(idx) {
  const c = CASOS_BA[idx];
  if (!c || c._ok) return;
  c._ok = true;
  [c.antes, c.depois].forEach(src => { const im = new Image(); im.src = src; });
}

function setSliderBA(val) {
  const clip = document.getElementById('ba-clip-wrapper');
  const handle = document.getElementById('ba-handle');
  if (clip) clip.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
  if (handle) handle.style.left = `${val}%`;
}

function mudarCasoBA(idx) {
  const c = CASOS_BA[idx];
  if (!c) return;
  const antes = document.getElementById('ba-img-antes');
  const depois = document.getElementById('ba-img-depois');
  if (antes) { antes.src = c.antes; antes.alt = `Antes - ${c.nome} - ${NOME_NEGOCIO}`; }
  if (depois) { depois.src = c.depois; depois.alt = `Depois - ${c.nome} - ${NOME_NEGOCIO}`; }
  const range = document.getElementById('ba-range');
  if (range) range.value = 50;
  setSliderBA(50);
  CASOS_BA.forEach((_, i) => {
    const btn = document.getElementById(`ba-tab-${i}`);
    if (btn) btn.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
  });
}

function initSliderBA() {
  const range = document.getElementById('ba-range');
  if (range) range.addEventListener('input', (e) => setSliderBA(e.target.value), { passive: true });
}

/* =========================================================
   3. CARROSSEL INFINITO GENÉRICO (arraste + inércia + autoplay + pausa fora da tela)
   Movido só por transform (sem rolagem nativa), para não "brigar" com o
   scroll do celular quando a pessoa arrasta rápido para os lados.
========================================================= */
function initInfiniteCarousel(wrapperId, trackId, criarCards, speed = 0.8, fotos = null) {
  const track = document.getElementById(trackId);
  const wrapper = document.getElementById(wrapperId);
  if (!track || !wrapper) return;

  // criarCards = null: usa os itens que já estão no HTML e duplica eles
  const originais = criarCards ? criarCards() : Array.from(track.children);
  const copias = criarCards ? criarCards() : originais.map(c => c.cloneNode(true));
  track.innerHTML = '';
  originais.forEach(c => track.appendChild(c));
  copias.forEach(c => {
    if (c.tabIndex >= 0) c.tabIndex = -1;
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });

  if (TELA_TOQUE) {
    // 3ª cópia: deixa espaço de rolagem para os dois lados do "meio"
    const extras = criarCards ? criarCards() : originais.map(c => c.cloneNode(true));
    extras.forEach(c => {
      if (c.tabIndex >= 0) c.tabIndex = -1;
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    });
    initCarrosselNativo(wrapper, track, originais, copias, speed);
    ligarCliqueFotos(wrapper, fotos, () => false);
    return;
  }

  let x = 0;             // deslocamento atual (px)
  let half = 0;           // largura de um "ciclo" de fotos
  let vel = 0;            // velocidade da inércia (px/quadro)
  let isVisible = false, isHover = false, isDragging = false;
  let animId = null, lastT = 0;
  let pointerId = null, startX = 0, startY = 0, lastX = 0, lastMoveT = 0;
  let eixo = null;        // 'x' quando o gesto é horizontal
  let arrastou = false;

  function medir() {
    half = copias[0] ? copias[0].offsetLeft - originais[0].offsetLeft : 0;
  }
  function aplicar() {
    if (half > 0) x = ((x % half) + half) % half;
    track.style.transform = `translate3d(${-x}px,0,0)`;
  }

  function frame(t) {
    const dt = lastT ? Math.min((t - lastT) / 16.667, 3) : 1;
    lastT = t;
    if (!isDragging) {
      if (Math.abs(vel) > 0.05) {
        x += vel * dt;
        vel *= Math.pow(0.965, dt); // atrito mais leve: desliza mais, como a rolagem nativa
      } else {
        vel = 0;
        if (!isHover) x += speed * dt;
      }
      aplicar();
    }
    if (isVisible && !document.hidden && (isDragging || vel || !isHover)) {
      animId = requestAnimationFrame(frame);
    } else {
      animId = null; lastT = 0;
    }
  }
  function iniciar() {
    if (!animId && isVisible && !document.hidden) { lastT = 0; animId = requestAnimationFrame(frame); }
  }
  function parar() {
    if (animId) { cancelAnimationFrame(animId); animId = null; lastT = 0; }
  }

  medir(); aplicar();
  new ResizeObserver(() => { medir(); aplicar(); }).observe(track);

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) iniciar(); else parar();
    });
  }, { threshold: 0.05 }).observe(wrapper);

  wrapper.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') isHover = true; });
  wrapper.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { isHover = false; iniciar(); } });

  // Arraste (mouse e toque). touch-action: pan-y deixa a rolagem vertical da página com o navegador.
  wrapper.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (pointerId !== null) return;
    pointerId = e.pointerId;
    // Tocar enquanto as fotos ainda deslizam só "segura" o carrossel, sem abrir a foto
    arrastou = Math.abs(vel) > 1;
    vel = 0;
    isDragging = true;
    eixo = e.pointerType === 'mouse' ? 'x' : null;
    startX = lastX = e.clientX; startY = e.clientY;
    lastMoveT = performance.now();
    if (e.pointerType === 'mouse') e.preventDefault();
  });
  wrapper.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const dxTotal = e.clientX - startX, dyTotal = e.clientY - startY;
    if (!eixo) {
      if (Math.abs(dxTotal) < 6 && Math.abs(dyTotal) < 6) return;
      if (Math.abs(dyTotal) > Math.abs(dxTotal)) { soltar(e); return; }
      eixo = 'x';
    }
    // Gesto horizontal confirmado: prende o dedo no carrossel na hora
    if (eixo === 'x' && (e.pointerType !== 'mouse' || Math.abs(dxTotal) > 8)) {
      arrastou = true;
      if (!wrapper.hasPointerCapture(e.pointerId)) {
        try { wrapper.setPointerCapture(e.pointerId); } catch (_) {}
      }
    }
    const now = performance.now();
    const dx = e.clientX - lastX;
    const dtMs = Math.max(now - lastMoveT, 1);
    // velocidade suavizada em px/quadro (60fps)
    vel = vel * 0.3 + (-dx / dtMs * 16.667) * 0.7;
    lastX = e.clientX; lastMoveT = now;
    x -= dx;
    aplicar();
  });
  function soltar(e) {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    isDragging = false;
    // parou o dedo antes de soltar: sem inércia
    if (performance.now() - lastMoveT > 90) vel = 0;
    vel = Math.max(-60, Math.min(60, vel));
    if (e.pointerType !== 'mouse') isHover = false;
    iniciar();
  }
  wrapper.addEventListener('pointerup', soltar);
  wrapper.addEventListener('pointercancel', (e) => { if (e.pointerId === pointerId) { vel = 0; soltar(e); } });
  wrapper.addEventListener('lostpointercapture', (e) => { if (e.pointerId === pointerId) soltar(e); });
  wrapper.addEventListener('dragstart', (e) => e.preventDefault());

  // Navegação por teclado: traz a foto focada para a tela
  wrapper.addEventListener('focusin', (e) => {
    const card = Array.from(track.children).find(c => c.contains(e.target));
    wrapper.scrollLeft = 0;
    if (!card) return;
    const r = card.getBoundingClientRect(), w = wrapper.getBoundingClientRect();
    if (r.left < w.left || r.right > w.right) { x += r.left - w.left - 16; vel = 0; aplicar(); }
  });
  wrapper.addEventListener('scroll', () => { wrapper.scrollLeft = 0; });

  // Clique (sem arrastar) numa foto abre a visualização ampliada
  ligarCliqueFotos(wrapper, fotos, () => {
    if (arrastou) { arrastou = false; return true; }
    return false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else iniciar();
  });
}

function ligarCliqueFotos(wrapper, fotos, foiArraste) {
  if (!fotos) return;
  const abrirDoCard = (card) => {
    if (card) abrirLightbox(fotos, Number(card.dataset.idx) || 0);
  };
  wrapper.addEventListener('click', (e) => {
    if (foiArraste()) return;
    abrirDoCard(e.target.closest('.photo-card'));
  });
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.photo-card');
      if (card) { e.preventDefault(); abrirDoCard(card); }
    }
  });
}

/* Versão para celular: rolagem horizontal nativa do navegador (roda fora do JS,
   acompanha o dedo sem atraso e tem a inércia do aparelho). O loop infinito é
   feito "teletransportando" a rolagem entre cópias idênticas quando ela para,
   e o autoplay só anda quando a pessoa não está mexendo. */
function initCarrosselNativo(wrapper, track, originais, copias, speed) {
  wrapper.classList.add('is-native');

  let half = 0;          // largura de um ciclo de fotos
  let pos = 0;           // posição atual (float, para o autoplay lento não "travar" no arredondamento)
  let tocando = false;
  let ultimoUsuario = 0; // último momento em que a pessoa rolou
  let isVisible = false, animId = null, lastT = 0, idleT = null;
  const PAUSA_APOS_TOQUE = 1500;

  function medir() {
    const antigo = half;
    half = copias[0] ? copias[0].offsetLeft - originais[0].offsetLeft : 0;
    if (!half) return;
    pos = antigo ? (pos / antigo) * half : half; // começa no ciclo do meio
    wrapper.scrollLeft = pos;
  }
  // Volta para o ciclo do meio (mesma imagem na tela, posição equivalente)
  function recentrar() {
    if (!half) return;
    let novo = pos;
    while (novo < half * 0.5) novo += half;
    while (novo >= half * 1.5) novo -= half;
    if (novo !== pos) { pos = novo; wrapper.scrollLeft = pos; }
  }

  wrapper.addEventListener('scroll', () => {
    const sl = wrapper.scrollLeft;
    if (Math.abs(sl - pos) > 2) { pos = sl; ultimoUsuario = performance.now(); }
    // Só pula de ciclo durante o movimento se encostar no fim real da faixa
    const max = wrapper.scrollWidth - wrapper.clientWidth;
    if (sl < 40 || sl > max - 40) recentrar();
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (!tocando) recentrar(); }, 160);
  }, { passive: true });

  wrapper.addEventListener('touchstart', () => { tocando = true; ultimoUsuario = performance.now(); }, { passive: true });
  const fimToque = () => { tocando = false; ultimoUsuario = performance.now(); };
  wrapper.addEventListener('touchend', fimToque, { passive: true });
  wrapper.addEventListener('touchcancel', fimToque, { passive: true });

  function frame(t) {
    const dt = lastT ? Math.min((t - lastT) / 16.667, 3) : 1;
    lastT = t;
    if (!tocando && half && performance.now() - ultimoUsuario > PAUSA_APOS_TOQUE) {
      pos += speed * dt;
      if (pos >= half * 1.5) pos -= half;
      wrapper.scrollLeft = pos;
    }
    if (isVisible && !document.hidden) animId = requestAnimationFrame(frame);
    else { animId = null; lastT = 0; }
  }
  function iniciar() {
    // autoplay roda mesmo com "movimento reduzido" (muitos Windows vêm com animações desligadas)
    if (!animId && isVisible && !document.hidden) { lastT = 0; animId = requestAnimationFrame(frame); }
  }
  function parar() {
    if (animId) { cancelAnimationFrame(animId); animId = null; lastT = 0; }
  }

  medir();
  new ResizeObserver(() => medir()).observe(track);

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) iniciar(); else parar();
    });
  }, { threshold: 0.05 }).observe(wrapper);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) parar(); else iniciar();
  });
}

/* =========================================================
   3b. FOTO AMPLIADA (LIGHTBOX)
========================================================= */
let lbFotos = [], lbIdx = 0, lbEl = null, lbFocoAnterior = null;

function criarLightbox() {
  if (lbEl) return lbEl;
  lbEl = document.createElement('div');
  lbEl.className = 'lightbox';
  lbEl.setAttribute('role', 'dialog');
  lbEl.setAttribute('aria-modal', 'true');
  lbEl.setAttribute('aria-label', 'Foto ampliada');
  lbEl.setAttribute('data-lenis-prevent', '');
  lbEl.innerHTML = `
    <button type="button" class="lightbox__btn lightbox__close" aria-label="Fechar foto"><i class="fa-solid fa-xmark"></i></button>
    <button type="button" class="lightbox__btn lightbox__nav lightbox__prev" aria-label="Foto anterior"><i class="fa-solid fa-chevron-left"></i></button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button type="button" class="lightbox__btn lightbox__nav lightbox__next" aria-label="Próxima foto"><i class="fa-solid fa-chevron-right"></i></button>
    <span class="lightbox__count" aria-live="polite"></span>`;
  document.body.appendChild(lbEl);

  lbEl.querySelector('.lightbox__close').addEventListener('click', fecharLightbox);
  lbEl.querySelector('.lightbox__prev').addEventListener('click', () => mudarLightbox(-1));
  lbEl.querySelector('.lightbox__next').addEventListener('click', () => mudarLightbox(1));
  lbEl.addEventListener('click', (e) => {
    if (e.target === lbEl || e.target.classList.contains('lightbox__figure')) fecharLightbox();
  });

  // Deslizar para o lado troca de foto; para baixo fecha
  let tx = 0, ty = 0;
  lbEl.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  lbEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) mudarLightbox(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) fecharLightbox();
  }, { passive: true });

  return lbEl;
}

function mostrarFotoLightbox() {
  const f = lbFotos[lbIdx];
  const img = lbEl.querySelector('.lightbox__img');
  img.src = f.src;
  img.alt = f.alt || (f.titulo ? `${f.titulo} - ${NOME_NEGOCIO}` : '');
  lbEl.querySelector('.lightbox__caption').innerHTML = f.titulo
    ? `${f.tag ? `<small>${f.tag}</small>` : ''}${f.titulo}` : '';
  const varias = lbFotos.length > 1;
  lbEl.querySelectorAll('.lightbox__nav').forEach(b => { b.hidden = !varias; });
  lbEl.querySelector('.lightbox__count').textContent = varias ? `${lbIdx + 1} / ${lbFotos.length}` : '';
  // Pré-carrega as vizinhas para a troca ficar instantânea
  if (varias) [1, -1].forEach(d => { new Image().src = lbFotos[(lbIdx + d + lbFotos.length) % lbFotos.length].src; });
}

function abrirLightbox(fotos, idx = 0) {
  criarLightbox();
  lbFotos = fotos;
  lbIdx = idx;
  lbFocoAnterior = document.activeElement;
  mostrarFotoLightbox();
  lbEl.style.display = 'flex';
  void lbEl.offsetWidth;
  lbEl.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbEl.querySelector('.lightbox__close').focus({ preventScroll: true });
}

function mudarLightbox(d) {
  if (lbFotos.length < 2) return;
  lbIdx = (lbIdx + d + lbFotos.length) % lbFotos.length;
  mostrarFotoLightbox();
}

function fecharLightbox() {
  if (!lbEl || !lbEl.classList.contains('open')) return;
  lbEl.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if (!lbEl.classList.contains('open')) lbEl.style.display = 'none'; }, 250);
  if (lbFocoAnterior && lbFocoAnterior.focus) lbFocoAnterior.focus({ preventScroll: true });
}

document.addEventListener('keydown', (e) => {
  if (!lbEl || !lbEl.classList.contains('open')) return;
  if (e.key === 'Escape') fecharLightbox();
  else if (e.key === 'ArrowRight') mudarLightbox(1);
  else if (e.key === 'ArrowLeft') mudarLightbox(-1);
});

// Imagens soltas na página com data-lightbox (ex.: fachada)
document.addEventListener('click', (e) => {
  const img = e.target.closest && e.target.closest('img[data-lightbox]');
  if (!img) return;
  abrirLightbox([{ src: img.currentSrc || img.src, titulo: img.dataset.lightbox, alt: img.alt }], 0);
});

function criarCardFoto(f, i, extra) {
  const card = document.createElement('div');
  card.className = `photo-card${extra ? ' ' + extra : ''} glare-hover`;
  card.dataset.idx = i;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ampliar foto: ${f.titulo}`);
  const img = document.createElement('img');
  img.src = f.src;
  img.alt = `${f.titulo} - ${NOME_NEGOCIO}`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.draggable = false;
  const cap = document.createElement('div');
  cap.className = 'photo-card__caption';
  cap.innerHTML = `<small>${f.tag}</small>${f.titulo}`;
  const zoom = document.createElement('span');
  zoom.className = 'photo-card__zoom';
  zoom.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
  card.append(img, cap, zoom);
  return card;
}

// Chamadas 2 ou 3 vezes (cópias do loop): criam elementos NOVOS a cada chamada
function criarCardsResultados() {
  return FOTOS_RESULTADOS.map((f, i) => criarCardFoto(f, i, f.quadrado ? 'is-square' : ''));
}
function criarCardsSalao() {
  return FOTOS_SALAO.map((f, i) => criarCardFoto(f, i, 'is-wide'));
}

/* 5. BOTÃO DO WHATSAPP NÃO SOBREPÕE O RODAPÉ */
function ajustarBotaoWhatsApp() {
  const waFab = document.getElementById('wa-fab');
  const footer = document.querySelector('footer');
  if (!waFab || !footer) return;
  // Só aparece depois de rolar até a "Filosofia de Atendimento"
  const filosofia = document.getElementById('filosofia');
  const visivel = !filosofia || filosofia.getBoundingClientRect().top < window.innerHeight * 0.75;
  waFab.classList.toggle('is-visible', visivel);
  const footerRect = footer.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const baseBottom = 24;
  waFab.style.bottom = footerRect.top < windowHeight
    ? `${windowHeight - footerRect.top + baseBottom}px`
    : `calc(${baseBottom}px + env(safe-area-inset-bottom, 0px))`;
}

/* 6. MODAIS, ACORDEÕES & CLIPBOARD */
let modalFocoAnterior = null;
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!el.classList.contains('open')) modalFocoAnterior = document.activeElement;
  el.style.display = 'flex';
  void el.offsetWidth;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  const fechar = el.querySelector('[data-fechar-modal]');
  if (fechar) fechar.focus({ preventScroll: true });

  if (id === 'share-modal') {
    const qrEl = document.getElementById('site-qrcode');
    if (qrEl && qrEl.children.length === 0 && typeof QRCode !== 'undefined') {
      new QRCode(qrEl, {
        text: urlSite(),
        width: 140,
        height: 140,
        colorDark: '#012C4C',
        colorLight: '#FFFFFF'
      });
    }
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el || !el.classList.contains('open')) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
  if (modalFocoAnterior && modalFocoAnterior.focus) modalFocoAnterior.focus({ preventScroll: true });
  modalFocoAnterior = null;
  setTimeout(() => {
    if (!el.classList.contains('open')) el.style.display = 'none';
  }, 250);
}

function closeOnBackdrop(e, id) {
  if (e.target.id === id) closeModal(id);
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || (lbEl && lbEl.classList.contains('open'))) return;
  ['pix-modal', 'share-modal'].forEach(closeModal);
});

function abrirPixDoCompartilhar() {
  const voltar = modalFocoAnterior;
  closeModal('share-modal');
  setTimeout(() => { openModal('pix-modal'); modalFocoAnterior = voltar; }, 260);
}

function toggleAccordion(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const isOpen = el.classList.toggle('open');
  const btn = el.previousElementSibling;
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

/* Anos completos desde uma data (ex.: abertura do salão), atualiza sozinho a cada aniversário */
function atualizarAnosDesde() {
  const hoje = new Date();
  document.querySelectorAll('[data-anos-desde]').forEach((el) => {
    const [a, m, d] = el.dataset.anosDesde.split('-').map(Number);
    let anos = hoje.getFullYear() - a;
    if (hoje.getMonth() + 1 < m || (hoje.getMonth() + 1 === m && hoje.getDate() < d)) anos--;
    if (anos >= 1) el.textContent = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  });
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 3200);
}

function copiarTexto(texto, msg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto).then(() => toast(msg)).catch(() => toast(texto));
  } else {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, texto.length);
    try { document.execCommand('copy'); toast(msg); } catch (err) { toast(texto); }
    ta.remove();
  }
}

// Sempre o endereço oficial: não espalha parâmetros de rastreio (?fbclid, ?igsh...) nem o endereço de teste
function urlSite() { return SITE_URL; }

// Monta o link do WhatsApp codificando também ! ' ( ) * — alguns celulares cortavam a mensagem no "!"
function linkWhatsApp(msg, phone = '') {
  const text = encodeURIComponent(msg).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
  return `https://wa.me/${phone}?text=${text}`;
}

function copiarLink() {
  copiarTexto(urlSite(), 'Link copiado com sucesso!');
}

/* 7. COMPARTILHAMENTO */
function shareWhatsApp() {
  const msg = `💆‍♀️ *${NOME_NEGOCIO}*\n\nClínica capilar com avaliação por tricoscopia e tratamentos para queda, alopecia, caspa e fios enfraquecidos em Canaã dos Carajás - PA!\n\n🔗 Acesse o site: ${urlSite()}`;
  window.open(linkWhatsApp(msg), '_blank');
}
function compartilharNativo() {
  if (navigator.share) {
    navigator.share({
      title: NOME_NEGOCIO,
      text: `Conheça a ${NOME_NEGOCIO}!`,
      url: urlSite()
    }).catch(() => {});
  } else {
    copiarLink();
  }
}

/* 8. WHATS DIRECT */
function whatsDirect() {
  const inputEl = document.getElementById('wd-telefone');
  if (!inputEl) return;
  // Tira tudo que não é número e o 0 da frente (ex.: 094..., 0 + operadora + DDD)
  let raw = inputEl.value.replace(/\D/g, '').replace(/^0+/, '');
  if (raw.length === 13 && !raw.startsWith('55')) raw = raw.slice(2); // operadora + DDD + número
  const phone = raw.startsWith('55') && raw.length >= 12 ? raw : `55${raw}`;
  if (raw.length < 10 || phone.length > 13) {
    toast('Digite o DDD e o número completo (ex: 94991234567)!');
    inputEl.focus();
    return;
  }
  const msg = `Olá, conheça a ${NOME_NEGOCIO}:\n${SITE_URL}`;
  window.open(linkWhatsApp(msg, phone), '_blank');
}

/* 9. GERADOR VCARD */
function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Clínica DNA Vital Fios e Pele',
    'ORG:Clínica DNA Vital Fios e Pele',
    'TITLE:Clínica Capilar - Terapia Capilar',
    `TEL;TYPE=CELL,VOICE;PREF:+${WHATS_NUMERO}`,
    `URL:${SITE_URL}`,
    'ADR;TYPE=WORK:;;Rua Angelim\\, 192 - Nova Canaã;Canaã dos Carajás;PA;68356-013;Brasil',
    'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/clinicadnavitalfiosepele/',
    'NOTE:Avaliação capilar com tricoscopia\\, terapia capilar para queda\\, alopecia areata\\, caspa e couro cabeludo\\, fortalecimento dos fios\\, queda hormonal e Escova Ozonizada.',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Clinica-DNA-Vital-Fios-e-Pele.vcf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Contato pronto para salvar!');
}

/* 10. PWA DINÂMICO */
let deferredPrompt = null;
(function initPWA() {
  const atual = document.getElementById('manifest-link');
  if (atual && atual.getAttribute('href')) return; // já usa o manifest.webmanifest estático
  const abs = (p) => new URL(p, window.location.href).href;
  const manifest = {
    name: NOME_NEGOCIO,
    short_name: 'DNA Vital',
    description: 'Clínica Capilar • Terapia Capilar • Canaã dos Carajás - PA',
    start_url: urlSite(),
    display: 'standalone',
    background_color: '#012C4C',
    theme_color: '#012C4C',
    icons: [
      { src: abs('assets/img/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: abs('assets/img/icon-512.png'), sizes: '512x512', type: 'image/png' }
    ]
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    document.getElementById('manifest-link').setAttribute('href', URL.createObjectURL(blob));
  } catch (e) {}
})();

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
window.addEventListener('appinstalled', () => { deferredPrompt = null; });

function instalarPWA() {
  const instalado = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (instalado) { toast('O aplicativo já está instalado neste aparelho!'); return; }
  const ios = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios && !deferredPrompt) {
    const acc = document.getElementById('acc-ios');
    if (acc && !acc.classList.contains('open')) toggleAccordion('acc-ios');
    toast('No iPhone: siga o passo a passo abaixo');
    return;
  }
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') toast('Aplicativo instalado com sucesso!');
      deferredPrompt = null;
    });
  } else {
    toast('No Android: toque nos 3 pontinhos (⋮) do navegador e selecione "Instalar aplicativo"');
  }
}

/* MENU MOBILE (SANDUÍCHE) */
function toggleMenu(forcar) {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle');
  if (!menu || !btn) return;
  const abrir = typeof forcar === 'boolean' ? forcar : !menu.classList.contains('is-open');
  menu.classList.toggle('is-open', abrir);
  btn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
  btn.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  const icone = btn.querySelector('i');
  if (icone) icone.className = (abrir ? 'fa-solid fa-xmark' : 'fa-solid fa-bars') + ' text-sm';
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  if (!menu || !menu.classList.contains('is-open')) return;
  if (e.target.closest('.mobile-menu-link')) { toggleMenu(false); return; }
  if (!e.target.closest('#mobile-menu') && !e.target.closest('#menu-toggle')) toggleMenu(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth >= 1024) toggleMenu(false); });

/* SINAIS DE ALERTA: os sinais marcados entram na mensagem do WhatsApp */
function initSinais() {
  const lista = document.getElementById('sinais-lista');
  const cta = document.getElementById('sinais-cta');
  const texto = document.getElementById('sinais-cta-texto');
  if (!lista || !cta) return;
  const MSG_PADRAO = 'Olá, equipe DNA Vital! Vim pelo site, percebi alguns sinais no meu cabelo e gostaria de agendar uma avaliação capilar.';
  function atualizar() {
    const marcados = Array.from(lista.querySelectorAll('.sinal__check:checked')).map(c => c.value);
    const msg = marcados.length
      ? `Olá, equipe DNA Vital! Vim pelo site e percebi estes sinais no meu cabelo:\n\n${marcados.map(s => `• ${s}`).join('\n')}\n\nGostaria de agendar uma avaliação capilar.`
      : MSG_PADRAO;
    cta.href = linkWhatsApp(msg, WHATS_NUMERO);
    if (texto) {
      const n = marcados.length;
      texto.textContent = n ? `Enviar ${n} ${n === 1 ? 'sinal' : 'sinais'} pelo WhatsApp` : 'Quero fazer minha avaliação';
    }
  }
  lista.addEventListener('change', atualizar);
  atualizar(); // o navegador pode restaurar caixas marcadas ao voltar para a página
}

/* INICIALIZAÇÃO */
document.addEventListener('DOMContentLoaded', () => {
  atualizarAnosDesde();
  initSinais();
  renderTabsBA();
  initSliderBA();
  initInfiniteCarousel('reviews-wrapper', 'reviews-carousel-track', null, 0.55);
  initInfiniteCarousel('results-wrapper', 'results-infinite-track', criarCardsResultados, 0.8, FOTOS_RESULTADOS);
  initInfiniteCarousel('salon-wrapper', 'salon-infinite-track', criarCardsSalao, 0.8, FOTOS_SALAO);
  ajustarBotaoWhatsApp();
  const wd = document.getElementById('wd-telefone');
  if (wd) wd.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); whatsDirect(); } });
  document.getElementById('year').textContent = new Date().getFullYear();
  // Links diretos: site.com/#compartilhar ou site.com/#pix
  if (location.hash === '#compartilhar') openModal('share-modal');
  if (location.hash === '#pix') openModal('pix-modal');
});

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20);
  ajustarBotaoWhatsApp();
}, { passive: true });

window.addEventListener('resize', ajustarBotaoWhatsApp);

/* 11. STATUS DE ATENDIMENTO (aberto/fechado agora) */
(function statusAtendimento() {
  const el = document.getElementById('status-horario');
  const chip = document.getElementById('status-chip');
  const prox = document.getElementById('status-prox');
  if (!el || !chip || !prox) return;
  const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const fmt = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;
  function agora() {
    try {
      const p = new Intl.DateTimeFormat('en-US', { timeZone: FUSO, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (t) => p.find((x) => x.type === t).value;
      return { dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: +get('hour') * 60 + +get('minute') };
    } catch (e) {
      const d = new Date(); return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function atualizar() {
    const { dia, min } = agora();
    const h = HORARIOS[dia];
    if (h && min >= h[0] && min < h[1]) {
      el.textContent = 'Aberto agora';
      prox.textContent = `Até ${fmt(h[1])}`;
      chip.className = 'hours-status is-open';
      chip.hidden = false;
      return;
    }
    let texto;
    if (h && min < h[0]) texto = `Abre hoje às ${fmt(h[0])}`;
    else {
      let d = (dia + 1) % 7; while (!HORARIOS[d]) d = (d + 1) % 7;
      texto = `Abre ${d === (dia + 1) % 7 ? 'amanhã' : DIAS[d]} às ${fmt(HORARIOS[d][0])}`;
    }
    el.textContent = 'Fechado agora';
    prox.textContent = texto;
    chip.className = 'hours-status is-closed';
    chip.hidden = false;
  }
  atualizar();
  setInterval(atualizar, 60000);
})();

// FAQ: abrir uma pergunta fecha as outras
(function faqAcordeao() {
  const itens = document.querySelectorAll('details.faq-item');
  itens.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      itens.forEach((outro) => { if (outro !== item) outro.open = false; });
    });
  });
})();

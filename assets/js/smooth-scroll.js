/* Rolagem suave (Lenis) */
(function () {
  if (!window.Lenis) return;

  var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  window.lenis = lenis;

  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  function iniciar() {
    // Janelas com rolagem própria (modais, foto ampliada) continuam rolando normalmente
    document.querySelectorAll('.modal-panel, .lightbox').forEach(function (el) {
      el.setAttribute('data-lenis-prevent', '');
    });

    // Pausa a rolagem suave enquanto um modal trava a página
    new MutationObserver(function () {
      if (document.body.style.overflow === 'hidden') lenis.stop();
      else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['style'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  // Links internos (#secao) deslizam até o destino, compensando o cabeçalho fixo
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var alvo;
    try { alvo = document.querySelector(id); } catch (err) { return; }
    if (!alvo) return;
    e.preventDefault();
    var margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
    lenis.scrollTo(alvo, { offset: -margem });
  });
})();

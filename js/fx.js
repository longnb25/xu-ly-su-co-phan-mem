/* Hiệu ứng xuất hiện khi cuộn + thanh tiến độ cuộn trang */
const rvIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); } }), {threshold: .05}) : null;
function revealAll() {
  $$('#app .card, #app .q, #app .lcard, #app .diag').forEach((el, i) => {
    if (!rvIO || el.classList.contains('rv')) return;
    el.classList.add('rv'); el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms'; rvIO.observe(el);
  });
}
/* Phòng khi IntersectionObserver bị trình duyệt trì hoãn: tự hiện phần tử đang trong màn hình */
setInterval(() => {
  $$('.rv:not(.in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { el.classList.add('in'); if (rvIO) rvIO.unobserve(el); } });
  $$('.anim[data-ready]:not([data-auto])').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight * .7 && r.bottom > innerHeight * .3) { el.dataset.auto = 1; const b = el.querySelector('[data-c=play]'); if (b && /Phát/.test(b.textContent) && /Bước 1 \//.test(el.querySelector('.an-step').textContent)) b.click(); } });
}, 700);
document.addEventListener('scroll', () => {
  const h = document.documentElement, p = document.getElementById('prog');
  if (p) p.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
}, {passive: true});

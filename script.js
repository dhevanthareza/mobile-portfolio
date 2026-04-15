'use strict';

const SLIDES = ['hero', 'cash4mail', 'oncodoc', 'reconet', 'presensiku', 'contact'];
const NUMS   = { hero: '01', cash4mail: '02', oncodoc: '03', reconet: '04', presensiku: '05', contact: '06' };

const deck  = document.getElementById('deck');
const dots  = document.querySelectorAll('.dot');
const curEl = document.querySelector('.c-cur');

// ── scrollTo exposed to onclick attrs ──
function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
window.goTo = goTo;

// ── Update nav + counter ──
function setActive(id) {
  dots.forEach(d => d.classList.toggle('active', d.dataset.target === id));
  if (curEl) curEl.textContent = NUMS[id] ?? '01';
}

// ── IntersectionObserver — reveal .fade and update UI ──
const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.fade').forEach(el => el.classList.add('visible'));
      setActive(entry.target.id);
    });
  },
  { root: deck, threshold: 0.5 }
);

document.querySelectorAll('.slide').forEach(s => io.observe(s));

// ── Nav dot clicks ──
dots.forEach(d => d.addEventListener('click', () => goTo(d.dataset.target)));

// ── Keyboard navigation ──
let locked = false;

document.addEventListener('keydown', e => {
  if (locked) return;
  if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) return;
  e.preventDefault();

  let current = SLIDES[0];
  let best = 0;
  document.querySelectorAll('.slide').forEach(s => {
    const r = s.getBoundingClientRect();
    const vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    const ratio = vis / r.height;
    if (ratio > best) { best = ratio; current = s.id; }
  });

  const dir  = ['ArrowDown', 'PageDown', ' '].includes(e.key) ? 1 : -1;
  const idx  = SLIDES.indexOf(current);
  const next = SLIDES[Math.max(0, Math.min(SLIDES.length - 1, idx + dir))];

  locked = true;
  goTo(next);
  setTimeout(() => { locked = false; }, 800);
});

// ── Trigger hero on load ──
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hero')?.querySelectorAll('.fade').forEach(el => el.classList.add('visible'));
  setActive('hero');
});

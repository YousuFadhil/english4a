/* أدوات الواجهة + الحيوان الأليف */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  kids.flat(9).forEach((c) => {
    if (c == null || c === false) return;
    e.append(c.nodeType ? c : String(c));
  });
  return e;
}
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const arNum = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const Pet = {
  types: [{ e: '🐱', n: 'القطة' }, { e: '🐶', n: 'الكلب' }, { e: '🐰', n: 'الأرنب' }, { e: '🐪', n: 'الجمل' }],
  steps: [0, 6, 16, 32, 54, 80],
  names: ['صغير', 'ينمو', 'نشيط', 'قوي', 'بطل', 'نجم النجوم'],
  acc: ['', '', '🎀', '🎩', '👑', '👑✨'],
  level() { const s = Store.data.stars; let l = 0; this.steps.forEach((t, i) => { if (s >= t) l = i; }); return l; },
  next() { const l = this.level(); return l >= this.steps.length - 1 ? null : this.steps[l + 1] - Store.data.stars; },
  html(extra) {
    const t = Store.data.pet; if (!t) return '';
    const l = this.level();
    const size = 54 + l * 12;
    return `<div class="pet ${extra || ''}" data-level="${l}"><div class="pet-acc">${this.acc[l]}</div><div class="pet-body" style="font-size:${size}px">${t}</div></div>`;
  },
  cheer(root) {
    const p = (root || document).querySelector('.pet-body'); if (!p) return;
    p.classList.remove('bounce'); void p.offsetWidth; p.classList.add('bounce');
  },
  sad(root) {
    const p = (root || document).querySelector('.pet-body'); if (!p) return;
    p.classList.remove('sad'); void p.offsetWidth; p.classList.add('sad');
  },
};

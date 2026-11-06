/* رسومات التطبيق: إيموجي + رسومات SVG مرسومة داخل التطبيق (ساعات، أسبوع، أوعية) */
const Pic = (() => {
  function clock(h, m) {
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      const r1 = i % 3 === 0 ? 36 : 39, r2 = 43;
      ticks += `<line x1="${50 + r1 * Math.sin(a)}" y1="${50 - r1 * Math.cos(a)}" x2="${50 + r2 * Math.sin(a)}" y2="${50 - r2 * Math.cos(a)}" stroke="#3b6e8f" stroke-width="${i % 3 === 0 ? 3 : 1.5}"/>`;
    }
    const ha = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
    const ma = (m * 6 * Math.PI) / 180;
    return `<svg class="svgpic" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#3b6e8f" stroke-width="4"/>${ticks}
      <line x1="50" y1="50" x2="${50 + 22 * Math.sin(ha)}" y2="${50 - 22 * Math.cos(ha)}" stroke="#2b4a63" stroke-width="5" stroke-linecap="round"/>
      <line x1="50" y1="50" x2="${50 + 34 * Math.sin(ma)}" y2="${50 - 34 * Math.cos(ma)}" stroke="#e07a5f" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="3.5" fill="#2b4a63"/></svg>`;
  }

  function week(p) {
    const labels = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
    let s = '';
    labels.forEach((l, i) => {
      const x = 4 + i * 29;
      const on = p.on.includes(i);
      s += `<rect x="${x}" y="14" width="26" height="46" rx="5" fill="${on && p.day ? '#f4a259' : '#fff'}" stroke="#7fb3c8" stroke-width="2"/>
        <text x="${x + 13}" y="11" text-anchor="middle" font-size="11" fill="#3b6e8f" font-family="Segoe UI,Arial" font-weight="700">${l}</text>`;
      if (on && !p.day) s += `<text x="${x + 13}" y="46" text-anchor="middle" font-size="26" fill="#3fa36b" font-family="Segoe UI Symbol,Arial">✔</text>`;
    });
    if (p.never) s += `<text x="104" y="50" text-anchor="middle" font-size="40" fill="#d9534f" font-family="Segoe UI Symbol,Arial">✘</text>`;
    return `<svg class="svgpic wide" viewBox="0 0 208 64">${s}</svg>`;
  }

  function cont(p) {
    const c = p.col || '#ddd';
    const st = 'stroke="#5b6b7a" stroke-width="3" stroke-linejoin="round"';
    let g = '';
    switch (p.c) {
      case 'can':
        g = `<rect x="30" y="24" width="40" height="58" rx="6" fill="${c}" ${st}/><ellipse cx="50" cy="24" rx="20" ry="6" fill="#d9dee3" ${st}/><rect x="30" y="44" width="40" height="18" fill="#fff" opacity=".55"/>`; break;
      case 'bottle':
        g = `<rect x="42" y="6" width="16" height="10" rx="3" fill="#5b6b7a"/><path d="M43 16 H57 V30 C70 34 70 40 70 46 V86 Q70 92 64 92 H36 Q30 92 30 86 V46 C30 40 30 34 43 30 Z" fill="${c}" ${st}/>`; break;
      case 'bowl':
        g = `<path d="M10 42 H90 C90 74 72 90 50 90 C28 90 10 74 10 42 Z" fill="${c}" ${st}/><ellipse cx="50" cy="42" rx="40" ry="6" fill="#f7d8b0" ${st}/>`; break;
      case 'cup':
        g = `<path d="M22 34 H68 V60 Q68 84 45 84 Q22 84 22 60 Z" fill="${c}" ${st}/><path d="M68 42 H78 Q88 42 88 54 Q88 66 76 66 H67" fill="none" ${st}/><ellipse cx="45" cy="34" rx="23" ry="5" fill="#d9c3a8" ${st}/>`; break;
      case 'glass':
        g = `<path d="M26 20 H74 L68 86 H32 Z" fill="${c}" ${st}/><path d="M27 32 H73" stroke="#9fb4c3" stroke-width="2"/>`; break;
      case 'plate':
        g = `<ellipse cx="50" cy="68" rx="44" ry="14" fill="#fff" ${st}/><ellipse cx="50" cy="66" rx="30" ry="8" fill="#eef2f5" stroke="#b9c6d0" stroke-width="2"/><text x="50" y="66" text-anchor="middle" font-size="38">${p.e}</text>`; break;
      case 'box':
        g = `<rect x="20" y="30" width="60" height="54" rx="3" fill="${c}" ${st}/><path d="M20 30 L30 14 H70 L80 30" fill="#f7dd9a" ${st}/><text x="50" y="68" text-anchor="middle" font-size="30">${p.e}</text>`; break;
      case 'bag':
        g = `<path d="M30 32 Q30 12 40 12 M70 32 Q70 12 60 12" fill="none" ${st}/><path d="M24 32 H76 L82 88 H18 Z" fill="${c}" ${st}/><text x="50" y="68" text-anchor="middle" font-size="30">${p.e}</text>`; break;
    }
    return `<svg class="svgpic" viewBox="0 0 100 100">${g}</svg>`;
  }

  function html(p) {
    if (!p) return '';
    if (p.e) return `<span class="emo">${p.e}</span>`;
    if (p.t) return `<span class="txt">${p.t}</span>`;
    if (p.svg === 'clock') return clock(p.h, p.m);
    if (p.svg === 'week') return week(p);
    if (p.svg === 'cont') return cont(p);
    return '';
  }
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  return { html, same };
})();

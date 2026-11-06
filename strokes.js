/* الكتابة بالإصبع على الأسطر الأربعة.
   الأسطر (من فوق): 0 = سطر الحروف الطويلة، 1 = السطر المنقّط (ارتفاع الحرف القصير)، 2 = سطر الكتابة، 3 = سطر الذيل.
   اتجاه الخطوط ونقاط البداية: نموذج الحروف المطبوعة القياسي (عكس عقارب الساعة للحروف المدوّرة، من الأعلى للأسفل).
   الكتاب نفسه لا يتضمن نموذج خط، فهذا النموذج قياسي ويُراجَع من ولي الأمر. */
const Strokes = (() => {
  const RAD = Math.PI / 180;
  // قوس: مركز، أنصاف الأقطار، زاوية البداية (0=يمين، 90=أسفل، 270=أعلى)، والمدى (سالب = عكس عقارب الساعة)
  function arc(cx, cy, rx, ry, a0, sweep, n) {
    n = n || Math.max(8, Math.round(Math.abs(sweep) / 12));
    const out = [];
    for (let i = 0; i <= n; i++) {
      const a = (a0 + (sweep * i) / n) * RAD;
      out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return out;
  }
  const line = (x1, y1, x2, y2) => [[x1, y1], [x2, y2]];
  const cat = (...parts) => [].concat(...parts);
  const dot = (x, y) => [[x, y]];
  const stretch = (strokes) => strokes.map((st) => st.map(([x, y]) => [x, (y - 1) * 2]));

  const L = {}; // الحروف الصغيرة
  L.a = [arc(0.47, 1.5, 0.3, 0.5, -35, -330), line(0.77, 1, 0.77, 2)];
  L.b = [line(0.2, 0, 0.2, 2), arc(0.5, 1.5, 0.3, 0.5, 180, 360)];
  L.c = [arc(0.55, 1.5, 0.33, 0.5, -40, -280)];
  L.d = [arc(0.47, 1.5, 0.3, 0.5, -35, -330), line(0.77, 0, 0.77, 2)];
  L.e = [cat(line(0.15, 1.5, 0.85, 1.5), arc(0.5, 1.5, 0.35, 0.5, 0, -320))];
  L.f = [[[0.8, 0.12], [0.7, 0.02], [0.55, 0.04], [0.45, 0.2], [0.45, 2]], line(0.2, 1, 0.78, 1)];
  L.g = [arc(0.47, 1.5, 0.3, 0.5, -35, -330), [[0.77, 1], [0.77, 2.5], [0.7, 2.85], [0.5, 3], [0.28, 2.92], [0.15, 2.75]]];
  L.h = [line(0.2, 0, 0.2, 2), [[0.2, 1.5], [0.3, 1.12], [0.5, 1.0], [0.7, 1.12], [0.8, 1.45], [0.8, 2]]];
  L.i = [line(0.5, 1, 0.5, 2), dot(0.5, 0.55)];
  L.j = [[[0.55, 1], [0.55, 2.5], [0.48, 2.85], [0.3, 3], [0.15, 2.9]], dot(0.55, 0.55)];
  L.k = [line(0.2, 0, 0.2, 2), line(0.8, 1, 0.2, 1.65), line(0.4, 1.45, 0.8, 2)];
  L.l = [line(0.5, 0, 0.5, 2)];
  L.m = [line(0.12, 1, 0.12, 2), [[0.12, 1.4], [0.2, 1.1], [0.35, 1.0], [0.5, 1.12], [0.5, 2]], [[0.5, 1.4], [0.58, 1.1], [0.72, 1.0], [0.86, 1.12], [0.86, 2]]];
  L.n = [line(0.2, 1, 0.2, 2), [[0.2, 1.45], [0.3, 1.12], [0.5, 1.0], [0.7, 1.12], [0.8, 1.45], [0.8, 2]]];
  L.o = [arc(0.5, 1.5, 0.33, 0.5, -90, -360)];
  L.p = [line(0.2, 1, 0.2, 3), arc(0.5, 1.5, 0.3, 0.5, 180, 360)];
  L.q = [arc(0.47, 1.5, 0.3, 0.5, -35, -330), line(0.77, 1, 0.77, 3)];
  L.r = [line(0.25, 1, 0.25, 2), [[0.25, 1.45], [0.35, 1.12], [0.55, 1.0], [0.75, 1.1]]];
  L.s = [[[0.75, 1.15], [0.6, 1.02], [0.4, 1.02], [0.25, 1.15], [0.3, 1.35], [0.5, 1.5], [0.7, 1.65], [0.75, 1.85], [0.6, 1.98], [0.4, 1.98], [0.25, 1.85]]];
  L.t = [[[0.45, 0.3], [0.45, 1.75], [0.5, 1.92], [0.65, 2.0], [0.8, 1.92]], line(0.2, 1, 0.75, 1)];
  L.u = [[[0.2, 1], [0.2, 1.65], [0.3, 1.9], [0.5, 2.0], [0.7, 1.9], [0.8, 1.7], [0.8, 1]], line(0.8, 1, 0.8, 2)];
  L.v = [[[0.15, 1], [0.5, 2], [0.85, 1]]];
  L.w = [[[0.05, 1], [0.27, 2], [0.5, 1.2], [0.73, 2], [0.95, 1]]];
  L.x = [line(0.15, 1, 0.85, 2), line(0.85, 1, 0.15, 2)];
  L.y = [line(0.15, 1, 0.5, 2), [[0.85, 1], [0.5, 2], [0.3, 2.7], [0.2, 3]]];
  L.z = [[[0.15, 1], [0.85, 1], [0.15, 2], [0.85, 2]]];

  const U = {}; // الحروف الكبيرة
  U.A = [line(0.5, 0, 0.1, 2), line(0.5, 0, 0.9, 2), line(0.28, 1.3, 0.72, 1.3)];
  U.B = [line(0.2, 0, 0.2, 2), cat(line(0.2, 0, 0.45, 0), arc(0.45, 0.5, 0.3, 0.5, -90, 180), line(0.45, 1, 0.2, 1)), cat(line(0.2, 1, 0.45, 1), arc(0.45, 1.5, 0.35, 0.5, -90, 180), line(0.45, 2, 0.2, 2))];
  U.C = stretch(L.c);
  U.D = [line(0.2, 0, 0.2, 2), cat(line(0.2, 0, 0.4, 0), arc(0.4, 1, 0.45, 1, -90, 180), line(0.4, 2, 0.2, 2))];
  U.E = [line(0.25, 0, 0.25, 2), line(0.25, 0, 0.8, 0), line(0.25, 1, 0.7, 1), line(0.25, 2, 0.8, 2)];
  U.F = [line(0.25, 0, 0.25, 2), line(0.25, 0, 0.8, 0), line(0.25, 1, 0.7, 1)];
  U.G = [arc(0.55, 1, 0.38, 1, -40, -290), line(0.93, 1.17, 0.58, 1.17)];
  U.H = [line(0.2, 0, 0.2, 2), line(0.8, 0, 0.8, 2), line(0.2, 1, 0.8, 1)];
  U.I = [line(0.5, 0, 0.5, 2)];
  U.J = [[[0.65, 0], [0.65, 1.6], [0.55, 1.9], [0.35, 2], [0.2, 1.85]]];
  U.K = [line(0.2, 0, 0.2, 2), line(0.8, 0, 0.2, 1.15), line(0.38, 0.95, 0.85, 2)];
  U.L = [[[0.25, 0], [0.25, 2], [0.8, 2]]];
  U.M = [[[0.1, 2], [0.1, 0], [0.5, 1.4], [0.9, 0], [0.9, 2]]];
  U.N = [[[0.15, 2], [0.15, 0], [0.85, 2], [0.85, 0]]];
  U.O = [arc(0.5, 1, 0.4, 1, -90, -360)];
  U.P = [line(0.2, 0, 0.2, 2), cat(line(0.2, 0, 0.5, 0), arc(0.5, 0.5, 0.32, 0.5, -90, 180), line(0.5, 1, 0.2, 1))];
  U.Q = [arc(0.5, 1, 0.4, 1, -90, -360), line(0.6, 1.5, 0.92, 2.1)];
  U.R = [line(0.2, 0, 0.2, 2), cat(line(0.2, 0, 0.5, 0), arc(0.5, 0.5, 0.32, 0.5, -90, 180), line(0.5, 1, 0.2, 1)), line(0.45, 1, 0.85, 2)];
  U.S = stretch(L.s);
  U.T = [line(0.1, 0, 0.9, 0), line(0.5, 0, 0.5, 2)];
  U.U = [[[0.2, 0], [0.2, 1.5], [0.35, 1.9], [0.5, 2], [0.65, 1.9], [0.8, 1.5], [0.8, 0]]];
  U.V = stretch(L.v);
  U.W = stretch(L.w);
  U.X = stretch(L.x);
  U.Y = [[[0.1, 0], [0.5, 1], [0.9, 0]], line(0.5, 1, 0.5, 2)];
  U.Z = stretch(L.z);

  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  // إعادة أخذ عينات بخطوة ثابتة
  function resample(pts, step) {
    if (pts.length === 1) return [pts[0]];
    const out = [pts[0]];
    let carry = 0;
    for (let i = 1; i < pts.length; i++) {
      let a = pts[i - 1], b = pts[i];
      let d = dist(a, b);
      let pos = step - carry;
      while (pos <= d) {
        const t = pos / d;
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        pos += step;
      }
      carry = d - (pos - step);
    }
    const last = pts[pts.length - 1];
    if (dist(out[out.length - 1], last) > step * 0.3) out.push(last);
    return out;
  }

  function glyph(ch) {
    const strokes = L[ch] || U[ch];
    if (!strokes) return null;
    return strokes.map((p) => ({ pts: p, samples: resample(p, 0.07), dot: p.length === 1 }));
  }

  /* ======== أداة الكتابة ======== */
  // word: الكلمة، host: عنصر div، callbacks: onDone(fails)
  function Writer(host, word, cb) {
    const letters = word.split('');
    const CELL = 1.08, TOPM = 0.45, BOTM = 0.5;
    const nU = letters.length * CELL + 0.5;
    const hostW = Math.max(260, host.clientWidth || 600);
    let u = Math.min(110, Math.max(46, hostW / nU));
    const W = Math.round(nU * u), H = Math.round((3 + TOPM + BOTM) * u);
    const dpr = window.devicePixelRatio || 1;
    const cv = document.createElement('canvas');
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    cv.className = 'writer-canvas';
    host.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'writer-wrap'; wrap.appendChild(cv); host.appendChild(wrap);
    const g = cv.getContext('2d');
    g.scale(dpr, dpr);

    const glyphs = letters.map(glyph);
    let li = 0, si = 0;          // الحرف الحالي والخط الحالي
    let fails = 0, totalFails = 0, hint = false;
    const done = glyphs.map((gl) => gl.map(() => false));
    let cur = null;              // الخط الجاري: {pts, prog, off}
    let demoT = -1, raf = 0, destroyed = false;

    const X = (x, i) => (0.25 + i * CELL + x * 0.9) * u;
    const Y = (y) => (TOPM + y) * u;

    function drawLines() {
      g.fillStyle = '#fffdf6'; g.fillRect(0, 0, W, H);
      const lines = [[0, '#7fb3c8', []], [1, '#b8d6e2', [6, 6]], [2, '#7fb3c8', []], [3, '#7fb3c8', []]];
      lines.forEach(([y, c, dash]) => {
        g.strokeStyle = c; g.lineWidth = y === 1 ? 2 : 2.5; g.setLineDash(dash);
        g.beginPath(); g.moveTo(8, Y(y)); g.lineTo(W - 8, Y(y)); g.stroke();
      });
      g.setLineDash([]);
    }
    function pathStroke(i, st, color, width) {
      g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath();
      st.pts.forEach(([x, y], k) => { k ? g.lineTo(X(x, i), Y(y)) : g.moveTo(X(x, i), Y(y)); });
      if (st.dot) { g.lineTo(X(st.pts[0][0], i) + 0.1, Y(st.pts[0][1])); }
      g.stroke();
    }
    function render() {
      if (destroyed) return;
      drawLines();
      glyphs.forEach((gl, i) => {
        if (!gl) return;
        gl.forEach((st, k) => {
          if (done[i][k]) pathStroke(i, st, '#3b7dd8', 0.13 * u);
          else if (i === li) pathStroke(i, st, '#c7d3dc', 0.16 * u);
          else pathStroke(i, st, '#e4eaee', 0.14 * u);
        });
      });
      // رقم نقطة البداية للخطوط غير المكتملة في الحرف الحالي
      const gl = glyphs[li];
      if (gl) {
        gl.forEach((st, k) => {
          if (done[li][k]) return;
          const [sx, sy] = st.pts[0];
          const isNext = k === si;
          g.fillStyle = isNext ? '#2fa36b' : '#9db4c2';
          g.beginPath(); g.arc(X(sx, li), Y(sy), (isNext ? 0.2 : 0.15) * u, 0, 7); g.fill();
          g.fillStyle = '#fff'; g.font = `bold ${0.22 * u}px Segoe UI, Arial`;
          g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(String(k + 1), X(sx, li), Y(sy) + 1);
        });
        // مؤشر العرض التوضيحي
        const st = gl[si];
        if (st && demoT >= 0) {
          const idx = Math.min(st.samples.length - 1, Math.floor(demoT * st.samples.length));
          const [px, py] = st.samples[idx];
          g.fillStyle = '#f4a259'; g.beginPath(); g.arc(X(px, li), Y(py), 0.17 * u, 0, 7); g.fill();
        }
      }
      // حبر الطفل
      if (cur && cur.ink.length) {
        g.strokeStyle = '#e8743b'; g.lineWidth = 0.13 * u; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath(); cur.ink.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
      }
    }
    render();

    function toUnits(ev) {
      const r = cv.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * W, py = ((ev.clientY - r.top) / r.height) * H;
      return { px, py, x: ((px / u) - 0.25 - li * CELL) / 0.9, y: py / u - TOPM };
    }

    function strokeDone() {
      const gl = glyphs[li];
      done[li][si] = true; fails = 0; hint = false;
      si++;
      cur = null;
      if (si >= gl.length) {            // اكتمل الحرف
        Snd.sfx('ok');
        li++; si = 0;
        while (li < glyphs.length && !glyphs[li]) li++;
        if (li >= glyphs.length) { render(); finish(); return; }
      } else Snd.sfx('tap');
      render();
    }
    function strokeFail(msg) {
      fails++; totalFails++;
      cur = null; Snd.sfx('no');
      host.classList.add('shake'); setTimeout(() => host.classList.remove('shake'), 400);
      if (fails >= 2) demo();
      render();
    }
    function finish() { destroyed = true; cb.onDone(totalFails); }

    function demo() {
      if (!glyphs[li]) return;
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const loop = (t) => {
        if (destroyed) return;
        demoT = Math.min(1, (t - t0) / 1600);
        render();
        if (demoT < 1) raf = requestAnimationFrame(loop);
        else setTimeout(() => { demoT = -1; render(); }, 400);
      };
      raf = requestAnimationFrame(loop);
    }

    const TOL = 0.34, STARTTOL = 0.5;
    cv.addEventListener('pointerdown', (ev) => {
      if (destroyed || !glyphs[li]) return;
      ev.preventDefault();
      try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
      const p = toUnits(ev);
      const st = glyphs[li][si];
      if (dist([p.x, p.y], st.samples[0]) > STARTTOL) {
        // بدأ من مكان خاطئ: نُريه النقطة الصحيحة
        Snd.sfx('no'); demo(); return;
      }
      cur = { ink: [[p.px, p.py]], prog: 0, off: 0, n: 0 };
      if (st.dot) { cur.prog = 1; }
      render();
    });
    cv.addEventListener('pointermove', (ev) => {
      if (!cur || destroyed) return;
      ev.preventDefault();
      const p = toUnits(ev);
      cur.ink.push([p.px, p.py]); cur.n++;
      const st = glyphs[li][si];
      const smp = st.samples;
      // تقدّم متسلسل على الخط
      for (let j = cur.prog; j < Math.min(smp.length, cur.prog + 5); j++) {
        if (dist([p.x, p.y], smp[j]) < TOL) cur.prog = j + 1;
      }
      let dmin = 9;
      for (let j = Math.max(0, cur.prog - 3); j < Math.min(smp.length, cur.prog + 4); j++) dmin = Math.min(dmin, dist([p.x, p.y], smp[j]));
      if (dmin > 0.7) cur.off++;
      render();
    });
    const up = (ev) => {
      if (!cur || destroyed) return;
      const st = glyphs[li][si];
      const need = st.dot ? 1 : st.samples.length - 2;
      const ok = cur.prog >= need && cur.off < 6;
      if (ok) strokeDone(); else strokeFail();
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);

    return {
      demo,
      destroy() { destroyed = true; cancelAnimationFrame(raf); },
      // للاختبار الآلي: يكتب الخط الحالي بدقة
      _autoTrace() {
        const gl = glyphs[li]; if (!gl) return false;
        const st = gl[si];
        const r = cv.getBoundingClientRect();
        const ptsPx = st.samples.map(([x, y]) => [r.left + (X(x, li) / W) * r.width, r.top + (Y(y) / H) * r.height]);
        const ev = (type, p) => cv.dispatchEvent(new PointerEvent(type, { clientX: p[0], clientY: p[1], pointerId: 1, bubbles: true }));
        ev('pointerdown', ptsPx[0]);
        ptsPx.forEach((p) => ev('pointermove', p));
        ev('pointerup', ptsPx[ptsPx.length - 1]);
        return true;
      },
    };
  }

  return { glyph, Writer, has: (ch) => !!(L[ch] || U[ch]) };
})();

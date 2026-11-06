/* الألعاب الخمس: كل لعبة لها هدف تعليمي واحد، وتتكرر في كل الدروس */
const Games = (() => {
  const META = {
    g1: { name: 'اسمع واختر', icon: '👂', goal: 'يربط الصوت بالمعنى' },
    g2: { name: 'اقرأ واختر', icon: '👀', goal: 'يتعرّف على الكلمة المكتوبة' },
    g3: { name: 'رتّب الحروف', icon: '🔤', goal: 'يتهجّى الكلمة' },
    g4: { name: 'اكتب بإصبعك', icon: '✍️', goal: 'يتعلّم شكل الحرف' },
    g5: { name: 'رتّب الجملة', icon: '🧩', goal: 'يتعلّم نمط الجملة' },
  };
  const INSTR = {
    g1: 'اسمع الكلمة، ثم اضغط على الصورة الصحيحة.',
    g1s: 'اسمع الجملة، ثم اختر الجملة الصحيحة.',
    g2: 'اقرأ الكلمة، ثم اضغط على الصورة الصحيحة.',
    g2s: 'اقرأ الجملة، ثم اختر معناها بالعربي.',
    g3: 'اسمع الكلمة، ثم رتّب الحروف لتكتبها.',
    g4: 'اكتب الحرف بإصبعك. ابدأ من النقطة الخضراء، وامشِ مع الأرقام.',
    g5: 'رتّب الكلمات لتكوّن جملة صحيحة.',
  };

  const spellable = (w) => w.en && /^[A-Za-z]+$/.test(w.en) && w.en.length >= 2 && w.en.length <= 12;
  const uniq = (arr) => { const m = new Map(); arr.forEach((x) => { if (!m.has(x.id)) m.set(x.id, x); }); return [...m.values()]; };
  const ownWords = (l) => (l.kind === 'review' ? uniq(l.unit.lessons.flatMap((x) => x.words)) : l.words);
  const ownSents = (l) => (l.kind === 'review' ? l.unit.lessons.flatMap((x) => x.sentences) : l.sentences);
  const earlierWords = (l) => uniq(DATA.lessons.filter((x) => x.index < l.index).flatMap((x) => x.words));
  const earlierSents = (l) => DATA.lessons.filter((x) => x.index < l.index).flatMap((x) => x.sentences);

  function gamesFor(l) {
    const words = ownWords(l), sp = words.filter(spellable), ss = ownSents(l);
    const g = [];
    if (l.kind === 'phonics') { g.push('g1'); if (sp.length >= 2) g.push('g3', 'g4'); if (ss.length) g.push('g5'); return g; }
    if (l.kind === 'review') { g.push('g1', 'g2', 'g3'); if (ss.length) g.push('g5'); return g; }
    if (words.length >= 2) { g.push('g1', 'g2'); if (sp.length >= 2) g.push('g3', 'g4'); if (ss.length) g.push('g5'); }
    else if (ss.length) g.push('g1', 'g2', 'g5');
    return g;
  }
  const lessonDone = (l) => gamesFor(l).every((g) => Store.gameStars(l.id, g) >= 1);
  const lessonUnlocked = (l) => Store.data.unlockAll || l.index === 0 || lessonDone(DATA.lessons[l.index - 1]);

  // ---------- اختيار العناصر: الدرس الحالي أولاً + كلمات قديمة (والأضعف تتكرر أكثر) ----------
  function weighted(list, k) {
    const out = [];
    if (!list.length || k <= 0) return out;
    while (out.length < k) {
      const scored = shuffle(list).map((x) => ({ x, s: Store.priority(x.id) + Math.random() * 3 })).sort((a, b) => b.s - a.s);
      for (const o of scored) { if (out.length >= k) break; out.push(o.x); }
    }
    return out;
  }
  function spread(arr) { // تجنّب تكرار نفس العنصر متتالياً
    const a = arr.slice();
    for (let i = 1; i < a.length; i++) {
      if (a[i].id === a[i - 1].id) {
        const j = a.findIndex((x, k) => k > i && x.id !== a[i].id && (!a[i + 1] || x.id !== a[i + 1].id));
        if (j > 0) [a[i], a[j]] = [a[j], a[i]];
      }
    }
    return a;
  }
  function pickWords(l, n, filter) {
    filter = filter || (() => true);
    const own = ownWords(l).filter(filter);
    const ownIds = new Set(own.map((w) => w.id));
    const old = earlierWords(l).filter((w) => !ownIds.has(w.id)).filter(filter);
    let nOld = old.length ? Math.round(n * (l.kind === 'review' ? 0.25 : 0.35)) : 0;
    if (!own.length) nOld = n;
    return spread(shuffle([...weighted(own, n - nOld), ...weighted(old, nOld)]));
  }
  function pickSents(l, n) {
    const own = ownSents(l), ids = new Set(own.map((s) => s.id));
    const old = earlierSents(l).filter((s) => !ids.has(s.id));
    const nOld = old.length && own.length ? Math.min(old.length, Math.round(n * 0.3)) : 0;
    const k = Math.min(n, own.length + nOld);
    return spread(shuffle([...weighted(own, Math.max(0, Math.min(own.length, k - nOld))), ...weighted(old, nOld)]));
  }

  // ---------- بناء الأسئلة ----------
  function choiceQ(w, l) {
    const pool = uniq([...ownWords(l), ...earlierWords(l)]);
    const type = w.pic ? 'pic' : 'ar';
    const own = new Set(ownWords(l).map((x) => x.id));
    const cands = pool.filter((c) => c.id !== w.id && (type === 'pic' ? c.pic && !Pic.same(c.pic, w.pic) : c.ar !== w.ar));
    const ordered = [...shuffle(cands.filter((c) => own.has(c.id))), ...shuffle(cands.filter((c) => !own.has(c.id)))];
    const seen = [], ds = [];
    for (const c of ordered) {
      const key = type === 'pic' ? JSON.stringify(c.pic) : c.ar;
      if (seen.includes(key)) continue;
      seen.push(key); ds.push(c);
      if (ds.length === 3) break;
    }
    return { kind: 'w', w, type, opts: shuffle([w, ...ds]) };
  }
  function sentQ(s, l, mode) {
    const pool = uniq([...ownSents(l), ...earlierSents(l)]);
    const ds = shuffle(pool.filter((x) => x.id !== s.id)).slice(0, 2);
    return { kind: 's', s, mode, opts: shuffle([s, ...ds]) };
  }

  // ---------- إطار اللعبة ----------
  function frame(App, ctx, l, gkey, total, instrKey) {
    const dots = h('div', { class: 'dots' }, Array.from({ length: total }, () => h('i')));
    const say = () => ctx.dead || Snd.speak(INSTR[instrKey], 'ar');
    const root = h('div', { class: 'screen game' },
      h('div', { class: 'gtop' },
        h('button', { class: 'btn small back', 'aria-label': 'رجوع', onclick: () => App.lesson(l) }, '🏠'),
        h('div', { class: 'gtitle' }, `${META[gkey].icon} ${META[gkey].name}`),
        dots,
        h('button', { class: 'btn small round', 'aria-label': 'اسمع التعليمات', onclick: say }, '🗣️')),
      h('div', { class: 'instr-line' }, INSTR[instrKey]),
      h('div', { class: 'gbody' }),
      h('div', { class: 'gpet', html: Pet.html() }));
    App.show(root);
    return {
      root, body: $('.gbody', root), say,
      mark(i, ok) { const d = dots.children[i]; if (d) d.className = ok ? 'ok' : 'bad'; },
      cheer() { Pet.cheer(root); }, sad() { Pet.sad(root); },
    };
  }

  const wordHtml = (w, mark) => {
    if (w.parts && mark !== false) return w.parts.map((p, i) => `<span class="${w.hl && w.hl.includes(i) ? 'hl' : ''}">${p}</span>`).join('');
    return w.en;
  };

  // ---------- نهاية اللعبة ----------
  async function finish(App, ctx, l, gkey, stars, summary) {
    if (ctx.dead) return;
    const was = lessonDone(l);
    Store.setGameStars(l.id, gkey, stars);
    const nowDone = lessonDone(l);
    Snd.sfx('star');
    const root = h('div', { class: 'screen result' },
      h('div', { class: 'big-title' }, stars === 3 ? 'ممتاز! 🎉' : stars === 2 ? 'أحسنت! 👏' : 'جيد! واصل 💪'),
      h('div', { class: 'stars-big' }, [1, 2, 3].map((i) => h('span', { class: i <= stars ? 'on' : 'off' }, '⭐'))),
      h('div', { class: 'sum' }, summary || ''),
      h('div', { class: 'petbox', html: Pet.html('big') }),
      (nowDone && !was) ? h('div', { class: 'unlock' }, '🔓 خلّصت الدرس! الدرس اللي بعده انفتح') : null,
      h('div', { class: 'row' },
        h('button', { class: 'btn big', onclick: () => App.play(l, gkey) }, '🔁 مرة ثانية'),
        h('button', { class: 'btn big primary', onclick: () => App.lesson(l) }, 'الدرس ◀')));
    App.show(root);
    Pet.cheer(root);
    Snd.speak(stars === 3 ? 'ممتاز!' : 'أحسنت!', 'ar');
  }
  const starsFor = (ok, total) => { const p = ok / total; return p >= 0.9 ? 3 : p >= 0.65 ? 2 : 1; };

  // ---------- ١ و ٢: اختيار ----------
  async function choice(App, ctx, l, gkey) {
    const sentMode = ownWords(l).length < 2 && ownSents(l).length > 0;
    const n = 8;
    let qs;
    if (sentMode) qs = pickSents(l, Math.min(n, Math.max(5, ownSents(l).length))).map((s) => sentQ(s, l, gkey === 'g1' ? 'listen' : 'read'));
    else qs = pickWords(l, n).map((w) => choiceQ(w, l));
    const total = qs.length;
    const fr = frame(App, ctx, l, gkey, total, gkey + (sentMode ? 's' : ''));
    await fr.say();
    const queue = qs.slice();
    let idx = 0, firstOk = 0;
    while (queue.length && !ctx.dead) {
      const q = queue.shift();
      const ok = await ask(fr, ctx, q, gkey);
      if (ctx.dead) return;
      if (!q.again) { if (ok) firstOk++; fr.mark(idx, ok); idx++; }
      if (q.kind === 'w') Store.answer(q.w.id, ok); else Store.answer(q.s.id, ok);
      if (!ok && !q.again) queue.splice(Math.min(2, queue.length), 0, Object.assign({}, q, { again: true, opts: shuffle(q.opts) }));
    }
    finish(App, ctx, l, gkey, starsFor(firstOk, total), `${arNum(firstOk)} من ${arNum(total)} من أول مرة`);
  }

  function ask(fr, ctx, q, gkey) {
    return new Promise(async (resolve) => {
      const body = fr.body;
      body.innerHTML = '';
      const isW = q.kind === 'w';
      const target = isW ? q.w : q.s;
      body.dataset.target = target.id;
      const listen = gkey === 'g1';
      const spk = h('button', { class: 'btn spk', 'aria-label': 'اسمع', onclick: () => Snd.speak(target.en, 'en') }, '🔊');
      let prompt;
      if (listen) prompt = h('div', { class: 'prompt' }, spk, !isW ? h('div', { class: 'hint-ar' }, 'اسمع الجملة') : null);
      else if (isW) prompt = h('div', { class: 'prompt' }, h('div', { class: 'bigword en', html: wordHtml(q.w) }), spk);
      else prompt = h('div', { class: 'prompt' }, h('div', { class: 'sentence en' }, q.s.en), spk);
      const opts = h('div', { class: 'opts ' + (isW ? (q.type === 'pic' ? 'pics' : 'texts') : 'long') });
      let locked = false;
      q.opts.forEach((o) => {
        let content;
        if (isW) content = q.type === 'pic' ? h('div', { class: 'pic', html: Pic.html(o.pic) }) : h('div', { class: 'artext' }, o.ar);
        else content = (gkey === 'g1') ? h('div', { class: 'en stext' }, o.en) : h('div', { class: 'artext' }, o.ar);
        const b = h('button', { class: 'opt', 'data-id': o.id }, content);
        b.addEventListener('click', async () => {
          if (locked || ctx.dead) return;
          locked = true;
          const ok = o.id === target.id;
          if (ok) { b.classList.add('right'); Snd.sfx('ok'); fr.cheer(); }
          else {
            b.classList.add('wrong'); Snd.sfx('no'); fr.sad();
            const c = [...opts.children].find((x) => x.dataset.id === target.id); if (c) c.classList.add('right', 'reveal');
          }
          // نُظهر المعنى بالعربي وننطق الكلمة
          const meaning = h('div', { class: 'meaning' }, h('span', { class: 'en' }, target.en), ' = ', target.ar);
          body.append(meaning);
          await Snd.speak(target.en, 'en');
          await sleep(ok ? 500 : 1300);
          resolve(ok);
        });
        opts.append(b);
      });
      body.append(prompt, opts);
      if (listen) { await sleep(250); if (!ctx.dead) Snd.speak(target.en, 'en'); }
    });
  }

  // ---------- ٣: ترتيب الحروف ----------
  const CHUNK_DISTRACT = ['ie', 'igh', 'y', 'oa', 'ow', 'ee', 'ai', 'ea'];
  async function spell(App, ctx, l, gkey) {
    const words = pickWords(l, 6, spellable);
    const total = words.length;
    const fr = frame(App, ctx, l, gkey, total, 'g3');
    await fr.say();
    let firstOk = 0;
    for (let i = 0; i < total && !ctx.dead; i++) {
      const w = words[i];
      const r = await spellOne(fr, ctx, w);
      if (ctx.dead) return;
      Store.answer(w.id, r.firstTry);
      if (r.firstTry) firstOk++;
      fr.mark(i, r.firstTry);
    }
    finish(App, ctx, l, gkey, starsFor(firstOk, total), `${arNum(firstOk)} من ${arNum(total)} من أول مرة`);
  }
  function spellOne(fr, ctx, w) {
    return new Promise(async (resolve) => {
      const parts = w.parts ? w.parts.slice() : w.en.split('');
      const target = parts.join('');
      const body = fr.body; body.innerHTML = ''; body.dataset.target = target;
      let extras;
      if (w.parts) {
        extras = shuffle(CHUNK_DISTRACT.filter((c) => !parts.includes(c))).slice(0, 2);
      } else {
        const abc = 'abcdefghijklmnoprstuwy'.split('').filter((c) => !w.en.toLowerCase().includes(c));
        extras = shuffle(abc).slice(0, 2);
      }
      const tiles = shuffle([...parts.map((t, k) => ({ t, k, id: 'p' + k, hl: w.hl && w.hl.includes(k) })), ...extras.map((t, k) => ({ t, id: 'x' + k }))]);
      const slots = Array(parts.length).fill(null);
      const pic = h('div', { class: 'pic big', html: w.pic ? Pic.html(w.pic) : `<span class="txt">${w.ar}</span>` });
      const spk = h('button', { class: 'btn spk', onclick: () => Snd.speak(w.en, 'en') }, '🔊');
      const slotRow = h('div', { class: 'slots en' });
      const tray = h('div', { class: 'tray en' });
      let wrongCount = 0, locked = false;
      const render = () => {
        slotRow.innerHTML = ''; tray.innerHTML = '';
        slots.forEach((s, i) => {
          const b = h('button', { class: 'slot' + (s ? ' filled' : '') + (s && s.hl ? ' hl' : '') }, s ? s.t : '');
          b.addEventListener('click', () => { if (locked || !slots[i]) return; Snd.sfx('tap'); slots[i] = null; render(); });
          slotRow.append(b);
        });
        tiles.forEach((t) => {
          if (slots.includes(t)) return;
          const b = h('button', { class: 'tile' }, t.t);
          b.addEventListener('click', () => {
            if (locked) return;
            const e = slots.indexOf(null); if (e < 0) return;
            slots[e] = t; Snd.sfx('tap'); render(); check();
          });
          tray.append(b);
        });
      };
      const check = async () => {
        if (slots.includes(null)) return;
        locked = true;
        const got = slots.map((s) => s.t).join('');
        if (got === target) {
          slotRow.classList.add('good'); Snd.sfx('ok'); fr.cheer();
          body.append(h('div', { class: 'meaning' }, h('span', { class: 'en' }, w.en), ' = ', w.ar));
          await Snd.speak(w.en, 'en'); await sleep(500);
          resolve({ firstTry: wrongCount === 0 });
        } else {
          wrongCount++; Snd.sfx('no'); fr.sad(); slotRow.classList.add('shake');
          await sleep(600); slotRow.classList.remove('shake');
          if (wrongCount >= 2) { // نعرض الجواب الصحيح ونكمل
            parts.forEach((t, k) => { slots[k] = tiles.find((x) => x.k === k); });
            render(); slotRow.classList.add('good');
            body.append(h('div', { class: 'meaning' }, h('span', { class: 'en' }, w.en), ' = ', w.ar));
            await Snd.speak(w.en, 'en'); await sleep(900);
            resolve({ firstTry: false });
          } else { slots.fill(null); locked = false; render(); }
        }
      };
      body.append(h('div', { class: 'prompt' }, pic, spk), h('div', { class: 'meaning-ar' }, w.ar), slotRow, tray);
      render();
      await sleep(250); if (!ctx.dead) Snd.speak(w.en, 'en');
    });
  }

  // ---------- ٤: كتابة بالإصبع ----------
  async function write(App, ctx, l, gkey) {
    const words = spread(shuffle(ownWords(l).filter(spellable))).slice(0, 4);
    const total = words.length;
    const fr = frame(App, ctx, l, gkey, total, 'g4');
    await fr.say();
    let totalFails = 0;
    for (let i = 0; i < total && !ctx.dead; i++) {
      const w = words[i];
      const fails = await writeOne(fr, ctx, w);
      if (ctx.dead) return;
      totalFails += fails;
      fr.mark(i, fails <= 2);
    }
    const avg = totalFails / total;
    finish(App, ctx, l, gkey, avg <= 1 ? 3 : avg <= 3 ? 2 : 1, `كتبت ${arNum(total)} كلمات`);
  }
  function writeOne(fr, ctx, w) {
    return new Promise(async (resolve) => {
      const body = fr.body; body.innerHTML = '';
      const host = h('div', { class: 'writer-host' });
      const wordEl = h('div', { class: 'bigword en small', html: wordHtml(w) });
      const demoBtn = h('button', { class: 'btn', onclick: () => writer && writer.demo() }, '👁️ شاهد الطريقة');
      const spk = h('button', { class: 'btn spk', onclick: () => Snd.speak(w.en, 'en') }, '🔊');
      const pic = h('div', { class: 'pic mid', html: w.pic ? Pic.html(w.pic) : '' });
      body.append(h('div', { class: 'prompt' }, pic, wordEl, spk), host, h('div', { class: 'row' }, demoBtn),
        h('div', { class: 'meaning-ar' }, w.ar));
      let writer = null;
      await sleep(60);
      ctx.writer = null;
      writer = Strokes.Writer(host, w.en, {
        onDone: async (fails) => {
          fr.cheer(); Snd.sfx('star');
          await Snd.speak(w.en, 'en'); await sleep(600);
          resolve(fails);
        },
      });
      ctx.writer = writer;
      Snd.speak(w.en, 'en');
    });
  }

  // ---------- ٥: ترتيب الجملة ----------
  async function order(App, ctx, l, gkey) {
    const sents = pickSents(l, 5);
    const total = sents.length;
    const fr = frame(App, ctx, l, gkey, total, 'g5');
    await fr.say();
    let firstOk = 0;
    for (let i = 0; i < total && !ctx.dead; i++) {
      const r = await orderOne(fr, ctx, sents[i]);
      if (ctx.dead) return;
      Store.answer(sents[i].id, r);
      if (r) firstOk++;
      fr.mark(i, r);
    }
    finish(App, ctx, l, gkey, starsFor(firstOk, total), `${arNum(firstOk)} من ${arNum(total)} من أول مرة`);
  }
  function orderOne(fr, ctx, s) {
    return new Promise(async (resolve) => {
      const body = fr.body; body.innerHTML = '';
      body.dataset.target = s.en;
      const toks = s.en.split(' ');
      let chips = shuffle(toks.map((t, k) => ({ t, k })));
      if (toks.length > 1) { let g = 0; while (chips.map((c) => c.t).join(' ') === s.en && g++ < 5) chips = shuffle(chips); }
      const placed = [];
      const line = h('div', { class: 'ans-line en' });
      const tray = h('div', { class: 'tray en words' });
      const spk = h('button', { class: 'btn spk', onclick: () => Snd.speak(s.en, 'en') }, '🔊');
      let wrong = 0, locked = false;
      const render = () => {
        line.innerHTML = ''; tray.innerHTML = '';
        placed.forEach((c, i) => {
          const b = h('button', { class: 'chip placed' }, c.t);
          b.addEventListener('click', () => { if (locked) return; Snd.sfx('tap'); placed.splice(i, 1); render(); });
          line.append(b);
        });
        chips.filter((c) => !placed.includes(c)).forEach((c) => {
          const b = h('button', { class: 'chip' }, c.t);
          b.addEventListener('click', () => { if (locked) return; Snd.sfx('tap'); placed.push(c); render(); check(); });
          tray.append(b);
        });
      };
      const check = async () => {
        if (placed.length < chips.length) return;
        locked = true;
        if (placed.map((c) => c.t).join(' ') === s.en) {
          line.classList.add('good'); Snd.sfx('ok'); fr.cheer();
          await Snd.speak(s.en, 'en'); await sleep(600);
          resolve(wrong === 0);
        } else {
          wrong++; Snd.sfx('no'); fr.sad(); line.classList.add('shake');
          await sleep(650); line.classList.remove('shake');
          if (wrong >= 2) {
            placed.length = 0; toks.forEach((t, k) => placed.push(chips.find((c) => c.k === k && !placed.includes(c))));
            render(); line.classList.add('good');
            await Snd.speak(s.en, 'en'); await sleep(1000);
            resolve(false);
          } else { placed.length = 0; locked = false; render(); }
        }
      };
      body.append(h('div', { class: 'prompt' }, h('div', { class: 'meaning-ar big' }, s.ar), spk), line, tray);
      render();
    });
  }

  const RUN = { g1: choice, g2: choice, g3: spell, g4: write, g5: order };
  return { META, INSTR, gamesFor, lessonDone, lessonUnlocked, run: (App, ctx, l, g) => RUN[g](App, ctx, l, g), ownWords, ownSents, wordHtml };
})();

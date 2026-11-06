/* الشاشات: الرئيسية، الدرس، البطاقات، لوحة ولي الأمر */
const App = (() => {
  const root = document.getElementById('app');
  let ctx = { dead: false };

  function leave() {
    ctx.dead = true;
    if (ctx.writer) ctx.writer.destroy();
    Snd.stop();
    ctx = { dead: false };
  }
  function show(el) { root.innerHTML = ''; root.append(el); window.scrollTo(0, 0); }

  // ---------- أزرار الصوت (موسيقى) ----------
  function soundBar() {
    const bar = $('#sound');
    const m = Store.data.music;
    const level = m.muted ? 0 : Math.round(m.vol * 5);
    bar.innerHTML = '';
    bar.append(
      h('button', { class: 'sbtn', 'aria-label': 'خفض الموسيقى', onclick: () => { Snd.setVol(Store.data.music.vol - 0.2); soundBar(); } }, '➖'),
      h('button', { class: 'sbtn mid', 'aria-label': 'كتم / تشغيل الموسيقى', onclick: () => { Snd.toggleMute(); soundBar(); } }, m.muted ? '🔇' : '🎵'),
      h('div', { class: 'vol' }, [1, 2, 3, 4, 5].map((i) => h('i', { class: i <= level ? 'on' : '' }))),
      h('button', { class: 'sbtn', 'aria-label': 'ارفع الموسيقى', onclick: () => { Snd.setVol(Store.data.music.vol + 0.2); soundBar(); } }, '➕'));
  }

  // ---------- اختيار الحيوان الأليف ----------
  function petPick() {
    leave();
    const s = h('div', { class: 'screen center' },
      h('div', { class: 'big-title' }, 'اختر حيوانك الأليف'),
      h('div', { class: 'row wrap' }, Pet.types.map((t) => h('button', {
        class: 'btn pet-choice', onclick: () => { Store.data.pet = t.e; Store.save(); Snd.sfx('ok'); home(); },
      }, h('span', { class: 'pe' }, t.e), t.n))));
    show(s);
    Snd.speak('اختر حيوانك الأليف', 'ar');
  }

  // ---------- الرئيسية ----------
  function home() {
    leave();
    if (!Store.data.pet) return petPick();
    const next = Pet.next();
    const lvl = Pet.level();
    let pressTimer = null;
    const title = h('h1', { class: 'title en' }, 'English 4A');
    const startP = () => { pressTimer = setTimeout(parent, 2500); };
    const stopP = () => clearTimeout(pressTimer);
    ['pointerdown'].forEach((e) => title.addEventListener(e, startP));
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((e) => title.addEventListener(e, stopP));

    const s = h('div', { class: 'screen home' },
      h('div', { class: 'hero' },
        h('div', { class: 'hero-pet', html: Pet.html('big') }),
        h('div', { class: 'hero-info' }, title,
          h('div', { class: 'stars-line' }, `⭐ ${arNum(Store.data.stars)}`),
          h('div', { class: 'pet-level' }, `${Pet.names[lvl]}${next ? ' · باقي ' + arNum(next) + ' نجمة ليكبر' : ' · وصل لأعلى مستوى'}`))),
      DATA.units.map((u) => h('section', { class: 'unit' },
        h('h2', {}, h('span', { class: 'en' }, `Unit ${u.no}: ${u.name}`), h('small', {}, ` ${u.ar} · الكتاب ص ${u.pages}`)),
        h('div', { class: 'tiles' }, u.lessons.map((l, i) => lessonTile(l, i))))));
    show(s);
    $('.hero-pet', s).addEventListener('click', () => { Pet.cheer(s); Snd.sfx('ok'); });
  }

  function lessonTile(l, i) {
    const open = Games.lessonUnlocked(l);
    const gs = Games.gamesFor(l);
    const got = gs.reduce((a, g) => a + (Store.gameStars(l.id, g) >= 1 ? 1 : 0), 0);
    const done = Games.lessonDone(l);
    return h('button', {
      class: 'tile-lesson' + (open ? '' : ' locked') + (done ? ' done' : ''),
      'aria-label': l.ar,
      onclick: () => { if (open) lesson(l); else { Snd.sfx('no'); Snd.speak('خلّص الدرس اللي قبله أول', 'ar'); } },
    },
      h('div', { class: 'lt-no' }, arNum(i + 1)),
      h('div', { class: 'lt-icon' }, open ? l.icon : '🔒'),
      h('div', { class: 'lt-name' }, l.ar),
      h('div', { class: 'lt-pages' }, '📖 ' + l.pages),
      h('div', { class: 'lt-prog' }, done ? '✅' : gs.map((g, k) => h('i', { class: k < got ? 'on' : '' }))));
  }

  // ---------- الدرس ----------
  function lesson(l) {
    leave();
    const gs = Games.gamesFor(l);
    const itemsN = Games.ownWords(l).length + Games.ownSents(l).length;
    const s = h('div', { class: 'screen lesson' },
      h('div', { class: 'ltop' },
        h('button', { class: 'btn small back', 'aria-label': 'الرئيسية', onclick: home }, '🏠'),
        h('div', { class: 'ltitle' }, h('div', { class: 'l1' }, `${l.icon} ${l.ar}`), h('div', { class: 'l2' }, `📖 في الكتاب: ${l.pages}`))),
      l.kind === 'phonics' ? h('div', { class: 'groups en' }, l.groups.map((g) => h('span', {}, g))) : null,
      h('button', { class: 'btn huge primary', onclick: () => l.kind === 'review' ? play(l, gs[0]) : cards(l) },
        l.kind === 'review' ? '▶ ابدأ المراجعة' : `🃏 البطاقات (${arNum(itemsN)})`),
      h('div', { class: 'sub' }, 'الألعاب'),
      h('div', { class: 'games' }, gs.map((g) => {
        const st = Store.gameStars(l.id, g);
        return h('button', { class: 'game-btn', onclick: () => play(l, g) },
          h('div', { class: 'gi' }, Games.META[g].icon),
          h('div', { class: 'gn' }, Games.META[g].name),
          h('div', { class: 'gg' }, Games.META[g].goal),
          h('div', { class: 'gs' }, [1, 2, 3].map((i) => h('span', { class: i <= st ? 'on' : 'off' }, '⭐'))));
      })));
    show(s);
  }

  function play(l, g) {
    leave();
    Snd.startMusic();
    Games.run(App, ctx, l, g);
  }

  // ---------- البطاقات ----------
  function cards(l) {
    leave();
    const items = [...l.words.map((w) => ({ k: 'w', w })), ...l.sentences.map((s) => ({ k: 's', s }))];
    if (!items.length) return lesson(l);
    let i = 0;
    const box = h('div', { class: 'card-wrap' });
    const s = h('div', { class: 'screen cards' },
      h('div', { class: 'ltop' },
        h('button', { class: 'btn small back', onclick: () => lesson(l) }, '🏠'),
        h('div', { class: 'ltitle' }, h('div', { class: 'l1' }, `🃏 ${l.ar}`), h('div', { class: 'l2' }, `📖 ${l.pages}`))),
      box);
    show(s);

    function draw() {
      if (ctx.dead) return;
      const it = items[i];
      const last = i === items.length - 1;
      box.innerHTML = '';
      let card;
      if (it.k === 'w') {
        Store.seen(it.w.id);
        card = h('div', { class: 'card' },
          h('div', { class: 'pic big', html: it.w.pic ? Pic.html(it.w.pic) : `<span class="txt small">${it.w.tricky ? '✨' : ''}</span>` }),
          h('div', { class: 'bigword en', html: Games.wordHtml(it.w) }),
          it.w.tricky ? h('div', { class: 'tag' }, 'كلمة صعبة، احفظها') : null,
          h('div', { class: 'ar-meaning' }, it.w.ar),
          h('button', { class: 'btn spk', 'aria-label': 'اسمع', onclick: () => Snd.speak(it.w.en, 'en') }, '🔊'));
        Snd.speak(it.w.en, 'en');
      } else {
        card = h('div', { class: 'card sent' },
          h('div', { class: 'pic big' }, h('span', { class: 'emo' }, '💬')),
          h('div', { class: 'sentence en' }, it.s.en),
          h('div', { class: 'ar-meaning' }, it.s.ar),
          h('button', { class: 'btn spk', 'aria-label': 'اسمع', onclick: () => Snd.speak(it.s.en, 'en') }, '🔊'));
        Snd.speak(it.s.en, 'en');
        Store.seen(it.s.id);
      }
      box.append(card,
        h('div', { class: 'counter' }, `${arNum(i + 1)} / ${arNum(items.length)}`),
        h('div', { class: 'row nav' },
          h('button', { class: 'btn big', disabled: i === 0 ? 'disabled' : null, onclick: () => { if (i > 0) { i--; draw(); } } }, '▶ السابق'),
          last
            ? h('button', { class: 'btn big primary', onclick: () => lesson(l) }, '🎮 للألعاب')
            : h('button', { class: 'btn big primary', onclick: () => { i++; draw(); } }, 'التالي ◀')));
    }
    draw();
  }

  // ---------- لوحة ولي الأمر (ضغطة طويلة على العنوان) ----------
  function parent() {
    Snd.refreshVoices();
    const weak = Store.weakest(10).map(([id, r]) => {
      const w = DATA.wordsById[id] || DATA.sentencesById[id];
      return h('li', {}, h('span', { class: 'en' }, w ? w.en : id), ` — أخطأ ${arNum(r.wrong)} مرة`);
    });
    let sure = false;
    const s = h('div', { class: 'screen parent' },
      h('h2', {}, '👨‍👦 لوحة ولي الأمر'),
      h('div', { class: 'pbox' },
        h('div', {}, `🔊 الصوت الإنجليزي: ${Snd.hasEn ? '✅ ' + Snd.enName : '❌ غير موجود'}`),
        h('div', {}, `🗣️ الصوت العربي: ${Snd.hasAr ? '✅ ' + Snd.arName : '❌ غير موجود (التعليمات تظهر مكتوبة فقط)'}`),
        h('div', { class: 'row wrap' },
          h('button', { class: 'btn', onclick: () => Snd.speak('Hello! Welcome to the school.', 'en') }, 'جرّب الإنجليزي'),
          h('button', { class: 'btn', onclick: () => Snd.speak('أحسنت! اسمع الكلمة ثم اضغط على الصورة الصحيحة.', 'ar') }, 'جرّب العربي'))),
      h('div', { class: 'pbox' },
        h('div', {}, 'الكلمات اللي يغلط فيها أكثر:'),
        weak.length ? h('ol', {}, weak) : h('div', { class: 'muted' }, 'ما فيه أخطاء مسجّلة بعد.')),
      h('div', { class: 'row wrap' },
        h('button', { class: 'btn', onclick: () => { Store.setUnlockAll(!Store.data.unlockAll); parent(); } }, Store.data.unlockAll ? '🔒 رجّع ترتيب الدروس' : '🔓 افتح كل الدروس للتجربة'),
        h('button', { class: 'btn danger', onclick: (e) => { if (!sure) { sure = true; e.target.textContent = 'اضغط مرة ثانية للتأكيد'; } else { Store.reset(); home(); } } }, '🗑️ مسح كل التقدم')),
      h('button', { class: 'btn big primary', onclick: home }, 'رجوع'));
    show(s);
  }

  return { show, home, lesson, play, cards, parent, soundBar, get ctx() { return ctx; } };
})();

document.addEventListener('pointerdown', () => Snd.startMusic(), { once: true });
App.soundBar();
App.home();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

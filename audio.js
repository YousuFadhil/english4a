/* الصوت: نطق الكلمات والتعليمات (من أصوات الجهاز، بدون نت) + موسيقى خفيفة مولّدة + مؤثرات */
const Snd = (() => {
  const synth = window.speechSynthesis;
  let voices = [], en = null, ar = null;

  function pick() {
    if (!synth) return;
    voices = synth.getVoices() || [];
    const lang = (v) => (v.lang || '').toLowerCase().replace('_', '-');
    const best = (prefix, prefs) => {
      const list = voices.filter((v) => lang(v).startsWith(prefix));
      // نفضّل الأصوات المحلية (تشتغل بدون نت)
      const local = list.filter((v) => v.localService);
      const pool = local.length ? local : list;
      for (const p of prefs) { const f = pool.find((v) => lang(v) === p); if (f) return f; }
      return pool[0] || null;
    };
    en = best('en', ['en-gb', 'en-us']);
    ar = best('ar', ['ar-om', 'ar-sa', 'ar-ae', 'ar-eg']);
  }
  if (synth) { pick(); synth.onvoiceschanged = pick; }

  let speaking = 0;
  function speak(text, l = 'en', opt = {}) {
    return new Promise((resolve) => {
      if (!synth) return resolve(false);
      const v = l === 'ar' ? ar : en;
      if (!v) return resolve(false); // لا صوت مناسب: نكمل بدون نطق
      try {
        if (!opt.queue) synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.voice = v; u.lang = v.lang;
        u.rate = opt.rate || (l === 'ar' ? 0.95 : 0.8);
        u.pitch = 1;
        u.volume = 1;
        let done = false;
        const fin = (ok) => { if (done) return; done = true; speaking--; duck(speaking > 0); resolve(ok); };
        u.onend = () => fin(true);
        u.onerror = () => fin(false);
        speaking++; duck(true);
        synth.speak(u);
        setTimeout(() => fin(false), 2500 + text.length * 220); // أمان
      } catch (e) { resolve(false); }
    });
  }
  const stop = () => { try { synth && synth.cancel(); } catch (e) {} };

  // ---------- موسيقى مولّدة ----------
  let ctx = null, master = null, musicGain = null, sfxGain = null, timer = null, step = 0, started = false;
  const vol = () => (Store.data.music.muted ? 0 : Store.data.music.vol);

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.connect(master);
    applyVol();
  }
  function applyVol() {
    if (!ctx) return;
    const v = vol();
    musicGain.gain.setTargetAtTime(v * 0.16, ctx.currentTime, 0.05);
    sfxGain.gain.setTargetAtTime(Store.data.music.muted ? 0 : Math.max(0.25, v) * 0.5, ctx.currentTime, 0.05);
  }
  function duck(on) {
    if (!ctx) return;
    musicGain.gain.setTargetAtTime(vol() * (on ? 0.05 : 0.16), ctx.currentTime, 0.1);
  }
  function tone(freq, t, dur, type, gainNode, peak) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(gainNode);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // سلّم خماسي هادئ: كل ثانية نغمة تقريباً
  const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
  const PATTERN = [0, 2, 4, 2, 3, 1, 2, 0, 4, 3, 2, 1, 0, 2, 3, 5];
  function tick() {
    if (!ctx || vol() === 0) return;
    const t = ctx.currentTime + 0.05;
    const n = PATTERN[step % PATTERN.length];
    tone(SCALE[n], t, 1.6, 'sine', musicGain, 0.8);
    if (step % 4 === 0) tone(SCALE[0] / 2, t, 3.0, 'triangle', musicGain, 0.5);
    step++;
  }
  function startMusic() {
    ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (started) return;
    started = true;
    timer = setInterval(tick, 900);
  }
  function setVol(v) { Store.data.music.vol = Math.max(0, Math.min(1, v)); Store.data.music.muted = false; Store.save(); startMusic(); applyVol(); }
  function toggleMute() { Store.data.music.muted = !Store.data.music.muted; Store.save(); startMusic(); applyVol(); }

  // ---------- مؤثرات ----------
  function sfx(kind) {
    ensure();
    if (!ctx || Store.data.music.muted) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime + 0.01;
    if (kind === 'ok') { tone(659.25, t, 0.25, 'sine', sfxGain, 0.6); tone(880, t + 0.12, 0.35, 'sine', sfxGain, 0.6); }
    else if (kind === 'no') { tone(220, t, 0.3, 'sine', sfxGain, 0.4); }
    else if (kind === 'tap') { tone(520, t, 0.08, 'sine', sfxGain, 0.3); }
    else if (kind === 'star') { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.12, 0.4, 'triangle', sfxGain, 0.5)); }
  }

  return {
    speak, stop, startMusic, setVol, toggleMute, sfx, applyVol,
    get hasEn() { return !!en; }, get hasAr() { return !!ar; },
    get enName() { return en ? `${en.name} (${en.lang})${en.localService ? '' : ' - يحتاج نت'}` : ''; },
    get arName() { return ar ? `${ar.name} (${ar.lang})${ar.localService ? '' : ' - يحتاج نت'}` : ''; },
    refreshVoices: pick,
    get enLocal() { return !!(en && en.localService); },
    get arLocal() { return !!(ar && ar.localService); },
  };
})();

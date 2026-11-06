/* التقدم والمراجعة المتباعدة — كل شيء يُحفظ على هذا الجهاز فقط (localStorage) ولا يُرسل لأي مكان */
const Store = (() => {
  const KEY = 'efk4a.v1';
  const HOURS = [0, 4, 24, 72, 168, 336]; // الفاصل بعد كل صندوق
  const def = () => ({ words: {}, lessons: {}, stars: 0, pet: null, music: { vol: 0.5, muted: false }, unlockAll: false });
  let s = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(def(), JSON.parse(raw)) : def();
    } catch (e) { return def(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  const now = () => Date.now();
  function rec(id) { return s.words[id]; }

  // تسجيل نتيجة إجابة (كلمة أو جملة)
  function answer(id, correct) {
    const r = s.words[id] || { box: 0, due: now(), wrong: 0, right: 0 };
    if (correct) {
      r.box = Math.min(5, r.box + 1);
      r.right++;
      r.due = now() + HOURS[r.box] * 3600000;
    } else {
      r.box = 0;
      r.wrong++;
      r.due = now();
    }
    s.words[id] = r;
    save();
  }
  // رأى البطاقة فقط
  function seen(id) {
    if (!s.words[id]) { s.words[id] = { box: 0, due: now(), wrong: 0, right: 0 }; save(); }
  }
  // أولوية الظهور: الغلط والمستحق والجديد أولاً
  function priority(id) {
    const r = s.words[id];
    if (!r) return 6;
    return (r.due <= now() ? 5 : 0) + Math.min(6, r.wrong * 1.5) + (5 - r.box) * 0.6;
  }

  // دروس
  function lessonState(id) { return s.lessons[id] || (s.lessons[id] = { games: {} }); }
  function gameStars(lessonId, g) { return (s.lessons[lessonId] && s.lessons[lessonId].games[g]) || 0; }
  function setGameStars(lessonId, g, stars) {
    const L = lessonState(lessonId);
    const old = L.games[g] || 0;
    L.games[g] = Math.max(old, stars);
    s.stars += Math.max(0, stars); // كل جولة تضيف نجومها للحيوان الأليف
    save();
  }

  return {
    get data() { return s; }, save, answer, seen, priority, rec, gameStars, setGameStars,
    reset() { s = def(); save(); },
    setUnlockAll(v) { s.unlockAll = v; save(); },
    weakest(n) {
      return Object.entries(s.words).filter(([, r]) => r.wrong > 0)
        .sort((a, b) => b[1].wrong - a[1].wrong).slice(0, n);
    },
  };
})();

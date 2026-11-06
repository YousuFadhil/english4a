/* يخزّن ملفات التطبيق على الجهاز ليشتغل بدون نت. لا يتصل إلا بملفات نفس المجلد. */
const CACHE = 'english-4a-v1';
const FILES = ['./', 'index.html', 'styles.css', 'data.js', 'pics.js', 'store.js', 'audio.js', 'strokes.js', 'ui.js', 'games.js', 'app.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // لا نمرّر أي طلب خارجي
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});

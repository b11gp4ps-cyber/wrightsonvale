// Wrightson & Vale — сервис-воркер веб-приложения.
// Сначала сеть (сайт всегда свежий), при отсутствии связи — сохранённая копия.
const CACHE = "wv-v1";
const CORE = ["/", "/index.html", "/styles.css", "/fonts.css", "/site.js", "/assets/icon-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // формы, Метрика и чужие сайты — напрямую
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then(
          (hit) => hit || (req.mode === "navigate" ? caches.match("/") : Response.error())
        )
      )
  );
});

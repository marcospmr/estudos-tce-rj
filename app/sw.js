// Gerado por scripts/gerar_sw.py. Não edite à mão.
const VERSAO = '90f94a3edbe9';
const CACHE = 'estudos-tce-rj-' + VERSAO;
const ARQUIVOS = [
  "./",
  "./css/app.css",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./js/backup.js",
  "./js/data/curriculum.js",
  "./js/data/material.js",
  "./js/data/questoes-basicas.js",
  "./js/data/questoes-ti.js",
  "./js/data/seed-helpers.js",
  "./js/data/seed.js",
  "./js/db.js",
  "./js/domain/dates.js",
  "./js/domain/importer.js",
  "./js/domain/review.js",
  "./js/domain/scheduler.js",
  "./js/domain/scoring.js",
  "./js/domain/stats.js",
  "./js/main.js",
  "./js/pages/ajustes.js",
  "./js/pages/cronograma.js",
  "./js/pages/desempenho.js",
  "./js/pages/editor.js",
  "./js/pages/hoje.js",
  "./js/pages/mais.js",
  "./js/pages/material.js",
  "./js/pages/questoes.js",
  "./js/pages/revisao.js",
  "./js/pages/simulados.js",
  "./js/pratica.js",
  "./js/questao-view.js",
  "./js/state.js",
  "./js/ui.js",
  "./manifest.webmanifest"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('estudos-tce-rj-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

// Cache primeiro (funciona offline); se não estiver no cache, busca na rede.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req).catch(() => caches.match('./index.html'))),
  );
});

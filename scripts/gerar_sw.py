#!/usr/bin/env python3
"""Gera app/sw.js com a lista de todos os arquivos do app e uma versão baseada no conteúdo.

Rode sempre que alterar arquivos do app (o empacotamento já faz isso). A versão muda quando
qualquer arquivo muda, o que dispara o aviso "Nova versão disponível" no celular.
"""
import hashlib
import json
from pathlib import Path

APP = Path(__file__).resolve().parent.parent / "app"
IGNORAR = {"sw.js"}

arquivos = sorted(
    p.relative_to(APP).as_posix()
    for p in APP.rglob("*")
    if p.is_file() and p.name not in IGNORAR and not p.name.startswith(".")
)
h = hashlib.sha256()
for a in arquivos:
    h.update(a.encode())
    h.update((APP / a).read_bytes())
versao = h.hexdigest()[:12]

lista = json.dumps(["./"] + ["./" + a for a in arquivos], indent=2)

sw = f"""// Gerado por scripts/gerar_sw.py. Não edite à mão.
const VERSAO = '{versao}';
const CACHE = 'estudos-tce-rj-' + VERSAO;
const ARQUIVOS = {lista};

self.addEventListener('install', (e) => {{
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
}});

self.addEventListener('activate', (e) => {{
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('estudos-tce-rj-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
}});

self.addEventListener('message', (e) => {{
  if (e.data === 'skipWaiting') self.skipWaiting();
}});

// Cache primeiro (funciona offline); se não estiver no cache, busca na rede.
self.addEventListener('fetch', (e) => {{
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, {{ ignoreSearch: true }}).then((r) => r || fetch(req).catch(() => caches.match('./index.html'))),
  );
}});
"""
(APP / "sw.js").write_text(sw, encoding="utf-8")
print(f"sw.js gerado: versão {versao}, {len(arquivos)} arquivos")

// Acesso ao IndexedDB (design.md, B3 e B7).
import { QUESTOES_SEED, SEED_VERSION } from './data/seed.js';
import { TOPICOS, INICIO_PADRAO } from './data/curriculum.js';
import { SEMANA_PADRAO, gerarCronograma } from './domain/scheduler.js';

const NOME = 'estudos-tce-rj';
const VERSAO = 1;
export const SCHEMA_VERSION = 1;
export const STORES = ['questoes', 'tentativas', 'revisao', 'sessoes', 'simulados', 'config'];

let dbPromise = null;

function abrir() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(NOME, VERSAO);
    req.onupgradeneeded = () => {
      const db = req.result;
      const q = db.createObjectStore('questoes', { keyPath: 'id' });
      q.createIndex('topicoId', 'topicoId');
      const t = db.createObjectStore('tentativas', { keyPath: 'id' });
      t.createIndex('questaoId', 'questaoId');
      t.createIndex('data', 'data');
      const r = db.createObjectStore('revisao', { keyPath: 'questaoId' });
      r.createIndex('vencimento', 'vencimento');
      const s = db.createObjectStore('sessoes', { keyPath: 'id' });
      s.createIndex('data', 'data');
      db.createObjectStore('simulados', { keyPath: 'id' });
      db.createObjectStore('config', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function prom(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(stores, modo, fn) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const t = db.transaction(stores, modo);
    let resultado;
    Promise.resolve(fn(t)).then((r) => (resultado = r), reject);
    t.oncomplete = () => resolve(resultado);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const getAll = (store) => tx([store], 'readonly', (t) => prom(t.objectStore(store).getAll()));
export const get = (store, key) => tx([store], 'readonly', (t) => prom(t.objectStore(store).get(key)));
export const put = (store, obj) => tx([store], 'readwrite', (t) => prom(t.objectStore(store).put(obj)));
export const del = (store, key) => tx([store], 'readwrite', (t) => prom(t.objectStore(store).delete(key)));

/**
 * Lê e grava na mesma transação (atômico): evita que duas edições rápidas se sobrescrevam.
 * @param {(atual:any)=>any} fn recebe o registro atual e devolve o novo (ou undefined para não gravar)
 */
export function update(store, key, fn) {
  return tx([store], 'readwrite', async (t) => {
    const os = t.objectStore(store);
    const atual = await prom(os.get(key));
    const novo = fn(atual);
    if (novo !== undefined) await prom(os.put(novo));
    return novo;
  });
}

export function putMany(store, objs) {
  return tx([store], 'readwrite', (t) => {
    const os = t.objectStore(store);
    for (const o of objs) os.put(o);
  });
}

export function delMany(store, keys) {
  return tx([store], 'readwrite', (t) => {
    const os = t.objectStore(store);
    for (const k of keys) os.delete(k);
  });
}

/** Substitui todo o conteúdo das stores (usado na importação de backup). */
export function substituirTudo(dados) {
  return tx(STORES, 'readwrite', (t) => {
    for (const s of STORES) {
      const os = t.objectStore(s);
      os.clear();
      for (const o of dados[s] ?? []) os.put(o);
    }
  });
}

// ── Configuração ──
export async function getConfig() {
  return (await get('config', 'main')) ?? null;
}

export async function saveConfig(cfg) {
  await put('config', { ...cfg, key: 'main' });
  return cfg;
}

export function novoId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
}

/**
 * Primeira execução e atualização do banco inicial.
 */
export async function inicializar() {
  let cfg = await getConfig();
  if (!cfg) {
    cfg = {
      inicioPlano: INICIO_PADRAO,
      semanaModelo: SEMANA_PADRAO,
      topicosInativos: [],
      disciplinasInativas: [],
      banca: '',
      dataProva: '',
      ultimoBackup: '',
      seedVersion: 0,
      schemaVersion: SCHEMA_VERSION,
      criadoEm: new Date().toISOString(),
    };
    const { sessoes } = gerarCronograma({
      inicio: cfg.inicioPlano,
      template: cfg.semanaModelo,
      topicos: TOPICOS,
      desde: cfg.inicioPlano,
    });
    await putMany('sessoes', sessoes);
  }
  if ((cfg.seedVersion ?? 0) < SEED_VERSION) {
    const existentes = new Map((await getAll('questoes')).map((q) => [q.id, q]));
    const agora = new Date().toISOString();
    const atualizar = QUESTOES_SEED.filter((q) => !existentes.get(q.id)?.editada).map((q) => ({
      ...q,
      criadaEm: existentes.get(q.id)?.criadaEm ?? agora,
    }));
    await putMany('questoes', atualizar);
    cfg.seedVersion = SEED_VERSION;
  }
  await saveConfig(cfg);

  if (navigator.storage?.persist) {
    try {
      await navigator.storage.persist();
    } catch {
      /* navegador recusou; o lembrete de backup cobre esse caso */
    }
  }
  return cfg;
}

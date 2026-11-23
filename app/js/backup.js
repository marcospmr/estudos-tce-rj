import { anexar } from './ui.js';
// Exportação e importação de backup (Req. 7.5; design.md, B7).
import * as db from './db.js';
import { estado, salvarConfig } from './state.js';
import { today } from './domain/dates.js';

export const APP_ID = 'estudos-tce-rj';

export async function exportarDados() {
  const dados = {};
  for (const s of db.STORES) dados[s] = await db.getAll(s);
  return { app: APP_ID, schemaVersion: db.SCHEMA_VERSION, exportadoEm: new Date().toISOString(), dados };
}

/** @returns {string|null} mensagem de erro */
export function validarBackup(obj) {
  if (!obj || typeof obj !== 'object') return 'arquivo inválido';
  if (obj.app !== APP_ID) return 'o arquivo não é um backup deste app';
  if (typeof obj.schemaVersion !== 'number') return 'versão do backup ausente';
  if (obj.schemaVersion > db.SCHEMA_VERSION) return 'backup criado por uma versão mais nova do app; atualize o app primeiro';
  if (!obj.dados || typeof obj.dados !== 'object') return 'dados ausentes';
  for (const s of db.STORES) if (obj.dados[s] !== undefined && !Array.isArray(obj.dados[s])) return `parte "${s}" inválida`;
  if (!obj.dados.config?.some?.((c) => c.key === 'main')) return 'configuração ausente';
  return null;
}

/** Migrações de versões antigas do esquema (nenhuma ainda: versão 1). */
function migrar(obj) {
  return obj;
}

/**
 * Salva o backup: compartilha (celular) ou baixa o arquivo.
 * @returns {Promise<boolean>} true se o arquivo foi entregue
 */
export async function salvarBackup() {
  const obj = await exportarDados();
  const texto = JSON.stringify(obj);
  const nome = `tce-rj-backup-${today()}.json`;
  const arquivo = new File([texto], nome, { type: 'application/json' });
  let ok = false;
  if (navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], title: 'Backup Estudos TCE-RJ' });
      ok = true;
    } catch (e) {
      if (e?.name === 'AbortError') return false;
    }
  }
  if (!ok) {
    const url = URL.createObjectURL(arquivo);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    anexar(document.body, a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    ok = true;
  }
  await salvarConfig({ ultimoBackup: new Date().toISOString() });
  return ok;
}

/**
 * Importa um backup, substituindo os dados atuais. Antes, salva um backup dos dados atuais.
 * @param {File} arquivo
 * @returns {Promise<string|null>} erro ou null
 */
export async function restaurarBackup(arquivo) {
  let obj;
  try {
    obj = JSON.parse(await arquivo.text());
  } catch {
    return 'o arquivo não é um JSON válido';
  }
  const erro = validarBackup(obj);
  if (erro) return erro;
  obj = migrar(obj);
  const salvo = await salvarBackup();
  if (!salvo && !confirm('Não foi salvo um backup dos dados atuais. Substituir mesmo assim?')) return 'importação cancelada';
  await db.substituirTudo(obj.dados);
  estado.cfg = await db.getConfig();
  return null;
}

// Estado compartilhado entre as telas e operações que combinam domínio e armazenamento.
import * as db from './db.js';
import { DISCIPLINAS, TOPICOS } from './data/curriculum.js';
import { recalcular, calendarioComProva, infoSemana } from './domain/scheduler.js';
import { registrarResposta } from './domain/review.js';
import { corrigir } from './domain/scoring.js';
import { today, diffDays, mondayOf } from './domain/dates.js';

export const topicoPorId = new Map(TOPICOS.map((t) => [t.id, t]));
export const disciplinaPorId = new Map(DISCIPLINAS.map((d) => [d.id, d]));

export const estado = {
  /** @type {any} */ cfg: null,
};

export async function carregar() {
  estado.cfg = await db.inicializar();
  return estado.cfg;
}

export async function salvarConfig(parcial) {
  estado.cfg = { ...estado.cfg, ...parcial };
  await db.saveConfig(estado.cfg);
  return estado.cfg;
}

export function topicosAtivos(cfg = estado.cfg) {
  const ti = new Set(cfg.topicosInativos ?? []);
  const di = new Set(cfg.disciplinasInativas ?? []);
  return TOPICOS.filter((t) => !ti.has(t.id) && !di.has(t.disciplinaId));
}

export function disciplinaDoTopico(topicoId) {
  return topicoPorId.get(topicoId)?.disciplinaId ?? 'outros';
}

export function nomeTopico(id) {
  return topicoPorId.get(id)?.nome ?? id;
}

export function nomeDisciplina(id) {
  return disciplinaPorId.get(id)?.nome ?? id;
}

/** Índice da semana (0 = primeira) para uma data. */
export function semanaDe(data, cfg = estado.cfg) {
  return Math.floor(diffDays(mondayOf(cfg.inicioPlano), data) / 7);
}

/** Fase, mês e semana de uma data, pelo calendário atual. */
export function infoData(data, cfg = estado.cfg) {
  const semana = Math.max(0, semanaDe(data, cfg));
  const cal = calendarioComProva(cfg.inicioPlano, cfg.dataProva || undefined, semanaDe(today(), cfg));
  return { semana, ...infoSemana(semana, cal), totalSemanas: cal.totalSemanas };
}

/** Recalcula o cronograma futuro (Req. 1.5, 1.6, 8.3, 8.5). */
export async function recalcularCronograma() {
  const cfg = estado.cfg;
  const sessoesAtuais = await db.getAll('sessoes');
  const r = recalcular({
    sessoesAtuais,
    hoje: today(),
    inicio: cfg.inicioPlano,
    template: cfg.semanaModelo,
    topicos: topicosAtivos(cfg),
    dataProva: cfg.dataProva || undefined,
  });
  const manterIds = new Set(r.manter.map((s) => s.id));
  await db.delMany('sessoes', sessoesAtuais.filter((s) => !manterIds.has(s.id)).map((s) => s.id));
  await db.putMany('sessoes', r.novas);
  await salvarConfig({ atrasados: r.atrasados, foraDoPlano: r.foraDoPlano });
  return r;
}

/** Registra uma tentativa e atualiza o caderno de erros (Req. 2.4, 2.5, 3). */
export async function registrarTentativa(q, resposta, tempoMs, modo, simuladoId) {
  const correta = corrigir(q, resposta);
  const agora = new Date();
  await db.put('tentativas', {
    id: db.novoId(),
    questaoId: q.id,
    data: agora.toISOString(),
    dia: today(agora),
    resposta,
    correta,
    tempoMs,
    modo,
    simuladoId,
  });
  const atual = await db.get('revisao', q.id);
  const novo = registrarResposta(atual, q.id, correta, modo, today(agora));
  if (novo && novo !== atual) await db.put('revisao', novo);
  return { correta, item: novo };
}

/** Questões elegíveis (tópicos ativos). */
export async function questoesAtivas() {
  const ativos = new Set(topicosAtivos().map((t) => t.id));
  return (await db.getAll('questoes')).filter((q) => ativos.has(q.topicoId));
}

/** Formato preferido pela banca (Req. 8.4). */
export function formatoPreferido(cfg = estado.cfg) {
  if (!cfg.banca) return '';
  return cfg.banca === 'Cebraspe' ? 'CE' : 'ME';
}

export function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Estatísticas de desempenho (Req. 5).
import { addDays, mondayOf } from './dates.js';

export const META_ACERTO = { 1: 0.6, 2: 0.7, 3: 0.8 };
export const META_QUESTOES_DIA = { 1: 15, 2: 25, 3: 40 };
export const MIN_TENTATIVAS_META = 5;

/**
 * Percentual de acerto agrupado.
 * @param {{questaoId:string, correta:boolean}[]} tentativas
 * @param {(questaoId:string)=>string|undefined} chave
 * @returns {Map<string, {total:number, acertos:number, pct:number}>}
 */
export function acertoPor(tentativas, chave) {
  const m = new Map();
  for (const t of tentativas) {
    const k = chave(t.questaoId);
    if (!k) continue;
    const r = m.get(k) ?? { total: 0, acertos: 0, pct: 0 };
    r.total++;
    if (t.correta) r.acertos++;
    m.set(k, r);
  }
  for (const r of m.values()) r.pct = r.total ? r.acertos / r.total : 0;
  return m;
}

/** Disciplinas/tópicos abaixo da meta da fase, com o mínimo de tentativas. */
export function abaixoDaMeta(mapa, fase) {
  const meta = META_ACERTO[fase] ?? META_ACERTO[3];
  return [...mapa.entries()].filter(([, r]) => r.total >= MIN_TENTATIVAS_META && r.pct < meta).map(([k]) => k);
}

/** Minutos realizados na semana (segunda a domingo) que contém `dia`. */
export function minutosSemana(sessoes, dia) {
  const seg = mondayOf(dia);
  const dom = addDays(seg, 6);
  return sessoes
    .filter((s) => s.concluidaEm && s.data >= seg && s.data <= dom)
    .reduce((a, s) => a + (s.minutosRealizados ?? s.minutosPlanejados), 0);
}

/** Quantidade de tentativas por dia (AAAA-MM-DD) nos últimos `n` dias até `hoje`. */
export function questoesPorDia(tentativas, hoje, n) {
  const dias = [];
  for (let i = n - 1; i >= 0; i--) dias.push(addDays(hoje, -i));
  const cont = new Map(dias.map((d) => [d, 0]));
  for (const t of tentativas) {
    const d = t.dia ?? t.data.slice(0, 10); // `dia` é a data local da resposta
    if (cont.has(d)) cont.set(d, cont.get(d) + 1);
  }
  return dias.map((d) => ({ dia: d, total: cont.get(d) }));
}

/**
 * Tópico com pior % entre os estudados, com pelo menos `min` tentativas (bloco de recuperação).
 * @returns {string|null}
 */
export function piorTopico(tentativas, topicoDe, estudados, min = MIN_TENTATIVAS_META) {
  const m = acertoPor(tentativas, topicoDe);
  let pior = null;
  let pctPior = 2;
  for (const id of estudados) {
    const r = m.get(id);
    if (!r || r.total < min) continue;
    if (r.pct < pctPior) {
      pior = id;
      pctPior = r.pct;
    }
  }
  return pior;
}

/** Status de cada questão pela última tentativa: 'nova' | 'errada' | 'acertada'. */
export function statusQuestoes(tentativas) {
  const ultima = new Map();
  for (const t of tentativas) {
    const u = ultima.get(t.questaoId);
    if (!u || t.data > u.data) ultima.set(t.questaoId, t);
  }
  return (questaoId) => {
    const u = ultima.get(questaoId);
    return !u ? 'nova' : u.correta ? 'acertada' : 'errada';
  };
}

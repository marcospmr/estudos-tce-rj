// Revisão espaçada em três caixas: 1, 7 e 30 dias (design.md, B5.3).
import { addDays } from './dates.js';

export const INTERVALOS = { 1: 1, 2: 7, 3: 30 };

/**
 * @typedef {{questaoId:string, caixa:1|2|3, vencimento:string, dominada:boolean,
 *   tipoErro?:'nao-sabia'|'desatencao'|'chute', anotacao?:string, atualizadoEm?:string}} ItemRevisao
 */

/**
 * Atualiza o item de revisão após uma resposta.
 * @param {ItemRevisao|undefined|null} item estado atual (ou nada, se a questão não está no caderno)
 * @param {string} questaoId
 * @param {boolean} correta
 * @param {'treino'|'revisao'|'simulado'} modo
 * @param {string} hoje AAAA-MM-DD
 * @returns {ItemRevisao|null} novo estado (null = continua fora do caderno)
 */
export function registrarResposta(item, questaoId, correta, modo, hoje) {
  if (!correta) {
    return {
      ...(item ?? {}),
      questaoId,
      caixa: 1,
      vencimento: addDays(hoje, INTERVALOS[1]),
      dominada: false,
      atualizadoEm: hoje,
    };
  }
  if (!item) return null;
  if (modo !== 'revisao' || item.dominada) return item;
  if (item.caixa === 3) return { ...item, dominada: true, atualizadoEm: hoje };
  const caixa = /** @type {1|2|3} */ (item.caixa + 1);
  return { ...item, caixa, vencimento: addDays(hoje, INTERVALOS[caixa]), atualizadoEm: hoje };
}

/** Itens vencidos até hoje (inclusive), ainda não dominados. */
export function vencidos(itens, hoje) {
  return itens.filter((i) => !i.dominada && i.vencimento <= hoje).sort((a, b) => a.vencimento.localeCompare(b.vencimento));
}

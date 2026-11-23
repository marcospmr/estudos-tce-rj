// Correção de questões e notas de simulado (design.md, B5.4).

/**
 * @typedef {{id:string, topicoId:string, formato:'ME'|'CE', gabarito:number|boolean}} QuestaoMin
 */

/** @param {QuestaoMin} q @param {number|boolean|null|undefined} resposta */
export function corrigir(q, resposta) {
  if (resposta === null || resposta === undefined) return false;
  return resposta === q.gabarito;
}

function vazio() {
  return { total: 0, certas: 0, erradas: 0, branco: 0, bruto: 0, liquido: 0 };
}

function fechar(r) {
  r.bruto = r.total ? r.certas / r.total : 0;
  r.liquido = r.total ? (r.certas - r.erradas) / r.total : 0;
  return r;
}

function somar(r, q, resp) {
  r.total++;
  if (resp === null || resp === undefined) r.branco++;
  else if (corrigir(q, resp)) r.certas++;
  else r.erradas++;
}

/**
 * Nota de um conjunto de respostas.
 * Certo/errado: bruto = certas/total; líquido = (certas − erradas)/total. Em branco vale 0.
 * Múltipla escolha: bruto = acertos/total (o líquido é informado mas não é usado na tela).
 * @param {QuestaoMin[]} questoes
 * @param {Record<string, number|boolean|null>} respostas
 * @param {(topicoId:string)=>string} disciplinaDe
 */
export function pontuar(questoes, respostas, disciplinaDe = () => '') {
  const geral = vazio();
  const porFormato = { ME: vazio(), CE: vazio() };
  /** @type {Record<string, ReturnType<typeof vazio>>} */
  const porDisciplina = {};
  for (const q of questoes) {
    const resp = respostas[q.id];
    somar(geral, q, resp);
    somar(porFormato[q.formato], q, resp);
    const d = disciplinaDe(q.topicoId);
    porDisciplina[d] ??= vazio();
    somar(porDisciplina[d], q, resp);
  }
  fechar(geral);
  fechar(porFormato.ME);
  fechar(porFormato.CE);
  Object.values(porDisciplina).forEach(fechar);
  return { geral, porFormato, porDisciplina };
}

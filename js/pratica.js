// Sequência de questões com correção imediata (treino e revisão).
import { h, limpar, botao, pct, anexar } from './ui.js';
import * as db from './db.js';
import { questaoTreino } from './questao-view.js';
import { formularioQuestao } from './pages/editor.js';

/**
 * @param {HTMLElement} root
 * @param {any[]} questoes
 * @param {'treino'|'revisao'} modo
 * @param {()=>void} aoSair
 */
export function iniciarPratica(root, questoes, modo, aoSair) {
  let idx = 0;
  let acertos = 0;
  let respondidas = 0;

  function mostrar() {
    limpar(root);
    if (idx >= questoes.length) return resumo();
    const q = questoes[idx];
    const progresso = h('div', { class: 'progresso-pratica' },
      h('span', {}, `Questão ${idx + 1} de ${questoes.length}`),
      botao('Encerrar', resumo, 'btn-link'));
    const view = questaoTreino({
      q,
      modo,
      rotuloProxima: idx + 1 < questoes.length ? 'Próxima' : 'Ver resultado',
      onProxima: () => {
        idx++;
        mostrar();
        window.scrollTo({ top: 0 });
      },
      onEditar: () => {
        limpar(root);
        anexar(root, formularioQuestao(q, async () => {
          questoes[idx] = (await db.get('questoes', q.id)) ?? q;
          idx++;
          mostrar();
        }));
      },
      onResultado: (correta) => {
        respondidas++;
        if (correta) acertos++;
      },
    });
    anexar(root, progresso, view);
  }

  function resumo() {
    limpar(root);
    anexar(root, h('section', { class: 'card centro' },
      h('h2', {}, modo === 'revisao' ? 'Revisão concluída' : 'Fim da sequência'),
      respondidas
        ? h('p', { class: 'grande' }, `${acertos} de ${respondidas} (${pct(acertos / respondidas)})`)
        : h('p', {}, 'Nenhuma questão respondida.'),
      respondidas - acertos > 0 ? h('p', { class: 'pequeno' }, 'As questões erradas entraram no caderno de erros e voltam amanhã.') : null,
      botao('Voltar', aoSair, 'btn-primario')));
  }

  mostrar();
}

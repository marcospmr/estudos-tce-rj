// Cadastro, edição e exclusão de questões (Req. 6.5).
import { h, limpar, botao, campo, toast, anexar } from '../ui.js';
import * as db from '../db.js';
import { DISCIPLINAS, TOPICOS } from '../data/curriculum.js';
import { validarRegistro } from '../domain/importer.js';
import { topicoPorId } from '../state.js';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/**
 * @param {any|null} q questão existente (ou null para nova)
 * @param {()=>void} aoTerminar
 */
export function formularioQuestao(q, aoTerminar) {
  const discInicial = q ? topicoPorId.get(q.topicoId)?.disciplinaId : DISCIPLINAS[0].id;
  const selDisc = h('select', {}, DISCIPLINAS.map((d) => h('option', { value: d.id, selected: d.id === discInicial }, d.nome)));
  const selTop = h('select', {});
  const preencherTopicos = (sel) => {
    limpar(selTop);
    for (const t of TOPICOS.filter((x) => x.disciplinaId === selDisc.value)) {
      anexar(selTop, h('option', { value: t.id, selected: t.id === sel }, t.nome));
    }
  };
  preencherTopicos(q?.topicoId);
  selDisc.addEventListener('change', () => preencherTopicos());

  const selFormato = h('select', {},
    h('option', { value: 'ME', selected: q?.formato !== 'CE' }, 'Múltipla escolha'),
    h('option', { value: 'CE', selected: q?.formato === 'CE' }, 'Certo/Errado'));
  const enunciado = h('textarea', { rows: 5, required: true });
  enunciado.value = q?.enunciado ?? '';
  const alts = LETRAS.map((l, i) => {
    const inp = h('input', { type: 'text', placeholder: `Alternativa ${l}` });
    inp.value = q?.alternativas?.[i] ?? '';
    return inp;
  });
  const selGab = h('select', {});
  const preencherGab = () => {
    limpar(selGab);
    const opts = selFormato.value === 'CE' ? [['C', 'Certo'], ['E', 'Errado']] : LETRAS.map((l) => [l, l]);
    const atual = q ? (q.formato === 'CE' ? (q.gabarito ? 'C' : 'E') : LETRAS[q.gabarito]) : '';
    for (const [v, t] of opts) anexar(selGab, h('option', { value: v, selected: v === atual }, t));
    altsBox.hidden = selFormato.value === 'CE';
  };
  const altsBox = h('div', { class: 'alts-editor' }, alts);
  selFormato.addEventListener('change', preencherGab);
  const comentario = h('textarea', { rows: 3 });
  comentario.value = q?.comentario ?? '';
  const referencia = h('input', { type: 'text', placeholder: 'Ex.: CF/88, art. 71, II' });
  referencia.value = q?.referencia ?? '';
  const erro = h('p', { class: 'erro-msg', hidden: true });
  preencherGab();

  async function salvar() {
    const r = validarRegistro({
      topicoId: selTop.value,
      formato: selFormato.value,
      enunciado: enunciado.value,
      alternativas: alts.map((a) => a.value),
      gabarito: selGab.value,
      comentario: comentario.value,
      referencia: referencia.value,
    }, TOPICOS, DISCIPLINAS);
    if (!r.ok) {
      erro.textContent = 'Não foi possível salvar: ' + r.motivo + '.';
      erro.hidden = false;
      return;
    }
    const agora = new Date().toISOString();
    const nova = q
      ? { ...q, ...r.questao, editada: true, atualizadaEm: agora }
      : { ...r.questao, id: db.novoId(), origem: 'manual', criadaEm: agora };
    if (nova.formato === 'CE') delete nova.alternativas;
    await db.put('questoes', nova);
    toast(q ? 'Questão atualizada' : 'Questão cadastrada');
    aoTerminar();
  }

  async function excluir() {
    if (!confirm('Excluir esta questão? O histórico de respostas dela será mantido, mas ela sai do caderno de erros.')) return;
    await db.del('questoes', q.id);
    await db.del('revisao', q.id);
    toast('Questão excluída');
    aoTerminar();
  }

  return h('section', { class: 'card' },
    h('h2', {}, q ? 'Editar questão' : 'Nova questão'),
    campo('Disciplina', selDisc),
    campo('Tópico', selTop),
    campo('Formato', selFormato),
    campo('Enunciado', enunciado),
    altsBox,
    campo('Gabarito', selGab),
    campo('Comentário', comentario),
    campo('Referência (lei, artigo, norma)', referencia),
    erro,
    h('div', { class: 'acoes' },
      q ? botao('Excluir', excluir, 'btn-perigo') : null,
      botao('Cancelar', aoTerminar, 'btn-secundario'),
      botao('Salvar', salvar, 'btn-primario')),
  );
}

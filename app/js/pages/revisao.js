// Revisão espaçada e caderno de erros (Req. 3).
import { h, card, botao, limpar, toast, anexar } from '../ui.js';
import * as db from '../db.js';
import { nomeTopico, nomeDisciplina, disciplinaDoTopico } from '../state.js';
import { vencidos, INTERVALOS } from '../domain/review.js';
import { today, fmtBR } from '../domain/dates.js';
import { iniciarPratica } from '../pratica.js';

const TIPOS = { 'nao-sabia': 'Não sabia', desatencao: 'Desatenção', chute: 'Chute' };

export async function render(root) {
  const hoje = today();
  const [itens, questoes] = await Promise.all([db.getAll('revisao'), db.getAll('questoes')]);
  const porId = new Map(questoes.map((q) => [q.id, q]));
  const validos = itens.filter((i) => porId.has(i.questaoId));
  const venc = vencidos(validos, hoje);
  const ativos = validos.filter((i) => !i.dominada).sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  const dominadas = validos.filter((i) => i.dominada).length;

  anexar(root, h('header', { class: 'topo' }, h('h1', {}, 'Revisão')));

  anexar(root, card(null,
    h('p', { class: 'grande' }, venc.length ? `${venc.length} revisões para hoje` : 'Nenhuma revisão vencida hoje'),
    h('p', { class: 'pequeno' }, `Errou: a questão volta em ${INTERVALOS[1]} dia. Acertou na revisão: volta em ${INTERVALOS[2]} dias, depois em ${INTERVALOS[3]} dias e então sai do caderno (dominada).`),
    venc.length ? botao('Começar revisão', () => {
      iniciarPratica(root, venc.map((i) => porId.get(i.questaoId)), 'revisao', () => {
        limpar(root);
        render(root);
      });
    }, 'btn-primario btn-bloco') : null,
  ));

  const filtro = { tipo: '' };
  const lista = h('div', { class: 'caderno' });
  const desenhar = () => {
    limpar(lista);
    const visiveis = ativos.filter((i) => !filtro.tipo || (filtro.tipo === 'sem' ? !i.tipoErro : i.tipoErro === filtro.tipo));
    if (!visiveis.length) anexar(lista, h('p', { class: 'pequeno' }, 'Nada por aqui.'));
    for (const i of visiveis) anexar(lista, itemCaderno(i, porId.get(i.questaoId), hoje));
  };
  const chips = [['', 'Todos'], ['nao-sabia', 'Não sabia'], ['desatencao', 'Desatenção'], ['chute', 'Chute'], ['sem', 'Sem classificação']].map(([v, t]) =>
    h('button', { type: 'button', class: 'chip', 'aria-pressed': String(v === ''), onclick: (e) => {
      filtro.tipo = v;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === e.currentTarget)));
      desenhar();
    } }, t));

  anexar(root, card(`Caderno de erros (${ativos.length})`,
    dominadas ? h('p', { class: 'pequeno' }, `${dominadas} questões já dominadas.`) : null,
    h('div', { class: 'chips' }, chips),
    lista));
  desenhar();
}

function itemCaderno(i, q, hoje) {
  const area = h('textarea', { rows: 2, placeholder: 'Anotação' });
  area.value = i.anotacao ?? '';
  area.addEventListener('change', async () => {
    await db.update('revisao', i.questaoId, (atual) => (atual ? { ...atual, anotacao: area.value.trim() } : undefined));
    toast('Anotação salva');
  });
  const selTipo = h('select', { onchange: async (e) => {
    const v = e.target.value || undefined;
    await db.update('revisao', i.questaoId, (atual) => (atual ? { ...atual, tipoErro: v } : undefined));
    toast('Classificação salva');
  } },
  h('option', { value: '' }, 'Tipo de erro…'),
  Object.entries(TIPOS).map(([v, t]) => h('option', { value: v, selected: v === i.tipoErro }, t)));

  const vencida = i.vencimento <= hoje;
  return h('details', { class: 'item-caderno' },
    h('summary', {},
      h('span', { class: `tag ${vencida ? 'tag-alerta' : 'tag-suave'}` }, vencida ? 'Vencida' : `Volta ${fmtBR(i.vencimento)}`),
      ' ', q.enunciado.length > 110 ? q.enunciado.slice(0, 110) + '…' : q.enunciado),
    h('p', { class: 'pequeno' }, nomeDisciplina(disciplinaDoTopico(q.topicoId)), ' · ', nomeTopico(q.topicoId), ` · intervalo de ${INTERVALOS[i.caixa]} dia(s)`),
    selTipo,
    area);
}

// Material de estudo por tópico (resumo, pontos de atenção e fontes oficiais).
import { h, card, anexar } from '../ui.js';
import { DISCIPLINAS, TOPICOS } from '../data/curriculum.js';
import { MATERIAL, FONTES_DISCIPLINA } from '../data/material.js';
import { topicoPorId, nomeDisciplina } from '../state.js';

function listaFontes(fontes) {
  return h('ul', { class: 'lista-fontes' }, fontes.map(([nome, url]) => h('li', {},
    url ? h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, nome) : nome)));
}

export async function render(root, params) {
  const id = params.get('topico');
  if (id) return detalhe(root, id);
  return indice(root);
}

function detalhe(root, id) {
  const t = topicoPorId.get(id);
  if (!t) {
    anexar(root, card('Tópico não encontrado', h('a', { href: '#/material' }, 'Ver todo o material')));
    return;
  }
  const m = MATERIAL[id];
  const irQuestoes = h('a', { class: 'btn btn-primario btn-bloco', href: `#/questoes?topicos=${encodeURIComponent(id)}` }, 'Fazer questões deste tópico');
  anexar(root,
    h('header', { class: 'topo' },
      h('p', { class: 'pequeno' }, nomeDisciplina(t.disciplinaId), ` · mês ${t.mes} · ${t.minutos} min`),
      h('h1', {}, t.nome)),
    m
      ? [
        card('Resumo', h('ul', { class: 'resumo' }, m.resumo.map((x) => h('li', {}, x)))),
        m.atencao?.length ? h('section', { class: 'card card-atencao' }, h('h2', {}, 'Atenção: costuma cair'), h('ul', { class: 'resumo' }, m.atencao.map((x) => h('li', {}, x)))) : null,
        card('Para aprofundar', listaFontes(m.fontes),
          h('p', { class: 'pequeno' }, 'Resumo escrito para o app. Confira os pontos nas fontes acima, principalmente a lei seca.')),
      ]
      : card('Resumo ainda não disponível',
        h('p', {}, 'Os resumos do mês 1 já estão prontos. Os dos meses seguintes serão incluídos antes de você chegar neles.'),
        FONTES_DISCIPLINA[t.disciplinaId] ? [h('p', { class: 'pequeno' }, 'Enquanto isso, use:'), listaFontes(FONTES_DISCIPLINA[t.disciplinaId])] : null),
    irQuestoes,
    h('a', { class: 'btn btn-link btn-bloco', href: '#/material' }, 'Ver todo o material'),
  );
}

function indice(root) {
  const blocos = DISCIPLINAS.map((d) => {
    const tops = TOPICOS.filter((t) => t.disciplinaId === d.id).sort((a, b) => a.mes - b.mes || a.ordem - b.ordem);
    const prontos = tops.filter((t) => MATERIAL[t.id]).length;
    return h('details', { class: 'disc-conteudo', open: prontos > 0 },
      h('summary', {}, h('strong', {}, d.nome), ` (${prontos}/${tops.length} resumos)`),
      h('ul', { class: 'lista-material' }, tops.map((t) => h('li', { class: MATERIAL[t.id] ? '' : 'sem-material' },
        h('a', { href: `#/material?topico=${encodeURIComponent(t.id)}` }, t.nome),
        h('span', { class: 'pequeno' }, ` · mês ${t.mes}`)))));
  });
  anexar(root,
    h('header', { class: 'topo' }, h('h1', {}, 'Material de estudo'),
      h('p', { class: 'pequeno' }, 'Resumo, pontos que costumam cair e fontes oficiais de cada tópico. Nas sessões de teoria, toque no nome do tópico para abrir.')),
    card(null, blocos));
}

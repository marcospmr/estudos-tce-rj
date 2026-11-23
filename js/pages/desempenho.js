// Painel de desempenho (Req. 5).
import { h, card, svg, pct, horas, anexar } from '../ui.js';
import * as db from '../db.js';
import { DISCIPLINAS } from '../data/curriculum.js';
import { infoData, nomeTopico, disciplinaDoTopico } from '../state.js';
import { acertoPor, META_ACERTO, META_QUESTOES_DIA, MIN_TENTATIVAS_META, questoesPorDia, minutosSemana } from '../domain/stats.js';
import { today, addDays, mondayOf, fmtBR } from '../domain/dates.js';
import { MINUTOS_SEMANA } from '../domain/scheduler.js';

export async function render(root) {
  const hoje = today();
  const [tentativas, questoes, sessoes, simulados] = await Promise.all([db.getAll('tentativas'), db.getAll('questoes'), db.getAll('sessoes'), db.getAll('simulados')]);
  const info = infoData(hoje);
  const meta = META_ACERTO[info.fase];
  const topicoDe = new Map(questoes.map((q) => [q.id, q.topicoId]));
  const porDisc = acertoPor(tentativas, (id) => (topicoDe.has(id) ? disciplinaDoTopico(topicoDe.get(id)) : undefined));
  const porTopico = acertoPor(tentativas, (id) => topicoDe.get(id));

  anexar(root, h('header', { class: 'topo' }, h('h1', {}, 'Desempenho'),
    h('p', { class: 'pequeno' }, `Fase ${info.fase}: meta de ${pct(meta)} de acerto e ${META_QUESTOES_DIA[info.fase]} questões por dia útil.`)));

  // Acerto por disciplina (Req. 5.1, 5.4)
  const linhas = DISCIPLINAS.filter((d) => porDisc.has(d.id)).map((d) => {
    const r = porDisc.get(d.id);
    const abaixo = r.total >= MIN_TENTATIVAS_META && r.pct < meta;
    const topicos = [...porTopico.entries()].filter(([t]) => disciplinaDoTopico(t) === d.id).sort((a, b) => a[1].pct - b[1].pct);
    return h('details', { class: `disc ${abaixo ? 'abaixo' : ''}` },
      h('summary', {},
        h('div', { class: 'disc-linha' },
          h('span', {}, d.nome),
          h('strong', {}, pct(r.pct))),
        barraMeta(r.pct, meta, abaixo),
        h('span', { class: 'pequeno' }, `${r.acertos}/${r.total} questões`, abaixo ? ' · abaixo da meta' : '')),
      h('ul', { class: 'lista-topicos' }, topicos.map(([t, x]) => h('li', { class: x.total >= MIN_TENTATIVAS_META && x.pct < meta ? 'abaixo' : '' }, `${nomeTopico(t)}: ${pct(x.pct)} (${x.total})`))));
  });
  anexar(root, card('Acerto por disciplina', linhas.length ? linhas : h('p', { class: 'pequeno' }, 'Responda questões para ver seu desempenho.'),
    linhas.length ? h('p', { class: 'pequeno' }, `Destaque em vermelho: abaixo da meta com pelo menos ${MIN_TENTATIVAS_META} questões. Toque para ver os tópicos.`) : null));

  // Questões por dia (Req. 5.5)
  const dias = questoesPorDia(tentativas, hoje, 14);
  anexar(root, card('Questões por dia (14 dias)', grafBarras(dias.map((d) => ({ rotulo: fmtBR(d.dia).slice(0, 2), valor: d.total })), META_QUESTOES_DIA[info.fase], (v) => String(v))));

  // Horas por semana (Req. 5.2)
  const semanas = [];
  for (let i = 7; i >= 0; i--) {
    const seg = addDays(mondayOf(hoje), -7 * i);
    semanas.push({ rotulo: fmtBR(seg), valor: minutosSemana(sessoes, seg) });
  }
  anexar(root, card('Horas por semana', grafBarras(semanas, MINUTOS_SEMANA, horas)));

  // Evolução dos simulados (Req. 5.3)
  const fin = simulados.filter((s) => s.resultado).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm));
  anexar(root, card('Evolução nos simulados', fin.length >= 1 ? grafLinha(fin.map((s) => ({ rotulo: fmtBR(s.criadoEm.slice(0, 10)), valor: s.resultado.geral.bruto })), meta) : h('p', { class: 'pequeno' }, 'Faça simulados para acompanhar a evolução.')));
}

function barraMeta(valor, meta, abaixo) {
  return h('div', { class: `barra ${abaixo ? 'barra-alerta' : 'barra-ok'}` },
    h('div', { style: { width: `${Math.min(1, valor) * 100}%` } }),
    h('span', { class: 'marca-meta', style: { left: `${meta * 100}%` }, title: 'meta' }));
}

function grafBarras(dados, meta, fmt) {
  const W = 320, H = 140, base = H - 20, topo = 16;
  const max = Math.max(meta, ...dados.map((d) => d.valor), 1);
  const bw = W / dados.length;
  const y = (v) => base - ((base - topo) * v) / max;
  return svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'grafico', role: 'img', 'aria-label': 'gráfico de barras' },
    dados.map((d, i) => [
      svg('rect', { x: i * bw + 3, y: y(d.valor), width: bw - 6, height: Math.max(0, base - y(d.valor)), class: d.valor >= meta ? 'b-ok' : 'b' }),
      svg('text', { x: i * bw + bw / 2, y: H - 6, 'text-anchor': 'middle', class: 'g-rot' }, d.rotulo),
      d.valor ? svg('text', { x: i * bw + bw / 2, y: y(d.valor) - 3, 'text-anchor': 'middle', class: 'g-val' }, fmt(d.valor)) : null,
    ]),
    svg('line', { x1: 0, x2: W, y1: y(meta), y2: y(meta), class: 'g-meta' }),
    svg('text', { x: W - 2, y: y(meta) - 3, 'text-anchor': 'end', class: 'g-val' }, `meta ${fmt(meta)}`));
}

function grafLinha(dados, meta) {
  const W = 320, H = 150, base = H - 20, topo = 12, esq = 10, dir = 10;
  const x = (i) => (dados.length === 1 ? W / 2 : esq + ((W - esq - dir) * i) / (dados.length - 1));
  const y = (v) => base - (base - topo) * v;
  const pts = dados.map((d, i) => `${x(i)},${y(d.valor)}`).join(' ');
  return svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'grafico', role: 'img', 'aria-label': 'evolução das notas' },
    svg('line', { x1: 0, x2: W, y1: y(meta), y2: y(meta), class: 'g-meta' }),
    svg('polyline', { points: pts, class: 'g-linha' }),
    dados.map((d, i) => [
      svg('circle', { cx: x(i), cy: y(d.valor), r: 4, class: 'g-ponto' }),
      svg('text', { x: x(i), y: y(d.valor) - 7, 'text-anchor': 'middle', class: 'g-val' }, pct(d.valor)),
      svg('text', { x: x(i), y: H - 6, 'text-anchor': 'middle', class: 'g-rot' }, d.rotulo),
    ]));
}


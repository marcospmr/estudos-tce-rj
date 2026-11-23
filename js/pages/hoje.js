// Tela inicial (Req. 1.3, 1.4, 1.5, 3.5, 5.2, 5.5, 7.6).
import { h, card, barra, horas, link, toast, limpar, anexar } from '../ui.js';
import * as db from '../db.js';
import { estado, infoData, nomeTopico } from '../state.js';
import { today, addDays, mondayOf, diffDays, fmtBR, fmtBRCompleto, dayOfWeek, NOMES_DIAS } from '../domain/dates.js';
import { vencidos } from '../domain/review.js';
import { minutosSemana, META_QUESTOES_DIA, piorTopico } from '../domain/stats.js';
import { MINUTOS_SEMANA } from '../domain/scheduler.js';

export const ROTULO_TIPO = {
  teoria: 'Teoria',
  questoes: 'Questões',
  revisao: 'Caderno de erros',
  recuperacao: 'Recuperação',
  simulado: 'Simulado',
};

export async function render(root) {
  const cfg = estado.cfg;
  const hoje = today();
  const [sessoes, revisao, tentativas, questoes] = await Promise.all([db.getAll('sessoes'), db.getAll('revisao'), db.getAll('tentativas'), db.getAll('questoes')]);
  const topicoDaQuestao = new Map(questoes.map((q) => [q.id, q.topicoId]));
  const info = infoData(hoje);
  const antesDoInicio = hoje < cfg.inicioPlano;

  // Cabeçalho
  anexar(root, h('header', { class: 'topo' },
    h('p', { class: 'pequeno' }, `${NOMES_DIAS[dayOfWeek(hoje)]}, ${fmtBRCompleto(hoje)}`),
    antesDoInicio
      ? h('h1', {}, `O plano começa em ${fmtBR(cfg.inicioPlano)}`)
      : h('h1', {}, `Semana ${info.semana + 1} · Mês ${info.mes} · Fase ${info.fase}`),
    cfg.dataProva ? h('p', { class: 'contagem' }, `Prova em ${Math.max(0, diffDays(hoje, cfg.dataProva))} dias (${fmtBRCompleto(cfg.dataProva)})${cfg.banca ? ' · ' + cfg.banca : ''}`) : null,
  ));

  // Lembrete de backup (Req. 7.6)
  const temDados = tentativas.length > 0 || sessoes.some((s) => s.concluidaEm);
  if (temDados && (!cfg.ultimoBackup || diffDays(cfg.ultimoBackup.slice(0, 10), hoje) > 7)) {
    anexar(root, h('div', { class: 'aviso' },
      h('p', {}, cfg.ultimoBackup ? `Último backup em ${fmtBR(cfg.ultimoBackup.slice(0, 10))}. ` : 'Você ainda não fez backup. ',
        'Faça um backup para não perder seu progresso.'),
      link('Fazer backup', '#/ajustes?secao=backup', 'btn btn-secundario')));
  }

  // Revisões vencidas (Req. 3.5)
  const venc = vencidos(revisao, hoje);
  // Metas
  const feitasHoje = tentativas.filter((t) => (t.dia ?? t.data.slice(0, 10)) === hoje).length;
  const metaQ = META_QUESTOES_DIA[info.fase];
  const minSemana = minutosSemana(sessoes, hoje);
  anexar(root, h('div', { class: 'grade-metas' },
    h('a', { class: 'meta', href: '#/revisao' }, h('span', { class: 'meta-num' }, String(venc.length)), h('span', {}, 'revisões vencidas')),
    h('a', { class: 'meta', href: '#/questoes' }, h('span', { class: 'meta-num' }, `${feitasHoje}/${metaQ}`), h('span', {}, 'questões hoje')),
    h('a', { class: 'meta', href: '#/cronograma' }, h('span', { class: 'meta-num' }, `${horas(minSemana)}`), h('span', {}, `de 14h na semana`), barra(minSemana, MINUTOS_SEMANA)),
  ));

  // Sessões do dia
  const dia = antesDoInicio ? cfg.inicioPlano : hoje;
  const doDia = sessoes.filter((s) => s.data === dia).sort(ordem);
  const tituloDia = antesDoInicio ? `Primeiro dia (${fmtBR(dia)})` : 'Sessões de hoje';
  const ctx = { tentativas, sessoes, topicoDe: (qid) => topicoDaQuestao.get(qid), recarregar: () => rerender(root) };
  anexar(root, card(tituloDia,
    doDia.length ? doDia.map((s) => sessaoCard(s, ctx)) : h('p', {}, dayOfWeek(dia) === 0 ? 'Domingo de folga. Se quiser, faça só as revisões vencidas.' : 'Nenhuma sessão planejada para hoje.')));

  // Pendências da semana anterior (Req. 1.5)
  if (!antesDoInicio) {
    const segAnterior = addDays(mondayOf(hoje), -7);
    const domAnterior = addDays(segAnterior, 6);
    const pend = sessoes.filter((s) => s.data >= segAnterior && s.data <= domAnterior && !s.concluidaEm).sort(ordem);
    if (pend.length) {
      anexar(root, card(`Pendentes da semana passada (${pend.length})`,
        h('p', { class: 'pequeno' }, 'Faça quando puder ou apenas marque como concluída se já estudou.'),
        pend.map((s) => sessaoCard(s, ctx, true))));
    }
  }
}

async function rerender(root) {
  limpar(root);
  await render(root);
}

export function ordem(a, b) {
  return a.data.localeCompare(b.data) || a.id.localeCompare(b.id, undefined, { numeric: true });
}

/** Cartão de uma sessão, com ação principal e conclusão (Req. 1.4). */
export function sessaoCard(s, ctx, mostrarData = false) {
  const concluida = !!s.concluidaEm;
  const conteudo = [];
  let pior = null;
  if (s.tipo === 'teoria') {
    conteudo.push(h('ul', { class: 'lista-topicos' }, s.partes.map((p) => h('li', {}, nomeTopico(p.topicoId), s.partes.length > 1 ? ` (${p.minutos} min)` : ''))));
  } else if (s.tipo === 'questoes') {
    conteudo.push(h('p', { class: 'pequeno' }, s.topicoIds.length ? 'Sobre: ' + s.topicoIds.map(nomeTopico).join('; ') : 'Questões mistas dos tópicos já estudados, incluindo revisões vencidas.'));
  } else if (s.tipo === 'revisao') {
    conteudo.push(h('p', { class: 'pequeno' }, s.rotulo ?? 'Revise o caderno de erros e as anotações da semana.'));
  } else if (s.tipo === 'recuperacao') {
    const estudados = estudadosAte(ctx.sessoes, s.data);
    pior = piorTopico(ctx.tentativas, ctx.topicoDe, estudados);
    conteudo.push(h('p', { class: 'pequeno' }, pior
      ? `Tópico com pior desempenho: ${nomeTopico(pior)}. Revise a teoria e refaça questões dele.`
      : 'Ainda não há dados suficientes. Use o tempo para revisar a teoria da semana.'));
  } else if (s.tipo === 'simulado') {
    conteudo.push(h('p', { class: 'pequeno' }, s.rotulo === 'Diagnóstico'
      ? 'Diagnóstico: resolva uma prova antiga de TCE na área de TI (ou um simulado no app) e registre o desempenho por disciplina.'
      : 'Simulado no tempo da prova, sem consulta.'));
  }

  const acao = acaoPrincipal(s, pior);
  const btnConcluir = h('button', {
    type: 'button',
    class: `btn ${concluida ? 'btn-secundario' : 'btn-ok'}`,
    onclick: async () => {
      if (concluida) {
        const { concluidaEm, minutosRealizados, ...aberta } = s;
        await db.put('sessoes', aberta);
        toast('Sessão reaberta');
      } else {
        const v = prompt('Quantos minutos você estudou?', String(s.minutosPlanejados));
        if (v === null) return;
        const min = Math.max(0, Math.min(600, parseInt(v, 10) || 0));
        await db.put('sessoes', { ...s, concluidaEm: new Date().toISOString(), minutosRealizados: min });
        toast('Sessão concluída');
      }
      ctx.recarregar();
    },
  }, concluida ? 'Reabrir' : 'Concluir');

  return h('div', { class: `sessao ${concluida ? 'concluida' : ''} tipo-${s.tipo}` },
    h('div', { class: 'sessao-topo' },
      h('span', { class: 'tag' }, s.rotulo && s.tipo === 'simulado' ? s.rotulo : ROTULO_TIPO[s.tipo]),
      mostrarData ? h('span', { class: 'pequeno' }, fmtBR(s.data)) : null,
      h('span', { class: 'sessao-min' }, concluida ? `Feito: ${s.minutosRealizados ?? s.minutosPlanejados} min` : `${s.minutosPlanejados} min`)),
    conteudo,
    h('div', { class: 'acoes' }, acao, btnConcluir));
}

function acaoPrincipal(s, pior) {
  const q = (ids) => `#/questoes?topicos=${encodeURIComponent(ids.join(','))}`;
  if (s.tipo === 'teoria') return link('Questões destes tópicos', q(s.topicoIds), 'btn btn-secundario');
  if (s.tipo === 'questoes') return link('Resolver questões', s.topicoIds.length ? q(s.topicoIds) : '#/questoes?estudados=1', 'btn btn-primario');
  if (s.tipo === 'revisao') return link('Abrir caderno de erros', '#/revisao', 'btn btn-primario');
  if (s.tipo === 'recuperacao') return link('Questões do tópico', pior ? q([pior]) : '#/revisao', 'btn btn-primario');
  if (s.tipo === 'simulado') return link('Montar simulado', '#/simulados/novo', 'btn btn-primario');
  return null;
}

/** Tópicos com teoria agendada até a data (inclusive). */
export function estudadosAte(sessoes, data) {
  const ids = new Set();
  for (const s of sessoes) if (s.tipo === 'teoria' && s.data <= data) s.partes.forEach((p) => ids.add(p.topicoId));
  return [...ids];
}


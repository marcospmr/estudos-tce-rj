// Cronograma semanal e troca de dias da semana-modelo (Req. 1.1, 1.2, 1.6).
import { h, card, botao, limpar, horas, select, toast, anexar } from '../ui.js';
import * as db from '../db.js';
import { estado, infoData, semanaDe, salvarConfig, recalcularCronograma, nomeTopico } from '../state.js';
import { addDays, mondayOf, today, fmtBR, dayOfWeek, NOMES_DIAS } from '../domain/dates.js';
import { trocarDias, totalMinutos } from '../domain/scheduler.js';
import { sessaoCard, ordem } from './hoje.js';

export async function render(root, params) {
  const cfg = estado.cfg;
  const hoje = today();
  const semanaHoje = Math.max(0, semanaDe(hoje));
  const semana = params.has('semana') ? Math.max(0, Number(params.get('semana'))) : semanaHoje;
  const seg = addDays(mondayOf(cfg.inicioPlano), semana * 7);
  const dom = addDays(seg, 6);
  const [sessoes, tentativas, questoes] = await Promise.all([db.getAll('sessoes'), db.getAll('tentativas'), db.getAll('questoes')]);
  const daSemana = sessoes.filter((s) => s.data >= seg && s.data <= dom).sort(ordem);
  const info = infoData(seg);
  const planejado = daSemana.reduce((a, s) => a + s.minutosPlanejados, 0);
  const feito = daSemana.filter((s) => s.concluidaEm).reduce((a, s) => a + (s.minutosRealizados ?? s.minutosPlanejados), 0);
  const topicoDaQuestao = new Map(questoes.map((q) => [q.id, q.topicoId]));
  const ctx = { tentativas, sessoes, topicoDe: (id) => topicoDaQuestao.get(id), recarregar: () => { limpar(root); render(root, params); } };

  const ir = (w) => { location.hash = `#/cronograma?semana=${w}`; };
  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Cronograma')),
    h('div', { class: 'nav-semana' },
      botao('‹', () => ir(Math.max(0, semana - 1)), 'btn-secundario'),
      h('div', { class: 'centro' },
        h('strong', {}, `Semana ${semana + 1}`),
        h('p', { class: 'pequeno' }, `${fmtBR(seg)} a ${fmtBR(dom)} · Mês ${info.mes} · Fase ${info.fase}`)),
      botao('›', () => ir(semana + 1), 'btn-secundario')),
    semana !== semanaHoje ? botao('Ir para a semana atual', () => ir(semanaHoje), 'btn-link') : null,
    h('p', { class: 'pequeno centro' }, `Planejado: ${horas(planejado)} · Concluído: ${horas(feito)}`),
  );

  if (!daSemana.length) anexar(root, card(null, h('p', {}, 'Sem sessões nesta semana (fora do plano ou após a data da prova).')));
  const dias = [...new Set(daSemana.map((s) => s.data))];
  for (const d of dias) {
    anexar(root, card(`${NOMES_DIAS[dayOfWeek(d)]}, ${fmtBR(d)}${d === hoje ? ' (hoje)' : ''}`,
      daSemana.filter((s) => s.data === d).map((s) => sessaoCard(s, ctx))));
  }

  // Tópicos que não cabem até a prova (Req. 8; B5.2)
  if (cfg.dataProva && (cfg.atrasados?.length || cfg.foraDoPlano?.length)) {
    anexar(root, card('Ajuste necessário para a data da prova',
      cfg.foraDoPlano?.length ? [
        h('p', {}, `${cfg.foraDoPlano.length} tópico(s) não cabem até a prova. Considere desativar os de menor peso em Ajustes:`),
        h('ul', { class: 'lista-topicos' }, cfg.foraDoPlano.map((id) => h('li', {}, nomeTopico(id)))),
      ] : null,
      cfg.atrasados?.length && !cfg.foraDoPlano?.length ? h('p', {}, `${cfg.atrasados.length} tópico(s) só serão vistos durante a Fase 3 (reta final).`) : null,
      h('a', { href: '#/ajustes?secao=conteudo', class: 'btn btn-secundario' }, 'Ativar ou desativar tópicos')));
  }

  // Semana-modelo (Req. 1.6)
  const resumo = [1, 2, 3, 4, 5, 6, 0].map((d) => {
    const min = cfg.semanaModelo.filter((s) => s.dia === d).reduce((a, s) => a + s.minutos, 0);
    return h('li', {}, `${NOMES_DIAS[d]}: `, min ? horas(min) : 'folga');
  });
  const dOpts = [1, 2, 3, 4, 5, 6, 0].map((d) => [String(d), NOMES_DIAS[d]]);
  const troca = { a: '6', b: '0' };
  anexar(root, card('Semana-modelo (14 h)',
    h('ul', { class: 'lista-dias' }, resumo),
    h('p', { class: 'pequeno' }, 'Troque dois dias para mudar, por exemplo, o dia de folga. O total continua 14 h e só as semanas futuras mudam.'),
    h('div', { class: 'linha-campos' },
      select(dOpts, troca.a, (v) => { troca.a = v; }),
      h('span', { class: 'centro' }, 'com'),
      select(dOpts, troca.b, (v) => { troca.b = v; })),
    botao('Trocar dias', async () => {
      if (troca.a === troca.b) return toast('Escolha dois dias diferentes.');
      const nova = trocarDias(cfg.semanaModelo, Number(troca.a), Number(troca.b));
      if (totalMinutos(nova) !== totalMinutos(cfg.semanaModelo)) return toast('Erro: total alterado.');
      await salvarConfig({ semanaModelo: nova });
      await recalcularCronograma();
      toast('Semana-modelo atualizada');
      limpar(root);
      render(root, params);
    }, 'btn-secundario')));
}

// Simulados cronometrados (Req. 4).
import { h, card, botao, campo, select, limpar, pct, toast, anexar } from '../ui.js';
import * as db from '../db.js';
import { DISCIPLINAS } from '../data/curriculum.js';
import { questoesAtivas, formatoPreferido, embaralhar, disciplinaDoTopico, nomeDisciplina, registrarTentativa, topicosAtivos } from '../state.js';
import { pontuar } from '../domain/scoring.js';
import { fmtBR } from '../domain/dates.js';
import { questaoSimulado, questaoRevisada } from '../questao-view.js';

// ── Lista ──
export async function renderLista(root) {
  const sims = (await db.getAll('simulados')).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Simulados')),
    h('a', { class: 'btn btn-primario btn-bloco', href: '#/simulados/novo' }, 'Novo simulado'),
    card('Histórico',
      sims.length ? h('ul', { class: 'lista-sims' }, sims.map((s) => h('li', {},
        h('a', { href: `#/simulado?id=${encodeURIComponent(s.id)}` },
          h('span', {}, fmtBR(s.criadoEm.slice(0, 10)), ' · ', `${s.questaoIds.length} questões`),
          h('strong', {}, s.resultado ? notaPrincipal(s.resultado) : 'em andamento'))))) : h('p', { class: 'pequeno' }, 'Nenhum simulado ainda.')),
  );
}

function notaPrincipal(r) {
  if (r.porFormato.CE.total && !r.porFormato.ME.total) return `${pct(r.geral.bruto)} (líquida ${pct(r.porFormato.CE.liquido)})`;
  return pct(r.geral.bruto);
}

// ── Montagem (Req. 4.1) ──
export async function renderNovo(root) {
  const questoes = await questoesAtivas();
  const ativos = new Set(topicosAtivos().map((t) => t.disciplinaId));
  const discs = DISCIPLINAS.filter((d) => ativos.has(d.id));
  const c = { quantidade: 30, formato: formatoPreferido() || 'misto', disciplinas: new Set(discs.map((d) => d.id)), tempo: 90 };

  const disponivel = h('p', { class: 'contador' });
  const pool = () => questoes.filter((q) => c.disciplinas.has(disciplinaDoTopico(q.topicoId)) && (c.formato === 'misto' || q.formato === c.formato));
  const atualizar = () => {
    const n = pool().length;
    disponivel.textContent = `${n} questões disponíveis com esses filtros` + (n < c.quantidade ? ` (o simulado terá ${n})` : '');
  };

  const inpQtd = h('input', { type: 'number', min: '5', max: '200', value: String(c.quantidade), inputmode: 'numeric' });
  const inpTempo = h('input', { type: 'number', min: '5', max: '300', value: String(c.tempo), inputmode: 'numeric' });
  inpQtd.addEventListener('input', () => {
    c.quantidade = Math.max(1, parseInt(inpQtd.value, 10) || 0);
    c.tempo = Math.round(c.quantidade * 3);
    inpTempo.value = String(c.tempo);
    atualizar();
  });
  inpTempo.addEventListener('input', () => { c.tempo = Math.max(1, parseInt(inpTempo.value, 10) || 0); });

  const caixas = discs.map((d) => {
    const cb = h('input', { type: 'checkbox', checked: true, onchange: (e) => {
      if (e.target.checked) c.disciplinas.add(d.id);
      else c.disciplinas.delete(d.id);
      atualizar();
    } });
    return h('label', { class: 'check' }, cb, d.nome);
  });

  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Novo simulado')),
    card(null,
      h('div', { class: 'linha-campos' }, campo('Questões', inpQtd), campo('Tempo (min)', inpTempo)),
      campo('Formato', select([['misto', 'Misto'], ['ME', 'Múltipla escolha'], ['CE', 'Certo/Errado']], c.formato, (v) => { c.formato = v; atualizar(); })),
      h('fieldset', { class: 'grupo-checks' }, h('legend', {}, 'Disciplinas'), caixas),
      disponivel,
      botao('Iniciar simulado', async () => {
        const lista = selecionar(pool(), c.quantidade, c.disciplinas);
        if (!lista.length) return toast('Nenhuma questão com esses filtros.');
        const agora = Date.now();
        const sim = {
          id: db.novoId(),
          criadoEm: new Date(agora).toISOString(),
          config: { questoes: c.quantidade, disciplinaIds: [...c.disciplinas], formato: c.formato, tempoMin: c.tempo },
          questaoIds: lista.map((q) => q.id),
          respostas: {},
          iniciadoEm: agora,
          prazo: agora + c.tempo * 60000,
        };
        await db.put('simulados', sim);
        location.hash = `#/simulado?id=${encodeURIComponent(sim.id)}`;
      }, 'btn-primario btn-bloco')),
    h('p', { class: 'pequeno centro' }, 'Durante o simulado, a correção só aparece no final.'),
  );
  atualizar();
}

/** Seleção proporcional ao peso (horas no ano) das disciplinas escolhidas. */
function selecionar(pool, n, discs) {
  const porDisc = new Map();
  for (const q of embaralhar(pool)) {
    const d = disciplinaDoTopico(q.topicoId);
    if (!porDisc.has(d)) porDisc.set(d, []);
    porDisc.get(d).push(q);
  }
  const pesos = DISCIPLINAS.filter((d) => discs.has(d.id) && porDisc.has(d.id));
  const soma = pesos.reduce((a, d) => a + d.horasAno, 0);
  const escolhidas = [];
  for (const d of pesos) {
    const k = Math.floor((n * d.horasAno) / soma);
    escolhidas.push(...porDisc.get(d.id).splice(0, k));
  }
  const resto = embaralhar([...porDisc.values()].flat());
  while (escolhidas.length < n && resto.length) escolhidas.push(resto.pop());
  return embaralhar(escolhidas);
}

// ── Execução e resultado (Req. 4.2 a 4.6) ──
export async function renderSimulado(root, params) {
  const sim = await db.get('simulados', params.get('id'));
  if (!sim) {
    anexar(root, card('Simulado não encontrado', h('a', { href: '#/simulados' }, 'Voltar')));
    return;
  }
  const questoes = (await Promise.all(sim.questaoIds.map((id) => db.get('questoes', id)))).filter(Boolean);
  if (sim.finalizadoEm) return resultado(root, sim, questoes);
  if (Date.now() >= sim.prazo) {
    await finalizar(sim, questoes);
    return resultado(root, sim, questoes);
  }

  let idx = 0;
  let encerrado = false;
  const relogio = h('span', { class: 'relogio' });
  const corpo = h('div');
  const navegador = h('div', { class: 'navegador' });

  const tick = async () => {
    const resta = sim.prazo - Date.now();
    if (resta <= 0) {
      if (encerrado) return;
      encerrado = true;
      clearInterval(timer);
      await finalizar(sim, questoes);
      toast('Tempo esgotado. Simulado corrigido.');
      limpar(root);
      resultado(root, sim, questoes);
      return;
    }
    const m = Math.floor(resta / 60000);
    const s = Math.floor((resta % 60000) / 1000);
    relogio.textContent = `${m}:${String(s).padStart(2, '0')}`;
    relogio.classList.toggle('urgente', resta < 5 * 60000);
  };
  const timer = setInterval(tick, 1000);
  tick();

  const desenharNav = () => {
    limpar(navegador);
    questoes.forEach((q, i) => {
      const r = sim.respostas[q.id];
      anexar(navegador, h('button', {
        type: 'button',
        class: `nav-q ${r !== undefined && r !== null ? 'respondida' : ''} ${i === idx ? 'atual' : ''}`,
        onclick: () => { idx = i; mostrar(); },
      }, String(i + 1)));
    });
  };

  const mostrar = () => {
    limpar(corpo);
    const q = questoes[idx];
    anexar(corpo, 
      h('p', { class: 'pequeno' }, `Questão ${idx + 1} de ${questoes.length}`),
      questaoSimulado({
        q,
        resposta: sim.respostas[q.id] ?? null,
        onResponder: async (v) => {
          sim.respostas[q.id] = v;
          await db.put('simulados', sim); // retomada após recarregar
          desenharNav();
        },
      }),
      h('div', { class: 'acoes' },
        botao('‹ Anterior', () => { if (idx > 0) { idx--; mostrar(); } }, 'btn-secundario'),
        botao('Próxima ›', () => { if (idx < questoes.length - 1) { idx++; mostrar(); } }, 'btn-secundario')),
    );
    desenharNav();
    window.scrollTo({ top: 0 });
  };

  anexar(root, 
    h('div', { class: 'barra-simulado' },
      relogio,
      botao('Finalizar', async () => {
        const brancos = questoes.filter((q) => sim.respostas[q.id] === undefined || sim.respostas[q.id] === null).length;
        if (!confirm(brancos ? `Há ${brancos} questão(ões) em branco. Finalizar mesmo assim?` : 'Finalizar e corrigir o simulado?')) return;
        encerrado = true;
        clearInterval(timer);
        await finalizar(sim, questoes);
        limpar(root);
        resultado(root, sim, questoes);
      }, 'btn-primario')),
    navegador,
    corpo,
  );
  mostrar();
  return () => clearInterval(timer);
}

async function finalizar(sim, questoes) {
  if (sim.finalizadoEm) return;
  sim.finalizadoEm = new Date().toISOString();
  sim.resultado = pontuar(questoes, sim.respostas, disciplinaDoTopico);
  await db.put('simulados', sim);
  // Registra as respondidas; erradas entram no caderno (Req. 4.6). Em branco não contam como tentativa.
  for (const q of questoes) {
    const r = sim.respostas[q.id];
    if (r === undefined || r === null) continue;
    await registrarTentativa(q, r, 0, 'simulado', sim.id);
  }
}

// coluna: false = sem coluna "Líquida"; 'vazia' = coluna sem valor (linha de múltipla escolha); true = com valor.
function linhaNota(rotulo, r, coluna) {
  return h('tr', {},
    h('td', {}, rotulo),
    h('td', {}, `${r.certas}/${r.total}`),
    h('td', {}, pct(r.bruto)),
    coluna === true ? h('td', {}, pct(r.liquido)) : coluna === 'vazia' ? h('td', {}, '-') : null);
}

function resultado(root, sim, questoes) {
  const r = sim.resultado;
  const temCE = r.porFormato.CE.total > 0;
  const soCE = temCE && r.porFormato.ME.total === 0;
  const cab = h('tr', {}, h('th', {}, ''), h('th', {}, 'Acertos'), h('th', {}, '%'), temCE ? h('th', {}, 'Líquida') : null);
  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Resultado do simulado'), h('p', { class: 'pequeno' }, fmtBR(sim.criadoEm.slice(0, 10)))),
    card(null,
      h('p', { class: 'grande' }, pct(r.geral.bruto), ' de acerto'),
      h('p', { class: 'pequeno' }, `Certas: ${r.geral.certas} · erradas: ${r.geral.erradas} · em branco: ${r.geral.branco}`),
      temCE ? h('p', { class: 'pequeno' }, `Nota líquida no estilo Cebraspe (certas − erradas) nas questões de certo/errado: ${r.porFormato.CE.certas - r.porFormato.CE.erradas} pontos (${pct(r.porFormato.CE.liquido)}).`) : null,
      h('table', { class: 'tabela' },
        h('thead', {}, cab),
        h('tbody', {},
          r.porFormato.ME.total ? linhaNota('Múltipla escolha', r.porFormato.ME, temCE ? 'vazia' : false) : null,
          temCE ? linhaNota('Certo/Errado', r.porFormato.CE, temCE) : null))),
    card('Por disciplina',
      h('table', { class: 'tabela' },
        h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, 'Acertos'), h('th', {}, '%'), soCE ? h('th', {}, 'Líquida') : null)),
        h('tbody', {}, Object.entries(r.porDisciplina).sort((a, b) => a[1].bruto - b[1].bruto).map(([d, x]) => linhaNota(nomeDisciplina(d), x, soCE))))),
    card('Revisão das questões', questoes.map((q, i) => questaoRevisada(q, sim.respostas[q.id] ?? null, i + 1))),
    h('a', { class: 'btn btn-secundario btn-bloco', href: '#/simulados' }, 'Voltar aos simulados'),
  );
}


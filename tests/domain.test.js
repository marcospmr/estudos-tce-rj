import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registrarResposta, vencidos, INTERVALOS } from '../app/js/domain/review.js';
import { pontuar, corrigir } from '../app/js/domain/scoring.js';
import { importarJSON, importarCSV, parseCSV } from '../app/js/domain/importer.js';
import { acertoPor, abaixoDaMeta, statusQuestoes, piorTopico } from '../app/js/domain/stats.js';
import { addDays, diffDays } from '../app/js/domain/dates.js';
import { TOPICOS, DISCIPLINAS } from '../app/js/data/curriculum.js';
import { QUESTOES_SEED } from '../app/js/data/seed.js';
import { rng, CASOS } from './helpers.js';

test('propriedade 4: revisão espaçada', () => {
  const r = rng(3);
  for (let i = 0; i < CASOS; i++) {
    let item = null;
    let hoje = '2026-11-23';
    let acertosSeguidosRevisao = 0;
    for (let k = 0; k < 30; k++) {
      const correta = r.bool(0.7);
      const modo = r.pick(['treino', 'revisao', 'simulado']);
      const antes = item;
      item = registrarResposta(item, 'q1', correta, modo, hoje);
      if (!correta) acertosSeguidosRevisao = 0;
      else if (modo === 'revisao' && antes && !antes.dominada) acertosSeguidosRevisao++;
      if (item) {
        assert.ok([1, 2, 3].includes(item.caixa));
        if (item !== antes && !item.dominada) {
          assert.ok(item.vencimento > hoje, 'vencimento deve ser posterior à resposta');
          assert.equal(diffDays(hoje, item.vencimento), INTERVALOS[item.caixa]);
        }
        if (item.dominada) assert.ok(acertosSeguidosRevisao >= 3, 'dominada só após 3 acertos em revisão');
      } else {
        assert.equal(antes, null);
      }
      hoje = addDays(hoje, r.int(0, 40));
    }
  }
});

test('revisão: exemplo do design (1 → 7 → 30 → dominada)', () => {
  let it = registrarResposta(null, 'q', false, 'treino', '2027-02-01');
  assert.deepEqual([it.caixa, it.vencimento], [1, '2027-02-02']);
  it = registrarResposta(it, 'q', true, 'revisao', '2027-02-02');
  assert.deepEqual([it.caixa, it.vencimento], [2, '2027-02-09']);
  it = registrarResposta(it, 'q', true, 'revisao', '2027-02-09');
  assert.deepEqual([it.caixa, it.vencimento], [3, '2027-03-11']);
  it = registrarResposta(it, 'q', true, 'revisao', '2027-03-11');
  assert.equal(it.dominada, true);
  assert.deepEqual(vencidos([it], '2027-12-31'), []);
  it = registrarResposta(it, 'q', false, 'simulado', '2027-04-01');
  assert.deepEqual([it.caixa, it.dominada], [1, false]);
});

test('propriedade 5: nota de certo/errado', () => {
  const r = rng(5);
  for (let i = 0; i < CASOS; i++) {
    const n = r.int(1, 60);
    const qs = [];
    const resp = {};
    let c = 0, e = 0;
    for (let k = 0; k < n; k++) {
      const q = { id: 'q' + k, topicoId: 'si.pilares', formato: 'CE', gabarito: r.bool() };
      qs.push(q);
      const tipo = r.int(0, 2);
      resp[q.id] = tipo === 0 ? null : tipo === 1 ? q.gabarito : !q.gabarito;
      if (tipo === 1) c++;
      if (tipo === 2) e++;
    }
    const { geral, porFormato } = pontuar(qs, resp);
    assert.equal(geral.liquido, (c - e) / n);
    assert.ok(-1 <= geral.liquido && geral.liquido <= geral.bruto && geral.bruto <= 1);
    assert.equal(porFormato.CE.total, n);
    assert.equal(geral.certas + geral.erradas + geral.branco, n);
  }
});

test('correção de múltipla escolha', () => {
  const q = { id: 'x', topicoId: 't', formato: 'ME', gabarito: 2 };
  assert.equal(corrigir(q, 2), true);
  assert.equal(corrigir(q, 1), false);
  assert.equal(corrigir(q, null), false);
});

test('propriedade 8: importação parcial lista exatamente os inválidos', () => {
  const r = rng(8);
  for (let i = 0; i < 50; i++) {
    const n = r.int(1, 30);
    const regs = [];
    const invalidos = [];
    for (let k = 0; k < n; k++) {
      const ok = r.bool(0.7);
      const reg = r.bool()
        ? { topicoId: 'si.pilares', formato: 'CE', enunciado: 'Enunciado ' + k, gabarito: r.pick(['C', 'E', true, false]) }
        : { topicoId: 'redes.osi', formato: 'ME', enunciado: 'Enunciado ' + k, alternativas: ['a', 'b', 'c', 'd', 'e'], gabarito: r.pick(['A', 'B', 'C', 'D', 'E', 0, 4]) };
      if (!ok) {
        invalidos.push(k + 1);
        const defeito = r.int(0, 3);
        if (defeito === 0) reg.formato = 'XX';
        if (defeito === 1) reg.enunciado = '   ';
        if (defeito === 2) reg.topicoId = 'nao.existe';
        if (defeito === 3) reg.gabarito = reg.formato === 'ME' ? 'Z' : 'talvez';
      }
      regs.push(reg);
    }
    const res = importarJSON(JSON.stringify(regs), TOPICOS, DISCIPLINAS);
    assert.equal(res.validas.length, n - invalidos.length);
    assert.deepEqual(res.erros.map((e) => e.linha), invalidos);
  }
});

test('importação CSV com aspas, quebra de linha e erros por linha', () => {
  const csv = [
    'topicoId;formato;enunciado;altA;altB;altC;altD;altE;gabarito;comentario;referencia',
    'si.pilares;CE;"Texto com ; ponto e vírgula e ""aspas""";;;;;;C;coment;ref',
    'redes.osi;ME;"Enunciado em\nduas linhas";a;b;c;d;e;B;;',
    'nao.existe;CE;x;;;;;;C;;',
    'redes.osi;ME;y;a;b;;;;E;;',
  ].join('\r\n');
  const res = importarCSV(csv, TOPICOS, DISCIPLINAS);
  assert.equal(res.validas.length, 2);
  assert.equal(res.validas[0].enunciado, 'Texto com ; ponto e vírgula e "aspas"');
  assert.equal(res.validas[1].gabarito, 1);
  assert.equal(res.validas[1].enunciado, 'Enunciado em\nduas linhas');
  assert.deepEqual(res.erros.map((e) => e.linha), [5, 6]);
  assert.equal(parseCSV('a;b\n\n c;d').length, 2);
});

test('importação por nome de tópico', () => {
  const res = importarJSON(JSON.stringify([{ disciplina: 'Redes de Computadores', topico: 'modelos OSI', formato: 'CE', enunciado: 'x', gabarito: 'E' }]), TOPICOS, DISCIPLINAS);
  assert.equal(res.validas[0]?.topicoId, 'redes.osi');
});

test('estatísticas: acerto, meta e status', () => {
  const t = [
    { questaoId: 'a', correta: true, data: '2027-01-01T10:00:00Z' },
    { questaoId: 'a', correta: false, data: '2027-01-02T10:00:00Z' },
    ...Array.from({ length: 5 }, (_, i) => ({ questaoId: 'b', correta: i === 0, data: '2027-01-01T10:00:00Z' })),
  ];
  const m = acertoPor(t, (q) => (q === 'a' ? 'X' : 'Y'));
  assert.equal(m.get('X').pct, 0.5);
  assert.deepEqual(abaixoDaMeta(m, 1), ['Y']);
  const st = statusQuestoes(t);
  assert.equal(st('a'), 'errada');
  assert.equal(st('z'), 'nova');
  assert.equal(piorTopico(t, (q) => (q === 'a' ? 'X' : 'Y'), ['X', 'Y']), 'Y');
});

test('banco inicial: questões válidas, com referência, cobrindo todos os tópicos do mês 1', () => {
  const ids = new Set();
  for (const q of QUESTOES_SEED) {
    assert.ok(!ids.has(q.id), 'id duplicado ' + q.id);
    ids.add(q.id);
    const r = importarJSON(JSON.stringify([q]), TOPICOS, DISCIPLINAS);
    assert.equal(r.erros.length, 0, `${q.id}: ${r.erros[0]?.motivo}`);
    assert.ok(q.referencia && q.comentario, 'sem referência/comentário: ' + q.id);
  }
  const mes1 = TOPICOS.filter((t) => t.mes === 1);
  for (const t of mes1) {
    const n = QUESTOES_SEED.filter((q) => q.topicoId === t.id).length;
    assert.ok(n >= 5, `${t.id} tem ${n} questões`);
  }
  assert.ok(QUESTOES_SEED.length >= 150);
});

test('material: todos os tópicos do mês 1 têm resumo, atenção e fontes válidas', async () => {
  const { MATERIAL } = await import('../app/js/data/material.js');
  const ids = new Set(TOPICOS.map((t) => t.id));
  for (const id of Object.keys(MATERIAL)) assert.ok(ids.has(id), 'tópico inexistente: ' + id);
  for (const t of TOPICOS.filter((x) => x.mes === 1)) {
    const m = MATERIAL[t.id];
    assert.ok(m, 'sem material: ' + t.id);
    assert.ok(m.resumo.length >= 4, 'resumo curto: ' + t.id);
    assert.ok(m.atencao.length >= 1, 'sem atenção: ' + t.id);
    assert.ok(m.fontes.length >= 1, 'sem fontes: ' + t.id);
    for (const [nome, url] of m.fontes) {
      assert.ok(nome.trim(), 'fonte sem nome: ' + t.id);
      if (url) assert.match(url, /^https?:\/\/[^\s]+$/, 'url inválida em ' + t.id);
    }
  }
});

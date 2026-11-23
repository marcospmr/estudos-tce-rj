import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOPICOS } from '../app/js/data/curriculum.js';
import {
  SEMANA_PADRAO, MINUTOS_SEMANA, SEMANAS_PLANO, gerarCronograma, recalcular, transformarSemana, trocarDias, totalMinutos,
} from '../app/js/domain/scheduler.js';
import { addDays } from '../app/js/domain/dates.js';
import { rng, CASOS } from './helpers.js';

const INICIO = '2026-11-23';

function porSemana(sessoes) {
  const m = new Map();
  for (const s of sessoes) m.set(s.semana, (m.get(s.semana) ?? 0) + s.minutosPlanejados);
  return m;
}

test('curriculo: trilhas somam exatamente a capacidade dos meses 1 a 8', () => {
  const soma = (tr) => TOPICOS.filter((t) => t.trilha === tr).reduce((a, t) => a + t.minutos, 0);
  assert.equal(soma('B'), 4 * 720 + 4 * 600);
  assert.equal(soma('T1'), 4 * 540 + 4 * 480);
  assert.equal(soma('T2'), 4 * 640 + 4 * 560);
  assert.equal(new Set(TOPICOS.map((t) => t.id)).size, TOPICOS.length, 'ids duplicados');
});

test('semana-modelo padrão tem 840 min', () => {
  assert.equal(totalMinutos(SEMANA_PADRAO), MINUTOS_SEMANA);
});

test('propriedade 1: transformarSemana preserva o total para qualquer semana-modelo e fase', () => {
  const r = rng(1);
  const tipos = ['teoria', 'questoes', 'revisao', 'recuperacao'];
  for (let i = 0; i < CASOS; i++) {
    const template = [];
    const n = r.int(1, 15);
    for (let k = 0; k < n; k++) {
      const tipo = r.pick(tipos);
      template.push({ dia: r.int(0, 6), tipo, trilha: tipo === 'teoria' ? r.pick(['B', 'T1', 'T2']) : undefined, minutos: r.int(1, 30) * 5 });
    }
    const total = totalMinutos(template);
    for (const fase of [1, 2, 3]) {
      for (const simulado of [false, true]) {
        for (const final of [false, true]) {
          const dias = transformarSemana(template, { fase, simulado, final });
          const t = [...dias.values()].flat().reduce((a, s) => a + s.minutos, 0);
          assert.equal(t, total, `fase ${fase} simulado ${simulado} final ${final}`);
          if (final) assert.ok(![...dias.values()].flat().some((s) => s.tipo === 'teoria'));
        }
      }
    }
  }
});

test('propriedade 1: cada semana do plano padrão soma 840 min (±15)', () => {
  const { sessoes } = gerarCronograma({ inicio: INICIO, template: SEMANA_PADRAO, topicos: TOPICOS, desde: INICIO });
  const m = porSemana(sessoes);
  for (let w = 0; w < SEMANAS_PLANO; w++) {
    const v = m.get(w);
    assert.ok(Math.abs(v - MINUTOS_SEMANA) <= 15, `semana ${w + 1}: ${v}`);
  }
});

test('propriedade 1: semanas com dias trocados continuam com 840 min', () => {
  const r = rng(7);
  for (let i = 0; i < 30; i++) {
    const template = trocarDias(SEMANA_PADRAO, r.int(0, 6), r.int(0, 6));
    const { sessoes } = gerarCronograma({ inicio: INICIO, template, topicos: TOPICOS, desde: INICIO });
    for (const [w, v] of porSemana(sessoes)) if (w < SEMANAS_PLANO) assert.equal(v, MINUTOS_SEMANA, `semana ${w}`);
  }
});

test('propriedade 3: tópicos aparecem na ordem da trilha e todos cabem antes da Fase 3', () => {
  const r = gerarCronograma({ inicio: INICIO, template: SEMANA_PADRAO, topicos: TOPICOS, desde: INICIO });
  assert.deepEqual(r.atrasados, []);
  assert.deepEqual(r.foraDoPlano, []);
  const ordenadas = [...r.sessoes].sort((a, b) => a.data.localeCompare(b.data) || a.id.localeCompare(b.id, undefined, { numeric: true }));
  for (const trilha of ['B', 'T1', 'T2']) {
    const vistos = [];
    for (const s of ordenadas) for (const p of s.partes) {
      const t = TOPICOS.find((x) => x.id === p.topicoId);
      if (t.trilha === trilha && vistos.at(-1) !== t.id) vistos.push(t.id);
    }
    const esperado = TOPICOS.filter((t) => t.trilha === trilha).map((t) => t.id);
    assert.deepEqual(vistos, esperado, trilha);
  }
  // Nenhuma teoria na Fase 3 (trilhas terminam no mês 8).
  assert.ok(!r.sessoes.some((s) => s.fase === 3 && s.tipo === 'teoria'));
  // Última teoria na semana 32 (fim do mês 8).
  const ultimaTeoria = Math.max(...r.sessoes.filter((s) => s.tipo === 'teoria').map((s) => s.semana));
  assert.equal(ultimaTeoria, 31);
});

test('propriedade 9: mês 1 reproduz a seção A3', () => {
  const { sessoes } = gerarCronograma({ inicio: INICIO, template: SEMANA_PADRAO, topicos: TOPICOS, desde: INICIO });
  const teoria = (data, trilha) => sessoes.find((s) => s.data === data && s.tipo === 'teoria' && s.trilha === trilha)?.topicoIds;
  const d = (semana, dia) => addDays(INICIO, semana * 7 + dia); // dia: 0 = segunda
  const esperadoB = [
    ['port.interpretacao', 'const.principios', 'port.coesao'],
    ['const.direitos', 'port.concordancia', 'const.adm-publica'],
    ['const.fiscalizacao', 'ce.conceitos', 'ce.lc63-1'],
    ['adm.principios', 'port.regencia-crase', 'adm.poderes'],
  ];
  const esperadoT1 = [
    ['si.pilares', 'si.ameaca-risco', 'si.politica'],
    ['si.cripto-simetrica', 'si.cripto-assimetrica', 'si.hash-assinatura'],
    ['si.pki', 'si.iso27001', 'si.iso27002'],
    ['si.malware', 'si.ataques', 'si.riscos'],
  ];
  const esperadoT2 = [
    ['redes.osi', 'redes.enlace'],
    ['redes.ipv4', 'redes.subnet-ipv6'],
    ['redes.transporte', 'redes.aplicacao'],
    ['redes.firewall', 'redes.ids-vpn'],
  ];
  for (let w = 0; w < 4; w++) {
    [0, 2, 4].forEach((dia, i) => {
      assert.deepEqual(teoria(d(w, dia), 'B'), [esperadoB[w][i]], `B semana ${w + 1} dia ${dia}`);
      assert.deepEqual(teoria(d(w, dia), 'T1'), [esperadoT1[w][i]], `T1 semana ${w + 1} dia ${dia}`);
    });
    [1, 3].forEach((dia, i) => assert.deepEqual(teoria(d(w, dia), 'T2'), [esperadoT2[w][i]], `T2 semana ${w + 1}`));
    const sab = sessoes.filter((s) => s.data === d(w, 5));
    const temSimulado = sab.some((s) => s.tipo === 'simulado');
    assert.equal(temSimulado, w === 0 || w === 3, `simulado na semana ${w + 1}`);
    assert.equal(sessoes.filter((s) => s.data === d(w, 6)).length, 0, 'domingo de folga');
  }
  assert.equal(sessoes.find((s) => s.data === d(0, 5) && s.tipo === 'simulado').rotulo, 'Diagnóstico');
});

test('propriedade 2: recálculo não altera sessões passadas nem concluídas', () => {
  const r = rng(99);
  const base = gerarCronograma({ inicio: INICIO, template: SEMANA_PADRAO, topicos: TOPICOS, desde: INICIO }).sessoes;
  for (let i = 0; i < 40; i++) {
    const atuais = base.map((s) => (r.bool(0.1) ? { ...s, concluidaEm: '2027-01-01T10:00:00Z', minutosRealizados: s.minutosPlanejados } : { ...s }));
    const hoje = addDays(INICIO, r.int(0, 300));
    const inativos = new Set(TOPICOS.filter(() => r.bool(0.1)).map((t) => t.id));
    const dataProva = r.bool() ? addDays(hoje, r.int(20, 300)) : undefined;
    const template = r.bool() ? trocarDias(SEMANA_PADRAO, r.int(0, 6), r.int(0, 6)) : SEMANA_PADRAO;
    const antes = JSON.stringify(atuais.filter((s) => s.data < hoje || s.concluidaEm));
    const res = recalcular({
      sessoesAtuais: atuais, hoje, inicio: INICIO, template, topicos: TOPICOS.filter((t) => !inativos.has(t.id)), dataProva,
    });
    assert.equal(JSON.stringify(res.manter), antes);
    const idsMantidos = new Set(res.manter.map((s) => s.id));
    for (const s of res.novas) {
      assert.ok(s.data >= hoje, 'nova sessão no passado');
      assert.ok(!idsMantidos.has(s.id), 'id colidiu com sessão mantida');
      if (dataProva) assert.ok(s.data < dataProva, 'sessão depois da prova');
      for (const p of s.partes) assert.ok(!inativos.has(p.topicoId), 'tópico inativo agendado');
    }
  }
});

test('data da prova: últimas 2 semanas sem teoria e com simulado; tópicos que não cabem são listados', () => {
  const dataProva = addDays(INICIO, 7 * 20 + 5); // sábado da semana 21
  const r = gerarCronograma({ inicio: INICIO, template: SEMANA_PADRAO, topicos: TOPICOS, desde: INICIO, dataProva });
  const semanas = Math.max(...r.sessoes.map((s) => s.semana));
  assert.equal(semanas, 20);
  for (const w of [19, 20]) {
    assert.ok(!r.sessoes.some((s) => s.semana === w && s.tipo === 'teoria'), `teoria na semana ${w}`);
  }
  // Semana 20 (índice 19) tem simulado no sábado; na semana da prova o sábado é o dia da prova.
  assert.ok(r.sessoes.some((s) => s.semana === 19 && s.tipo === 'simulado'));
  assert.ok(!r.sessoes.some((s) => s.data === dataProva));
  assert.ok(r.atrasados.length > 0);
  assert.ok(r.foraDoPlano.length > 0);
  assert.ok(r.sessoes.every((s) => s.data < dataProva));
});

// Geração do cronograma (design.md, B5.1, B5.2 e B13).
import { addDays, diffDays, mondayOf, offsetFromMonday } from './dates.js';

/**
 * @typedef {'teoria'|'questoes'|'revisao'|'recuperacao'|'simulado'} TipoSessao
 * @typedef {{dia:number, tipo:TipoSessao, trilha?:'B'|'T1'|'T2', minutos:number}} SlotSemana
 * @typedef {{topicoId:string, minutos:number}} Parte
 * @typedef {{id:string, data:string, semana:number, fase:number, tipo:TipoSessao, trilha?:string,
 *   partes:Parte[], topicoIds:string[], minutosPlanejados:number, rotulo?:string,
 *   minutosRealizados?:number, concluidaEm?:string}} Sessao
 */

export const SEMANAS_PLANO = 48;
export const SEMANAS_GERADAS = 52; // após a semana 48, segue em Fase 3
export const MINUTOS_SEMANA = 840;

/** Semana-modelo padrão (seção A2). @type {SlotSemana[]} */
export const SEMANA_PADRAO = [
  ...[1, 3, 5].flatMap((dia) => [
    { dia, tipo: 'teoria', trilha: 'B', minutos: 60 },
    { dia, tipo: 'teoria', trilha: 'T1', minutos: 45 },
    { dia, tipo: 'questoes', minutos: 15 },
  ]),
  ...[2, 4].flatMap((dia) => [
    { dia, tipo: 'teoria', trilha: 'T2', minutos: 80 },
    { dia, tipo: 'questoes', minutos: 40 },
  ]),
  { dia: 6, tipo: 'revisao', minutos: 60 },
  { dia: 6, tipo: 'questoes', minutos: 120 },
  { dia: 6, tipo: 'recuperacao', minutos: 60 },
];

export const FATOR_FASE = { 1: 1, 2: 0.85, 3: 0.5 };

const round5 = (x) => Math.round(x / 5) * 5;

/** Troca as sessões de dois dias da semana-modelo (Req. 1.6). Mantém o total. */
export function trocarDias(template, diaA, diaB) {
  return template.map((s) =>
    s.dia === diaA ? { ...s, dia: diaB } : s.dia === diaB ? { ...s, dia: diaA } : { ...s },
  );
}

export function totalMinutos(template) {
  return template.reduce((acc, s) => acc + s.minutos, 0);
}

/**
 * Calendário de fases.
 * @param {string} inicio segunda-feira de início
 * @param {string|undefined} dataProva
 */
export function calendario(inicio, dataProva) {
  if (!dataProva) {
    return { totalSemanas: SEMANAS_GERADAS, inicioFase2: 16, inicioFase3: 32, semanasFinais: null, semanaProva: null };
  }
  // Semanas cuja segunda-feira é anterior à prova.
  const semanaProva = Math.max(1, Math.ceil(diffDays(inicio, dataProva) / 7));
  return { totalSemanas: semanaProva, semanaProva };
}

/**
 * Fase e marcadores de uma semana.
 * @param {number} semana índice (0 = primeira semana)
 * @param {{inicioFase2:number, inicioFase3:number, totalSemanas:number, semanaProva:number|null}} cal
 */
export function infoSemana(semana, cal) {
  const fase = semana >= cal.inicioFase3 ? 3 : semana >= cal.inicioFase2 ? 2 : 1;
  const mes = Math.min(12, Math.floor(semana / 4) + 1);
  const semanaNoMes = semana % 4; // 0..3
  const final = cal.semanaProva != null && semana >= cal.semanaProva - 2;
  let simulado = false;
  if (semana === 0) simulado = true;
  else if (final || fase === 3) simulado = true;
  else if (fase === 1) simulado = semanaNoMes === 3;
  else if (fase === 2) simulado = semanaNoMes === 1 || semanaNoMes === 3;
  return { fase, mes, semanaNoMes, final, simulado };
}

/**
 * Calcula as fases quando há data de prova (B5.2): a Fase 3 ocupa as últimas
 * max(4, 33% das semanas restantes) semanas.
 */
export function calendarioComProva(inicio, dataProva, semanaAtual) {
  const base = calendario(inicio, dataProva);
  if (!dataProva) return base;
  const W = base.totalSemanas;
  const restantes = Math.max(0, W - semanaAtual);
  const len3 = Math.max(4, Math.ceil(restantes * 0.33));
  const inicioFase3 = Math.max(0, W - len3);
  const inicioFase2 = Math.min(16, Math.floor(inicioFase3 / 2));
  return { totalSemanas: W, inicioFase2, inicioFase3, semanaProva: W };
}

/**
 * Aplica a fase e o simulado à semana-modelo, preservando o total de minutos.
 * Retorna os slots agrupados por dia (0..6), na ordem original.
 * @param {SlotSemana[]} template
 * @param {{fase:number, simulado:boolean, final:boolean}} info
 * @returns {Map<number, (SlotSemana & {rotulo?:string})[]>}
 */
export function transformarSemana(template, info, semana = -1) {
  /** @type {Map<number, any[]>} */
  const porDia = new Map();
  for (const s of template) {
    if (!porDia.has(s.dia)) porDia.set(s.dia, []);
    porDia.get(s.dia).push({ ...s });
  }
  const fator = info.final ? 0 : FATOR_FASE[info.fase];

  for (const [dia, slots] of porDia) {
    let retirado = 0;
    const novos = [];
    for (const s of slots) {
      if (s.tipo === 'teoria' && fator < 1) {
        const m = fator === 0 ? 0 : round5(s.minutos * fator);
        retirado += s.minutos - m;
        if (m > 0) novos.push({ ...s, minutos: m });
      } else {
        novos.push(s);
      }
    }
    if (retirado > 0) {
      const q = novos.find((s) => s.tipo === 'questoes');
      if (q) q.minutos += retirado;
      else novos.push({ dia, tipo: 'questoes', minutos: retirado });
    }
    porDia.set(dia, novos);
  }

  if (info.simulado) {
    // O dia de maior carga (empate: o mais próximo do fim de semana) vira simulado + correção.
    let melhor = null;
    let melhorTotal = -1;
    for (const [dia, slots] of porDia) {
      const t = slots.reduce((a, s) => a + s.minutos, 0);
      const ordem = offsetFromMonday(dia);
      if (t > melhorTotal || (t === melhorTotal && ordem > offsetFromMonday(melhor))) {
        melhor = dia;
        melhorTotal = t;
      }
    }
    if (melhor != null && melhorTotal > 0) {
      const sim = melhorTotal >= 120 ? Math.min(180, melhorTotal - 60) : melhorTotal;
      const rotulo = semana === 0 ? 'Diagnóstico' : 'Simulado';
      const novos = [{ dia: melhor, tipo: 'simulado', minutos: sim, rotulo }];
      if (melhorTotal - sim > 0) {
        novos.push({ dia: melhor, tipo: 'revisao', minutos: melhorTotal - sim, rotulo: 'Correção do simulado e caderno de erros' });
      }
      porDia.set(melhor, novos);
    }
  }
  return porDia;
}

/**
 * Gera as sessões a partir de `desde` (inclusive), preservando as sessões em `manter`.
 * @param {{
 *   inicio:string, template:SlotSemana[], topicos:{id:string,trilha:string,ordem:number,minutos:number}[],
 *   desde:string, manter?:Sessao[], dataProva?:string
 * }} p
 * @returns {{sessoes:Sessao[], atrasados:string[], foraDoPlano:string[]}}
 */
export function gerarCronograma(p) {
  const manter = p.manter ?? [];
  const inicio = mondayOf(p.inicio);
  const desde = p.desde < inicio ? inicio : p.desde;
  const semanaDesde = Math.floor(diffDays(inicio, desde) / 7);
  const cal = calendarioComProva(inicio, p.dataProva, semanaDesde);
  const idsMantidos = new Set(manter.map((s) => s.id));

  // Minutos já consumidos pelas sessões mantidas.
  const consumido = new Map();
  for (const s of manter) {
    for (const parte of s.partes ?? []) {
      consumido.set(parte.topicoId, (consumido.get(parte.topicoId) ?? 0) + parte.minutos);
    }
  }

  const filas = { B: [], T1: [], T2: [] };
  for (const t of [...p.topicos].sort((a, b) => a.ordem - b.ordem)) {
    const restante = t.minutos - (consumido.get(t.id) ?? 0);
    if (restante > 0 && filas[t.trilha]) filas[t.trilha].push({ id: t.id, restante });
  }

  /** @type {Sessao[]} */
  const sessoes = [];
  const atrasados = new Set();
  let registrouAtraso = false;

  for (let semana = 0; semana < cal.totalSemanas; semana++) {
    const segunda = addDays(inicio, semana * 7);
    if (addDays(segunda, 6) < desde) continue;
    const info = infoSemana(semana, cal);

    if (!registrouAtraso && semana >= cal.inicioFase3) {
      for (const fila of Object.values(filas)) for (const t of fila) atrasados.add(t.id);
      registrouAtraso = true;
    }

    const porDia = transformarSemana(p.template, info, semana);
    const topicosSemana = [];
    const dias = [...porDia.keys()].sort((a, b) => offsetFromMonday(a) - offsetFromMonday(b));

    for (const dia of dias) {
      const data = addDays(segunda, offsetFromMonday(dia));
      if (data < desde) continue;
      if (p.dataProva && data >= p.dataProva) continue;
      const topicosDia = [];
      const slots = porDia.get(dia);

      slots.forEach((slot, i) => {
        const id = `${data}#${i}`;
        if (idsMantidos.has(id)) return;
        const base = { id, data, semana, fase: info.fase, minutosPlanejados: slot.minutos };
        if (slot.rotulo) base.rotulo = slot.rotulo;

        if (slot.tipo === 'teoria') {
          const fila = filas[slot.trilha];
          const partes = [];
          let resto = slot.minutos;
          while (resto > 0 && fila.length) {
            const t = fila[0];
            const take = Math.min(resto, t.restante);
            partes.push({ topicoId: t.id, minutos: take });
            t.restante -= take;
            resto -= take;
            if (t.restante === 0) fila.shift();
          }
          if (partes.length === 0) {
            sessoes.push({ ...base, tipo: 'questoes', partes: [], topicoIds: [] });
            return;
          }
          const ids = partes.map((x) => x.topicoId);
          topicosDia.push(...ids);
          topicosSemana.push(...ids);
          sessoes.push({ ...base, minutosPlanejados: slot.minutos - resto, tipo: 'teoria', trilha: slot.trilha, partes, topicoIds: ids });
          if (resto > 0) {
            sessoes.push({ id: `${id}q`, data, semana, fase: info.fase, minutosPlanejados: resto, tipo: 'questoes', partes: [], topicoIds: [...ids] });
          }
          return;
        }

        if (slot.tipo === 'questoes') {
          const ids = topicosDia.length ? topicosDia : topicosSemana;
          sessoes.push({ ...base, tipo: 'questoes', partes: [], topicoIds: [...new Set(ids)] });
          return;
        }

        sessoes.push({ ...base, tipo: slot.tipo, partes: [], topicoIds: [] });
      });
    }
  }

  const foraDoPlano = Object.values(filas).flatMap((f) => f.map((t) => t.id));
  return { sessoes, atrasados: [...atrasados], foraDoPlano };
}

/**
 * Recalcula o cronograma a partir de hoje (Req. 1.5 e 8.5): mantém sessões passadas e concluídas.
 * @returns {{manter:Sessao[], novas:Sessao[], atrasados:string[], foraDoPlano:string[]}}
 */
export function recalcular({ sessoesAtuais, hoje, inicio, template, topicos, dataProva }) {
  const manter = sessoesAtuais.filter((s) => s.data < hoje || s.concluidaEm);
  const r = gerarCronograma({ inicio, template, topicos, desde: hoje, manter, dataProva });
  return { manter, novas: r.sessoes, atrasados: r.atrasados, foraDoPlano: r.foraDoPlano };
}

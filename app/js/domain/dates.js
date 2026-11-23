// Datas locais no formato AAAA-MM-DD. Cálculos em UTC para evitar problemas de fuso/horário de verão.

const DIA_MS = 86400000;

/** @param {string} s AAAA-MM-DD */
export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** @param {number} ms */
export function formatDate(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

/** @param {string} s @param {number} n */
export function addDays(s, n) {
  return formatDate(parseDate(s) + n * DIA_MS);
}

/** Dias de a até b (b − a). */
export function diffDays(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / DIA_MS);
}

/** 0 = domingo ... 6 = sábado */
export function dayOfWeek(s) {
  return new Date(parseDate(s)).getUTCDay();
}

/** Segunda-feira da semana de s. */
export function mondayOf(s) {
  return addDays(s, -((dayOfWeek(s) + 6) % 7));
}

/** Data local de hoje. */
export function today(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/** Deslocamento dentro da semana iniciada na segunda (seg = 0 ... dom = 6). */
export function offsetFromMonday(dia) {
  return (dia + 6) % 7;
}

export const NOMES_DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const NOMES_DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/** dd/mm */
export function fmtBR(s) {
  const [, m, d] = s.split('-');
  return `${d}/${m}`;
}

/** dd/mm/aaaa */
export function fmtBRCompleto(s) {
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

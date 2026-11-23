// Construtores compactos para as questões autorais. O id é estável (tópico + ordem), para que
// atualizações do banco inicial não dupliquem questões.
const contadores = new Map();

function proximoId(topicoId) {
  const n = (contadores.get(topicoId) ?? 0) + 1;
  contadores.set(topicoId, n);
  return `seed:${topicoId}:${n}`;
}

export function CE(topicoId, enunciado, gabarito, comentario, referencia) {
  return { id: proximoId(topicoId), topicoId, formato: 'CE', enunciado, gabarito, comentario, referencia, origem: 'autoral' };
}

export function ME(topicoId, enunciado, alternativas, gabarito, comentario, referencia) {
  return { id: proximoId(topicoId), topicoId, formato: 'ME', enunciado, alternativas, gabarito, comentario, referencia, origem: 'autoral' };
}

// Importação de questões em JSON ou CSV (design.md, B6; Req. 6.3 e 6.4).

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

export function normalizar(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Parser de CSV com aspas (RFC 4180), separador configurável. Retorna linhas com o número da linha no arquivo.
 * @returns {{linha:number, campos:string[]}[]}
 */
export function parseCSV(texto, sep = ';') {
  const linhas = [];
  let campos = [];
  let campo = '';
  let aspas = false;
  let linhaAtual = 1;
  let linhaInicio = 1;
  const t = texto.replace(/^\uFEFF/, '');
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (aspas) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          campo += '"';
          i++;
        } else aspas = false;
      } else {
        if (c === '\n') linhaAtual++;
        campo += c;
      }
      continue;
    }
    if (c === '"') aspas = true;
    else if (c === sep) {
      campos.push(campo);
      campo = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++;
      campos.push(campo);
      if (campos.some((x) => x.trim() !== '')) linhas.push({ linha: linhaInicio, campos });
      campos = [];
      campo = '';
      linhaAtual++;
      linhaInicio = linhaAtual;
    } else campo += c;
  }
  campos.push(campo);
  if (campos.some((x) => x.trim() !== '')) linhas.push({ linha: linhaInicio, campos });
  return linhas;
}

/**
 * Resolve o tópico: por `topicoId` ou por `disciplina` + `topico` (nomes, sem acento/caixa).
 */
function resolverTopico(reg, topicos, disciplinas) {
  if (reg.topicoId) return topicos.find((t) => t.id === reg.topicoId)?.id ?? null;
  if (reg.topico) {
    const nt = normalizar(reg.topico);
    const nd = normalizar(reg.disciplina);
    const disc = nd ? disciplinas.find((d) => normalizar(d.nome) === nd || d.id === nd) : null;
    const cand = topicos.filter((t) => (!disc || t.disciplinaId === disc.id) && (normalizar(t.nome) === nt || normalizar(t.nome).includes(nt)));
    return cand.length === 1 ? cand[0].id : null;
  }
  return null;
}

function gabaritoME(g) {
  if (typeof g === 'number') return g;
  const s = String(g ?? '').trim().toUpperCase();
  if (LETRAS.includes(s)) return LETRAS.indexOf(s);
  if (/^\d+$/.test(s)) return Number(s);
  return NaN;
}

function gabaritoCE(g) {
  if (typeof g === 'boolean') return g;
  const s = normalizar(g);
  if (['c', 'certo', 'true', 'v', 'verdadeiro'].includes(s)) return true;
  if (['e', 'errado', 'false', 'f', 'falso'].includes(s)) return false;
  return null;
}

/**
 * Valida e normaliza um registro.
 * @returns {{ok:true, questao:object} | {ok:false, motivo:string}}
 */
export function validarRegistro(reg, topicos, disciplinas) {
  if (!reg || typeof reg !== 'object') return { ok: false, motivo: 'registro inválido' };
  const formato = String(reg.formato ?? '').trim().toUpperCase();
  if (formato !== 'ME' && formato !== 'CE') return { ok: false, motivo: 'formato deve ser ME ou CE' };
  const enunciado = String(reg.enunciado ?? '').trim();
  if (!enunciado) return { ok: false, motivo: 'enunciado vazio' };
  const topicoId = resolverTopico(reg, topicos, disciplinas);
  if (!topicoId) return { ok: false, motivo: 'tópico não encontrado' };
  const comentario = String(reg.comentario ?? '').trim();
  const referencia = String(reg.referencia ?? '').trim();

  if (formato === 'ME') {
    const alts = (Array.isArray(reg.alternativas) ? reg.alternativas : []).map((a) => String(a ?? '').trim()).filter(Boolean);
    if (alts.length < 2 || alts.length > 5) return { ok: false, motivo: 'múltipla escolha precisa de 2 a 5 alternativas' };
    const g = gabaritoME(reg.gabarito);
    if (!Number.isInteger(g) || g < 0 || g >= alts.length) return { ok: false, motivo: 'gabarito fora das alternativas' };
    return { ok: true, questao: { topicoId, formato, enunciado, alternativas: alts, gabarito: g, comentario, referencia } };
  }
  const g = gabaritoCE(reg.gabarito);
  if (g === null) return { ok: false, motivo: 'gabarito de certo/errado deve ser C ou E' };
  return { ok: true, questao: { topicoId, formato, enunciado, gabarito: g, comentario, referencia } };
}

/** @returns {{validas:object[], erros:{linha:number, motivo:string}[]}} */
export function importarJSON(texto, topicos, disciplinas) {
  let dados;
  try {
    dados = JSON.parse(texto);
  } catch (e) {
    return { validas: [], erros: [{ linha: 0, motivo: 'JSON inválido: ' + e.message }] };
  }
  if (!Array.isArray(dados)) dados = dados?.questoes;
  if (!Array.isArray(dados)) return { validas: [], erros: [{ linha: 0, motivo: 'o arquivo deve conter uma lista de questões' }] };
  const validas = [];
  const erros = [];
  dados.forEach((reg, i) => {
    const r = validarRegistro(reg, topicos, disciplinas);
    if (r.ok) validas.push(r.questao);
    else erros.push({ linha: i + 1, motivo: r.motivo });
  });
  return { validas, erros };
}

export const CABECALHO_CSV = ['topicoId', 'formato', 'enunciado', 'altA', 'altB', 'altC', 'altD', 'altE', 'gabarito', 'comentario', 'referencia'];

/** @returns {{validas:object[], erros:{linha:number, motivo:string}[]}} */
export function importarCSV(texto, topicos, disciplinas) {
  const linhas = parseCSV(texto);
  if (!linhas.length) return { validas: [], erros: [{ linha: 0, motivo: 'arquivo vazio' }] };
  const cab = linhas[0].campos.map((c) => c.trim());
  const idx = (nome) => cab.findIndex((c) => normalizar(c) === normalizar(nome));
  const faltando = ['formato', 'enunciado', 'gabarito'].filter((c) => idx(c) < 0);
  if (faltando.length || (idx('topicoId') < 0 && idx('topico') < 0)) {
    return { validas: [], erros: [{ linha: 1, motivo: 'cabeçalho deve ter: ' + CABECALHO_CSV.join(';') }] };
  }
  const validas = [];
  const erros = [];
  for (const { linha, campos } of linhas.slice(1)) {
    const get = (n) => (idx(n) >= 0 ? campos[idx(n)] ?? '' : '');
    const reg = {
      topicoId: get('topicoId') || undefined,
      topico: get('topico') || undefined,
      disciplina: get('disciplina') || undefined,
      formato: get('formato'),
      enunciado: get('enunciado'),
      alternativas: ['altA', 'altB', 'altC', 'altD', 'altE'].map(get),
      gabarito: get('gabarito'),
      comentario: get('comentario'),
      referencia: get('referencia'),
    };
    const r = validarRegistro(reg, topicos, disciplinas);
    if (r.ok) validas.push(r.questao);
    else erros.push({ linha, motivo: r.motivo });
  }
  return { validas, erros };
}

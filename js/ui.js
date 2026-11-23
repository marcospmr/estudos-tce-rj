// Utilitários de interface. Todo texto entra como nó de texto (nunca como HTML) para evitar injeção
// de scripts a partir de questões importadas (design.md, B6).

/**
 * Cria um elemento. Atributos: class, on<evento>, dataset, style (objeto) ou atributos comuns.
 * Filhos: string | número | Node | array | null/false (ignorados).
 * @returns {HTMLElement}
 */
export function h(tag, attrs = {}, ...filhos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k in el && typeof v !== 'string') el[k] = v;
    else el.setAttribute(k, v === true ? '' : String(v));
  }
  anexar(el, ...filhos);
  return el;
}

/** Anexa filhos ignorando null/undefined/false e achatando listas (o append nativo escreveria "null"). */
export function anexar(el, ...filhos) {
  for (const f of filhos.flat(Infinity)) {
    if (f === null || f === undefined || f === false) continue;
    el.append(f instanceof Node ? f : document.createTextNode(String(f)));
  }
}

export function limpar(el) {
  while (el.firstChild) el.firstChild.remove();
}

export function pct(x) {
  return `${Math.round(x * 100)}%`;
}

export function horas(min) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

let toastTimer = null;
export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = h('div', { id: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('visivel');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visivel'), 2600);
}

export function card(titulo, ...conteudo) {
  return h('section', { class: 'card' }, titulo ? h('h2', {}, titulo) : null, ...conteudo);
}

export function botao(texto, onclick, classe = '') {
  return h('button', { type: 'button', class: `btn ${classe}`.trim(), onclick }, texto);
}

export function link(texto, href, classe = '') {
  return h('a', { href, class: classe }, texto);
}

export function select(opcoes, valor, onchange, attrs = {}) {
  return h(
    'select',
    { ...attrs, onchange: (e) => onchange(e.target.value) },
    opcoes.map(([v, t]) => h('option', { value: v, selected: v === valor }, t)),
  );
}

export function campo(rotulo, controle) {
  return h('label', { class: 'campo' }, h('span', {}, rotulo), controle);
}

/** Barra de progresso simples. */
export function barra(valor, max, classe = '') {
  const p = max ? Math.min(1, valor / max) : 0;
  return h('div', { class: `barra ${classe}`.trim(), role: 'progressbar', 'aria-valuenow': String(Math.round(p * 100)), 'aria-valuemin': '0', 'aria-valuemax': '100' },
    h('div', { style: { width: `${p * 100}%` } }));
}

/** Leitura de arquivo escolhido pelo usuário. */
export function escolherArquivo(accept) {
  return new Promise((resolve) => {
    const input = h('input', { type: 'file', accept, style: { display: 'none' } });
    input.addEventListener('change', () => {
      const f = input.files?.[0];
      input.remove();
      resolve(f ?? null);
    });
    document.body.append(input);
    input.click();
  });
}

const SVG_NS = 'http://www.w3.org/2000/svg';
export function svg(tag, attrs = {}, ...filhos) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) el.setAttribute(k, String(v));
  for (const f of filhos.flat(Infinity)) {
    if (f === null || f === undefined || f === false) continue;
    el.append(f instanceof Node ? f : document.createTextNode(String(f)));
  }
  return el;
}

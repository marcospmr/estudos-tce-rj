// Exibição de questão: treino/revisão (correção imediata) e simulado (sem correção).
import { h, botao, toast, anexar } from './ui.js';
import * as db from './db.js';
import { nomeTopico, nomeDisciplina, disciplinaDoTopico, registrarTentativa } from './state.js';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

export function rotuloResposta(q, r) {
  if (r === null || r === undefined) return 'em branco';
  if (q.formato === 'CE') return r ? 'Certo' : 'Errado';
  return LETRAS[r];
}

function opcoes(q) {
  if (q.formato === 'CE') return [[true, 'Certo'], [false, 'Errado']];
  return q.alternativas.map((a, i) => [i, a]);
}

function cabecalho(q) {
  return h('div', { class: 'q-meta' },
    h('span', { class: 'tag' }, nomeDisciplina(disciplinaDoTopico(q.topicoId))),
    h('span', { class: 'tag tag-suave' }, q.formato === 'CE' ? 'Certo/Errado' : 'Múltipla escolha'),
    q.origem !== 'autoral' ? h('span', { class: 'tag tag-suave' }, 'Minha') : null,
  );
}

/**
 * Questão com correção imediata (Req. 2.2, 2.6, 3.6, 3.7).
 * @param {{q:any, modo:'treino'|'revisao', onProxima:()=>void, onEditar?:()=>void, onResultado?:(correta:boolean)=>void, rotuloProxima?:string}} p
 */
export function questaoTreino({ q, modo, onProxima, onEditar, onResultado, rotuloProxima = 'Próxima' }) {
  const inicio = performance.now();
  let selecionada = undefined;
  let confirmada = false;

  const botoes = opcoes(q).map(([valor, texto], i) => {
    const b = h('button', {
      type: 'button',
      class: `alt ${q.formato === 'CE' ? 'alt-ce' : ''}`,
      'aria-pressed': 'false',
      onclick: () => {
        if (confirmada) return;
        selecionada = valor;
        botoes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        confirmar.disabled = false;
      },
    },
    q.formato === 'ME' ? h('span', { class: 'alt-letra' }, LETRAS[i]) : null,
    h('span', { class: 'alt-texto' }, texto));
    b.dataset.valor = String(valor);
    return b;
  });

  const feedback = h('div', { class: 'feedback', hidden: true });
  const confirmar = h('button', { type: 'button', class: 'btn btn-primario btn-bloco', disabled: true, onclick: async () => {
    if (confirmada || selecionada === undefined) return;
    confirmada = true;
    confirmar.disabled = true;
    const { correta } = await registrarTentativa(q, selecionada, Math.round(performance.now() - inicio), modo);
    onResultado?.(correta);
    mostrarFeedback(correta);
  } }, 'Confirmar resposta');

  function mostrarFeedback(correta) {
    botoes.forEach((b) => {
      b.disabled = true;
      const v = b.dataset.valor;
      if (v === String(q.gabarito)) b.classList.add('alt-correta');
      else if (v === String(selecionada)) b.classList.add('alt-errada');
    });
    confirmar.remove();
    feedback.hidden = false;
    feedback.classList.add(correta ? 'ok' : 'erro');
    anexar(feedback, 
      h('p', { class: 'resultado' }, correta ? 'Você acertou' : 'Você errou'),
      h('p', {}, h('strong', {}, 'Gabarito: '), rotuloResposta(q, q.gabarito)),
      q.comentario ? h('p', { class: 'comentario' }, q.comentario) : null,
      q.referencia ? h('p', { class: 'referencia' }, 'Fonte: ', q.referencia) : null,
      correta ? null : painelErro(q),
      h('div', { class: 'acoes' },
        onEditar ? botao('Editar questão', onEditar, 'btn-secundario') : null,
        botao(rotuloProxima, onProxima, 'btn-primario')),
    );
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return h('article', { class: 'questao' },
    cabecalho(q),
    h('p', { class: 'q-topico' }, nomeTopico(q.topicoId)),
    h('p', { class: 'enunciado' }, q.enunciado),
    h('div', { class: 'alternativas' }, botoes),
    confirmar,
    feedback,
  );
}

/** Classificação do erro e anotação pessoal (Req. 3.6 e 3.7). */
export function painelErro(q) {
  const tipos = [['nao-sabia', 'Não sabia'], ['desatencao', 'Desatenção'], ['chute', 'Chute']];
  const area = h('textarea', { rows: 2, placeholder: 'Anotação: por que errei, regra correta...' });
  const chips = tipos.map(([v, t]) => h('button', { type: 'button', class: 'chip', 'aria-pressed': 'false', onclick: async () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.v === v)));
    await salvar({ tipoErro: v });
  } }, t));
  chips.forEach((c, i) => (c.dataset.v = tipos[i][0]));

  db.get('revisao', q.id).then((item) => {
    if (!item) return;
    if (item.anotacao) area.value = item.anotacao;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.v === item.tipoErro)));
  });

  const salvar = (parcial) => db.update('revisao', q.id, (item) => (item ? { ...item, ...parcial } : undefined));
  area.addEventListener('change', async () => {
    await salvar({ anotacao: area.value.trim() });
    toast('Anotação salva');
  });

  return h('div', { class: 'painel-erro' },
    h('p', { class: 'pequeno' }, 'A questão entrou no caderno de erros e volta amanhã. Tipo de erro:'),
    h('div', { class: 'chips' }, chips),
    area);
}

/**
 * Questão de simulado: marca a resposta, sem correção (Req. 4.2).
 * @param {{q:any, resposta:any, onResponder:(v:any)=>void}} p
 */
export function questaoSimulado({ q, resposta, onResponder }) {
  const botoes = opcoes(q).map(([valor, texto], i) => {
    const b = h('button', {
      type: 'button',
      class: `alt ${q.formato === 'CE' ? 'alt-ce' : ''}`,
      'aria-pressed': String(resposta === valor),
      onclick: () => {
        const novo = resposta === valor ? null : valor; // tocar de novo desmarca (em branco)
        resposta = novo;
        botoes.forEach((x, k) => x.setAttribute('aria-pressed', String(opcoes(q)[k][0] === novo)));
        onResponder(novo);
      },
    },
    q.formato === 'ME' ? h('span', { class: 'alt-letra' }, LETRAS[i]) : null,
    h('span', { class: 'alt-texto' }, texto));
    return b;
  });
  return h('article', { class: 'questao' },
    cabecalho(q),
    h('p', { class: 'enunciado' }, q.enunciado),
    h('div', { class: 'alternativas' }, botoes),
    h('p', { class: 'pequeno' }, 'Toque de novo na alternativa marcada para deixar em branco.'),
  );
}

/** Revisão de uma questão já respondida (resultado do simulado). */
export function questaoRevisada(q, resposta, numero) {
  const correta = resposta !== null && resposta !== undefined && resposta === q.gabarito;
  const branco = resposta === null || resposta === undefined;
  return h('details', { class: `revisada ${branco ? 'branco' : correta ? 'ok' : 'erro'}` },
    h('summary', {}, `${numero}. `, branco ? 'Em branco' : correta ? 'Acertou' : 'Errou', ' · ', nomeDisciplina(disciplinaDoTopico(q.topicoId))),
    h('p', { class: 'enunciado' }, q.enunciado),
    q.formato === 'ME' ? h('ol', { class: 'lista-alts', type: 'A' }, q.alternativas.map((a, i) =>
      h('li', { class: i === q.gabarito ? 'correta' : i === resposta ? 'errada' : '' }, a))) : null,
    h('p', {}, h('strong', {}, 'Sua resposta: '), rotuloResposta(q, resposta), ' · ', h('strong', {}, 'Gabarito: '), rotuloResposta(q, q.gabarito)),
    q.comentario ? h('p', { class: 'comentario' }, q.comentario) : null,
    q.referencia ? h('p', { class: 'referencia' }, 'Fonte: ', q.referencia) : null,
  );
}

// Roteamento por hash e inicialização.
import { h, limpar, anexar } from './ui.js';
import { carregar } from './state.js';
import * as hoje from './pages/hoje.js';
import * as questoes from './pages/questoes.js';
import * as revisao from './pages/revisao.js';
import * as simulados from './pages/simulados.js';
import * as cronograma from './pages/cronograma.js';
import * as desempenho from './pages/desempenho.js';
import * as ajustes from './pages/ajustes.js';
import * as mais from './pages/mais.js';

const ROTAS = {
  '/hoje': { aba: 'hoje', render: hoje.render },
  '/questoes': { aba: 'questoes', render: questoes.render },
  '/revisao': { aba: 'revisao', render: revisao.render },
  '/simulados': { aba: 'simulados', render: simulados.renderLista },
  '/simulados/novo': { aba: 'simulados', render: simulados.renderNovo },
  '/simulado': { aba: 'simulados', render: simulados.renderSimulado },
  '/cronograma': { aba: 'mais', render: cronograma.render },
  '/desempenho': { aba: 'mais', render: desempenho.render },
  '/ajustes': { aba: 'mais', render: ajustes.render },
  '/mais': { aba: 'mais', render: mais.render },
};

const main = document.getElementById('app');
let limpeza = null;
let geracao = 0;

async function navegar() {
  const [caminho, query] = (location.hash.slice(1) || '/hoje').split('?');
  const rota = ROTAS[caminho] ?? ROTAS['/hoje'];
  const params = new URLSearchParams(query ?? '');
  if (typeof limpeza === 'function') limpeza();
  limpeza = null;
  const minha = ++geracao;
  limpar(main);
  document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('ativo', a.dataset.aba === rota.aba));
  const tela = h('div', { class: 'tela' });
  anexar(main, tela);
  try {
    const r = await rota.render(tela, params);
    if (minha !== geracao) {
      if (typeof r === 'function') r();
      return;
    }
    limpeza = r;
  } catch (e) {
    console.error(e);
    anexar(tela, h('section', { class: 'card' }, h('h2', {}, 'Algo deu errado'), h('p', {}, String(e?.message ?? e)), h('a', { href: '#/hoje' }, 'Voltar ao início')));
  }
  window.scrollTo({ top: 0 });
}

function registrarSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    const avisar = (sw) => {
      const barra = h('div', { class: 'atualizacao' },
        h('span', {}, 'Nova versão disponível.'),
        h('button', { type: 'button', class: 'btn btn-primario', onclick: () => sw.postMessage('skipWaiting') }, 'Recarregar'));
      anexar(document.body, barra);
    };
    if (reg.waiting && navigator.serviceWorker.controller) avisar(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      sw?.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) avisar(sw);
      });
    });
  });
  let recarregando = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recarregando) return;
    recarregando = true;
    location.reload();
  });
}

async function iniciar() {
  try {
    await carregar();
  } catch (e) {
    anexar(main, h('section', { class: 'card' }, h('h2', {}, 'Não foi possível abrir o armazenamento'),
      h('p', {}, 'Verifique se o navegador não está em modo anônimo/privado e tente novamente.'), h('p', { class: 'pequeno' }, String(e?.message ?? e))));
    return;
  }
  window.addEventListener('hashchange', navegar);
  await navegar();
  registrarSW();
}

iniciar();

// Menu "Mais": cronograma, desempenho, ajustes e instruções de instalação.
import { h, card, anexar } from '../ui.js';

export async function render(root) {
  const instalado = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Mais')),
    h('nav', { class: 'menu-mais' },
      h('a', { href: '#/cronograma' }, h('strong', {}, 'Cronograma'), h('span', {}, 'Semanas do plano e semana-modelo')),
      h('a', { href: '#/desempenho' }, h('strong', {}, 'Desempenho'), h('span', {}, 'Acerto por disciplina, horas e simulados')),
      h('a', { href: '#/ajustes' }, h('strong', {}, 'Ajustes'), h('span', {}, 'Edital, conteúdo, questões e backup'))),
    instalado ? null : card('Instale o app no celular',
      h('p', {}, h('strong', {}, 'Android (Chrome): '), 'abra o menu de três pontos e toque em "Instalar app" ou "Adicionar à tela inicial".'),
      h('p', {}, h('strong', {}, 'iPhone (Safari): '), 'toque em Compartilhar e depois em "Adicionar à Tela de Início".'),
      h('p', { class: 'pequeno' }, 'Instalado, o app abre em tela cheia, funciona sem internet e o navegador tem menos chance de apagar seus dados.')),
    h('p', { class: 'pequeno centro' }, 'Estudos TCE-RJ · dados salvos só neste aparelho'),
  );
}

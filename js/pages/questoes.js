// Resolução de questões com filtros (Req. 2.1 a 2.6, 8.4).
import { h, card, botao, campo, select, limpar, anexar } from '../ui.js';
import * as db from '../db.js';
import { DISCIPLINAS } from '../data/curriculum.js';
import { estado, topicosAtivos, nomeTopico, questoesAtivas, formatoPreferido, embaralhar } from '../state.js';
import { statusQuestoes } from '../domain/stats.js';
import { today } from '../domain/dates.js';
import { iniciarPratica } from '../pratica.js';
import { estudadosAte } from './hoje.js';

export async function render(root, params) {
  const [questoes, tentativas, sessoes] = await Promise.all([questoesAtivas(), db.getAll('tentativas'), db.getAll('sessoes')]);
  const status = statusQuestoes(tentativas);
  const ativos = topicosAtivos();

  const f = {
    disciplina: '',
    topico: '',
    formato: params.get('formato') ?? formatoPreferido(),
    status: params.get('status') ?? 'nao-acertadas',
    origem: '',
    quantidade: '20',
    topicos: (params.get('topicos') ?? '').split(',').filter(Boolean),
    estudados: params.get('estudados') === '1',
  };
  if (f.estudados) f.topicos = estudadosAte(sessoes, today());

  const filtrar = () => questoes.filter((q) => {
    if (f.topicos.length && !f.topicos.includes(q.topicoId)) return false;
    if (f.disciplina && !q.topicoId.startsWith(f.disciplina + '.')) return false;
    if (f.topico && q.topicoId !== f.topico) return false;
    if (f.formato && q.formato !== f.formato) return false;
    if (f.origem === 'autoral' && q.origem !== 'autoral') return false;
    if (f.origem === 'minhas' && q.origem === 'autoral') return false;
    const st = status(q.id);
    if (f.status === 'nao-acertadas' && st === 'acertada') return false;
    if (f.status !== 'todas' && f.status !== 'nao-acertadas' && st !== f.status) return false;
    return true;
  });

  const contador = h('p', { class: 'contador' });
  const selTopico = h('div');
  const atualizar = () => {
    const n = filtrar().length;
    contador.textContent = n === 1 ? '1 questão disponível' : `${n} questões disponíveis`;
    btnComecar.disabled = n === 0;
  };

  const montarSelTopico = () => {
    limpar(selTopico);
    if (!f.disciplina) return;
    const opts = [['', 'Todos os tópicos'], ...ativos.filter((t) => t.disciplinaId === f.disciplina).map((t) => [t.id, t.nome])];
    anexar(selTopico, campo('Tópico', select(opts, f.topico, (v) => { f.topico = v; atualizar(); })));
  };

  const btnComecar = botao('Começar', () => {
    let lista = embaralhar(filtrar());
    if (f.quantidade !== 'todas') lista = lista.slice(0, Number(f.quantidade));
    iniciarPratica(root, lista, 'treino', () => {
      limpar(root);
      render(root, params);
    });
  }, 'btn-primario btn-bloco');

  const chipTopicos = f.topicos.length
    ? h('div', { class: 'aviso aviso-info' },
      h('p', {}, f.estudados ? 'Tópicos já estudados no plano' : 'Tópicos da sessão: ', f.estudados ? '' : f.topicos.map(nomeTopico).join('; ')),
      botao('Usar todos os tópicos', () => { location.hash = '#/questoes'; }, 'btn-link'))
    : null;

  const discOpts = [['', 'Todas as disciplinas'], ...DISCIPLINAS.filter((d) => ativos.some((t) => t.disciplinaId === d.id)).map((d) => [d.id, d.nome])];

  anexar(root, 
    h('header', { class: 'topo' }, h('h1', {}, 'Questões')),
    chipTopicos,
    card(null,
      f.topicos.length ? null : campo('Disciplina', select(discOpts, f.disciplina, (v) => { f.disciplina = v; f.topico = ''; montarSelTopico(); atualizar(); })),
      selTopico,
      h('div', { class: 'linha-campos' },
        campo('Formato', select([['', 'Todos'], ['ME', 'Múltipla escolha'], ['CE', 'Certo/Errado']], f.formato, (v) => { f.formato = v; atualizar(); })),
        campo('Quantidade', select([['10', '10'], ['20', '20'], ['40', '40'], ['todas', 'Todas']], f.quantidade, (v) => { f.quantidade = v; }))),
      h('div', { class: 'linha-campos' },
        campo('Situação', select([['nao-acertadas', 'Novas e erradas'], ['nova', 'Nunca respondidas'], ['errada', 'Erradas'], ['acertada', 'Acertadas'], ['todas', 'Todas']], f.status, (v) => { f.status = v; atualizar(); })),
        campo('Origem', select([['', 'Todas'], ['autoral', 'Banco do app'], ['minhas', 'Minhas questões']], f.origem, (v) => { f.origem = v; atualizar(); }))),
      contador,
      btnComecar,
    ),
    estado.cfg.banca ? h('p', { class: 'pequeno centro' }, `Formato padrão ajustado para a banca ${estado.cfg.banca}.`) : null,
  );
  montarSelTopico();
  atualizar();
}

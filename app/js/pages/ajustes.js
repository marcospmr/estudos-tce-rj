// Ajustes: prova, conteúdo, questões e backup (Req. 6.3 a 6.5, 7.5, 8).
import { h, card, botao, campo, select, limpar, toast, escolherArquivo, anexar } from '../ui.js';
import * as db from '../db.js';
import { DISCIPLINAS, TOPICOS } from '../data/curriculum.js';
import { estado, salvarConfig, recalcularCronograma } from '../state.js';
import { importarJSON, importarCSV, CABECALHO_CSV } from '../domain/importer.js';
import { fmtBRCompleto, today } from '../domain/dates.js';
import { salvarBackup, restaurarBackup } from '../backup.js';
import { formularioQuestao } from './editor.js';

export async function render(root, params) {
  const cfg = estado.cfg;
  const recarregar = () => { limpar(root); render(root, params); };
  anexar(root, h('header', { class: 'topo' }, h('h1', {}, 'Ajustes')));

  // ── Prova (Req. 8.2 a 8.4) ──
  const prova = { banca: cfg.banca ?? '', data: cfg.dataProva ?? '' };
  const inpData = h('input', { type: 'date', value: prova.data, min: today() });
  inpData.addEventListener('change', () => { prova.data = inpData.value; });
  anexar(root, card('Edital e prova',
    h('p', { class: 'pequeno' }, 'Quando o edital sair, informe a banca e a data. O cronograma futuro é recalculado; o histórico é mantido.'),
    campo('Banca', select([['', 'Ainda não definida'], ['FGV', 'FGV'], ['Cebraspe', 'Cebraspe'], ['FCC', 'FCC'], ['IBFC', 'IBFC'], ['outra', 'Outra']], prova.banca, (v) => { prova.banca = v; })),
    campo('Data da prova', inpData),
    h('div', { class: 'acoes' },
      cfg.dataProva ? botao('Remover data', async () => {
        await salvarConfig({ dataProva: '' });
        await recalcularCronograma();
        toast('Data removida');
        recarregar();
      }, 'btn-secundario') : null,
      botao('Salvar', async () => {
        const mudouData = prova.data !== (cfg.dataProva ?? '');
        await salvarConfig({ banca: prova.banca, dataProva: prova.data });
        if (mudouData) {
          const r = await recalcularCronograma();
          toast(r.foraDoPlano.length ? `Cronograma recalculado: ${r.foraDoPlano.length} tópico(s) não cabem. Veja o Cronograma.` : 'Cronograma recalculado');
        } else toast('Salvo');
        recarregar();
      }, 'btn-primario'))));

  // ── Conteúdo (Req. 8.1) ──
  const inativosT = new Set(cfg.topicosInativos ?? []);
  const inativosD = new Set(cfg.disciplinasInativas ?? []);
  const blocos = DISCIPLINAS.map((d) => {
    const cbD = h('input', { type: 'checkbox', checked: !inativosD.has(d.id), onchange: (e) => (e.target.checked ? inativosD.delete(d.id) : inativosD.add(d.id)) });
    const tops = TOPICOS.filter((t) => t.disciplinaId === d.id).map((t) =>
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !inativosT.has(t.id), onchange: (e) => (e.target.checked ? inativosT.delete(t.id) : inativosT.add(t.id)) }), `${t.nome} (mês ${t.mes})`));
    return h('details', { class: 'disc-conteudo' },
      h('summary', {}, h('label', { class: 'check', onclick: (e) => e.stopPropagation() }, cbD, h('strong', {}, d.nome))),
      tops);
  });
  anexar(root, h('section', { class: 'card', id: 'conteudo' },
    h('h2', {}, 'Conteúdo do edital'),
    h('p', { class: 'pequeno' }, 'Desmarque o que não cair no edital. Tópicos desativados saem do cronograma futuro, das questões e dos simulados.'),
    blocos,
    botao('Salvar conteúdo', async () => {
      await salvarConfig({ topicosInativos: [...inativosT], disciplinasInativas: [...inativosD] });
      await recalcularCronograma();
      toast('Conteúdo atualizado e cronograma recalculado');
      recarregar();
    }, 'btn-primario btn-bloco')));

  // ── Questões (Req. 6.3 a 6.5) ──
  const relatorio = h('div', { class: 'relatorio' });
  const questoes = await db.getAll('questoes');
  const minhas = questoes.filter((q) => q.origem !== 'autoral').length;
  anexar(root, card('Questões',
    h('p', { class: 'pequeno' }, `${questoes.length} questões no app (${questoes.length - minhas} do banco inicial, ${minhas} suas).`),
    h('div', { class: 'acoes' },
      botao('Nova questão', () => {
        limpar(root);
        anexar(root, formularioQuestao(null, recarregar));
      }, 'btn-secundario'),
      botao('Importar arquivo', async () => {
        const f = await escolherArquivo('.json,.csv,application/json,text/csv');
        if (!f) return;
        const texto = await f.text();
        const ehCSV = f.name.toLowerCase().endsWith('.csv');
        const r = ehCSV ? importarCSV(texto, TOPICOS, DISCIPLINAS) : importarJSON(texto, TOPICOS, DISCIPLINAS);
        const agora = new Date().toISOString();
        await db.putMany('questoes', r.validas.map((q) => ({ ...q, id: db.novoId(), origem: 'importada', criadaEm: agora })));
        limpar(relatorio);
        anexar(relatorio, 
          h('p', {}, `${r.validas.length} questão(ões) importada(s).`),
          r.erros.length ? h('p', { class: 'erro-msg' }, `${r.erros.length} registro(s) com erro (não importados):`) : null,
          r.erros.length ? h('ul', {}, r.erros.slice(0, 50).map((e) => h('li', {}, e.linha ? `${ehCSV ? 'Linha' : 'Item'} ${e.linha}: ${e.motivo}` : e.motivo))) : null);
      }, 'btn-secundario')),
    relatorio,
    h('details', {},
      h('summary', {}, 'Formato do arquivo de importação'),
      h('p', { class: 'pequeno' }, 'CSV com separador ponto e vírgula (;), em UTF-8, com este cabeçalho:'),
      h('pre', {}, CABECALHO_CSV.join(';')),
      h('p', { class: 'pequeno' }, 'Formato: ME (múltipla escolha) ou CE (certo/errado). Gabarito: A a E na múltipla escolha; C ou E no certo/errado (deixe as alternativas vazias). Em vez de topicoId, você pode usar as colunas "disciplina" e "topico" com os nomes.'),
      h('p', { class: 'pequeno' }, 'JSON: uma lista de objetos com os campos topicoId, formato, enunciado, alternativas (lista), gabarito, comentario e referencia.'),
      h('p', { class: 'pequeno' }, 'Códigos dos tópicos:'),
      h('ul', { class: 'lista-codigos' }, TOPICOS.map((t) => h('li', {}, h('code', {}, t.id), ' ', t.nome)))),
  ));

  // ── Backup (Req. 7.5, 7.6) ──
  anexar(root, h('section', { class: 'card', id: 'backup' },
    h('h2', {}, 'Backup'),
    h('p', { class: 'pequeno' }, cfg.ultimoBackup ? `Último backup: ${fmtBRCompleto(cfg.ultimoBackup.slice(0, 10))}.` : 'Nenhum backup feito ainda.'),
    h('p', { class: 'pequeno' }, 'Seus dados ficam só neste celular. Salve o arquivo no Google Drive, no e-mail ou no WhatsApp para não perder o progresso se trocar de aparelho ou limpar o navegador.'),
    h('div', { class: 'acoes' },
      botao('Salvar backup', async () => {
        if (await salvarBackup()) toast('Backup salvo');
        recarregar();
      }, 'btn-primario'),
      botao('Restaurar backup', async () => {
        const f = await escolherArquivo('.json,application/json');
        if (!f) return;
        if (!confirm('Restaurar substitui TODOS os dados atuais pelos do arquivo. Antes disso, o app salva um backup dos dados atuais. Continuar?')) return;
        const erro = await restaurarBackup(f);
        if (erro) return toast('Não foi possível restaurar: ' + erro);
        toast('Backup restaurado');
        recarregar();
      }, 'btn-secundario'))));

  if (params.get('secao')) {
    document.getElementById(params.get('secao'))?.scrollIntoView({ block: 'start' });
  }
}

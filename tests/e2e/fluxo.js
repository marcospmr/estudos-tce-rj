// Teste ponta a ponta (Playwright, tela de celular). Rodar com a ferramenta browser_run_code.
async (page) => {
  const BASE = '/projects/sandbox/estudos-tce-rj/app';
  const SHOTS = '/projects/sandbox/.kiro/artifacts/screenshots/';
  const tipos = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', webmanifest: 'application/manifest+json', json: 'application/json' };
  await page.context().unrouteAll().catch(() => {});
  await page.context().route('https://app.test/**', async (route) => {
    let p = route.request().url().replace('https://app.test', '').split('?')[0].split('#')[0];
    if (p.endsWith('/')) p += 'index.html';
    try { await route.fulfill({ path: BASE + p, headers: { 'content-type': tipos[p.split('.').pop()] ?? 'application/octet-stream' } }); }
    catch (e) { await route.fulfill({ status: 404, body: 'not found' }); }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  page.removeAllListeners('dialog');
  page.removeAllListeners('pageerror');
  page.removeAllListeners('console');
  const erros = [];
  page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') erros.push('console: ' + m.text()); });
  // Diálogos nativos substituídos: confirm aceita, prompt responde 50 minutos.
  await page.context().addInitScript(() => { window.confirm = () => true; window.prompt = () => '50'; });
  const r = {};
  const check = (nome, cond) => { r[nome] = cond ? 'OK' : 'FALHOU'; };
  const loja = (s) => page.evaluate(async (s) => {
    const db = await new Promise((res) => { const q = indexedDB.open('estudos-tce-rj'); q.onsuccess = () => res(q.result); });
    return new Promise((res) => { const q = db.transaction(s).objectStore(s).getAll(); q.onsuccess = () => res(q.result); });
  }, s);
  const ir = async (hash, sel) => { await page.goto('https://app.test/index.html' + hash); await page.waitForTimeout(400); await page.waitForSelector(sel ?? '.topo h1'); };

  page.setDefaultTimeout(10000);
  // Banco limpo: sai do app (fecha a conexão) e apaga o banco a partir de uma página vazia da mesma origem.
  await page.goto('https://app.test/vazio.html');
  r.reset = await page.evaluate(async () => {
    for (const reg of await navigator.serviceWorker.getRegistrations()) await reg.unregister();
    for (const k of await caches.keys()) await caches.delete(k);
    return new Promise((res) => { const q = indexedDB.deleteDatabase('estudos-tce-rj'); q.onsuccess = () => res('apagado'); q.onerror = () => res('erro'); q.onblocked = () => res('bloqueado'); });
  });
  await ir('#/hoje');

  // 1. Questão errada de propósito
  await ir('#/questoes?topicos=si.pilares', '.contador');
  await page.getByRole('button', { name: 'Começar' }).click();
  await page.waitForSelector('.questao');
  const enun = await page.locator('.enunciado').innerText();
  const qs = await loja('questoes');
  const q = qs.find((x) => x.enunciado === enun);
  const errada = q.formato === 'CE' ? (q.gabarito ? 1 : 0) : (q.gabarito === 0 ? 1 : 0);
  await page.locator('.alt').nth(errada).click();
  await page.getByRole('button', { name: 'Confirmar resposta' }).click();
  await page.waitForSelector('.feedback:not([hidden])');
  const fb = await page.locator('.feedback').innerText();
  check('feedback de erro', fb.includes('Você errou') && !fb.includes('null'));
  check('gabarito destacado', (await page.locator('.alt-correta').count()) === 1 && (await page.locator('.alt-errada').count()) === 1);
  check('comentário e fonte', fb.includes('Fonte:'));
  await page.getByRole('button', { name: 'Desatenção' }).click();
  await page.locator('.painel-erro textarea').fill('Confundi disponibilidade com integridade');
  await page.locator('.painel-erro textarea').blur();
  await page.waitForTimeout(400);
  await page.screenshot({ path: SHOTS + '03-erro.png', fullPage: true });
  let rev = await loja('revisao');
  const amanha = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
  check('caderno: caixa 1, volta amanhã', rev.length === 1 && rev[0].caixa === 1 && rev[0].vencimento === amanha);
  check('tipo de erro e anotação salvos', rev[0]?.tipoErro === 'desatencao' && rev[0]?.anotacao?.startsWith('Confundi'));

  // 2. Acerta a próxima
  await page.getByRole('button', { name: 'Próxima' }).click();
  await page.waitForSelector('.questao');
  const enun2 = await page.locator('.enunciado').innerText();
  const q2 = qs.find((x) => x.enunciado === enun2);
  const certa = q2.formato === 'CE' ? (q2.gabarito ? 0 : 1) : q2.gabarito;
  await page.locator('.alt').nth(certa).click();
  await page.getByRole('button', { name: 'Confirmar resposta' }).click();
  await page.waitForSelector('.feedback.ok');
  check('acerto não entra no caderno', (await loja('revisao')).length === 1);
  await page.getByRole('button', { name: 'Encerrar' }).click();
  check('resumo da sequência', (await page.locator('#app').innerText()).includes('1 de 2'));

  // 3. Revisão
  await ir('#/revisao');
  const txtRev = await page.locator('#app').innerText();
  check('revisão: nenhuma vencida hoje, 1 no caderno', txtRev.includes('Nenhuma revisão vencida') && txtRev.includes('Caderno de erros (1)'));

  // 4. Simulado com recarga no meio
  await ir('#/simulados/novo', '.contador');
  await page.locator('input[type=number]').first().fill('6');
  await page.getByRole('button', { name: 'Iniciar simulado' }).click();
  await page.waitForSelector('.relogio');
  check('simulado sem correção durante a prova', (await page.locator('.feedback, .alt-correta').count()) === 0);
  await page.locator('.alt').first().click();
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForSelector('.relogio');
  check('resposta mantida após recarregar', (await page.locator('.alt[aria-pressed=true]').count()) === 1);
  await page.getByRole('button', { name: 'Próxima ›' }).click();
  await page.locator('.alt').first().click();
  await page.getByRole('button', { name: 'Próxima ›' }).click();
  await page.locator('.alt').nth(1).click();
  await page.getByRole('button', { name: 'Finalizar' }).click();
  await page.waitForSelector('text=Resultado do simulado');
  const txtSim = await page.locator('#app').innerText();
  check('resultado com nota por disciplina', txtSim.includes('Por disciplina') && txtSim.includes('em branco'));
  await page.screenshot({ path: SHOTS + '04-simulado.png', fullPage: true });
  const sims = await loja('simulados');
  const tsSim = (await loja('tentativas')).filter((t) => t.modo === 'simulado');
  check('simulado: só respondidas viram tentativas', sims.length === 1 && sims[0].finalizadoEm && tsSim.length === 3);

  // 5. Concluir sessão no cronograma (prompt responde 50 min)
  await ir('#/cronograma?semana=0');
  await page.getByRole('button', { name: 'Concluir' }).first().click();
  await page.waitForTimeout(500);
  const ses = await loja('sessoes');
  check('sessão concluída com minutos informados', ses.some((s) => s.concluidaEm && s.minutosRealizados === 50));
  await page.screenshot({ path: SHOTS + '05-cronograma.png', fullPage: false });

  // 6. Telas restantes
  for (const [hash, nome] of [['#/desempenho', '06-desempenho'], ['#/ajustes', '07-ajustes'], ['#/mais', '08-mais'], ['#/hoje', '09-hoje']]) {
    await ir(hash);
    await page.screenshot({ path: SHOTS + nome + '.png', fullPage: true });
  }
  check('hoje mostra lembrete de backup', (await page.locator('.aviso').count()) >= 1);

  // 7. Backup: ida e volta (propriedade 7)
  const ida = await page.evaluate(async () => {
    const b = await import('/js/backup.js');
    const db = await import('/js/db.js');
    const a = await b.exportarDados();
    const erro = b.validarBackup(a);
    await db.substituirTudo(JSON.parse(JSON.stringify(a.dados)));
    const c = await b.exportarDados();
    return { erro, igual: JSON.stringify(a.dados) === JSON.stringify(c.dados), invalido: b.validarBackup({ app: 'outro' }) };
  });
  check('backup ida e volta idêntico', ida.erro === null && ida.igual && ida.invalido);

  // 8. Data da prova e banca (Req. 8)
  await ir('#/ajustes');
  await page.locator('select').first().selectOption('Cebraspe');
  const prova = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 120); return d.toISOString().slice(0, 10); });
  await page.locator('input[type=date]').fill(prova);
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await page.waitForTimeout(800);
  const ses2 = await loja('sessoes');
  check('nenhuma sessão após a prova', ses2.every((s) => s.data < prova));
  check('sessões concluídas mantidas', ses2.some((s) => s.concluidaEm && s.minutosRealizados === 50));
  await ir('#/questoes', '.contador');
  check('formato padrão CE para Cebraspe', (await page.locator('select').nth(1).inputValue()) === 'CE');
  await ir('#/hoje');
  check('contagem regressiva', (await page.locator('.contagem').innerText()).includes('Prova em'));
  await ir('#/cronograma');
  check('aviso de tópicos que não cabem', (await page.locator('#app').innerText()).includes('não cabem até a prova'));

  r.erros = erros;
  return r;
}

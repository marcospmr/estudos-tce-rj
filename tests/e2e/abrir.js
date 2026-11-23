// Helper para o Playwright: serve a pasta app/ em https://app.test via interceptação de rotas.
async (page) => {
  const BASE = '/projects/sandbox/estudos-tce-rj/app';
  const tipos = { html: 'text/html', js: 'text/javascript', css: 'text/css', png: 'image/png', webmanifest: 'application/manifest+json', json: 'application/json' };
  await page.context().route('https://app.test/**', async (route) => {
    let p = new URL(route.request().url()).pathname;
    if (p.endsWith('/')) p += 'index.html';
    const ext = p.split('.').pop();
    try {
      await route.fulfill({ path: BASE + p, headers: { 'content-type': tipos[ext] ?? 'application/octet-stream' } });
    } catch {
      await route.fulfill({ status: 404, body: 'not found' });
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  return 'ok';
}

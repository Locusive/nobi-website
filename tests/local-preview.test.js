import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createServer, preview } from 'vite';

for (const mode of ['development', 'preview']) {
  test(`${mode} serves the pricing page and its traffic lookup API locally`, async () => {
    const options = { host: '127.0.0.1', port: 0, strictPort: true };
    const server = mode === 'preview'
      ? await preview({ preview: options })
      : await createServer({ server: options });
    if (mode === 'development') await server.listen();
    try {
      const base = `http://127.0.0.1:${server.httpServer.address().port}`;
      const page = await fetch(`${base}/pricing`);
      assert.equal(page.status, 200);
      const html = await page.text();
      if (mode === 'preview') {
        assert.ok(html.includes('Simple, usage-based pricing'));
        assert.match(html, /src="\/assets\//);
        assert.ok(!html.includes('src="/src/'));
      }
      const invalidLookup = await fetch(`${base}/api/traffic-lookup?domain=invalid`);
      assert.equal(invalidLookup.status, 400);
      assert.equal((await invalidLookup.json()).error, 'invalid domain');
    } finally {
      if (mode === 'development') {
        await server.close();
      } else {
        const closed = once(server.httpServer, 'close');
        server.httpServer.close();
        server.httpServer.closeAllConnections();
        await closed;
      }
    }
  });
}

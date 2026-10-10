// A local server with test Shop Nobi page data, so tests and local builds need no network.
// Local build: `node tests/shop-nobi-pages-server.js 4789`, then set SHOP_PAGES_API_URL (see README).

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const FixturePath = new URL("./fixtures/shop-nobi-pages.json", import.meta.url);
const HttpOk = 200;
const HttpNotFound = 404;

/** Reads the test page data. */
export function readFixturePageData() {
  return JSON.parse(readFileSync(FixturePath, "utf8"));
}

/**
 * Starts a server that answers requests for /v1/shop/pages with the given status and body, gzip-encoded the way
 * the API may send it.
 *
 * @param {{status?: number, body?: unknown}} response What the server sends back.
 * @param {number} [port] The port, or 0 for any free port.
 * @returns {Promise<{url: string, close: () => Promise<void>}>} The API base address and a way to stop the server.
 */
export async function startPageDataServer({ status = HttpOk, body = readFixturePageData() } = {}, port = 0) {
  const server = createServer((request, response) => {
    const isPagesRoute = request.url.startsWith("/v1/shop/pages");
    response.writeHead(isPagesRoute ? status : HttpNotFound, { "content-type": "application/json", "content-encoding": "gzip" });
    response.end(gzipSync(JSON.stringify(isPagesRoute ? body : {})));
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

if (process.argv[1] && process.argv[1].endsWith("shop-nobi-pages-server.js")) {
  const server = await startPageDataServer({}, Number(process.argv[2] || 0));
  console.log(`Serving test Shop Nobi page data at ${server.url}`);
}

// A local server with test Shop Nobi page data, so tests and local builds need no network.
// Local build: `node tests/shop-nobi-pages-server.js 4789`, then set SHOP_PAGES_API_URL (see README).

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const FixturePath = new URL("./fixtures/shop-nobi-pages.json", import.meta.url);
const SaleFixturePath = new URL("./fixtures/shop-nobi-sale-pages.json", import.meta.url);
const PagesRoute = "/v1/shop/pages";
const SalePagesRoute = "/v1/shop/sale-pages";
const HttpOk = 200;
const HttpNotFound = 404;
/** The sale pages a test gets unless it asks for others: none, so search page tests see only search pages. */
const NoSalePages = { generatedAt: "2026-11-20T10:00:00Z", pages: [] };

/** Reads the test page data. */
export function readFixturePageData() {
  return JSON.parse(readFileSync(FixturePath, "utf8"));
}

/** Reads the test sale page data. */
export function readFixtureSalePageData() {
  return JSON.parse(readFileSync(SaleFixturePath, "utf8"));
}

/**
 * Starts a server that answers /v1/shop/pages and /v1/shop/sale-pages with the given statuses and bodies,
 * gzip-encoded the way the API may send them.
 *
 * @param {{status?: number, body?: unknown, saleStatus?: number, saleBody?: unknown}} response What the server sends back.
 * @param {number} [port] The port, or 0 for any free port.
 * @returns {Promise<{url: string, close: () => Promise<void>}>} The API base address and a way to stop the server.
 */
export async function startPageDataServer(
  { status = HttpOk, body = readFixturePageData(), saleStatus = HttpOk, saleBody = NoSalePages } = {},
  port = 0,
) {
  const answerByRoute = { [PagesRoute]: { status, body }, [SalePagesRoute]: { status: saleStatus, body: saleBody } };
  const server = createServer((request, response) => {
    const answer = answerByRoute[request.url.split("?")[0]] ?? { status: HttpNotFound, body: {} };
    response.writeHead(answer.status, { "content-type": "application/json", "content-encoding": "gzip" });
    response.end(gzipSync(JSON.stringify(answer.body)));
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

if (process.argv[1] && process.argv[1].endsWith("shop-nobi-pages-server.js")) {
  const server = await startPageDataServer({ saleBody: readFixtureSalePageData() }, Number(process.argv[2] || 0));
  console.log(`Serving test Shop Nobi page data at ${server.url}`);
}

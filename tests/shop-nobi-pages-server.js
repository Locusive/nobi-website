// A small local HTTP server that serves Shop Nobi page data for the tests
// and for local builds, so neither needs the network.
//
// Run on its own to serve the test data for a local build:
//   node tests/shop-nobi-pages-server.js 4789
//   SHOP_PAGES_DATA_URL=http://127.0.0.1:4789/pages.json npm test

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
 * Starts a server that answers requests for /pages.json with the given status and body, gzip-encoded the way
 * the public file may be served.
 *
 * @param {{status?: number, body?: unknown}} response What the server sends back.
 * @param {number} [port] The port, or 0 for any free port.
 * @returns {Promise<{url: string, close: () => Promise<void>}>} The data address and a way to stop the server.
 */
export async function startPageDataServer({ status = HttpOk, body = readFixturePageData() } = {}, port = 0) {
  const server = createServer((request, response) => {
    const isDataFile = request.url.startsWith("/pages.json");
    response.writeHead(isDataFile ? status : HttpNotFound, { "content-type": "application/json", "content-encoding": "gzip" });
    response.end(gzipSync(JSON.stringify(isDataFile ? body : {})));
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  return {
    url: `http://127.0.0.1:${server.address().port}/pages.json`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

if (process.argv[1] && process.argv[1].endsWith("shop-nobi-pages-server.js")) {
  const server = await startPageDataServer({}, Number(process.argv[2] || 0));
  console.log(`Serving test Shop Nobi page data at ${server.url}`);
}

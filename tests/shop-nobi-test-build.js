// Helpers that run the Shop Nobi build step into a throwaway folder and read what it wrote.

import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { prerenderShopNobiSearchPages } from "../scripts/prerender-shop.js";
import { startPageDataServer } from "./shop-nobi-pages-server.js";

export const BuiltDist = fileURLToPath(new URL("../dist/", import.meta.url));
// The build's own run adds to _redirects and llms.txt, so the copies start from the originals in public/.
const OriginalPublic = fileURLToPath(new URL("../public/", import.meta.url));
export const ListingFiles = ["_redirects", "llms.txt"];

/** Copies the built shell and the original listing files into a new folder, so each run starts clean. */
export function makeDistCopy() {
  const folder = mkdtempSync(join(tmpdir(), "shop-nobi-dist-"));
  copyFileSync(join(BuiltDist, "index.html"), join(folder, "index.html"));
  ListingFiles.forEach((file) => copyFileSync(join(OriginalPublic, file), join(folder, file)));
  return folder;
}

/** Reads an original file from public/. */
export function readOriginal(file) {
  return readFileSync(join(OriginalPublic, file), "utf8");
}

/** Runs the build step against a local server that sends the given response. */
export async function prerenderWith(response, folder, limits = {}) {
  const server = await startPageDataServer(response);
  try {
    return await prerenderShopNobiSearchPages({ apiBaseUrl: server.url, distDir: folder, ...limits });
  } finally {
    await server.close();
  }
}

/** Reads the JSON in the script element with the given id. */
export function readScriptJson(html, id) {
  const match = html.match(new RegExp(`<script type="application/(?:ld\\+)?json" id="${id}">([^<]*)</script>`));
  assert.ok(match, `Missing script element ${id}`);
  return JSON.parse(match[1]);
}

/** Reads the HTML inside #root, which is what a crawler sees as the page. */
export function readBody(html) {
  return html.slice(html.indexOf('<div id="root">'));
}

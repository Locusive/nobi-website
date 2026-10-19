// Compiles scripts/render-pages.jsx for Node with the same Vite asset
// handling as the browser build, so pages render without Chromium.

import { join, dirname } from "path";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { build } from "vite";
import { pathToFileURL, fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RendererCache = join(__dirname, "..", "node_modules", ".cache");

/**
 * Builds and loads the page renderer in its own folder, then removes only that temporary output.
 * Concurrent prerenders must not empty or replace one another's build files.
 *
 * @returns {Promise<object>} The render-pages.jsx exports.
 */
export async function loadPageRenderer() {
  mkdirSync(RendererCache, { recursive: true });
  const rendererFolder = mkdtempSync(join(RendererCache, "page-prerender-"));
  try {
    await build({
      configFile: false,
      logLevel: "warn",
      build: {
        ssr: join(__dirname, "render-pages.jsx"),
        outDir: rendererFolder,
        emptyOutDir: true,
        rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
      },
    });
    return await import(pathToFileURL(join(rendererFolder, "renderer.mjs")).href);
  } finally {
    rmSync(rendererFolder, { recursive: true, force: true });
  }
}

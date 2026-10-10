// Compiles scripts/render-pages.jsx for Node with the same Vite asset
// handling as the browser build, so pages render without Chromium.

import { join, dirname } from "path";
import { build } from "vite";
import { pathToFileURL, fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RendererFolder = join(__dirname, "..", "node_modules", ".cache", "page-prerender");

/**
 * Builds and loads the page renderer.
 *
 * @returns {Promise<object>} The render-pages.jsx exports.
 */
export async function loadPageRenderer() {
  await build({
    configFile: false,
    logLevel: "warn",
    build: {
      ssr: join(__dirname, "render-pages.jsx"),
      outDir: RendererFolder,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  return import(pathToFileURL(join(RendererFolder, "renderer.mjs")).href);
}

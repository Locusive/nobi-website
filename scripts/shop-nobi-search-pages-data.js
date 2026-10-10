// Downloads the Shop Nobi search page data: one public JSON file the API
// rebuilds every night, shaped as {generatedAt, pages: [...], retired: [...]}.

const DefaultDataUrl = "https://storage.googleapis.com/nobi-public/shop-nobi-pages/pages.json";
const DownloadTimeoutMs = 60000;

/**
 * Returns where to download the page data from. SHOP_PAGES_DATA_URL overrides the public file, for tests.
 *
 * @param {Record<string, string | undefined>} env The environment variables.
 * @returns {string} The data file address.
 */
export function readSearchPagesDataUrl(env) {
  return env.SHOP_PAGES_DATA_URL || DefaultDataUrl;
}

/**
 * Downloads and checks the page data. Any failure throws, so the build fails and the last good deploy stays live.
 *
 * @param {string} dataUrl The data file address.
 * @returns {Promise<{pages: object[], retired: object[]}>} The live pages and the retired slugs.
 */
export async function downloadSearchPagesData(dataUrl) {
  const response = await fetch(dataUrl, { signal: AbortSignal.timeout(DownloadTimeoutMs) });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Downloading ${dataUrl} returned status ${response.status}.`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.pages) || !Array.isArray(data?.retired)) {
    throw new Error(`${dataUrl} has no "pages" and "retired" lists.`);
  }
  return { pages: data.pages, retired: data.retired };
}

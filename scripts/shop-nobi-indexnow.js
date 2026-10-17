// Picks the Shop Nobi pages that are new or changed since the live site's sitemap, and builds the IndexNow
// requests that tell Bing and the other IndexNow search engines about them.

/** The IndexNow key. It is public by design: engines read it from the key file at the site root. */
export const IndexNowKey = "b20309cb84825b184afe0ffcf36630a7";
/** IndexNow takes at most 10,000 addresses in one request. */
export const IndexNowBatchSize = 10000;

const SiteHost = "nobi.ai";
const ProductionBranch = "main";
const SitemapEntryPattern = /<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g;
const XmlEntities = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

/**
 * Reads each page address in a sitemap with the time it last changed.
 *
 * @param {string} sitemapXml The sitemap XML.
 * @returns {Map<string, string | null>} Each address and its lastmod, or null when it has none.
 */
export function readSitemapEntries(sitemapXml) {
  const entries = new Map();
  for (const [, location, lastModified] of sitemapXml.matchAll(SitemapEntryPattern)) {
    entries.set(decodeXml(location.trim()), lastModified ? lastModified.trim() : null);
  }
  return entries;
}

/**
 * Lists the addresses in the new sitemap that the old one lacks or lists with another lastmod, in sitemap order.
 *
 * @param {Map<string, string | null>} previousEntries The live site's sitemap entries.
 * @param {Map<string, string | null>} currentEntries The new build's sitemap entries.
 * @returns {string[]} The new or changed addresses.
 */
export function selectChangedUrls(previousEntries, currentEntries) {
  return [...currentEntries]
    .filter(([url, lastModified]) => !previousEntries.has(url) || previousEntries.get(url) !== lastModified)
    .map(([url]) => url);
}

/**
 * Gives the reason this build must not submit to IndexNow, or null when it may. Only a Cloudflare Pages build of
 * the production branch, from the real page data, submits.
 *
 * @param {Record<string, string | undefined>} env The environment variables.
 * @returns {string | null} The reason to skip, or null.
 */
export function readSkipReason(env) {
  if (env.CF_PAGES !== "1") {
    return "not a Cloudflare Pages build";
  }
  if (env.CF_PAGES_BRANCH !== ProductionBranch) {
    return "a preview build";
  }
  if (env.SHOP_PAGES_API_URL) {
    return "built from other page data";
  }
  return null;
}

/**
 * Builds one IndexNow request body for each batch of addresses.
 *
 * @param {string[]} urls The addresses to submit.
 * @param {number} [batchSize] The most addresses in one request.
 * @returns {object[]} The request bodies, in order.
 */
export function buildIndexNowBodies(urls, batchSize = IndexNowBatchSize) {
  const bodies = [];
  for (let start = 0; start < urls.length; start += batchSize) {
    bodies.push({
      host: SiteHost,
      key: IndexNowKey,
      keyLocation: `https://${SiteHost}/${IndexNowKey}.txt`,
      urlList: urls.slice(start, start + batchSize),
    });
  }
  return bodies;
}

/** Turns the escaped characters in a sitemap address back into plain ones. */
function decodeXml(text) {
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => XmlEntities[entity]);
}

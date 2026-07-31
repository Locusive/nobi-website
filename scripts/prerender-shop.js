// Prerender the Shop Nobi landing pages (nobi.ai/shop/s/<slug>) at build time.
//
// Same contract as prerender-blog.js: for every entry in
// src/content/shop/shop_pages.json, write dist/shop/s/<slug>/index.html with
// the page's title, meta description, canonical, og/twitter tags, and an
// ItemList JSON-LD schema in the head, AND a static product grid inside
// <div id="root">. React's createRoot() clears and replaces #root on mount,
// so real visitors get the live shop experience while JS-blind crawlers read
// real product HTML.
//
// Products come from the API's build-time catalog export:
//   GET ${SHOP_SEO_EXPORT_URL}/v1/shop/seo-export?query=<query>&limit=24
//   with header X-Shop-Export-Secret: ${SHOP_SEO_EXPORT_SECRET}
// The expected payload is {"products": [...]} (a bare array also works) where
// each product carries name/title, url/productUrl, store/storeName,
// imageUrl/image, and price (number) or priceFormatted (display string).
//
// The build must NEVER fail because of this endpoint. When the env vars are
// missing (every local build) or the endpoint is unreachable, each page is
// still emitted with its full head plus the landing shell - just no product
// grid - and a warning explains why.
//
// After prerendering, the sitemap is regenerated with the real per-page
// product counts: a shop slug is only listed once its page carries at least
// MIN_SHOP_PRODUCTS_FOR_SITEMAP products (see generate-sitemap.js). The
// initial pre-build sitemap run can't know the counts, so this script is the
// one that actually decides which shop pages get listed.
//
// Run via: node scripts/prerender-shop.js (chained from `build`, after
// prerender-pages.js).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { stripHomepageMeta, htmlEscape } from "./prerender-blog.js";
import { generateSitemap } from "./generate-sitemap.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT     = join(__dirname, "..");
const DIST     = join(ROOT, "dist");
const SHELL    = join(DIST, "index.html");
const MANIFEST = join(ROOT, "src/content/shop/shop_pages.json");
const BASE_URL = "https://nobi.ai";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const EXPORT_ENDPOINT_PATH  = "/v1/shop/seo-export";
const EXPORT_SECRET_HEADER  = "X-Shop-Export-Secret";
const PRODUCTS_PER_PAGE     = 24;
const EXPORT_TIMEOUT_MS     = 30000;

// Turn a raw export product into the shape the grid renders, or null when it
// lacks the essentials (a name and a URL to link to). Defensive on field
// names because the export endpoint is still being built (plan item 2.8).
function normalizeProduct(raw) {
  if (!raw || typeof raw !== "object") return null;
  const name = raw.name || raw.title;
  const url = raw.url || raw.productUrl;
  if (!name || !url) return null;
  return {
    name: String(name),
    url: String(url),
    store: String(raw.store || raw.storeName || ""),
    image: String(raw.imageUrl || raw.image || ""),
    price: formatPrice(raw),
  };
}

// Prefer a preformatted display price; otherwise format a numeric price with
// its currency (defaulting to USD, the catalog's dominant currency).
function formatPrice(raw) {
  if (typeof raw.priceFormatted === "string" && raw.priceFormatted) return raw.priceFormatted;
  if (typeof raw.price === "string") return raw.price;
  if (typeof raw.price !== "number" || !Number.isFinite(raw.price)) return "";
  const currency = typeof raw.currency === "string" && raw.currency ? raw.currency : "USD";
  return currency === "USD" ? `$${raw.price.toFixed(2)}` : `${raw.price.toFixed(2)} ${currency}`;
}

// Fetch the current eligible products for one landing page's query. Any
// failure (non-2xx, timeout, bad payload) throws; the caller logs and falls
// back to the shell-only page so the build always completes.
async function fetchProducts(exportUrl, exportSecret, query) {
  const url =
    `${exportUrl.replace(/\/+$/, "")}${EXPORT_ENDPOINT_PATH}` +
    `?query=${encodeURIComponent(query)}&limit=${PRODUCTS_PER_PAGE}`;
  const response = await fetch(url, {
    headers: { [EXPORT_SECRET_HEADER]: exportSecret },
    signal: AbortSignal.timeout(EXPORT_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`seo-export responded ${response.status}`);
  }
  const payload = await response.json();
  const rawProducts = Array.isArray(payload) ? payload : payload?.products;
  if (!Array.isArray(rawProducts)) {
    throw new Error("seo-export payload has no products array");
  }
  return rawProducts.map(normalizeProduct).filter(Boolean);
}

// ItemList JSON-LD naming each product on the page, mirroring the ItemList
// pattern prerender-blog.js bakes for vendor lists.
function buildItemListSchema(entry, products) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": entry.title,
    "url": `${BASE_URL}/shop/s/${entry.slug}`,
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": product.name,
      "url": product.url,
      ...(product.image ? { image: product.image } : {}),
    })),
  };
}

// Head block for one landing page: canonical, og/twitter, and (when products
// exist) the ItemList schema under id="page-schema" so the runtime useSEO
// hook updates the same element instead of duplicating it.
function buildHeadInjection(entry, products) {
  const url = `${BASE_URL}/shop/s/${entry.slug}`;
  const tags = [
    `<link rel="canonical" href="${htmlEscape(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${htmlEscape(url)}">`,
    `<meta property="og:title" content="${htmlEscape(`${entry.title} | Nobi`)}">`,
    `<meta property="og:description" content="${htmlEscape(entry.description)}">`,
    `<meta property="og:image" content="${htmlEscape(OG_IMAGE)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${htmlEscape(`${entry.title} | Nobi`)}">`,
    `<meta name="twitter:description" content="${htmlEscape(entry.description)}">`,
    `<meta name="twitter:image" content="${htmlEscape(OG_IMAGE)}">`,
  ];
  if (products.length > 0) {
    tags.push(
      `<script type="application/ld+json" id="page-schema">${JSON.stringify([buildItemListSchema(entry, products)])}</script>`
    );
  }
  return tags.join("\n    ");
}

function renderProductGrid(products) {
  const items = products
    .map((product) => {
      const parts = [
        product.image
          ? `<img src="${htmlEscape(product.image)}" alt="${htmlEscape(product.name)}" loading="lazy">`
          : "",
        `<span class="shop-product-name">${htmlEscape(product.name)}</span>`,
        product.store ? `<span class="shop-product-store">${htmlEscape(product.store)}</span>` : "",
        product.price ? `<span class="shop-product-price">${htmlEscape(product.price)}</span>` : "",
      ].filter(Boolean);
      return `<li class="shop-product"><a href="${htmlEscape(product.url)}">${parts.join("")}</a></li>`;
    })
    .join("\n");
  return `<ul class="shop-product-grid">\n${items}\n</ul>`;
}

// The static body injected inside #root. Hidden from real visitors by the
// .prerendered-shop rule in index.html (same trick as .prerendered-article);
// React replaces #root on mount, so only JS-blind crawlers ever read this.
function renderBody(entry, products) {
  const pieces = [
    `<div class="prerendered-shop">`,
    `<h1>${htmlEscape(entry.title)}</h1>`,
    `<p>${htmlEscape(entry.description)}</p>`,
    `<p><a href="${BASE_URL}/shop">Search everything on Shop Nobi</a></p>`,
  ];
  if (products.length > 0) {
    pieces.push(renderProductGrid(products));
  }
  pieces.push(`</div>`);
  return pieces.join("\n");
}

// prerender-pages.js runs before this script and overwrites dist/index.html
// with the homepage's baked head, so the shell we read already carries the
// homepage's canonical and page-schema on top of what stripHomepageMeta
// handles. Strip those too or every shop page would declare two canonicals.
function stripBakedHomepageExtras(shell) {
  return shell
    .replace(/<link rel="canonical" href="[^"]*">\s*/g, "")
    .replace(/<script type="application\/ld\+json" id="page-schema">[\s\S]*?<\/script>\s*/g, "");
}

function prerenderOne(entry, products, shell) {
  let html = stripHomepageMeta(stripBakedHomepageExtras(shell));
  html = html.replace(
    "<!--__PRERENDER_TITLE__-->",
    `<title>${htmlEscape(`${entry.title} | Nobi`)}</title>`
  );
  html = html.replace(
    "<!--__PRERENDER_DESC__-->",
    `<meta name="description" content="${htmlEscape(entry.description)}">\n    ${buildHeadInjection(entry, products)}`
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${renderBody(entry, products)}</div>`
  );

  // Both the directory index (trailing-slash URL) and the flat .html file
  // (Cloudflare serves it for the slugless URL) - same dual-write as
  // prerender-blog.js.
  const dirPath = join(DIST, "shop", "s", entry.slug);
  mkdirSync(dirPath, { recursive: true });
  writeFileSync(join(dirPath, "index.html"), html);
  writeFileSync(join(DIST, "shop", "s", `${entry.slug}.html`), html);
}

async function main() {
  if (!existsSync(SHELL)) {
    console.warn("prerender-shop: dist/index.html not found - run 'vite build' first. Skipping.");
    return;
  }
  const shell = readFileSync(SHELL, "utf8");
  const entries = JSON.parse(readFileSync(MANIFEST, "utf8"));

  const exportUrl = process.env.SHOP_SEO_EXPORT_URL;
  const exportSecret = process.env.SHOP_SEO_EXPORT_SECRET;
  const exportConfigured = Boolean(exportUrl && exportSecret);
  if (!exportConfigured) {
    console.warn(
      "prerender-shop: SHOP_SEO_EXPORT_URL / SHOP_SEO_EXPORT_SECRET not set - emitting shell-only pages, products skipped."
    );
  }

  const shopProductCounts = {};
  let withProducts = 0;
  for (const entry of entries) {
    let products = [];
    if (exportConfigured) {
      try {
        products = await fetchProducts(exportUrl, exportSecret, entry.query);
      } catch (e) {
        console.warn(
          `prerender-shop: seo-export failed for "${entry.slug}" (${e.message}) - emitting shell-only page.`
        );
      }
    }
    prerenderOne(entry, products, shell);
    shopProductCounts[entry.slug] = products.length;
    if (products.length > 0) withProducts++;
  }

  console.log(
    `✓ prerender-shop — ${entries.length} landing pages (${withProducts} with products, ${entries.length - withProducts} shell-only)`
  );

  // Regenerate the sitemap now that the real product counts are known, and
  // refresh the copy vite already placed in dist/ so the deploy ships it.
  const xml = generateSitemap({ shopProductCounts });
  writeFileSync(join(DIST, "sitemap.xml"), xml);
}

await main();

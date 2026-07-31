// Generates public/sitemap.xml at build time.
// Run via: node scripts/generate-sitemap.js
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, "..");
const today      = new Date().toISOString().slice(0, 10);
const BASE_URL   = "https://nobi.ai";

// A shop landing page only earns a sitemap slot when its prerendered HTML
// carries a real product grid of at least this size. Thin or product-less
// pages stay reachable but unlisted.
const MIN_SHOP_PRODUCTS_FOR_SITEMAP = 12;

// Static routes — priority and changefreq per page type
const STATIC_PAGES = [
  { path: "/",                       priority: "1.0", changefreq: "weekly"  },
  { path: "/product",                priority: "0.9", changefreq: "monthly" },
  { path: "/pricing",                priority: "0.8", changefreq: "monthly" },
  { path: "/faqs",                   priority: "0.8", changefreq: "monthly" },
  { path: "/customers",              priority: "0.8", changefreq: "monthly" },
  { path: "/customers/lucchese",     priority: "0.8", changefreq: "monthly" },
  { path: "/customers/untuckit",     priority: "0.8", changefreq: "monthly" },
  { path: "/customers/kilte",        priority: "0.8", changefreq: "monthly" },
  { path: "/shop",                   priority: "0.8", changefreq: "weekly"  },
  { path: "/blog",                   priority: "0.7", changefreq: "daily"   },
  { path: "/glossary",               priority: "0.7", changefreq: "weekly"  },
];

function getGlossaryEntries() {
  const dir = join(ROOT, "src/content/glossary");
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const entries = [];
  for (const file of files) {
    const content = readFileSync(join(dir, file), "utf8");
    if (/\bdraft:\s*true/.test(content)) continue;
    const slugMatch = content.match(/\bslug:\s*["']([^"']+)["']/);
    entries.push({ slug: slugMatch?.[1] ?? file.replace(/\.mdx$/, "") });
  }
  return entries;
}

function getBlogEntries() {
  const postsDir = join(ROOT, "src/content/posts");
  const files    = readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));
  const entries  = [];

  for (const file of files) {
    const content = readFileSync(join(postsDir, file), "utf8");

    const draftMatch = content.match(/\bdraft:\s*(true)/);
    if (draftMatch) continue;

    const slugMatch       = content.match(/\bslug:\s*["']([^"']+)["']/);
    const dateMatch       = content.match(/\bdate:\s*["']([^"']+)["']/);
    const publishedAtMatch = content.match(/\bpublishedAt:\s*["']([^"']+)["']/);

    const slug        = slugMatch?.[1]        ?? file.replace(/\.mdx$/, "");
    const date        = dateMatch?.[1]        ?? today;
    const publishDate = publishedAtMatch?.[1] ?? date;

    // Skip future-dated posts
    if (publishDate > today) continue;

    entries.push({ slug, date });
  }

  return entries;
}

// Shop landing pages come from the checked-in manifest, but only earn a
// sitemap slot once prerender-shop.js proves the page really carries at
// least MIN_SHOP_PRODUCTS_FOR_SITEMAP products. `shopProductCounts` maps
// slug -> product count and is only known after prerendering, so the
// initial pre-build run (no counts yet) lists no shop landing pages;
// prerender-shop.js re-runs this generator with the real counts.
function getShopEntries(shopProductCounts) {
  if (!shopProductCounts) return [];
  const manifestPath = join(ROOT, "src/content/shop/shop_pages.json");
  let pages = [];
  try {
    pages = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return [];
  }
  return pages.filter(
    ({ slug }) => (shopProductCounts[slug] || 0) >= MIN_SHOP_PRODUCTS_FOR_SITEMAP
  );
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

/**
 * Builds sitemap.xml and writes it to public/sitemap.xml. Returns the XML so
 * post-build callers (prerender-shop.js) can also refresh the copy vite
 * already placed in dist/.
 *
 * @param {object} [options]
 * @param {Object<string, number>} [options.shopProductCounts]
 *        Product count per shop manifest slug, gathered while prerendering.
 *        Omitted on the pre-build run, which therefore lists no shop slugs.
 */
export function generateSitemap({ shopProductCounts } = {}) {
  const blogEntries = getBlogEntries();
  const glossaryEntries = getGlossaryEntries();
  const shopEntries = getShopEntries(shopProductCounts);

  const urls = [
    ...STATIC_PAGES.map(({ path, priority, changefreq }) =>
      urlEntry({ loc: `${BASE_URL}${path}`, lastmod: today, changefreq, priority })
    ),
    ...blogEntries.map(({ slug, date }) =>
      urlEntry({ loc: `${BASE_URL}/blog/${slug}`, lastmod: date, changefreq: "monthly", priority: "0.6" })
    ),
    ...glossaryEntries.map(({ slug }) =>
      urlEntry({ loc: `${BASE_URL}/glossary/${slug}`, lastmod: today, changefreq: "monthly", priority: "0.6" })
    ),
    ...shopEntries.map(({ slug }) =>
      urlEntry({ loc: `${BASE_URL}/shop/s/${slug}`, lastmod: today, changefreq: "daily", priority: "0.6" })
    ),
  ];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n") + "\n";

  writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
  console.log(`✓ sitemap.xml — ${STATIC_PAGES.length} static + ${blogEntries.length} blog + ${glossaryEntries.length} glossary + ${shopEntries.length} shop (${urls.length} total)`);
  return xml;
}

// Run only when executed directly, not when prerender-shop.js imports the
// generator to re-run it with real product counts (same guard pattern as
// prerender-blog.js).
if (process.argv[1] && process.argv[1].endsWith("generate-sitemap.js")) {
  generateSitemap();
}

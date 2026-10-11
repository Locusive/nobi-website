// Writes public/sitemap-pages.xml (the site's own pages) and public/sitemap.xml,
// the index that points to it and to sitemap-shop.xml from prerender-shop.js.
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, "..");
const today      = new Date().toISOString().slice(0, 10);
const BASE_URL   = "https://nobi.ai";
const SITEMAP_FILES = ["sitemap-pages.xml", "sitemap-shop.xml"];

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
  { path: "/shop",                   priority: "0.9", changefreq: "weekly"  },
  { path: "/blog",                   priority: "0.7", changefreq: "daily"   },
  { path: "/glossary",               priority: "0.7", changefreq: "weekly"  },
  { path: "/terms",                  priority: "0.3", changefreq: "yearly"  },
  { path: "/privacy",                priority: "0.3", changefreq: "yearly"  },
  { path: "/bot",                    priority: "0.3", changefreq: "yearly"  },
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

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function generateSitemap() {
  const blogEntries = getBlogEntries();
  const glossaryEntries = getGlossaryEntries();

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
  ];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n") + "\n";

  writeFileSync(join(ROOT, "public/sitemap-pages.xml"), xml);
  writeFileSync(join(ROOT, "public/sitemap.xml"), buildSitemapIndex());
  console.log(`✓ sitemap-pages.xml: ${STATIC_PAGES.length} static + ${blogEntries.length} blog + ${glossaryEntries.length} glossary (${urls.length} total)`);
}

/** Builds the sitemap index that points crawlers to each sitemap file. */
function buildSitemapIndex() {
  const entries = SITEMAP_FILES.map(
    (file) => `  <sitemap>\n    <loc>${BASE_URL}/${file}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries,
    `</sitemapindex>`,
  ].join("\n") + "\n";
}

generateSitemap();

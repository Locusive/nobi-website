// Generates public/sitemap.xml at build time.
// Run via: node scripts/generate-sitemap.js
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, "..");
const today      = new Date().toISOString().slice(0, 10);
const BASE_URL   = "https://nobi.ai";

// Static routes — priority and changefreq per page type
const STATIC_PAGES = [
  { path: "/",                       priority: "1.0", changefreq: "weekly"  },
  { path: "/why-nobi/better-search",     priority: "0.8", changefreq: "monthly" },
  { path: "/why-nobi/automated-support", priority: "0.8", changefreq: "monthly" },
  { path: "/lead-capture",               priority: "0.8", changefreq: "monthly" },
  { path: "/custom-actions",             priority: "0.8", changefreq: "monthly" },
  { path: "/pricing",                priority: "0.8", changefreq: "monthly" },
  { path: "/faqs",                   priority: "0.8", changefreq: "monthly" },
  { path: "/customers",              priority: "0.8", changefreq: "monthly" },
  { path: "/customers/lucchese",     priority: "0.8", changefreq: "monthly" },
  { path: "/customers/untuckit",     priority: "0.8", changefreq: "monthly" },
  { path: "/customers/kilte",        priority: "0.8", changefreq: "monthly" },
  { path: "/blog",                   priority: "0.7", changefreq: "daily"   },
  { path: "/s/search",               priority: "0.6", changefreq: "monthly" },
  { path: "/s/ai-assistant",         priority: "0.6", changefreq: "monthly" },
];

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

  const urls = [
    ...STATIC_PAGES.map(({ path, priority, changefreq }) =>
      urlEntry({ loc: `${BASE_URL}${path}`, lastmod: today, changefreq, priority })
    ),
    ...blogEntries.map(({ slug, date }) =>
      urlEntry({ loc: `${BASE_URL}/blog/${slug}`, lastmod: date, changefreq: "monthly", priority: "0.6" })
    ),
  ];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n") + "\n";

  writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
  console.log(`✓ sitemap.xml — ${STATIC_PAGES.length} static + ${blogEntries.length} blog posts (${STATIC_PAGES.length + blogEntries.length} total)`);
}

generateSitemap();

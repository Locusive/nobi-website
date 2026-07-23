// Prerender the static <head> (title, description, canonical, og/twitter, and
// JSON-LD schema) for the client-rendered "money" pages - the same reliable
// pure-Node way prerender-blog.js works. NO headless browser: Cloudflare Pages'
// build container can't run Chromium, so we bake only the machine-readable head.
// The page BODY still renders client-side via React; this exists so crawlers and
// AI tools see correct per-page meta + structured data without executing JS.
// The runtime useSEO hook (id="page-schema") overwrites the same element after
// mount, so nothing duplicates.
//
// Keep each entry's title/description/schema in sync with that page's
// useSEO({...}) call. These are stable product pages.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { stripHomepageMeta, htmlEscape } from "./prerender-blog.js";
import { CANONICAL_DESCRIPTION, LINKEDIN_URL } from "../src/constants/positioning.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SHELL = join(DIST, "index.html");
const BASE = "https://nobi.ai";
const OG_IMAGE = `${BASE}/og-image.png`;

const ORG = { "@context": "https://schema.org", "@type": "Organization", name: "Nobi", url: BASE, logo: OG_IMAGE, sameAs: [LINKEDIN_URL] };
const SITE = { "@context": "https://schema.org", "@type": "WebSite", name: "Nobi", url: BASE };
const product = (name, description, path) => ({
  "@context": "https://schema.org", "@type": "Product", name, description,
  brand: { "@type": "Brand", name: "Nobi" }, url: `${BASE}${path}`,
  offers: { "@type": "Offer", price: "25", priceCurrency: "USD", availability: "https://schema.org/InStock" },
});

const PAGES = [
  {
    path: "/", title: "Nobi: Conversational Website Assistant for Search and Support",
    description: CANONICAL_DESCRIPTION,
    schema: [ORG, SITE, {
      "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Nobi",
      applicationCategory: "BusinessApplication", operatingSystem: "Web",
      description: CANONICAL_DESCRIPTION, url: BASE,
      offers: { "@type": "Offer", price: "25", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    }],
  },
  {
    path: "/pricing", title: "Pricing | Nobi",
    description: "Simple pricing starting at $25/month. Try free in your dashboard with 100 free messages every month - no credit card needed. AI search, knowledge base, and lead capture for any website.",
    schema: [{
      "@context": "https://schema.org", "@type": "Product", name: "Nobi",
      description: "AI site search and shopping assistant for ecommerce stores.",
      brand: { "@type": "Brand", name: "Nobi" },
      offers: { "@type": "Offer", price: "25", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${BASE}/pricing` },
    }],
  },
  {
    path: "/product", title: "Product | Nobi",
    description: "Everything Nobi does: AI-powered search and support, engagement triggered by visitor behavior, lead capture, merchandising and personalization, and an agent endpoint every AI can call.",
    schema: [product("Nobi", "A single AI assistant for search, support, proactive engagement, lead capture, merchandising, and an MCP agent endpoint.", "/product")],
  },
];

// The old standalone capability pages (better-search, automated-support,
// ai-agents, custom-actions, lead-capture) were consolidated into /product
// and now 301-redirect there — see public/_redirects. Don't re-add them
// here; their prerendered meta would compete with /product's.

function buildHead(page) {
  const url = page.path === "/" ? BASE : `${BASE}${page.path}`;
  const tags = [
    `<link rel="canonical" href="${htmlEscape(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${htmlEscape(url)}">`,
    `<meta property="og:title" content="${htmlEscape(page.title)}">`,
    `<meta property="og:description" content="${htmlEscape(page.description)}">`,
    `<meta property="og:image" content="${htmlEscape(OG_IMAGE)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${htmlEscape(page.title)}">`,
    `<meta name="twitter:description" content="${htmlEscape(page.description)}">`,
    `<meta name="twitter:image" content="${htmlEscape(OG_IMAGE)}">`,
    `<script type="application/ld+json" id="page-schema">${JSON.stringify(page.schema)}</script>`,
  ];
  return tags.join("\n    ");
}

function renderPage(page, shell) {
  let html = stripHomepageMeta(shell);
  html = html.replace("<!--__PRERENDER_TITLE__-->", `<title>${htmlEscape(page.title)}</title>`);
  html = html.replace(
    "<!--__PRERENDER_DESC__-->",
    `<meta name="description" content="${htmlEscape(page.description)}">\n    ${buildHead(page)}`
  );
  return html;
}

function main() {
  if (!existsSync(SHELL)) {
    console.warn("prerender-pages: dist/index.html not found - run 'vite build' first. Skipping.");
    return;
  }
  const shell = readFileSync(SHELL, "utf8");
  let count = 0;
  for (const page of PAGES) {
    const html = renderPage(page, shell);
    if (page.path === "/") {
      writeFileSync(SHELL, html); // homepage overwrites the shell itself
    } else {
      const rel = page.path.replace(/^\//, "");
      const dir = join(DIST, rel);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "index.html"), html);       // /path/ (trailing slash)
      mkdirSync(dirname(join(DIST, `${rel}.html`)), { recursive: true });
      writeFileSync(join(DIST, `${rel}.html`), html);     // /path (Cloudflare slugless)
    }
    count++;
  }
  console.log(`prerender-pages: baked static head + schema for ${count} page(s)`);
}

main();

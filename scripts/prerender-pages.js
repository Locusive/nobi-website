// Render page metadata and the real React page bodies at build time without
// Chromium. Client-side React still mounts normally to enable interactions.
// Keep metadata entries aligned with each page's useSEO call.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { build } from "vite";
import { pathToFileURL, fileURLToPath } from "url";
import { stripHomepageMeta, htmlEscape } from "./prerender-blog.js";
import { CANONICAL_DESCRIPTION, LINKEDIN_URL } from "../src/constants/positioning.js";
import { PRICING_DESCRIPTION } from "../src/constants/pricing.js";

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
    path: "/", title: "Nobi: Modern Site Search That Converts",
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
    description: PRICING_DESCRIPTION,
    schema: [{
      "@context": "https://schema.org", "@type": "Product", name: "Nobi",
      description: PRICING_DESCRIPTION,
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

/** Combine route metadata and rendered content with the built client shell. */
function renderPage(page, shell, body) {
  let html = stripHomepageMeta(shell);
  html = html.replace("<!--__PRERENDER_TITLE__-->", `<title>${htmlEscape(page.title)}</title>`);
  html = html.replace(
    "<!--__PRERENDER_DESC__-->",
    `<meta name="description" content="${htmlEscape(page.description)}">\n    ${buildHead(page)}`
  );
  if (!html.includes('<div id="root"></div>')) {
    throw new Error("Expected an empty React root in the build shell.");
  }
  return html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

/** Compile the JSX renderer for Node using the same Vite asset transforms. */
async function loadRenderer() {
  const outDir = join(__dirname, "..", "node_modules", ".cache", "page-prerender");
  await build({
    configFile: false,
    logLevel: "warn",
    build: {
      ssr: join(__dirname, "render-pages.jsx"),
      outDir,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  return import(pathToFileURL(join(outDir, "renderer.mjs")).href);
}

/** Write both Cloudflare URL forms with complete page content. */
async function main() {
  if (!existsSync(SHELL)) {
    throw new Error("prerender-pages: dist/index.html not found; run vite build first.");
  }
  const shell = readFileSync(SHELL, "utf8");
  const { renderPageBody } = await loadRenderer();
  let count = 0;
  for (const page of PAGES) {
    const html = renderPage(page, shell, renderPageBody(page.path));
    if (page.path === "/") {
      // Keep the SPA fallback empty so unrelated routes never inherit home content.
      writeFileSync(join(DIST, "homepage.html"), html);
      writeFileSync(SHELL, renderPage(page, shell, ""));
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
  console.log(`prerender-pages: rendered page content + metadata for ${count} page(s)`);
}

await main();

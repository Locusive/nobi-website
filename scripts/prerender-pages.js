// Render page metadata and the real React page bodies at build time without
// Chromium. Client-side React still mounts normally to enable interactions.
// Keep metadata entries aligned with each page's useSEO call.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { renderPage, writePageFiles } from "./page-html.js";
import { loadPageRenderer } from "./page-renderer.js";
import { CANONICAL_DESCRIPTION, LINKEDIN_URL } from "../src/constants/positioning.js";
import { ShopNobiPageHead } from "../src/utils/shopNobiPage.js";

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
    description: "Simple pricing starting at $25/month. Try free in your dashboard with 100 free messages every month - no credit card needed. AI search, knowledge base, and lead capture for any website.",
    schema: [{
      "@context": "https://schema.org", "@type": "Product", name: "Nobi",
      description: "Site search and an AI assistant for any website.",
      brand: { "@type": "Brand", name: "Nobi" },
      offers: { "@type": "Offer", price: "25", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${BASE}/pricing` },
    }],
  },
  {
    path: "/product", title: "Product | Nobi",
    description: "Everything Nobi does: AI-powered search and support, engagement triggered by visitor behavior, lead capture, merchandising and personalization, and an agent endpoint every AI can call.",
    schema: [product("Nobi", "A single AI assistant for search, support, proactive engagement, lead capture, merchandising, and an MCP agent endpoint.", "/product")],
  },
  ShopNobiPageHead,
  // Legal pages carry their full text in the HTML, so app directories and crawlers that run no JavaScript can read them.
  {
    path: "/privacy", title: "Privacy Policy | Nobi",
    description: "How Nobi collects, uses, and protects your data. Read our privacy policy for full details.",
    schema: [ORG],
  },
  {
    path: "/terms", title: "Terms of Service | Nobi",
    description: "Nobi's terms of service governing use of our AI assistant products and Shop Nobi.",
    schema: [ORG],
  },
];

// The old standalone capability pages (better-search, automated-support,
// ai-agents, custom-actions, lead-capture) were consolidated into /product
// and now 301-redirect there — see public/_redirects. Don't re-add them
// here; their prerendered meta would compete with /product's.

/** Write both Cloudflare URL forms with complete page content. */
async function main() {
  if (!existsSync(SHELL)) {
    throw new Error("prerender-pages: dist/index.html not found; run vite build first.");
  }
  const shell = readFileSync(SHELL, "utf8");
  const { renderPageBody } = await loadPageRenderer();
  let count = 0;
  for (const page of PAGES) {
    const html = renderPage(page, shell, renderPageBody(page.path));
    if (page.path === "/") {
      // Keep the SPA fallback empty so unrelated routes never inherit home content.
      writeFileSync(join(DIST, "homepage.html"), html);
      writeFileSync(SHELL, renderPage(page, shell, ""));
    } else {
      writePageFiles(DIST, page.path, html);
    }
    count++;
  }
  console.log(`prerender-pages: rendered page content + metadata for ${count} page(s)`);
}

await main();

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
import { AboutSeo } from "../src/content/about.js";
import { PRICING_OFFER, PRICING_SEO_DESCRIPTION } from "../src/constants/pricing.js";
import { CoveCubbySeo } from "../src/content/coveCubbyComparison.js";
import { MarleySpoonSeo } from "../src/content/marleySpoonCost.js";
import { isUtilityUrl } from "./shop-nobi-indexnow.js";
import { buildUtilityRevision, UtilityRevisionFile } from "./utility-content-revision.js";

import { BaseusScreenSeo } from "../src/content/baseusScreens.js";
import { UsbCPowerSeo } from "../src/utils/usbCPower.js";
import { PhoneCaseSeo } from "../src/utils/phoneCaseChecklist.js";
import { GiftBudgetSeo } from "../src/utils/giftBudget.js";
import { GiftGuidesSeo } from "../src/content/giftGuides.js";
import { GiftChooserSeo } from "../src/content/giftChooserProducts.js";

import { MindTheColorSeo } from "../src/content/mindTheColor.js";
import { ElectionNightSeo } from "../src/content/electionNight.js";
import { ShopNobiMcpSeo } from "../src/content/shopNobiMcp.js";

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
  AboutSeo,
  UsbCPowerSeo,
  PhoneCaseSeo,
  GiftBudgetSeo,
  GiftGuidesSeo,
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
    description: PRICING_SEO_DESCRIPTION,
    schema: [{
      "@context": "https://schema.org", "@type": "Product", name: "Nobi",
      description: "Site search and an AI assistant for any website.",
      brand: { "@type": "Brand", name: "Nobi" },
      offers: PRICING_OFFER,
    }],
  },
  {
    path: "/product", title: "Product | Nobi",
    description: "Everything Nobi does: AI-powered search and support, engagement triggered by visitor behavior, lead capture, merchandising and personalization, and an agent endpoint every AI can call.",
    schema: [product("Nobi", "A single AI assistant for search, support, proactive engagement, lead capture, merchandising, and an MCP agent endpoint.", "/product")],
  },
  ShopNobiPageHead,
  ShopNobiMcpSeo,
  CoveCubbySeo,
  MarleySpoonSeo,
  BaseusScreenSeo,
  GiftChooserSeo,
  MindTheColorSeo,
  ElectionNightSeo,
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
  const utilityRevisions = {};
  let count = 0;
  for (const page of PAGES) {
    const html = renderPage(page, shell, renderPageBody(page.path));
    if (isUtilityUrl(`${BASE}${page.path}`)) utilityRevisions[`${BASE}${page.path}`] = buildUtilityRevision(html, DIST);
    if (page.path === "/") {
      // Keep the SPA fallback empty so unrelated routes never inherit home content.
      writeFileSync(join(DIST, "homepage.html"), html);
      writeFileSync(SHELL, renderPage(page, shell, ""));
    } else {
      writePageFiles(DIST, page.path, html);
    }
    count++;
  }
  writeFileSync(join(DIST, UtilityRevisionFile), `${JSON.stringify({ version: 1, revisions: utilityRevisions }, null, 2)}\n`);
  console.log(`prerender-pages: rendered page content + metadata for ${count} page(s)`);
}

await main();

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { before, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const RendererEntry = fileURLToPath(new URL("./fixtures/render-blog-buyer-actions.jsx", import.meta.url));
const RendererFolder = fileURLToPath(new URL("../node_modules/.cache/blog-buyer-actions-test/", import.meta.url));
const ArticleSlugs = [
  "the-top-ecommerce-platforms-for-native-ai-search-and-product-discovery",
  "best-ai-search-for-apparel-and-fashion-brands",
];
let renderBuyerActions;
let renderBuyerProse;
let trackBlogBuyerAction;

before(async () => {
  await build({
    configFile: false,
    logLevel: "warn",
    esbuild: { jsx: "automatic" },
    build: {
      ssr: RendererEntry,
      outDir: RendererFolder,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "renderer.mjs" } },
    },
  });
  ({ renderBuyerActions, renderBuyerProse, trackBlogBuyerAction } = await import(pathToFileURL(join(RendererFolder, "renderer.mjs")).href));
});

test("comparison readers can reach signup, article-specific demos, and pricing without an assistant", () => {
  for (const slug of ArticleSlugs) {
    const html = renderBuyerActions(slug);
    assert.ok(html.includes('href="https://dashboard.nobi.ai/signup"'));
    assert.ok(html.includes(`href="/blog/${slug}?contact-us=1"`));
    assert.ok(html.includes('href="/pricing"'));
    assert.ok(html.includes("100 free messages each month"));
    assert.ok(html.includes("A live-site trial requires a payment method. It includes 100,000 free messages during your 30-day trial."));
  }
});

test("buttons and prose links preserve acquisition through signup, pricing, and demo", () => {
  globalThis.window = { location: { search: "?utm_source=google&utm_medium=cpc&utm_content=original&gclid=123&contact-us=0" } };
  try {
    for (const render of [renderBuyerActions, renderBuyerProse]) {
      const html = render(ArticleSlugs[0]).replaceAll("&amp;", "&");
      const links = [...html.matchAll(/href="([^"]+)"/g)].map(([, href]) => new URL(href, "https://nobi.ai"));
      const signup = links.find((url) => url.hostname === "dashboard.nobi.ai");
      const demo = links.find((url) => url.pathname.startsWith("/blog/"));
      const pricing = links.filter((url) => url.pathname === "/pricing");
      for (const url of [signup, demo, ...pricing]) {
        assert.equal(url.searchParams.get("utm_source"), "google");
        assert.equal(url.searchParams.get("utm_medium"), "cpc");
        assert.equal(url.searchParams.get("utm_content"), "original");
        assert.equal(url.searchParams.get("gclid"), "123");
      }
      assert.equal(signup.pathname, "/signup");
      assert.equal(signup.searchParams.has("contact-us"), false);
      assert.equal(demo.searchParams.get("contact-us"), "1");
      for (const url of pricing) assert.equal(url.searchParams.has("contact-us"), false);
      if (render === renderBuyerProse) assert.ok(pricing.some((url) => url.hash === "#pricing-calculator"));
      const customerStory = links.find((url) => url.pathname === "/customers/untuckit");
      if (customerStory) assert.equal(customerStory.search, "");
    }
  } finally {
    delete globalThis.window;
  }
});

test("commercial action events distinguish the article, placement, and chosen action", () => {
  globalThis.window = {};
  try {
    for (const action of ["signup", "demo", "pricing"]) {
      trackBlogBuyerAction(`/blog/${ArticleSlugs[0]}`, "conclusion", action);
    }
    assert.deepEqual(window.dataLayer, ["signup", "demo", "pricing"].map((action) => ({
      event: "blog_buyer_action_clicked",
      mixpanel_event_name: "Blog Buyer Action Clicked",
      article_path: `/blog/${ArticleSlugs[0]}`,
      cta_placement: "conclusion",
      action,
    })));
  } finally {
    delete globalThis.window;
  }
});

test("both buying guides retain pricing, signup, and demo links in crawler HTML and Markdown", () => {
  for (const slug of ArticleSlugs) {
    const html = readFileSync(new URL(`../dist/blog/${slug}.html`, import.meta.url), "utf8");
    const markdown = readFileSync(new URL(`../dist/blog/${slug}.md`, import.meta.url), "utf8");
    for (const target of ["https://dashboard.nobi.ai/signup", "/pricing", `/blog/${slug}?contact-us=1`]) {
      assert.ok(html.includes(`href="${target}"`), `Crawler HTML missing ${target}`);
      assert.ok(markdown.includes(`](${target})`), `Markdown missing ${target}`);
    }
    assert.ok(html.includes('"dateModified":"2026-10-15"'));
    assert.ok(!html.includes('href="https://dashboard.nobi.ai"'));
    assert.ok(!markdown.includes("<BlogBuyerActions"));
  }
});

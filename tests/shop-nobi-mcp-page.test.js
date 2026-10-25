import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const Dist = new URL("../dist/", import.meta.url);
const Endpoint = "https://api.nobi.ai/v1/shop/mcp";

/** Reads deployed output without running browser JavaScript. */
function readPage(path) {
  return readFileSync(new URL(path, Dist), "utf8");
}

/** React escapes JSON in HTML; recover the visible code a visitor copies. */
function readCode(text) {
  return text.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}

test("the MCP install route serves its own readable content, canonical and sitemap entry without JavaScript", () => {
  const html = readPage("shop/mcp.html");
  assert.equal(html, readPage("shop/mcp/index.html"));
  assert.match(html, /<h1[^>]*>Connect to Shop Nobi with MCP<\/h1>/);
  assert.match(html, /<title>Shop Nobi MCP Server: Setup and Tools \| Nobi<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/nobi.ai\/shop\/mcp"/);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.doesNotMatch(html, /noindex|<div id="root"><\/div>/);
  assert.match(readPage("sitemap-pages.xml"), /<loc>https:\/\/nobi.ai\/shop\/mcp<\/loc>/);
  assert.ok(html.indexOf("#ad:") < html.indexOf("<h1"), "The commission disclosure comes before the page heading");
  for (const text of ["read-only", "cannot place orders or take payments", "merchant", "privacy policy", "search_products", "find_shop_nobi_page"])
    assert.ok(html.includes(text), `Missing useful setup or disclosure text: ${text}`);
  assert.doesNotMatch(html, /\bindependent (?:online )?stores\b/i);
  assert.ok(html.includes("Search products across online stores."));
  assert.ok(readCode(html).includes("Catalog prices and availability may lag behind the merchant's website."), "The setup explains catalog freshness limits before a shopper relies on results");
});

test("copyable Claude Code and Gemini CLI instructions configure the actual remote HTTP endpoint without credentials", () => {
  const html = readPage("shop/mcp.html");
  const snippets = [...html.matchAll(/<pre><code>([\s\S]*?)<\/code><\/pre>/g)].map(match => readCode(match[1]));
  assert.equal(snippets.length, 3);
  assert.equal(snippets[0], `claude mcp add --transport http shop-nobi ${Endpoint}`);
  assert.deepEqual(JSON.parse(snippets[1]), { mcpServers: { "shop-nobi": { type: "http", url: Endpoint } } });
  assert.equal(snippets[2], `gemini mcp add --transport http shop-nobi ${Endpoint}`);
  assert.ok(html.includes("gemini mcp list") && html.includes('href="https://geminicli.com/docs/tools/mcp-server/"'));
  assert.ok(html.includes("MCP: Add Server") && html.includes(">HTTP</strong>"), "VS Code instructions choose the remote HTTP transport");
  assert.ok(html.includes('href="https://code.claude.com/docs/en/mcp"'));
  assert.ok(html.includes('href="https://code.visualstudio.com/docs/agent-customization/mcp-servers"'));
});

test("agent-readable llms.txt distinguishes Shop Nobi shopping tools from Nobi's business assistant", () => {
  const llmsText = readPage("llms.txt");
  const shopSection = llmsText.split("## Shop Nobi product search for AI agents")[1]?.split("## Contact")[0];
  assert.ok(shopSection, "Shop Nobi agent section is present");
  assert.ok(shopSection.includes(`mcp-server: ${Endpoint}`));
  assert.ok(shopSection.includes("search_products") && shopSection.includes("find_shop_nobi_page"));
  assert.ok(shopSection.includes("https://nobi.ai/shop/mcp"));
  assert.ok(shopSection.includes("cannot place orders or take payments"));
});

test("the built setup page starts the normal site assistant while shopping routes retain product-search mode", () => {
  const script = readPage("shop/mcp.html").match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const [pathname, shopping] of [["/shop/mcp", false], ["/shop/mcp/", false], ["/shop", true], ["/shop/s/purse", true]]) {
    const context = {
      window: { location: { pathname }, crypto: { randomUUID: () => "test-conversation" }, addEventListener() {} },
      document: { getElementById: () => null },
    };
    runInNewContext(script, context);
    const options = runInNewContext("readNobiAssistantOptions()", context);
    assert.equal(options.searchResultsPage === true, shopping, pathname);
    assert.equal(context.window.shopNobiPageConversationId, shopping ? "test-conversation" : null, pathname);
  }
});

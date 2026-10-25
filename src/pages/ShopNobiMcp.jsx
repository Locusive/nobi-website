import React from "react";
import PageLayout from "../components/PageLayout";
import { useSEO } from "../hooks/useSEO";
import {
  ShopNobiMcpCommand,
  ShopNobiMcpConfig,
  ShopNobiMcpEndpoint,
  ShopNobiGeminiCommand,
  ShopNobiMcpSeo,
  ShopNobiMcpTools,
} from "../content/shopNobiMcp.js";

/** Installation instructions remain readable without JavaScript or a Nobi account. */
export default function ShopNobiMcp() {
  useSEO(ShopNobiMcpSeo);

  return (
    <PageLayout active="shop">
      <article className="prose prose-slate mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm"><strong>#ad:</strong> Some product links may earn Nobi a commission from qualifying purchases.</p>
        <h1>Shopping MCP server for product search</h1>
        <p>Connect an AI agent to Shop Nobi to search products across curated online stores. Each result names the store and links to its product page. The hosted server is read-only: it cannot place orders or take payments. You buy on the merchant's website.</p>

        <h2>Server address</h2>
        <p>Choose a remote Streamable HTTP connection and enter:</p>
        <p className="break-all"><code>{ShopNobiMcpEndpoint}</code></p>
        <p>No Nobi sign-in, API key or OAuth is required. Your client may require its own account, plan or approval. Search text is sent to api.nobi.ai. See our <a href="/privacy">privacy policy</a>.</p>

        <h2>What a shopping agent can do</h2>
        <p>Ask for a product in ordinary language, such as “Find a linen dress for a summer wedding under $150.” The agent can call <code>search_products</code> and show the returned products, prices, stores and links. It should let the shopper check the final price, stock and delivery on the store's own page. If it needs a shareable Shop Nobi page for a topic, it can call <code>find_shop_nobi_page</code>.</p>
        <p>This is a shopping MCP connection, not a general REST catalog API, price-history feed or checkout service. For a broader comparison, read our <a href="/blog/shopping-mcp-servers-for-ai-agents">shopping MCP server guide</a>.</p>

        <h2>Claude Code</h2>
        <p>With Claude Code installed, run this in your project:</p>
        <pre><code>{ShopNobiMcpCommand}</code></pre>
        <p>Alternatively, merge this server into your project's <code>.mcp.json</code>:</p>
        <pre><code>{JSON.stringify(ShopNobiMcpConfig, null, 2)}</code></pre>
        <p>Open <code>/mcp</code> in Claude Code to check the connection and review any client approval. <a href="https://code.claude.com/docs/en/mcp">Claude Code setup reference</a>.</p>

        <h2>Gemini CLI</h2>
        <p>With Gemini CLI installed, run:</p>
        <pre><code>{ShopNobiGeminiCommand}</code></pre>
        <p>Run <code>gemini mcp list</code> to check the connection, then review the client's tool-use prompts. <a href="https://geminicli.com/docs/tools/mcp-server/">Gemini CLI setup reference</a>.</p>

        <h2>VS Code</h2>
        <p>Run <code>MCP: Add Server</code> from the Command Palette, choose <strong>HTTP</strong>, enter the server address above and name it <code>shop-nobi</code>. Choose where to save it and review the client prompts. <a href="https://code.visualstudio.com/docs/agent-customization/mcp-servers">VS Code setup reference</a>.</p>

        <h2>Available tools</h2>
        <ul>
          {ShopNobiMcpTools.map(tool => <li key={tool.name}><code>{tool.name}</code>: {tool.description}</li>)}
        </ul>
        <p>Try a request such as “Find a USB-C power bank.” Catalog prices and availability may lag behind the merchant's website. Follow the returned store links to check current prices, compatibility, stock and delivery estimates. Keep any commission notice next to the relevant link.</p>
        <p>Prefer a browser? <a href="/shop">Search Shop Nobi</a>. Claude Code plugin users can also follow the <a href="https://github.com/Locusive/shop-nobi-claude-plugin">existing plugin installation instructions</a>.</p>
      </article>
    </PageLayout>
  );
}

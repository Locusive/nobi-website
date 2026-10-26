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
        <h1>Connect agents to the Shop Nobi search engine</h1>
        <p>Shop Nobi is an online search engine. Its public MCP connection currently searches product listings from curated online stores. Service listings and other kinds of offerings are not yet available through these tools. Results identify the selling store and provide a route to its product page when that information is available. The connection is read-only: it cannot place orders or take payments.</p>

        <h2>Server address</h2>
        <p>Choose a remote Streamable HTTP connection and enter:</p>
        <p className="break-all"><code>{ShopNobiMcpEndpoint}</code></p>
        <p>For agents that prefer plain text, read the <a href="/shop-nobi-mcp.md">Markdown guide</a>. It lists tool arguments, response fields and error handling. The same guide is part of the <a href="https://docs.nobi.ai/shop-nobi/">Shop Nobi documentation module</a>.</p>
        <p>No Nobi sign-in, API key or OAuth is required. Your client may require its own account, plan or approval. Search text is sent to api.nobi.ai. See our <a href="/privacy">privacy policy</a>.</p>

        <h2>What an agent can do today</h2>
        <p>Ask for a product in ordinary language, such as “Find a linen dress for a summer wedding under $150.” The agent can call <code>search_products</code> and show products, prices, stores and links where returned. It should let the person check final price, stock and delivery on the store's own page. If it needs a shareable Shop Nobi page for a topic, it can call <code>find_shop_nobi_page</code>.</p>
        <p>The current MCP tools search products; they are not a general REST catalog API, price-history feed or checkout. For a comparison of current product-search tools, read our <a href="/blog/shopping-mcp-servers-for-ai-agents">MCP server guide</a>.</p>

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

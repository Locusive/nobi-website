import React from "react";
import PageLayout from "../components/PageLayout";
import { useSEO } from "../hooks/useSEO";
import {
  ShopNobiAgentConnections, ShopNobiCursorInstallUrl, ShopNobiGeminiExtensionCommand,
  ShopNobiMcpCommand, ShopNobiMcpConfig, ShopNobiMcpEndpoint, ShopNobiGeminiCommand,
  ShopNobiMcpSeo, ShopNobiMcpTools,
} from "../content/shopNobiMcp.js";
import "./ShopNobiMcp.css";

/** A connection card names its exact setup path without implying a platform partnership. */
function ConnectionCard({ connection }) {
  return (
    <a className="snm-connection" href={connection.anchor}>
      <span className="snm-connection-mark"><img src={connection.logo} alt="" loading="lazy" /></span>
      <span className="snm-connection-copy">
        <span className="snm-connection-kind">{connection.kind}</span>
        <strong>{connection.name}</strong>
        <span>{connection.description}</span>
      </span>
      <span className="snm-connection-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

/** Product entry point and setup guide stay useful in prerendered HTML without JavaScript. */
export default function ShopNobiMcp() {
  useSEO(ShopNobiMcpSeo);

  return (
    <PageLayout active="agents">
      <article className="snm-page">
        <section className="snm-hero">
          <div className="snm-hero-copy">
            <p className="snm-disclosure"><strong>#ad:</strong> Some product links may earn Nobi a commission from qualifying purchases.</p>
            <p className="snm-overline">Shop Nobi for agents</p>
            <h1>Connect agents to the Shop Nobi search engine</h1>
            <p className="snm-intro">Give an agent product search across curated online stores, with seller links it can hand back to a shopper. Shop Nobi is an online search engine; its public MCP connection currently returns product listings, not service listings or every offering on the web.</p>
            <div className="snm-actions">
              <a className="snm-primary-action" href="#connections">Choose a connection</a>
              <a className="snm-secondary-action" href="/shop">Try the web search</a>
            </div>
            <p className="snm-hero-note">No Nobi account or API key. Read-only tools cannot place orders or take payments. Purchases happen on the seller's site.</p>
          </div>
          <div className="snm-example" aria-label="Example product search flow">
            <div className="snm-example-title"><span className="snm-example-dot" /> Agent request</div>
            <p>“Find a linen dress for a summer wedding under $150.”</p>
            <div className="snm-example-divider" />
            <div className="snm-example-title">Shop Nobi tool call</div>
            <code>search_products</code>
            <div className="snm-example-fields"><span>Product name</span><span>Store</span><span>Price</span><span>Seller link</span></div>
            <small>Fields are shown when available. Check price, stock and delivery at the store.</small>
          </div>
        </section>

        <section className="snm-connections" id="connections" aria-labelledby="snm-connections-title">
          <div className="snm-section-heading">
            <div><h2 id="snm-connections-title">Choose where you build</h2><p>Each path connects to the same public product-search server. Pick the client you already use.</p></div>
            <a href="https://docs.nobi.ai/shop-nobi-connector/">Read the product docs</a>
          </div>
          <div className="snm-connection-grid">
            {ShopNobiAgentConnections.map(connection => <ConnectionCard key={connection.name} connection={connection} />)}
          </div>
          <p className="snm-platform-note">These are setup routes, not claims of a platform partnership or marketplace approval.</p>
        </section>

        <section className="snm-endpoint" aria-labelledby="snm-endpoint-title">
          <div><h2 id="snm-endpoint-title">Any remote MCP client</h2><p>Use Streamable HTTP with this server address. Discover the live tool schemas with <code>tools/list</code> and approve tool use in your client.</p></div>
          <p className="snm-endpoint-url"><code>{ShopNobiMcpEndpoint}</code></p>
        </section>

        <div className="snm-details">
          <section id="claude-code" className="snm-detail">
            <div className="snm-detail-heading"><span>Claude Code</span><h2>Install a plugin or add the server</h2></div>
            <div className="snm-detail-body">
              <p>The <a href="https://github.com/Locusive/shop-nobi-claude-plugin">public Shop Nobi plugin</a> adds a product-search skill and the hosted MCP connection. Run <code>claude plugin marketplace add Locusive/shop-nobi-claude-plugin</code>, then <code>claude plugin install shop-nobi@locusive</code>. For a server-only connection, run:</p>
              <pre><code>{ShopNobiMcpCommand}</code></pre>
              <p>Or merge this into your project's <code>.mcp.json</code>:</p>
              <pre><code>{JSON.stringify(ShopNobiMcpConfig, null, 2)}</code></pre>
              <p>Open <code>/mcp</code> in Claude Code to confirm the connection and review client approval. <a href="https://code.claude.com/docs/en/mcp">Claude Code setup reference</a>.</p>
            </div>
          </section>

          <section id="gemini-cli" className="snm-detail">
            <div className="snm-detail-heading"><span>Gemini CLI</span><h2>Install the extension</h2></div>
            <div className="snm-detail-body">
              <p>The <a href="https://github.com/Locusive/shop-nobi-gemini-extension">public Shop Nobi extension</a> connects the hosted tools. Run <code>{ShopNobiGeminiExtensionCommand}</code>. For a server-only connection, use:</p>
              <pre><code>{ShopNobiGeminiCommand}</code></pre>
              <p>Run <code>gemini mcp list</code> to check the connection, then review tool-use prompts. <a href="https://geminicli.com/docs/tools/mcp-server/">Gemini CLI setup reference</a>.</p>
            </div>
          </section>

          <section id="cursor" className="snm-detail">
            <div className="snm-detail-heading"><span>Cursor</span><h2>Add the MCP connection</h2></div>
            <div className="snm-detail-body">
              <p><a className="snm-inline-action" href={ShopNobiCursorInstallUrl}>Add Shop Nobi to Cursor</a> opens Cursor's direct MCP setup. Confirm the connection in Cursor's MCP settings before asking its agent to search. The <a href="https://github.com/Locusive/shop-nobi-claude-plugin">public repository</a> also contains a Cursor plugin manifest and shared product-search skill, but a Cursor marketplace listing has not been verified. The direct link installs only the MCP connection.</p>
            </div>
          </section>

          <section id="other-clients" className="snm-detail">
            <div className="snm-detail-heading"><span>Other clients</span><h2>Use the standard server address</h2></div>
            <div className="snm-detail-body">
              <p>In VS Code, run <code>MCP: Add Server</code>, choose <strong>HTTP</strong>, enter the server address above and name it <code>shop-nobi</code>. Choose where to save it and review client prompts. <a href="https://code.visualstudio.com/docs/agent-customization/mcp-servers">VS Code setup reference</a>.</p>
            </div>
          </section>
        </div>

        <section className="snm-contract">
          <div><h2>What the tools return</h2><p>Ask for a product in ordinary language. <code>search_products</code> can return names, stores, prices and links when available. <code>find_shop_nobi_page</code> can return an existing Shop Nobi page for an exact product topic.</p>
            <ul>{ShopNobiMcpTools.map(tool => <li key={tool.name}><code>{tool.name}</code>: {tool.description}</li>)}</ul>
          </div>
          <div className="snm-contract-links">
            <a href="https://docs.nobi.ai/shop-nobi-mcp-response/">Response format and errors</a>
            <a href="/shop-nobi-mcp.md">Plain Markdown for agents</a>
            <a href="/blog/shopping-mcp-servers-for-ai-agents">Compare shopping MCP servers</a>
          </div>
        </section>
        <p className="snm-bottom-note">The tools are not a general REST catalog API, price-history feed or checkout. A result may omit a price, image, seller or link. Check current price, stock and delivery at the seller, keep any returned commission notice beside its link, and read our <a href="/privacy">privacy policy</a>.</p>
      </article>
    </PageLayout>
  );
}

import { ShopNobiImage } from "../utils/shopNobiPage.js";
import { IndexableRobots } from "../utils/previewImage.js";

export const ShopNobiMcpPath = "/shop/mcp";
export const ShopNobiMcpEndpoint = "https://api.nobi.ai/v1/shop/mcp";
export const ShopNobiCursorInstallUrl = "https://cursor.com/install-mcp?name=shop-nobi&config=eyJ0eXBlIjoiaHR0cCIsInVybCI6Imh0dHBzOi8vYXBpLm5vYmkuYWkvdjEvc2hvcC9tY3AifQ%3D%3D";
export const ShopNobiGeminiExtensionCommand = "gemini extensions install https://github.com/Locusive/shop-nobi-gemini-extension";

/** Shared page metadata keeps the initial HTML and browser route consistent. */
export const ShopNobiMcpSeo = {
  path: ShopNobiMcpPath,
  title: "Shop Nobi Search Engine for AI Agents | MCP",
  description: "Connect an AI agent to the Shop Nobi online search engine. Its public, read-only MCP tools currently search product listings across curated stores.",
  image: ShopNobiImage,
  robots: IndexableRobots,
  schema: [{ "@context": "https://schema.org", "@type": "WebPage", name: "Shop Nobi MCP setup", url: `https://nobi.ai${ShopNobiMcpPath}` }],
};

/** Claude Code accepts this remote HTTP server in a project's .mcp.json. */
export const ShopNobiMcpConfig = {
  mcpServers: {
    "shop-nobi": { type: "http", url: ShopNobiMcpEndpoint },
  },
};

export const ShopNobiMcpCommand = `claude mcp add --transport http shop-nobi ${ShopNobiMcpEndpoint}`;
export const ShopNobiGeminiCommand = `gemini mcp add --transport http shop-nobi ${ShopNobiMcpEndpoint}`;

/** Each card names an available connection route, not a partnership or marketplace listing. */
export const ShopNobiAgentConnections = [
  {
    name: "Claude Code",
    kind: "Plugin",
    description: "A product-search skill and the hosted Shop Nobi tools.",
    logo: "/media/claude-logo.svg",
    anchor: "#claude-code",
  },
  {
    name: "Gemini CLI",
    kind: "Extension",
    description: "Install the public extension to connect the hosted tools.",
    logo: "/media/agent-integrations/gemini.svg",
    anchor: "#gemini-cli",
  },
  {
    name: "Cursor",
    kind: "MCP connection",
    description: "Add the server directly; a marketplace listing is not available yet.",
    logo: "/media/agent-integrations/cursor.svg",
    anchor: "#cursor",
  },
];

/** Framework recipes connect an agent to the server by URL; each links to a runnable example. */
export const ShopNobiFrameworkRecipes = [
  { name: "LangChain / LangGraph", description: "Register the server, load its tools, run an agent.", href: "https://github.com/Locusive/shop-nobi-claude-plugin/blob/main/examples/langchain_shop_agent.py" },
  { name: "LlamaIndex", description: "Load the tools with llama-index-tools-mcp.", href: "https://github.com/Locusive/shop-nobi-claude-plugin/blob/main/examples/llamaindex_shop_agent.py" },
  { name: "Vercel AI SDK", description: "createMCPClient over Streamable HTTP, then client.tools().", href: "https://github.com/Locusive/shop-nobi-claude-plugin/blob/main/examples/vercel_ai_sdk_shop_agent.ts" },
  { name: "OpenAI Agents SDK", description: "A hosted MCP tool points the Responses API at the server.", href: "https://github.com/Locusive/shop-nobi-claude-plugin/blob/main/examples/openai_agents_sdk_shop_agent.py" },
];

/** The tools advertised by the public hosted service. */
export const ShopNobiMcpTools = [
  { name: "search_products", description: "Search products across online stores." },
  { name: "find_shop_nobi_page", description: "Find an existing Shop Nobi shopping page for an exact topic." },
  { name: "get_product_details", description: "Get a product's full details: specs, variants, images, price, availability, brand and category." },
  { name: "compare_products", description: "Compare two or more products side by side on the attributes they share." },
  { name: "check_price_and_availability", description: "Check the current price, currency and stock for one or more products." },
  { name: "find_alternatives", description: "Find similar products across stores, excluding the original one." },
];

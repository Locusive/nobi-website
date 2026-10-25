import { ShopNobiImage } from "../utils/shopNobiPage.js";
import { IndexableRobots } from "../utils/previewImage.js";

export const ShopNobiMcpPath = "/shop/mcp";
export const ShopNobiMcpEndpoint = "https://api.nobi.ai/v1/shop/mcp";

/** Shared page metadata keeps the initial HTML and browser route consistent. */
export const ShopNobiMcpSeo = {
  path: ShopNobiMcpPath,
  title: "Shopping MCP Server for AI Agents | Shop Nobi",
  description: "Search products across curated online stores with Shop Nobi's read-only shopping MCP server. Remote HTTP endpoint, no Nobi account or API key.",
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

/** These are the two tools advertised by the public hosted service. */
export const ShopNobiMcpTools = [
  { name: "search_products", description: "Search products across online stores." },
  { name: "find_shop_nobi_page", description: "Find an existing Shop Nobi shopping page for an exact topic." },
];

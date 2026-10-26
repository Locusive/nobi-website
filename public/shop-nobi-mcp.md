# Shop Nobi search engine: MCP guide

Shop Nobi is an online search engine. Its public MCP connection currently searches product listings from curated online stores. It is read-only and does not search service listings, place orders, or take payments.

HTML documentation: https://docs.nobi.ai/shop-nobi-mcp-response/

## Connect

- Transport: remote Streamable HTTP
- Server: `https://api.nobi.ai/v1/shop/mcp`
- Shop Nobi authentication: none
- Client approval: depends on the MCP client

Discover the live tool schemas with `tools/list`. For installation examples, see https://nobi.ai/shop/mcp.

### Client setup paths

- Claude Code plugin and direct MCP setup: https://docs.nobi.ai/shop-nobi-connector/
- Gemini CLI extension: `gemini extensions install https://github.com/Locusive/shop-nobi-gemini-extension`
- Cursor direct MCP connection: https://nobi.ai/shop/mcp#cursor. The direct link installs the connection, not a marketplace plugin.
- Other remote MCP clients: use the server address above with Streamable HTTP.

## `search_products`

Arguments: `query` is required nonblank text, up to 500 characters. `limit` is optional, from 1 to 20, default 10. Example arguments:

```json
{"query":"linen dress for a summer wedding under $150","limit":5}
```

On success, check `isError === false` and read `structuredContent.products`. Clients that only read text can parse JSON from `content[0].text`. The `products` array may be empty.

Each product contains `name` (string), `store` (string or null), `price` (number or null), `currency` (string), `inStock` (boolean), `imageUrl` (string or null), `url` (string or null), `paidLink` (boolean), and `linkLabel` (string or null). The `url`, when present, is a Nobi click link that forwards to the seller's product page, not a raw merchant URL. Never invent a missing price, seller, image, or link. Show `linkLabel` beside its link when supplied, especially for a paid link. Verify final price, stock, and delivery on the seller's site.

This parser handles both structured and text-only MCP clients. It does not treat an error or a temporary busy message as a genuine zero-result search:

```js
function readSearchResult(result) {
  if (result.isError) throw new Error(result.content?.[0]?.text || "Search failed");
  const text = result.content?.find(item => item.type === "text")?.text;
  const data = result.structuredContent ?? (text ? JSON.parse(text) : null);
  if (!Array.isArray(data?.products)) throw new Error("Search result has no products array");
  if (data.products.length === 0 && data.message) return { status: "unavailable", message: data.message };
  return { status: "ok", products: data.products };
}
```

## `find_shop_nobi_page`

Arguments: `topic` is required nonblank text, up to 200 characters. Example: `{"topic":"linen dresses"}`. This tool finds an existing page for an exact product topic; it does not search products.

On success, `structuredContent.found` is a boolean. `structuredContent.page` is null if `found` is false. Otherwise the page has `title` (string), `description` (string or null), `url` (string), and `exactMatch` (true). Do not substitute a broader page when no exact page exists.

## Errors and limits

Check `isError` before parsing. An error result has explanatory text and may omit `structuredContent`; it is not a genuine zero-result search. A busy response may return empty `products` plus a `message` asking the client to try later. Avoid repeated rapid calls.

The current tools search Shop Nobi's product index, not the whole web. Search text is sent to Nobi's API; see https://nobi.ai/privacy.

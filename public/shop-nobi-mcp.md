# Shop Nobi search engine: MCP guide

Shop Nobi is an online search engine. Its public MCP connection currently searches product listings from curated online stores. It is read-only and does not search service listings, place orders, or take payments.

HTML documentation: https://docs.nobi.ai/shop-nobi/

## Connect

- Transport: remote Streamable HTTP
- Server: `https://api.nobi.ai/v1/shop/mcp`
- Shop Nobi authentication: none
- Client approval: depends on the MCP client

Discover the live tool schemas with `tools/list`. For installation examples, see https://nobi.ai/shop/mcp.

## `search_products`

Arguments: `query` is required nonblank text, up to 500 characters. `limit` is optional, from 1 to 20, default 10. Example arguments:

```json
{"query":"linen dress for a summer wedding under $150","limit":5}
```

On success, check `isError === false` and read `structuredContent.products`. Clients that only read text can parse JSON from `content[0].text`. The `products` array may be empty.

Each product contains `name` (string), `store` (string or null), `price` (number or null), `currency` (string), `inStock` (boolean), `imageUrl` (string or null), `url` (string or null), `paidLink` (boolean), and `linkLabel` (string or null). The `url`, when present, is a Nobi click link that forwards to the seller's product page, not a raw merchant URL. Never invent a missing price, seller, image, or link. Show `linkLabel` beside its link when supplied, especially for a paid link. Verify final price, stock, and delivery on the seller's site.

## `find_shop_nobi_page`

Arguments: `topic` is required nonblank text, up to 200 characters. Example: `{"topic":"linen dresses"}`. This tool finds an existing page for an exact product topic; it does not search products.

On success, `structuredContent.found` is a boolean. `structuredContent.page` is null if `found` is false. Otherwise the page has `title` (string), `description` (string or null), `url` (string), and `exactMatch` (true). Do not substitute a broader page when no exact page exists.

## Errors and limits

Check `isError` before parsing. An error result has explanatory text and may omit `structuredContent`; it is not a genuine zero-result search. A busy response may return empty `products` plus a `message` asking the client to try later. Avoid repeated rapid calls.

The current tools search Shop Nobi's product index, not the whole web. Search text is sent to Nobi's API; see https://nobi.ai/privacy.

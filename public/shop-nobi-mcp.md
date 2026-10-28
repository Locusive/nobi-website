# Shop Nobi search engine: MCP guide

Shop Nobi is an online search engine. Its public MCP connection currently searches product listings from curated online stores. It is read-only and does not search service listings, place orders, or take payments.

HTML documentation: https://docs.nobi.ai/shop-nobi-mcp-response/

## Connect

- Transport: remote Streamable HTTP
- Server: `https://api.nobi.ai/v1/shop/mcp?source=nobi_website`
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

Each product contains `id` (string, the selected Nobi variant ID used by the detail, compare, price, and alternatives tools), `name` (string), `store` (string or null), `price` (number or null), `currency` (string), `inStock` (boolean), `imageUrl` (string or null), `url` (string or null), `paidLink` (boolean), and `linkLabel` (string or null). The `url`, when present, is a Nobi click link that forwards to the seller's product page, not a raw merchant URL. Never invent a missing price, seller, image, or link. Show `linkLabel` beside its link when supplied, especially for a paid link. Verify final price, stock, and delivery on the seller's site.

In the expanded schema, search results also include `variantId` (the same Nobi variant ID as `id`), `productId` (its Nobi parent ID), `merchantId` (the selling merchant's Nobi UUID), `sourceProductId` and `sourceVariantId` (nullable merchant-source IDs). Discover `tools/list` before relying on these fields.

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

## `get_product_details`

Arguments: supply exactly one selector advertised by the live schema: `id` (legacy Nobi variant ID), `variantId` (Nobi variant), `productId` (Nobi parent), `sourceVariantId`, `sourceProductId`, `sku`, or `productUrl`. Nobi IDs accept the returned Base62 value or a canonical UUID. Source IDs and SKUs also require `storeDomain` or a known Nobi `merchantId`. `productUrl` must match a stored HTTPS catalog destination and is never fetched. An ambiguous URL is refused; use a known merchant ID to disambiguate a shared store hostname.

On success, read `structuredContent.product`: `id`, `name`, `store`, `price` (number or null), `currency`, `compareAtPrice` (number or null), `inStock` (boolean or null for a parent), `inventoryQuantity` (number or null), `brand` (string or null), `categoryPath` (string or null), `imageUrls` (array of strings), `specs` (array of `{name, value}` attribute pairs, which vary by product), and `variants` (the product's variant options). There are no reviews or ratings; the stores' catalogs hold none.

The structured result also has `found`; when false, `product` is null. In expanded details, `productId` and `merchantId` identify the parent and merchant, and `sourceProductId` and `sourceVariantId` retain source identities. A parent selection leaves `id`, `variantId`, `sourceVariantId`, price, currency, compare-at price, stock and inventory null, with empty selected-variant specs. It returns every current variant choice, including out-of-stock choices. Each choice has its Nobi variant `id`, nullable `sourceVariantId`, name, price, currency, stock, inventory and specs. Select that choice with `variantId`.

### Shopify IDs require the merchant domain

When sending a Shopify product or variant ID, include the selling merchant's domain as `storeDomain`, such as `example.com`. Use `sourceProductId` for a Shopify product and `sourceVariantId` for a Shopify variant only when the live `tools/list` schema supports them. A known Nobi `merchantId` can supply equivalent merchant context. Never put Shopify IDs or SKUs into Nobi `id`, `productId` or `variantId` fields. If the schema accepts only `id`, use the Nobi variant ID returned by search.

Where the source-ID arguments are advertised, send exactly one selector together with the actual merchant hostname:

```json
{"sourceProductId":"123456789","storeDomain":"example.com"}
```

```json
{"sourceVariantId":"987654321","storeDomain":"example.com"}
```

These are illustrative IDs and a placeholder domain, not catalog records. Nobi product IDs identify parents; Nobi variant IDs identify specific choices. Parent lookup returns variant options without choosing a variant's price or stock. SKU lookup also requires merchant context and refuses ambiguous matches.

## `compare_products`

Arguments: `ids` is a required array of two or more product ids from `search_products` results.

On success, read `structuredContent.comparison`: `attributes` (an array of attribute-name strings) and `products` (the compared variant rows, each with `id`, `name`, `store` and a `values` array of `{name, value}` attribute pairs). Only attributes at least one product provides are included.

## `check_price_and_availability`

Arguments: `ids` is a required array of one or more product ids from `search_products` results.

On success, read `structuredContent.products`: each has `id`, `price` (number or null), `currency`, `inStock` (boolean), and `inventoryQuantity` (number or null). Prices and stock are refreshed from the store; there is no price history.

## `find_alternatives`

Arguments: `id` is the required product id from a `search_products` result. `maxPrice` (number) and `limit` (integer) are optional.

On success, read `structuredContent.products`: the same product shape as `search_products`, excluding the original listing and collapsing the same product sold by more than one store.

## Errors and limits

Check `isError` before parsing. An error result has explanatory text and may omit `structuredContent`; it is not a genuine zero-result search. A busy response may return empty `products` plus a `message` asking the client to try later. Avoid repeated rapid calls.

The current tools search Shop Nobi's product index, not the whole web. Search text is sent to Nobi's API; see https://nobi.ai/privacy.

# Shop Nobi agent connection hub

> # Product positioning
  [x] Keep Shop Nobi the public online search engine; identify MCP as its agent connection, not a second search engine.
  [x] State the current product-listing, read-only scope and avoid partnership or marketplace claims.

> # Website
  > ## Connection page
      [x] Turn `/shop/mcp` into a clear agent entry point with a direct setup action and an integration gallery modeled on Tavily's navigation pattern.
      [x] Show only supported paths: Claude Code plugin, Gemini CLI extension, Cursor direct MCP, and generic remote MCP setup.
      [x] Link each path to the exact setup guide and agent-readable response documentation.
  > ## Discovery
      [x] Add a visible route from the Shop Nobi browsing experience and existing site navigation without changing the shopper search flow.
      [x] Preserve crawlable HTML, canonical URL, sitemap, keyboard access, and mobile layout.

> # Product documentation
  [x] Extend the existing Shop Nobi docs module with Claude Code, Gemini CLI, Cursor, and generic MCP setup paths.
  [x] Add a concrete response and error parsing example to the response guide and plain Markdown.
  [x] Publish and verify docs.nobi.ai before claiming documentation done.

> # Verification and release
  [x] Run the website suite and inspect responsive prerendered content and links.
  [] Use a feature branch, current-head review, normal merge, production deployment, and independent live checks.
  [] Update and re-fetch the Notion card after each material step; close agent-created tabs.

Design: Nobi purple `#6d3bff`, deep plum `#100a24`, ink `#1b1626`, pale violet `#f1ecff`, and white. Use the existing sans-serif. The hero pairs a concise agent use case with a copyable endpoint panel. The integration gallery uses recognizable platform marks and different status copy, not an identical SaaS card grid. Each card routes to a precise guide. This borrows Tavily's information path without copying its branding or claiming partnerships.

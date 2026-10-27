# Shop Nobi website MCP source tags

## Connection instructions

- [x] Inspect current source and distinguish canonical references from installable destinations.
- [x] Apply only source=nobi_website to the manual URL, JSON config, quoted CLI commands, Cursor deep-link, Markdown, llms and blog command.
- [x] Preserve product/tool copy, disclosures, canonical endpoint references and metadata.

## Verification

- [x] Build actual Vite and prerendered output locally without external-model calls.
- [x] Run the existing MCP page tests against copied/configured destinations.
- [x] Verify unaffected source files remain exact and inspect GitHub/Cloudflare triggers.

## Release

- [x] Obtain root review before any push, PR, hosted CI or deployment.
- [ ] Root completes the authorized release and independent public readback.

Notion NOBI-2878: https://www.notion.so/406c7ba9c3dd81ea99b2cc433bfdcb7c

Test cleanup: the eight existing MCP page tests cover distinct output/capability/canonical/layout behavior. Extend them in place, preserving all existing coverage; no removals or redundant additions.

# Scope and architecture decision

- [x] Inspect the website README, actual routes, static renderers, sitemap, current affiliate helpers and the server link-building path. No website-local AGENTS or lessons file was found; shared Nobi instructions and `agents/worktree_protocol.md` apply.
- [x] Read `affiliate_operating_portfolio.md`, `cat_space_comparison.md`, the functioning prototype, footprint module and the three original Pin drafts.
- [x] Verify remote website main is `0171a283b3243926c965876c2fd81de21972d7d7`. The primary `/Users/shanif/Nobi/nobi-website` checkout remains stale and must not be edited.
- [x] Obtain root's architecture confirmation before implementation.
- [x] Use **`/tools/cove-vs-cubby`**, canonical `https://nobi.ai/tools/cove-vs-cubby`, with a dedicated React page and the existing static renderer. It remains branded Shop Nobi and links to `/shop`, privacy and terms.
- [x] Preserve the site's existing floating assistant outside `/shop`. The calculator makes no search/model request and does not adopt the assistant container. No global assistant bootstrap, mode hook, routing classifier, API or ranking change is needed.

The alternative `/shop/compare/cove-vs-cubby` enters the unconditional full shopping-assistant bootstrap. A standalone utility there would require an exact-path exception and consistent navigation/reload handling. That adds unrelated global risk for no buyer benefit. The `/tools` route is the smaller option.

## Dedicated worktree and dependency

- [x] Create `/Users/shanif/Nobi/worktrees/shop-nobi-25-cat-fit`, branch `shop-nobi-25-cat-fit`; never edit the existing primary website or prebuilt-click worktree.
- [x] Prefer the reviewed standalone-click implementation from PR 427, head `62e252dba9db3b5899850b12b977b950d9a21f4f`, as an explicit local dependency. Keep the utility delta separate from that commit. Root chooses a stacked base or waits for that fix to land; no merge/publication is implied.
- [x] Create an untracked current `WORKTREE_BRIEFING.md`, preserve the AI session/card links, and copy this plan into the new worktree's `agents/feature_plans/` before source changes. Root owns the existing Notion card update.
- [x] Install locked dependencies normally only if needed, with no symlinks or copied credentials. Do not commit, push, open another PR, publish or run paid services under this preparation task.

# Consumer page

- [x] Lead with “Cove vs Cubby: which fits your floor space?” and the useful distinction: exterior size, chosen access/cleaning allowance, usable litter area and cat suitability answer different questions.
- [x] Port the dependency-free placement calculation into an ordinary website utility module. Keep explicit width/depth/clearance, inches/centimeters, optional 90-degree rotation and reset-on-edit behavior. Do not invent a manufacturer clearance recommendation or assume zero for missing input.
- [x] Reuse the prototype's cool palette/Avenir treatment and desktop form/drawing layout, stacking cleanly on mobile. Keep keyboard labels, error handling, live result summary and numeric/text alternatives to the drawings.
- [x] Carry all three original diagram questions into the page: common-scale exterior drawing, an explicitly labeled 20-by-24-inch zero-clearance example, and exterior-area versus merchant-reported litter-area comparison. Adapt the original geometry into responsive page figures rather than embedding three enormous draft posters. Original Pin files remain unpublished.
- [x] Show a compact sourced facts/price table and two equally prominent merchant CTAs. Place a clear commission disclosure beside/before the purchase links. Describe this as a specification comparison, with no hands-on testing or comfort/performance claim.
- [x] Put checked date, manufacturer source links and “check current price and availability” beside the dated price observations. Omit shipping estimates, coupon claims, ratings, stock quantities and unsupported recommendations.

## Facts verified October 16, 2026

| Product | Exterior width/depth | Dated US price | Exact variant |
| --- | --- | ---: | --- |
| Cubby | 15.2 × 21.2 inches | $69 USD | `40741601116233` |
| Cove | 16 × 26 inches | $199 USD | `40277967568969` |

Both [Cubby](https://www.tuftandpaw.com/products/cubby-litter-box?variant=40741601116233) and [Cove](https://www.tuftandpaw.com/products/cove-litter-box-full?variant=40277967568969) were read in ordinary Chrome with **United States** selected, those prices visible and Add to Cart enabled. The corresponding public `.js` product responses agree on IDs/prices and availability. No cart change was made. These are dated observations, not future stock guarantees.

Manufacturer technical details support the dimensions. Their comparison FAQ says the usable litter area is the same; attribute that statement rather than claiming independent measurement. Derived exterior rectangles are 322.24 and 416 square inches, with Cove approximately 29.1% larger relative to Cubby. This does not mean more usable litter area. Manufacturer shipping copy conflicts between a $49 threshold in content and $99 in visible badges, so omit a delivered-cost claim. Recheck facts before eventual publication.

# Correct links and attribution

- [x] Trace the existing path: `ShopNobiPageProductLinkWriter` → `ShopNobiStoreLinkBuilder` (channel WEBSITE, no conversation) → API product `storeLink`/`paidLink` → website `encodePaidLink` → click helper `tagProductLinkOnClick`/`fillClickId` → standalone event with the same final `linkUrl`, page URL, UTMs and referrer.
- [x] Verify the current cached `/v1/shop/pages`: HTTP 200, 2,582 pages, **no Cove/Cubby PDP match**. There are no finished links for these two products to select from that payload today.
- [x] Root supplies two reviewed link outputs from the **existing server builder**, using the current Tuft program configuration and exact variants, or authorizes the smallest separate data-input step that obtains them. Do not duplicate Awin construction in JavaScript, transplant a different product's link without rebuilding, or use the Web Story redirect, which would mislabel events.
- [x] Keep plain merchant URLs in the initial anchors, existing sponsored/nofollow/noopener treatment and `paidLink`-driven disclosures. Store only valid reviewed paid outputs in the authored data, encoded with the existing helper. Fall back truthfully to plain links when no valid paid output exists.
- [x] Reuse PR 427's standalone page/visit attribution. Make the existing click handler accept an optional entry point, retaining its current default for existing search pages; this utility passes the distinct actual surface **`Shop Nobi Utility`**. Generic ingestion and BigQuery preserve it without a backend enum change. Keep the existing default unchanged and do not attach the floating assistant's conversation. `JavaScript API` already means assistant launch and must not be reused.
- [x] Use `cove-vs-cubby.<visit-id>` as the network reference and preserve each nested variant URL. Keep Pinterest campaign/creative tags on the incoming page and event. No test visit or click counts as independent acquisition.

The reviewed outputs are now integrated from the offline real Java builder artifact, generated October 17 UTC (October 16 in New York), source head `9ddf163b2e39a7577d148dba83af77de2cac73ca`. The fixture made zero network attempts and passed 43 assertions. Both outputs use the verified advertiser 59149 / publisher 3122300 configuration, nested exact variant destinations and WEBSITE tags. This proves authored construction, not live network credit.

Reporting limitation: the new exact entry-point filter is rejected by the current report validator until a separate backend registration. Unfiltered counted-click reports accept the event's own nonnull entry point. Standalone utility events have no real conversation, so joined `search_text` remains null and `/tools` does not populate the current `/shop/s`-specific `page_slug`. `details.query`, page URL, incoming campaign fields and referrer remain explicit; use the final link's visit reference to join network reports. Do not emit a synthetic search or conversation to populate those derived columns. Final promotion terms and future live API/network/report verification remain publication gates.

# Exact website file plan

| File | Small change |
| --- | --- |
| `src/pages/CoveCubbyComparison.jsx` | New self-contained consumer page, calculator, sourced facts, original responsive figures and two CTAs. Small documented local components. |
| `src/pages/CoveCubbyComparison.css` | Scoped responsive styles derived from the prototype. |
| `src/utils/catFootprintFit.js` | Port tested pure math and validation; no browser/network dependencies. |
| `src/content/coveCubbyComparison.js` | One shared record for checked facts, plain/finished links, sources, route and SEO metadata. No secrets. |
| `src/main.jsx` | Lazy import and one exact `/tools/cove-vs-cubby` route. |
| `scripts/render-pages.jsx` | Register that same page for static rendering. |
| `scripts/prerender-pages.js` | Register its head metadata and render both normal URL forms. |
| `scripts/generate-sitemap.js` | Add the canonical route to the existing page sitemap. This prepares source; nothing is submitted/published. |
| `src/utils/shopNobiProductClick.js` | Optional actual surface and verified variant ID, with the old default preserved. No duplicate event sender. |
| `public/media/cove-cubby-footprints.svg` and `.png` | One source-derived original preview image; no merchant photography or paid generation. In-page figures cover the other two Pin questions. |
| `tests/cat-footprint-fit.test.js` | Real numeric outcomes for boundaries, clearance, rotation, unit conversion and invalid input. |
| `tests/cove-cubby-page.test.js` | Built HTML has correct facts, sources, disclosures, variant links, accessible controls, canonical and sitemap entry. |
| `tests/shop-nobi-product-click.test.js` | Utility entry point, tagged standalone visit/link join and unchanged default behavior. Consolidate overlapping cases. |
| `README.md` | One small section documenting the route, authored fact maintenance and offline verification. |

No edits are planned to `index.html`, assistant-mode hooks, `/shop` content, generated search-page feeds, Java source, DB records or existing Pin draft files.

# Verification before review

- [x] Cover seven focused math cases, including area arithmetic, without redundant implementation assertions. No implementation-only assertions, skips, paid calls or production event posts.
- [x] Verify facts in actual built HTML without executing JavaScript, and check the interactive browser separately; source facts and purchase links remain readable if the calculator cannot run.
- [x] Test actual CTA handling locally with a stand-in event transport: left/middle clicks, repeated clicks in one view, new view, exact nested variants, bot/plain fallback, UTM/referrer and the actual utility entry point. Do not claim live API persistence from a browser fixture.
- [x] Inspect the real page at desktop and narrow mobile widths, including invalid input, rotated fit, zero-clearance example and changed units. Save review screenshots.
- [x] Run the full website build/test suite using the existing loopback page fixture and bounded local poster fixture. Refuse other external test fetches; never start paid ingestion/search work.
- [x] Review the utility-only diff against the selected dependency head, ensure `WORKTREE_BRIEFING.md` remains untracked, and report exact tests, files and remaining link gates to root. No commit/push/release until separately authorized.

# Local review evidence

- [x] `npm ci --ignore-scripts` used the locked dependency file. No package/lock changes, symlinks or credential copies.
- [x] Full final suite: `SHOP_PAGES_API_URL=http://127.0.0.1:4789 NODE_OPTIONS=--import=./build/tmp/offline-fetch.mjs npm test`. Build succeeded; **124 tests passed, 0 failed, 0 skipped**. A temporary preload supplied only the known fixture poster header and denied other non-loopback fetches. Existing locked Node engine and bundle-size warnings remain; no upgrade was attempted.
- [x] Actual authored link click tests verify advertiser/publisher, exact full nested destinations, default entry point preservation, both variant UUIDs, separate actual utility surface, main/middle clicks, stable shared visit reference, page URL, incoming UTMs and referrer. The transport is a stand-in window. No real purchase exit or production event was sent.
- [x] Browser at 1280 × 900 and 390 × 844 verified empty-input errors, the 20 × 24 zero-clearance example, extra-clearance failure, reset on edit, opt-in rotation and inch/cm physical conversion. Document width equaled viewport width at both sizes. The existing floating assistant appeared and was left unchanged; no query was submitted. Browser error/warning log was empty during checks. Temporary viewport override was reset.
- [x] Original SVG parsed as XML at 720 × 400; PNG is 1200 × 667 and was visually inspected. Review screenshots: ignored `build/tmp/cove-cubby-desktop.jpg` and `build/tmp/cove-cubby-mobile.jpg`.
- [x] Static HTML contains facts, two source citations, plain exact-variant purchase links, sponsored disclosures, a JavaScript requirement notice, canonical/preview metadata and both URL forms; sitemap includes the route. This is static-output evidence, not a separate browser session with scripts disabled.
- [x] `git diff --check` passed. `index.html`, assistant-mode hooks, API, catalogs and generated feed code are unchanged. `WORKTREE_BRIEFING.md` stays untracked. No commit, push, PR or publication.

Local preview: `http://127.0.0.1:5198/tools/cove-vs-cubby`, process session 20088, retained for root review. Port 5176 was occupied by an older unrelated preview and was left untouched. The utility review tab is no longer retained. After browser control resumed, owned inventory was empty and all seven requested review/login/mail targets were absent. Root owns active PartnerStack 1150542919; this agent did not touch it or add new retention marks. Reopen the local preview from this canonical URL when needed.

# Execution authorization, Oct17

Shanif directly authorized Codex and Claude to own the complete commission path and run traffic campaigns while he sleeps. This supersedes the earlier local-review-only preparation limit for this useful, completed landing page. Publish through a reviewed website PR and the normal included Pages deployment, verify the production page, then use it in authorized free campaigns. Ads and subscriptions remain held. Preserve the documented reporting limitations and never count internal QA as acquired shoppers.

- [ ] Open the focused utility PR on current main, complete hosted review and exact-head Pages checks, merge and verify production.
- [ ] Verify current manufacturer facts and exact earning exits again before public promotion.
- [ ] Publish original useful Pins and other permitted free campaign outputs with clear commission disclosure and distinct acquisition tags.

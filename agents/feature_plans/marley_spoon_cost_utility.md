# Marley Spoon subscription delivery-cost utility

Approved architecture for Step 25. Website source will consume externally supplied actual Java builder artifacts; no public content or production event has been changed by this worktree. Website base: refreshed origin/main `397db8ffb45aa2654bdce2f9c56283cbfc40266f`. Worktree: `/Users/shanif/Nobi/worktrees/shop-nobi-25-marley-spoon-cost`.

## Approved boundary

Add `/tools/marley-spoon-cost` as one authored subscription offer and local delivery-cost calculator. Keep it outside physical-product search, price filters, product catalogs and ingestion. The record explicitly carries `kind: SUBSCRIPTION` and `priceBasis: PER_DELIVERY`; use an offer ID, never a fabricated SKU/product/variant ID.

Use the actual existing `ShopNobiStoreLinkBuilder.buildStoreLink(plainOfferUrl, realStoreId, WEBSITE, null, query)` output, exactly as the reviewed Cove/Cubby authored-link flow does. The Java builder accepts a store URL and store ID without any product. Save its plain/paid/paidLink outputs and source/config/date provenance; the website only encodes the finished paid link and fills the existing outer click-reference slot. No second affiliate URL constructor or redirect-unwrapping code.

Root independently queried all merchant rows and created/read back the real non-catalog Marley owner `7decef8b-9aef-4d97-a7f4-6eea83ede096`, after confirming none existed. It has api_push, included_in_shop_nobi=false, USD, no billing plan, no credentials/products/variants and the approved Awin template. Evidence: `affiliate_brainstorm/research/marley_owner_reconciled.json`. Root owns this production operation. Source trace confirms both MerchantDao pulled-feed selectors explicitly exclude api_push and ProductCatalogRefreshRunner rejects its parser; the direct affiliate loader reads active owners independently of physical catalog inclusion. Explicit false avoids the schema/createMerchant default of true. Do not set signup-waiting metadata or a feed path.

This first authored offering does not add generic MCP or service search. It is one web utility and a separate generic offer-click ledger. Root approved that boundary and instructed source to proceed with externally supplied authored link data. Missing/invalid merchant/link provenance must fail publication/build validation; never fill it with invented UUIDs, sample paid links or a client-side affiliate constructor.

## Verified commercial inputs

On October 17, 2026 at approximately 04:40 UTC, an owned Chrome tab opened the ordinary plain merchant destination `https://marleyspoon.com/select-plan?v=USMSAFFAWIN363M26`. It visibly confirmed the applied code, two people, three meals/six servings, food $80.94, shipping $12.99, full delivery $93.93, first discounted food $48.56 and delivery $61.55. The displayed five-delivery food-discount schedule remains 40/35/10/10/15 percent. No Continue/location/account/cart/payment action was taken. The source tab was closed immediately; owned tabs verified empty.

The existing authenticated Awin evidence is `affiliate_brainstorm/research/marley_offer_preflight.md` in the brainstorm worktree. It verifies joined advertiser 6988, approved code, new-customer condition and comparison/editorial traffic. Its active code lists an end date of December 31, 2027; UI timezone was not established. Assigned $25 Default is operational evidence, not a shopper-facing earnings claim or a guaranteed commission.

The current official merchant terms at `https://marleyspoon.com/terms` are dated July 7, 2026. Relevant limits: recurring automatic delivery/billing unless skipped/paused/canceled, location-specific cutoff, additional taxes/fees and recipe/plan-dependent adjustments; voucher discounts apply to food rather than delivery charges. Link these terms rather than invent a universal cancellation deadline. A page visit or planner calculation never creates a subscription.

## Calculator and content

> # 1. Truthful offer and source record
> - [x] Author one dated record with offer ID, SUBSCRIPTION kind, PER_DELIVERY basis, USD, real merchant identity, approved plain destination, exact verified plan and server-built link provenance.
> - [x] Keep food 8,094 cents, shipping 1,299 cents and discounts 40/35/10/10/15 as explicit sourced inputs; include new-customer eligibility, source date, recurring-price disclosure and source/terms links.
> - [x] Avoid other-plan price tables, grocery-savings claims, maximum-promotion savings as this plan's savings, merchant imagery without rights, fabricated SKU and monthly-price presentation.

> # 2. One original shopping utility
> - [x] Render a static source-based page with all five discounted deliveries and the next full-price delivery, food/shipping separate, full recurring price beside introductory price and commission disclosure beside the merchant exit.
> - [x] Use integer cents and round discounted food once per delivery before adding shipping. Default rows must equal 6,155/6,560/8,584/8,584/8,179 cents; next full delivery 9,393 cents, first four 29,883 cents, first five 38,062 cents.
> - [x] Let shoppers choose how many delivered boxes to model (one through the next full-price delivery); optionally add a clearly labeled user estimate for extras/tax. Inputs remain local. Do not equate skipped calendar weeks with delivered-box discount positions or invent other serving-plan prices.
> - [x] Label later totals as modeled under unchanged food/shipping/discount assumptions, excluding unentered extras/tax and actual merchant eligibility/checkout differences. No promise that a displayed future estimate is a checkout quote.

> # 3. Legitimate non-product exit attribution
> - [x] Reuse existing bot/local/smoke suppression, visit ID, buildClickId, encodePaidLink, tagProductLinkOnClick and fillClickId behavior through a narrow shared outbound-click helper; preserve existing product behavior with regression tests.
> - [x] Emit a distinct generic `Click On Offer` event under the Shop Nobi posting merchant with actual entryPoint `Shop Nobi Utility`, offer ID/name/kind/basis, real owning merchant ID, page URL, acquisition tags/referrer and finished outbound link. Omit productId, productVariantId, productPrice and productName; create no conversation.
> - [x] Keep the offer event separate from physical-product clicks and visitor product preferences. Current Event/EventsController/EventRecorder retain a generic name/details and serialize details to BigQuery; product enrichment has no variant/handle to resolve. An authored owner ID is client-supplied analytics metadata, not server-verified enrichment.
> - [x] Validate the exact slug.visit reference in the finished Awin link against the event payload for the acquisition-to-commission ledger. Existing counted-click SQL filters `Click On Search Result`, so the new offer cohort requires a raw-event query; do not claim it appears in the existing physical-click report or exact entry-point filter.

> # 4. Delivery, tests and review
> - [x] Register route, static renderer, canonical metadata and sitemap entry using the current Cove/Cubby pattern. Prefer WebPage/Breadcrumb metadata; do not advertise this subscription as a one-time physical Product price.
> - [x] Add meaningful cent-rounding/count/invalid-input tests and built-page checks for the complete source facts, ongoing cost, disclosure, plain HTML destination and absence of fake product identifiers/raw paid URLs.
> - [x] Verify main/middle/right click, crawler/local/smoke behavior, beacon/fetch fallback, no synthetic conversation, offer event fields, actual final reference and unchanged existing product-click behavior without production event posts.
> - [x] Run the full offline website build/test fixture, then inspect mobile and desktop in owned local preview tabs, reset viewport and close tabs when finished.
> - [ ] Open a ready PR, attach it, complete current-head hosted reviews and report exact checks. Root owns merge/deployment. No order/subscription/payment submission, ads, paid calls or account setup.

## Source trace and design tradeoff

Current website authored-data pattern: `src/content/coveCubbyComparison.js`; page: `src/pages/CoveCubbyComparison.jsx`; click mechanics: `src/utils/shopNobiProductClick.js`, `shopNobiSearchPage.js`, `shopNobiClickId.js`, `shopNobiPaidLink.js`. Static registration: `src/main.jsx`, `scripts/render-pages.jsx`, `scripts/prerender-pages.js`, sitemap script. Source filenames will be confirmed in the new worktree before edits.

Backend trace: `api/.../shop_nobi_store_links/ShopNobiStoreLinkBuilder.java` takes a store URL/ID without a product; generic `EventsController` reads Event with a free name and JsonNode details; `EventProductFiller` only enriches by variant/handle, and `ProductClickRecorder` runs only for the existing product-click name. `common/utils/bigquery_client/src/main/resources/sql/reporting/shop_nobi_counted_clicks.sql` explicitly selects the product-click name. This permits a narrow website offer pilot without a new backend schema, resolver or physical product. The tradeoff is a separate raw-event ledger rather than misleading existing product-click counts. A future server offer registry can verify offer-to-merchant ownership if required; it is not needed to fabricate a product for this pilot.

## Concise Step 25 checklist for root

> # Marley Spoon cost utility
> - [x] Verify real merchant/direct-link configuration and regenerate reviewed Java builder artifacts for the approved-code destination.
> - [x] Approve authored SUBSCRIPTION/PER_DELIVERY offer record and separate generic offer-click ledger.
> - [x] Build the exact two-person/three-meal delivery planner with food, shipping, first-five and ongoing-price truth.
> - [x] Verify cent math, source/eligibility/disclosure, attribution, offline build and mobile/desktop behavior.
> - [ ] Complete PR reviews, then root releases and independently verifies production. No purchase or paid campaign.

## Focused visual plan

Use the existing Shop Nobi utility family: Avenir/Arial for continuity, white #ffffff as the workspace, navy #202b4a for text, blue #3c4fe0 for actions, pale blue #eef4ff for the selected delivery span and grey #53617e for qualifications. Keep text left aligned and numbers right aligned, with tabular numerals. The memorable element is a six-delivery ledger: food and shipping visibly add to each delivery total, and the sixth full-price row remains in view. The layout is intro → exact plan and ongoing price → local delivery-count control plus ledger → source/eligibility and merchant exit. On mobile, use compact labeled rows rather than a horizontally scrolling spreadsheet.

Review against the brief: the ledger earns its repetition because deliveries are a real sequence. Avoid promotional stock photos, invented food experience, hero discount badges and decorative cards. Make the later price as legible as the first price; do not make introductory savings the page hierarchy.

## Verification and test cleanup

All150 offline website cases passed with zero failure/skip, including5 cent-math/configuration cases,3 separate offer-click cases and3 new built-page cases. Existing product-click cases remain unchanged in behavior and passed after extracting their existing browser fixture for reuse, without copying a second fixture or dropping assertions. Source shared outbound behavior moved intact from the product handler; product and offer wrappers provide distinct names/details. Initial fixture extraction split a semicolon inside the user-agent string; syntax was corrected before behavior checks, with no assertion changes.

Actual ordinary Chrome verified one/four/five/six delivery totals61.55/298.83/380.62/474.55. Desktop client width2545 and mobile client width375 (requested viewport390) had no horizontal overflow; mobile ledger339px. Screenshots: build/marley_release/desktop.jpg and mobile.jpg. Local preview CSP blocked external scripts/connections, so no remote assistant or telemetry was executed; floating assistant source was left unchanged. The temporary static server initially read a directory instead of index.html; fixture routing was corrected, not product code. All preview/error tabs closed and viewport reset; preview servers stopped.

Actual Java artifact: research/marley_link_builder_artifact in brainstorm worktree,33 behavioral assertions and zero network attempts, source0b0bb00b6a. Root-created non-catalog owner and approved code survive the output. Actual Event/BigQuery serialization proves generic fields, not HTTP/queue/cloud persistence or commission credit. No shopper purchase, subscription/cart submission, live event post or production deploy occurred.

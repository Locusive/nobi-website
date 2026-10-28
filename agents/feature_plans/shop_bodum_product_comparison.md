> # One genuine product comparison
- [x] Verify existing routes, prerendering, schema, product clicks and export-price semantics.
- [x] Root selects current-offer source and served-page expiry contract before implementation.
- [ ] Create only /shop/p/bodum-tribute-12076-57us-34oz, with useful unit/capacity explanation and two exact seller choices.
- [ ] Preserve current eligible product identities and earning-link/click helpers; reject different/removed variants.
- [ ] Use one Product with AggregateOffer only while same-model displayed offers have trustworthy current prices.
- [ ] Add one discoverable link from french-presses and canonical sitemap entry; preserve all other pages.
- [ ] Consolidated offline tests for exact identity, offer changes/removal/expiry, HTML/schema/hydration, tracking and mobile semantics.
- [ ] Root source review, visual validation, release and independent live checks.

## Freshness decision awaiting root
Normal /v1/shop/pages generatedAt is listing read time. It filters eligibility and regenerates links but preserves stored product prices. Page refreshedAt is updated on both pass and failure; it cannot certify successful price observation. Public product lookup is model-free but requires exact parent product IDs, domain authorization and careful current-source semantics. Product updatedAt is mutation time; lastRefreshedAt also serves as a refresh claim.

Preferred bounded alternative: two allowlisted exact merchant product/variant JSON reads at build, intersected with currently eligible normal-export rows, carrying successful fetchedAt. Exclude missing/mismatched/invalid prices. A static build-age check alone cannot suppress previously published prices after a failed rebuild; this one route needs a served-page expiry contract, or a separate bounded receipt with the same expiry protection. No request or implementation is approved by this document itself.

## Measurement
No prior page baseline; demand unknown. Track indexing first, then28complete days after indexing plus reporting lag. Separate impressions, organicvisits, distinct nonoperator merchant-clicking visitors, visitor-entered searches, confirmed orders and revenue. Eligibility/validation is not a rich-result display guarantee.

## Selected narrow architecture
Root selected build-time public merchant reads plus a24hour request-time expiry using a pre-rendered no-price fallback. Two product.js reads returned200 and exact qualified variants. Successful source prices3999/4995 are integer minor units; product.js has no currency field. Await root choice on adding one currency-confirming cart.js read per seller before treating values asUSD. No customer cart data or state mutations requested.

Build will use injected fetch/clock for local fixtures. Select exact eligible normal-export identities and URLs, then replace only this new page's displayed prices with independently read exact-variant prices. Preserve original catalog and earning-link fields. Generate valid live and no-price fallback HTML through the same React renderer. Live page carries checkedAt/expiresAt; fallback has no priced offers or Product/AggregateOffer schema but retains useful model guidance and eligible retailer links.

One exact-route Cloudflare Pages function, with no source refresh or dynamic SSR, chooses built live HTML only while unexpired; otherwise returns fallback. Responses must be no-store so CDN/browser caches cannot carry offers past expiry. Alias/trailing-slash/static asset paths must not bypass expiration; plan and tests must explicitly cover those routes. Source mismatch/error produces fallback during build rather than false prices or a build-time crash for the whole site. Root will verify Pages deployment/runtime behavior before delivery.

## Final approved architecture
Four anonymous read-only GETs per build are approved and qualified: both product.js and cart.js endpoints returned200, explicitUSD on2026-10-28. No cart mutation or cookies. Canonical static HTML always contains the no-price fallback. The fresh document is generated under ignored generated/bodum-document.js outside dist, imported into the scoped Pages Function bundle. Invalid or expired observations cannot leak through an unhandled static alias. Canonical/knownaliases are no-store, validators are removed; fallback ASSETS request receives no incoming cookies or conditional headers. React drops both price display and schema if the observation expires while open.

Source rows currently have paidLink:false and direct tagged storeLink. Preserve those exact vetted links and normal product-click event identities/page context. No commission entitlement is inferred.

## Review corrections and test consolidation
The known route now emits a noindex zero-seller fallback after both catalog rows disappear, without linking/indexing it. One static file is reserved in the file budget. Generic writer calls no longer overwrite the shared private module: only the production entrypoint supplies its generated path; test-specific private output is isolated. Original empty-catalog /shop behavior is preserved.

Five new consolidated behavior matrices cover the new boundary; no duplicate per-field test functions. The real-render matrix uses the actual production orchestrator instead of a parallel renderer-only test. Existing file-limit tests retain their scenarios with the known-product fallback included in the shared budget constant. No existing coverage removed or skipped.

> # Gift decision helper
> - [x] Inspect the actual supported Nobi search and collection handoff.
> - [x] Build and locally verify a source-backed recipient-interest, budget and constraints prototype.
> - [x] Run the normal fixture build and full local tests.
> - [ ] Obtain independent review of the exact source and working prototype.
> - [ ] Complete normal release and independent public verification.

See `agents/feature_plans/gift_chooser_prototype.md`. The first three leaves are local outcomes, not a claim that the whole task is Done.

> # Shopping-page build freshness
> - [x] Fix and locally verify bounded stale-export handling.
> - [ ] Complete independent review, normal release and actual public page/Story acceptance.

See `agents/feature_plans/shop_page_build_freshness.md`. The stored rows remain correct; no new product or page-data write is planned.

> # Holiday headphone guide and QCY card
> - [x] Build and locally verify one useful source-backed guide and exact disclosed assigned product link.
> - [ ] Complete normal review/release and root's independent public journey check.

See `agents/feature_plans/holiday_headphone_gifts.md`. No catalog, source-query, RSS mapping or social changes.

> # CUCKOO text-only prebuilt cards
> - [x] Preserve the two actual CUCKOO product choices while omitting unproven promotional imagery and using the exact programme disclosure.
> - [x] Pass the six regression cases and the full 246-test local suite.
> - [ ] Complete root review, normal release and independent public acceptance.

See `agents/feature_plans/cuckoo_text_only_prebuilt.md`. No catalog data, live assistant, RSS connection or company social changes.

> # ESR prebuilt material and price permission gate
> - [x] Omit exact ESR merchant product records from prebuilt publication while preserving original source data and other merchants.
> - [x] Pass seven focused cases and all 253 full local tests, including concurrent rendering.
> - [ ] Complete distinct root review, normal release and actual public acceptance.

See `agents/feature_plans/esr_prebuilt_permission_gate.md`. No catalog, membership, live assistant, affiliate template, RSS connection or social action.

> # Trivia card game gift decision guide
> - [x] Author and locally verify one useful page with the exact supplied Fun Fact Co. product and generated paid link (256 tests passed).
> - [ ] Complete root source review, normal release and actual independent public/card verification.

See `agents/feature_plans/funfact_trivia_gift_guide.md`. No catalogue, source-query, model, social or agreement action.


## Google sterling-silver-rings guide experiment

> # Improve one existing Google shopping page
> ## Evidence and scope
- [x] Read actual Google query/page baseline: Sep22-Oct19,84impressions,0clicks,averageposition50.1. This is low visibility, not proof the title alone caused missed clicks.
- [x] Verify today's Google live fetch still includes the ring-clasp advice and generic best/top claims;18product schema records remain.
- [x] Replace only sterling-silver-rings published title,description,guide andFAQs with original buying guidance about shape,width,size,material description and retailer policies.
> ## Implementation and checks
- [x] Apply the authored copy only while rendering this existing page, keeping the same data in visible HTML,metadata,FAQ schema and embedded browser content.
- [x] Preserve fetched products,ids,prices,stock,merchant/affiliate links,ranking,related links and dates; do not mutate the build plan,feeds orStories.
- [x] Add meaningful output tests for copy/FAQ consistency,source immutability and unchanged unrelated pages; run relevant existing regressions using local fixtures only.
> ## Review and release
- [ ] Obtain distinct review of the actual diff and normal feature PR/check gates before release. No admin/selfapproval/skipped tests or fixture deployment.
- [ ] Normal production build must use the existing full live-source build path. No catalog/model refresh,private export,account/security change,paid/outreach/social initiative or protected-source workaround.
- [ ] Verify deployed output and applicable engine notification receipts once after release. Compare later complete Google windows; no promised traffic/rank uplift or status-only polling.


## Shop Nobi website MCP source tags

- [x] Apply the approved single website publishing-source parameter in a dedicated worktree.
- [x] Build actual output and pass existing local MCP page tests without external-model calls.
- [x] Verify canonical/product copy preservation and report actual release triggers.
- [x] Root reviewed and authorized normal feature release.
- [ ] Verify actual Cloudflare preview, merge and production connection destinations.

Plan: agents/feature_plans/shop_nobi_source_tags.md
Notion: https://www.notion.so/406c7ba9c3dd81ea99b2cc433bfdcb7c


<toggle heading="h1">
All-page image sitemap rollout

- [x] Remove the fixed cohort and retain displayed-product eligibility, URL escaping and per-page deduplication.
- [x] Update publication regression and per-page image-limit coverage; preserve other page output.
- [x] Run the full local fixture suite and review current diff (365 passed, zero skips).
- [ ] Release without GitHub CI.
- [ ] Verify live XML coverage, image counts and byte size; update Notion and daily measurements.
</toggle>


## NOBI-2894 landing conversion experiment

<toggle heading="h1">Landing experiment

- [x] Inspect existing search flow and raw event persistence.
- [x] Deterministically assign populated search pages to original or products-first layout, same in HTML and browser.
- [x] Keep guide text, metadata, product order and earning links intact.
- [x] Add early same-page search jump on treatment, focus existing input without submitting a query.
</toggle>

<toggle heading="h1">Measurement

- [x] Share page-visit ID, experiment and variant between collection exposure and product clicks.
- [x] Capture live search/click outcomes through existing bundle events, without duplicating legacy clicks.
- [x] Save bounded raw-event baseline/readout SQL, preserving unknown traffic provenance.
- [x] Record release and the dates of complete seven/28day observation windows. Page cohorts are observational; no guaranteed significance at low traffic.
</toggle>

<toggle heading="h1">Release

- [x] Local tests and real-catalog rendering, desktop/mobile visual check.
- [x] Independent review; inspect triggers; PR merge and Cloudflare release with no GitHub CI.
- [x] Verify production and save/re-fetch Notion evidence.
</toggle>

## Launch verification completed October 28, 2026

PR 517 is merged and production deployment 6115f9f4-5173-44d2-a8e0-b47cd2a47e6f succeeded for e2a7ec23dd78578cc276f35494e469be1708009b. All 384 local tests and independent review passed. Public Chrome checks confirmed treatment/control placement and focus without a search.

A saved production collection exposure retained all four experiment fields. The released readout SQL executed successfully on actual production data, identifying that exposure and zero clicks. This partial-day diagnostic verifies persistence and reporting, not outside adoption, a conversion result or revenue. The exclusion flag and traffic provenance remain unknown; no controlled production product click was submitted. Click attribution is covered by local behavior tests and the 38-row, 11-assertion measurement fixture.

- [ ] Read the first complete seven-day window, October 29 through November 4 UTC, on November 5 plus reporting lag.
- [ ] Read the 28-day window, October 29 through November 25 UTC, on November 26 plus reporting lag.

Those are follow-up experiment measurements, not unfinished launch implementation. Keep the Marketing scorecard current. Exclude known operator visits, including utm_source=nobi_operator and campaign landing_release_20261028, if they are subsequently retained.

## Continue SEO alongside acquisition experiments

See agents/feature_plans/shop_guide_next_corrections.md. The ongoing goal is not completed by this batch.

## Carrying and household guide corrections

See `agents/feature_plans/shop_guide_carry_care.md`. These ten pages are a finite step in the ongoing SEO audit, not completion of the growth goal.

## Related search labels
- [ ] Complete agents/feature_plans/shop_related_search_labels.md and keep production verification separate from merge.

## Laptop stand comparison
- [ ] Complete agents/feature_plans/shop_laptop_stand_comparison.md; keep7/28-day measurement pending until due.

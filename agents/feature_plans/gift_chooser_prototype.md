> # Recipient and budget gift chooser
> - [x] Inspect actual Shop Nobi handoff and existing utility/product-click paths. `/shop` supports manual input, not an arbitrary URL query parameter.
> - [x] Build an explicit local chooser from pinned product records: interest, per-item USD budget and source-supported constraints; show up to three curated options with fit/tradeoff and actual retailer URLs.
> - [x] Provide a copyable request, supported `/shop` route and existing collection links. Never auto-submit a search or fabricate personalized live results.
> - [x] Verify actual form-data selection and actual rendered controls/cards/links with source-backed records and no provider calls; run affected full local fixture suite.
> - [x] Give root a working local prototype, exact diff/test/source pins and limitations before normal release.

Design: a small gift note with a useful form, not a dashboard. White `#ffffff`, cool sage `#f1f6f3`, dark ink `#18372f`, deep green `#16634b`, muted text `#52665f`. Georgia for the single main headline, the existing system sans for controls and product details. Left-aligned readable copy, compact form above the options, native product photos and clear source dates. Soft corners distinguish the form/results; no animated reveal, decorative badges or extra counters. On mobile, fields and product summaries stack. Focus outlines and semantic labels remain visible.

Scope: new `/tools/gift-chooser` utility in a dedicated feature branch based on actual merged website main56d939c. Existing products, blog source54c983f1/releasea0941d94, RSS mappings, backend/model/search behavior and other owners' work stay unchanged. Answers remain in component memory. Primary shopping continues through the existing canonical Nobi collection. Plain retailer URLs remain source/details links; no paid product exit or affiliate template is invented. Recipient/constraint answers stay local.

Local review: the normal fixture build and all 232 tests passed before the two requested disclosure/unused-stock-field edits. The final source was rebuilt and all 14 affected selector, actual-component and utility-revision checks pass with zero failures or skips; the earlier full-suite log stays historical. Native FormData and actual React output are verified; browser interaction and current retailer arrival are separate checks. The working loopback preview is for immediate root/user review, not publication. Normal release and independent public verification remain open.

Parent task: [NOBI-2703 / Step25](https://www.notion.so/3fac7ba9c3dd8071a88de8e9af5c4fa2), existing Codex session `01a1471e-2037-7302-bea5-2ebf887bc947`. No new Notion card or child session was created.

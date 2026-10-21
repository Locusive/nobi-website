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

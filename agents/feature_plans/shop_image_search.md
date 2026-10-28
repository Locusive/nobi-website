# Google Images acquisition pilot (NOBI-2879)
> # Baseline and fixed cohort
> - [x] Capture the signed-in GSC Image page report, September 28 to October 25.
> - [x] Freeze ten category-matched pairs outside the previous forty edited pages.
> - [x] Check existing catalog photographs and exact URL overlap before assignment.
> # Bounded publication
> - [ ] Add image sitemap entries only for the ten treatment pages, using normalized rendered products.
> - [ ] Test escaping, deduplication, absent images, rights exclusions and unchanged comparisons locally.
> - [ ] Review the final diff, merge via PR without GitHub CI and verify live XML and pages.
> # Measurement
> - [ ] Record the verified launch and subsequent complete seven and twenty-eight day windows.
> - [ ] Compare GSC Image impressions/clicks separately from downstream generic Google visits/searches/click-outs.

This is an exploratory discovery test with very low baseline volume, not a powered causal trial. Category pairs differ in audience and inventory; nightly catalog refreshes are another confounder. Existing product alt text, robots max-image-preview, canonical URLs, visible design and search behavior remain unchanged. No additional model calls, image generation or paid services. Baseline and catalog snapshots stay local; cohort and aggregate evidence go in Notion. Existing daily measurement automation will track the window.

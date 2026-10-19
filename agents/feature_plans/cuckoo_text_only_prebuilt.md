> # CUCKOO prebuilt presentation
> - [x] Match merchant `962fb5d1-9238-4ecf-bc36-0ddc304be721` and current terms to the retained fifteen-card public source.
> - [x] Reproduce the image and disclosure regression using actual retained product fixtures.
> - [x] Apply an exact-merchant text-only view with the literal `Disclosure: Compensated Affiliate.` near each CTA; preserve prices, stock flags, IDs, URLs and paid clicks.
> - [x] Verify generated HTML, hydration, JSON-LD, metadata, Stories and RSS derivatives, other merchants, and existing feed paths, board mappings and canonical GUIDs with focused and full local tests.
> - [ ] Obtain distinct root review, then complete normal PR checks, merge, deployment and independent public acceptance.

This changes prebuilt presentation only. It makes no catalog or database writes, starts no model jobs, and preserves stored source images. Live assistant results and existing published Pins are outside this change.

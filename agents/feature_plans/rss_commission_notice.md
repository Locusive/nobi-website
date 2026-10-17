# RSS commission disclosure

> # Feed descriptions
- [x] Reproduce the live Cat Beds disclosure omission and inspect the actual paidLink contract.
- [x] Prove a failing mixed earning/unpaid-page RSS output case before the correction.
- [x] Prefix a clear commission notice only when an actual page product has paidLink true; preserve unpaid descriptions.
- [x] Preserve feed URLs, GUIDs, images, dates, category mapping, escaping and limits.

> # Verification and release
- [x] Run focused feed cases and the complete offline fixture-backed website build/test suite.
- [ ] Push a feature-branch draft PR, verify preview and current-head hosted review; fix actionable feedback.
- [ ] Hand off the exact source/test/review evidence to root for release; do not merge or change Pinterest settings.

## Scope and acceptance

Use a mixed Cat Beds fixture with an unpaid image-leading product and a later explicitly paid product. The notice describes commission from some page links, not every item. False/missing/nonboolean flags must not claim paid status. Descriptions remain XML-escaped. Stable item identity is preserved; no invented publication date or feed reconnect. An updated feed is not evidence that Pinterest updates an existing Pin. Tool inclusion and actual natural new/unchanged/revised-item observation remain separate tasks.

## Evidence

Focused red baseline: 7/8 pass, exactly the mixed earning description fails before source correction; all six old feed contracts and unchanged/unconfirmed descriptions pass.

Final verification: supported bundled Node24.19.0 arm64, full local fixture-backed build plus189 tests pass,0 failures/skips. The first full run correctly found one old prerender expectation for the undisclosed earning description (188/189); that expectation now checks the notice and explicitly retains the unpaid fallback. No paid/model or production API calls; local fixture server closed.

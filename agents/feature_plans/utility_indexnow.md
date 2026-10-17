# Utility IndexNow coverage

## 1. Submission selection
- [x] Read the existing built Shop Nobi sitemap and the authored-page sitemap, comparing each with its live counterpart.
- [x] Include only canonical HTTPS nobi.ai `/tools/` destinations from authored pages; preserve the existing Shop Nobi scope and remove duplicate destinations before batching.
- [x] Keep production/main/real-data guards, changed-lastmod behavior and at most 10,000 URLs per batch. Do not replay all pages when a live sitemap cannot be read.
- [x] Keep missing built files, failed live reads and refused submissions visible while retaining the existing nonblocking build contract.

## 2. Verification and documentation
- [x] Add offline local-HTTP cases proving actual utilities plus Shop inclusion, unchanged utility exclusion, marketing/wrong-host exclusion, duplicate handling, missing-file/read-failure behavior and batching.
- [x] First reproduce the missing utility selection with a failing regression; then pass the focused test and complete fixture-backed website build/tests without model or public submission calls.
- [x] Document the two sitemap inputs, limited selection and notification-versus-indexing boundary.

## 3. Review handoff
- [ ] Commit/push only this feature branch; create and attach a draft PR; verify current preview and request hosted cloud review.
- [ ] Address actionable review findings, then report exact head, tests and remaining gates. Root owns merge, production submission response and live verification.

## Constraints
No new analytics, credentials, permissions, accounts, paid resources, model calls or manual IndexNow submissions. Source URLs already live and unchanged are not forcibly replayed; a later normal lastmod change triggers notification. Both original utilities were already sitemap-listed and crawlable, with correct prerendered content and canonicals. Search Console has no processed `/tools/` rows for October16–17, so indexing is unproven. Public key-file HTTP403 from the Python client is a limitation, not crawler-block proof.

## Local result
The omission regression failed4of19 cases before source changes, then all19passed. Empty query/fragment canonical cases independently failed before their correction. Final fixture-backed build and177tests pass,0failures/skips, Node22.23.1arm64. The first full-build attempt stopped before tests because npm dependencies installed under Node20x64 lacked arm64Rollup; reinstalling under the actual Node22arm64 runtime fixed the environment without lockfile/source changes. No external submission/model call. Root owns one bounded initial3URLnotification separately from normal changed-only builds.

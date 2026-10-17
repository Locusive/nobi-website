# Prebuilt Shop Nobi click attribution

## Outcome

- [x] Record prebuilt product clicks without depending on a conversation being saved.
- [x] Use `<slug>.<visit id>` in paid links, stable within a page view, even when the live assistant has a conversation ID.
- [x] Preserve live assistant bootstrap, query handling, Web Stories, event fields, acquisition tags and smoke-test exclusions.

## Website change

- [x] Make the prebuilt click handler return no conversation and always use the page visit reference.
- [x] Remove stale `nobi-conversation-id` from plain prebuilt store links while preserving product parameters, fragments and Shop Nobi tags.
- [x] Keep encoded affiliate destinations unchanged except for their existing outer sub-ID slot.
- [x] Correct attribution documentation. A prebuilt card intentionally gives no cross-merchant AI conversation credit, including after a shopper has used the assistant.

## Verification

- [x] First run behavioral regressions against unchanged source and record the expected failures.
- [x] Cover present and absent page conversation IDs, paid-link references and event agreement, repeated clicks, separate page visits, stale plain IDs, malformed paid-link fallback, bots, smoke markers and beacon fallback.
- [x] Inspect build-time network requests, install dependencies through the normal registry if required, and run the complete suite with loopback fixtures and no external build requests.
- [x] Review the diff, stop fixture processes and update the worktree briefing with exact results.

## Scope and remaining evidence

- [x] Make no API, account, production, deployment, commit, push or CI changes.
- [x] Retain the earlier local Postgres persistence evidence without calling it cloud end-to-end verification. Actual BigQuery confirmation still requires refreshed test credentials.

## Review evidence

- The revised two-file regression suite failed on unchanged source: 8 passed and 5 failed, including the UUID affiliate reference and stale plain-link conversation.
- The same suite passed after the fix: 13 passed, 0 failed and 0 skipped.
- `npm ci --no-audit --no-fund` installed the locked dependencies. It warned that locked `undici@7.14.0` requests Node 20.18.1 or newer while this shell uses 20.12.2; the build and tests still passed.
- Full verification: `SHOP_PAGES_API_URL=http://127.0.0.1:4789 NODE_OPTIONS=--import=./build/tmp/offline-fetch.mjs npm test`, with a loopback page server and a temporary preload supplying PNG header bytes for the single known fixture poster. Other external fetches were rejected and would fail verification. Build succeeded; 114 tests passed, 0 failed and 0 skipped. The output logged one local poster substitution and no blocked requests.
- `git diff --check` passed. The only executable source changes are in the prebuilt click handler and its plain-link helper; `index.html` changes comments only. Duplicate no-conversation tests were folded into the broader behavioral cases.
- Verification log remains at ignored `build/tmp/offline-test.log`. The temporary preload was removed and the loopback fixture server was stopped. Local `node_modules` and `dist` remain ignored for review; no symlinks were created.

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

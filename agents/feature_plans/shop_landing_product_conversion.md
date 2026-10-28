<toggle heading="h1">Landing experiment

- [x] Inspect existing search flow and raw event persistence.
- [ ] Deterministically assign populated search pages to original or products-first layout, same in HTML and browser.
- [ ] Keep guide text, metadata, product order and earning links intact.
- [ ] Add early same-page search jump on treatment, focus existing input without submitting a query.
</toggle>

<toggle heading="h1">Measurement

- [ ] Share page-visit ID, experiment and variant between collection exposure and product clicks.
- [ ] Capture live search/click outcomes through existing bundle events, without duplicating legacy clicks.
- [ ] Save bounded raw-event baseline/readout SQL, preserving unknown traffic provenance.
- [ ] Record release and complete seven/28day observation windows. Page cohorts are observational; no guaranteed significance at low traffic.
</toggle>

<toggle heading="h1">Release

- [ ] Local tests and real-catalog rendering, desktop/mobile visual check.
- [ ] Independent review; inspect triggers; PR merge and Cloudflare release with no GitHub CI.
- [ ] Verify production and save/re-fetch Notion evidence.
</toggle>

# Mid-grid saved-page search prompt

Hypothesis: a second, visitor-entered search box after four product cards will lead more Google-referred saved-page visitors to submit a specific Shop Nobi query than the existing top-only layout. Each eligible page has a stable, independent allocation. Both groups retain the same top form, product order, links, and buying guidance. Pages with four or fewer products are excluded from the readout.

Primary measure: exposed visits with a recorded `Shop Nobi Landing Search Submitted` event, by variant, on complete UTC days. Report top versus mid-grid submissions separately. Product and paid-link click events are secondary guardrails. A submitted-form event proves a search attempt was recorded; it does not prove search results were delivered, an outside human identity, a purchase, or commission. Separately inspect accepted search/result events before claiming qualified use. Keep unknown operator and bot provenance visible. Low traffic and page-level allocation may leave the result inconclusive.

After public deployment, use the first seven complete UTC days as the first readout and 28 complete UTC days as the second, with reporting lag. Dry run first, then set a billed-byte cap:

```
bq --location=us-east4 query --use_legacy_sql=false --dry_run --parameter=start_date:DATE:YYYY-MM-DD --parameter=end_date:DATE:YYYY-MM-DD < scripts/experiments/shop-mid-grid-search-v1/readout.sql
bq --location=us-east4 --format=prettyjson query --use_legacy_sql=false --maximum_bytes_billed=8000000000 --parameter=start_date:DATE:YYYY-MM-DD --parameter=end_date:DATE:YYYY-MM-DD < scripts/experiments/shop-mid-grid-search-v1/readout.sql
```

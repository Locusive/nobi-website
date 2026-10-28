# Shop Nobi landing product conversion experiment

Durable readout and synthetic regression fixture. Observed baseline data and operator receipts remain in uncommitted `agents/evidence/`; do not treat fixture numbers as results.

## Run the synthetic measurement test

From the website repository root:

```sh
python3 scripts/experiments/shop-landing-products-v1/build-landing-measurement-fixture.py
bq --location=us-east4 query --use_legacy_sql=false --dry_run < scripts/experiments/shop-landing-products-v1/landing-measurement-fixture.sql
bq --location=us-east4 --format=prettyjson query --use_legacy_sql=false --maximum_bytes_billed=1000000 < scripts/experiments/shop-landing-products-v1/landing-measurement-fixture.sql
```

The fixture contains synthetic rows only and references no production tables. The generator embeds the current readout SQL so the checks validate the same logic used in the readout. Do not edit the generated fixture by hand. The expected output is one row beginning PASS; zero rows or a query error is a failure.

## Run a bounded production readout

Use actual complete post-launch dates, with an exclusive end date. The example dates are not proof of launch. Populate the operator-visit exclusion list from receipts first, then dry run before executing:

```sh
bq --location=us-east4 query --use_legacy_sql=false --dry_run --parameter=start_date:DATE:2026-10-29 --parameter=end_date:DATE:2026-11-05 < scripts/experiments/shop-landing-products-v1/landing-measurement.sql
bq --location=us-east4 --format=prettyjson query --use_legacy_sql=false --maximum_bytes_billed=6500000000 --parameter=start_date:DATE:2026-10-29 --parameter=end_date:DATE:2026-11-05 < scripts/experiments/shop-landing-products-v1/landing-measurement.sql
```

If the dry-run estimate exceeds the cap, split into shorter complete windows instead of removing the cap. Do not sum distinct visit counts across overlapping windows. Keep both page cohorts stable through the readout.

## Existing persistence contract

`common/data_access_layer/src/main/java/ai/nobi/data_model/events/Event.java` uses arbitrary JsonNode `details`, serialized verbatim into JSON column `events.details`; no API migration is needed for experimentId, experimentVariant, landingVisitId or pageSlug. The website's `sendShopNobiEvent` adds pageUrl, available UTM tags, referrer and optional shopperId. Source is `assistant` on the stored event; browser `nobi-analytics` message source `nobi` is a separate bridge validation field.

The existing merchant_event_fields materialized view excludes Displayed Product Collection and retains originalReferrer but not referrer. It also lacks these experiment fields. Use the bounded raw-events SQL, not that view or existing traffic totals, for this experiment.

## Experiment metric contract

`landing-measurement.sql` has been dry-run validated with the baseline dates. Production readout requires parameter start_date and exclusive end_date, dry run first and maximum_bytes_billed=6500000000 when executed. The query is read-only and has not been executed for any post-launch result.

Experiment ID: shop-landing-products-v1. Variants: products-first and guide-first. Exposure: existing prebuilt Displayed Product Collection with one page visit ID. Actions:
- Prebuilt product click: existing Click On Search Result with identical experiment, variant, page slug and visit ID.
- Jump/refine action: Shop Nobi Refine Search with the same keys.
- Live outcome: Shop Nobi Landing Outcome, outcome=product-click or message-submitted, outcomeSurface=live, with the same keys. The bridge emits a distinct event so existing click rollups are not doubled.

Primary metric: exposed visits with at least one accepted prebuilt OR canonical-confirmed live product click divided by exposed visits. Both variants and all traffic/Google-referred-untagged groups are reported. Keep the prebuilt and live surface counts separately. Multiple clicks and duplicate exposure events must not inflate visit conversions. Event IDs are deduplicated, exposure visits are grouped by visit ID and page slug, and contradictory variant assignments are excluded. Missing shopper IDs do not remove exposures; the unit is a page visit, not a unique browser or person.

Before each readout, populate the known operator visit exclusion array from test receipts; exclude explicit analytics-excluded events and smoke-marked URLs. Keep counts with unknown exclusion flag visible. New query's Google-referred-untagged cohort also excludes UTM tags and gclid/dclid/gbraid/wbraid. Other/unknown is a separate cohort, not inferred organic traffic.

The bridge's custom outcome alone does not prove an accepted product click. The canonical Click On Search Result endpoint applies cloud/bot and conversation validation that a generic custom event does not. Therefore live product-click mirrors count only when paired with a retained canonical click: exact conversation and every supplied product identifier, shopper ID when available, and within two minutes of both mirror receipt and originating browser timestamp. At least one product identifier and a nonempty conversation are required. When the mirror has only productVariantId, it may match the canonical internal variant ID because NobiEventTracker deliberately renames an internal-only ID; when both mirror identifiers exist, both must match exactly. Explicitly excluded canonical events do not match. Mirrors match only one nearest canonical ID, and canonical IDs match only one selected mirror, preventing repeated bridge emissions from inflating accepted clicks. Unmatched mirrors remain diagnostic; they do not contribute to the primary metric. Conservative matching may undercount delayed or incomplete event pairs and must not be described as complete traffic capture.

The unused initial-conversation join has been removed. The source browser timestamp is an ISO string in NobiEventTracker. message-submitted is a user message submission observed by the bridge, not a completed search, successful result or canonical API acceptance. Separate live-message and refine-action visit counts are diagnostic. Bundle bridge availability and persisted schema must be verified before trusting the all-path metric.

`landing-measurement-fixture.sql` executes the same readout logic over 38 synthetic rows only, generated by `build-landing-measurement-fixture.py`. All 11 assertions passed: 11 exposed visits, one prebuilt conversion, three accepted live conversions, four total converting visits, and seven unmatched mirrors. Cases cover duplicate event delivery and duplicate mirrors, absent/excluded canonical events, product/conversation/shopper mismatches, late events, missing keys and the bridge renaming an internal-only variant ID. Dry run and execution processed zero production bytes, with a 1,000,000-byte cap. Result is saved in landing-measurement-fixture-result.json. Final production SQL dry run validated with a 5,866,899,104-byte upper bound; no new production baseline was executed.

Page-slug assignment is a page-level experiment, not visitor randomization. Different page traffic and product quality can confound pooled rates. Compare page composition, pre-period counts and uncertainty; do not declare a causal winner from a handful of events. At 25 Google-referred prebuilt displays per week, one day cannot deliver a trustworthy conversion verdict.

## Safety and remaining verification

No production mutation, GitHub CI, external-model calls or browser tabs. Schema and SQL validate, but launch/persisted controlled-event verification belongs to the parent release work. No generated search calls were made. The sample alone supports deploying reliable attribution and a bounded UX test; it does not establish paid revenue or a winning variant.

"""Build a self-contained BigQuery fixture that executes the production readout SQL over synthetic events only."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
rows = []
experiment = 'shop-landing-products-v1'

def event(event_id, name, visit=None, second=10, **extra):
    details = {
        'pageUrl': 'https://nobi.ai/shop/s/test-page',
        'referrer': 'https://www.google.com/',
    }
    if visit:
        details.update(experimentId=experiment, experimentVariant='products-first',
                       landingVisitId=visit, pageSlug='test-page')
    excluded = extra.pop('excluded', None)
    shopper = extra.pop('shopper', 'shopper-1')
    details.update(extra)
    rows.append(dict(id=event_id, name=name, shopper_id=shopper,
                     created_at=f'2026-10-29T00:{second // 60:02}:{second % 60:02}Z',
                     is_excluded_from_analytics=excluded, details=details))

def mirror(visit, suffix='', **extra):
    data = dict(outcome='product-click', outcomeSurface='live',
                outcomeConversationId=f'conversation-{visit}', outcomeProductVariantId='variant-1',
                outcomeProductVariantInternalId='internal-1', outcomeShopperId='shopper-1',
                outcomeTimestamp='2026-10-29T00:00:10Z')
    data.update(extra)
    event(f'mirror-{visit}{suffix}', 'Shop Nobi Landing Outcome', visit, **data)

def canonical(visit, **extra):
    data = dict(conversationId=f'conversation-{visit}', productVariantId='variant-1',
                productVariantInternalId='internal-1')
    data.update(extra)
    event(f'canonical-{visit}', 'Click On Search Result', **data)

visits = ['prebuilt', 'accepted', 'duplicates', 'missing', 'excluded', 'wrong-product',
          'wrong-conversation', 'wrong-shopper', 'late', 'missing-keys', 'internal-only']
for visit in visits:
    event(f'exposure-{visit}', 'Displayed Product Collection', visit, second=0,
          collectionName='Prebuilt search page')
event('exposure-prebuilt-copy', 'Displayed Product Collection', 'prebuilt', second=1,
      collectionName='Prebuilt search page')
event('excluded-exposure', 'Displayed Product Collection', 'excluded-visit', second=0,
      collectionName='Prebuilt search page', excluded=True)
event('prebuilt-click', 'Click On Search Result', 'prebuilt')
rows.append(rows[-1].copy())  # Delivery duplicate of the same canonical event ID.
event('live-message', 'Shop Nobi Landing Outcome', 'prebuilt',
      outcome='message-submitted', outcomeSurface='live')
event('refine', 'Shop Nobi Refine Search', 'prebuilt')
for visit in visits[1:]:
    mirror(visit)
canonical('accepted')
canonical('duplicates')
rows.append(rows[-1].copy())
mirror('duplicates', '-copy')
canonical('excluded', excluded=True)
canonical('wrong-product', productVariantInternalId='different-internal-id')
canonical('wrong-conversation', conversationId='different-conversation')
canonical('wrong-shopper', shopper='different-shopper')
canonical('late', second=131)
# The missing-keys mirror cannot be admitted just because some other canonical click is present.
rows = [r for r in rows if r['id'] != 'mirror-missing-keys']
mirror('missing-keys', outcomeConversationId=None, outcomeProductVariantId=None,
       outcomeProductVariantInternalId=None)
canonical('missing-keys')
rows = [r for r in rows if r['id'] != 'mirror-internal-only']
mirror('internal-only', outcomeProductVariantId='internal-1', outcomeProductVariantInternalId=None)
canonical('internal-only', productVariantId=None)

structs = []
for row in rows:
    excluded = 'NULL' if row['is_excluded_from_analytics'] is None else str(row['is_excluded_from_analytics']).upper()
    sql = "STRUCT({id} AS id, TIMESTAMP({time}) AS created_at, {name} AS name, {shopper} AS shopper_id, "
    sql += "CAST({excluded} AS BOOL) AS is_excluded_from_analytics, PARSE_JSON({details}) AS details, "
    sql += "CAST(NULL AS STRING) AS product_variant_id, CAST(NULL AS STRING) AS product_variant_internal_id, "
    sql += "'9282b7cb-66ce-4d53-8c37-c291352ef03d' AS merchant_id, 'assistant' AS source)"
    structs.append(sql.format(id=json.dumps(row['id']), time=json.dumps(row['created_at']),
                             name=json.dumps(row['name']), shopper=json.dumps(row['shopper_id']),
                             excluded=excluded, details=json.dumps(json.dumps(row['details']))))
query = (root / 'landing-measurement.sql').read_text()
query = query[query.index('WITH raw AS'):].replace('WITH raw AS', 'raw AS', 1)
query = query.replace('`locusive.nobi.events`', 'fixture')
query = query.replace('@start_date', "DATE '2026-10-29'").replace('@end_date', "DATE '2026-10-30'")
query = query.replace('\nSELECT e.variant,e.traffic_group', '\n, result AS (\nSELECT e.variant,e.traffic_group')
query = query.rstrip().rstrip(';') + '\n)\n'
checks = {
    'exposed_visits': 11, 'raw_exposure_events': 12,
    'visits_with_prebuilt_product_click': 1, 'prebuilt_product_click_events': 1,
    'visits_with_any_product_click': 4, 'visits_with_accepted_live_product_click': 3,
    'accepted_live_product_click_events': 3, 'observed_live_click_mirror_events': 11,
    'unmatched_live_click_mirrors': 7, 'visits_with_live_message_submitted': 1,
    'visits_with_refine_action': 1,
}
assertions = ' AND '.join(f'{key}={value}' for key, value in checks.items())
query += f"SELECT IF({assertions}, 'PASS: accepted canonical clicks only; duplicate and unmatched mirrors excluded; prebuilt counted', ERROR('Landing measurement fixture failed')) AS fixture_result, result.* FROM result;\n"
(root / 'landing-measurement-fixture.sql').write_text(
    '-- Synthetic data only. No production tables are queried. Generated from the current production readout SQL.\n'
    + 'WITH fixture AS (SELECT * FROM UNNEST([\n' + ',\n'.join(structs) + '\n])),\n' + query)
print(f'Wrote fixture with {len(rows)} synthetic input rows and {len(checks)} assertions.')

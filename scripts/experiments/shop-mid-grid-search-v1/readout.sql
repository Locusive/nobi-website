-- Read-only mid-grid search prompt experiment. Complete UTC days; end_date exclusive.
-- A submitted form is a shopper-entered search attempt, not proof of completed API results.
WITH events AS (
  SELECT id, created_at, name, shopper_id, is_excluded_from_analytics,
    JSON_VALUE(details, '$.pageUrl') page_url,
    JSON_VALUE(details, '$.pageSlug') page_slug,
    JSON_VALUE(details, '$.landingVisitId') visit_id,
    JSON_VALUE(details, '$.midGridSearchExperimentId') experiment_id,
    JSON_VALUE(details, '$.midGridSearchVariant') variant,
    JSON_VALUE(details, '$.collectionName') collection_name,
    SAFE_CAST(JSON_VALUE(details, '$.collectionSize') AS INT64) collection_size,
    JSON_VALUE(details, '$.promptPlacement') prompt_placement,
    JSON_VALUE(details, '$.isPaidLink') is_paid_link,
    COALESCE(NULLIF(JSON_VALUE(details, '$.originalReferrer'), ''), JSON_VALUE(details, '$.referrer')) referrer,
    JSON_VALUE(details, '$.utm_source') utm_source,
    JSON_VALUE(details, '$.utm_medium') utm_medium
  FROM `locusive.nobi.events`
  WHERE created_at >= TIMESTAMP(@start_date) AND created_at < TIMESTAMP(@end_date)
    AND merchant_id = '9282b7cb-66ce-4d53-8c37-c291352ef03d'
    AND source = 'assistant'
    AND name IN ('Displayed Product Collection', 'Shop Nobi Landing Search Submitted', 'Click On Search Result')
  QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY created_at) = 1
), eligible AS (
  SELECT * FROM events
  WHERE is_excluded_from_analytics IS NOT TRUE
    AND NOT REGEXP_CONTAINS(COALESCE(page_url, ''), r'[?&]nobi_smoke_test=')
    -- Add known operator visit IDs before each result read.
    AND COALESCE(visit_id, '') NOT IN UNNEST(ARRAY<STRING>[])
), exposures AS (
  SELECT visit_id, page_slug, ANY_VALUE(variant) variant, MIN(created_at) exposed_at,
    COUNTIF(is_excluded_from_analytics IS NULL) > 0 unknown_exclusion_flag,
    IF(COUNTIF(REGEXP_CONTAINS(COALESCE(referrer, ''), r'^https?://([^/]+\.)?google\.[^/]+/')
      AND NULLIF(utm_source, '') IS NULL AND NULLIF(utm_medium, '') IS NULL) > 0,
      'google_referred_untagged', 'other_or_unknown') traffic_group
  FROM eligible
  WHERE name = 'Displayed Product Collection'
    AND collection_name = 'Prebuilt search page' AND collection_size > 4
    AND experiment_id = 'shop-mid-grid-search-v1'
    AND variant IN ('mid-grid-search', 'top-only-search')
    AND NULLIF(visit_id, '') IS NOT NULL AND NULLIF(page_slug, '') IS NOT NULL
  GROUP BY visit_id, page_slug HAVING COUNT(DISTINCT eligible.variant) = 1
), visits AS (
  SELECT e.visit_id, e.page_slug, e.variant, e.traffic_group, e.unknown_exclusion_flag,
    COUNT(DISTINCT IF(a.name = 'Shop Nobi Landing Search Submitted' AND a.prompt_placement = 'top', a.id, NULL)) top_submits,
    COUNT(DISTINCT IF(a.name = 'Shop Nobi Landing Search Submitted' AND a.prompt_placement = 'mid-grid', a.id, NULL)) mid_grid_submits,
    COUNT(DISTINCT IF(a.name = 'Click On Search Result', a.id, NULL)) product_clicks,
    COUNT(DISTINCT IF(a.name = 'Click On Search Result' AND a.is_paid_link = 'true', a.id, NULL)) paid_product_clicks
  FROM exposures e LEFT JOIN eligible a
    ON a.name IN ('Shop Nobi Landing Search Submitted', 'Click On Search Result')
    AND a.visit_id = e.visit_id AND a.page_slug = e.page_slug AND a.variant = e.variant
    AND a.experiment_id = 'shop-mid-grid-search-v1' AND a.created_at >= e.exposed_at
  GROUP BY e.visit_id, e.page_slug, e.variant, e.traffic_group, e.unknown_exclusion_flag
)
SELECT variant, traffic_group, COUNT(*) exposed_visits, COUNT(DISTINCT page_slug) exposed_pages,
  COUNTIF(top_submits + mid_grid_submits > 0) visits_with_recorded_search_submit,
  SUM(top_submits) top_search_submits, SUM(mid_grid_submits) mid_grid_search_submits,
  SAFE_DIVIDE(COUNTIF(top_submits + mid_grid_submits > 0), COUNT(*)) recorded_submit_visit_rate,
  COUNTIF(product_clicks > 0) visits_with_product_click,
  SUM(product_clicks) product_click_events, SUM(paid_product_clicks) paid_product_click_events,
  COUNTIF(unknown_exclusion_flag) visits_with_unknown_exclusion_flag
FROM visits GROUP BY variant, traffic_group ORDER BY traffic_group, variant;

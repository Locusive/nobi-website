-- Read-only Shop Nobi landing experiment. start_date inclusive; end_date exclusive, complete UTC days plus reporting lag.
-- Dry-run first with both DATE parameters; execute only with --maximum_bytes_billed=6500000000.
-- Unit: observed page visit, not a person. Google referrer is client supplied, not proven organic acquisition.
WITH raw AS (
 SELECT id,created_at,name,shopper_id,is_excluded_from_analytics,
 JSON_VALUE(details,'$.pageUrl') page_url, JSON_VALUE(details,'$.pageSlug') page_slug,
 COALESCE(NULLIF(JSON_VALUE(details,'$.originalReferrer'),''),JSON_VALUE(details,'$.referrer')) referrer,
 JSON_VALUE(details,'$.utm_source') utm_source, JSON_VALUE(details,'$.utm_medium') utm_medium,
 JSON_VALUE(details,'$.collectionName') collection_name,
 JSON_VALUE(details,'$.outcome') outcome, JSON_VALUE(details,'$.outcomeSurface') outcome_surface,
 JSON_VALUE(details,'$.landingVisitId') visit_id,
 NULLIF(JSON_VALUE(details,'$.conversationId'),'') conversation_id,
 COALESCE(NULLIF(product_variant_id,''),NULLIF(JSON_VALUE(details,'$.productVariantId'),'')) variant_id,
 COALESCE(NULLIF(product_variant_internal_id,''),NULLIF(JSON_VALUE(details,'$.productVariantInternalId'),'')) variant_internal_id,
 NULLIF(JSON_VALUE(details,'$.outcomeConversationId'),'') outcome_conversation_id,
 NULLIF(JSON_VALUE(details,'$.outcomeProductVariantId'),'') outcome_variant_id,
 NULLIF(JSON_VALUE(details,'$.outcomeProductVariantInternalId'),'') outcome_variant_internal_id,
 COALESCE(NULLIF(JSON_VALUE(details,'$.outcomeShopperId'),''),NULLIF(shopper_id,'')) outcome_shopper_id,
 SAFE_CAST(JSON_VALUE(details,'$.outcomeTimestamp') AS TIMESTAMP) outcome_timestamp,
 JSON_VALUE(details,'$.experimentId') experiment_id, JSON_VALUE(details,'$.experimentVariant') variant
 FROM `locusive.nobi.events`
 WHERE created_at >= TIMESTAMP(@start_date) AND created_at < TIMESTAMP(@end_date)
 AND merchant_id='9282b7cb-66ce-4d53-8c37-c291352ef03d' AND source='assistant'
 AND name IN ('Displayed Product Collection','Click On Search Result','Shop Nobi Refine Search','Shop Nobi Landing Outcome')
 QUALIFY ROW_NUMBER() OVER(PARTITION BY id ORDER BY created_at)=1
), eligible AS (
 SELECT * FROM raw WHERE is_excluded_from_analytics IS NOT TRUE
 AND NOT REGEXP_CONTAINS(COALESCE(page_url,''),r'[?&]nobi_smoke_test=')
 -- Populate from known operator/test receipts before each readout.
 AND COALESCE(visit_id,'') NOT IN UNNEST(ARRAY<STRING>[])
), exposures AS (
 SELECT visit_id,page_slug,ANY_VALUE(variant) variant,MIN(created_at) exposed_at,
 COUNT(*) exposure_events,COUNTIF(shopper_id IS NULL)>0 missing_shopper_id,
 COUNTIF(is_excluded_from_analytics IS NULL)>0 unknown_exclusion_flag,
 CASE WHEN COUNTIF(REGEXP_CONTAINS(COALESCE(referrer,''),r'^https?://([^/]+\.)?google\.[^/]+/')
 AND NULLIF(utm_source,'') IS NULL AND NULLIF(utm_medium,'') IS NULL
 AND NOT REGEXP_CONTAINS(COALESCE(page_url,''),r'[?&](gclid|dclid|gbraid|wbraid)='))>0
 THEN 'google_referred_untagged' ELSE 'other_or_unknown' END traffic_group
 FROM eligible
 WHERE name='Displayed Product Collection' AND collection_name='Prebuilt search page'
 AND experiment_id='shop-landing-products-v1' AND variant IN ('products-first','guide-first')
 AND NULLIF(visit_id,'') IS NOT NULL AND NULLIF(page_slug,'') IS NOT NULL
 GROUP BY visit_id,page_slug HAVING COUNT(DISTINCT eligible.variant)=1
), attributed_actions AS (
 SELECT a.*,e.exposed_at FROM exposures e JOIN eligible a
 ON a.visit_id=e.visit_id AND a.page_slug=e.page_slug AND a.variant=e.variant
 AND a.experiment_id='shop-landing-products-v1' AND a.created_at>=e.exposed_at
), live_mirrors AS (
 SELECT * FROM attributed_actions
 WHERE name='Shop Nobi Landing Outcome' AND outcome='product-click' AND outcome_surface='live'
), canonical_candidates AS (
 -- A custom bridge event is not an accepted click. Require the canonical event that passed API click checks.
 -- Both identifiers must agree when supplied. At least one product identifier and a conversation are required.
 -- Server receipt times and the originating browser timestamp must both be within two minutes of the canonical click.
 SELECT m.id mirror_id,m.visit_id,m.page_slug,c.id canonical_id,
 ABS(TIMESTAMP_DIFF(c.created_at,m.outcome_timestamp,MICROSECOND)) time_distance
 FROM live_mirrors m JOIN eligible c
 ON c.name='Click On Search Result' AND c.experiment_id IS NULL
 AND m.outcome_conversation_id=c.conversation_id
 AND (m.outcome_variant_id IS NOT NULL OR m.outcome_variant_internal_id IS NOT NULL)
 -- The public bridge renames an internal-only ID to productVariantId; allow that exact internal-ID form.
 AND (m.outcome_variant_id IS NULL OR m.outcome_variant_id=c.variant_id
      OR (m.outcome_variant_internal_id IS NULL AND m.outcome_variant_id=c.variant_internal_id))
 AND (m.outcome_variant_internal_id IS NULL OR m.outcome_variant_internal_id=c.variant_internal_id)
 AND (m.outcome_shopper_id IS NULL OR m.outcome_shopper_id=c.shopper_id)
 AND ABS(TIMESTAMP_DIFF(c.created_at,m.created_at,MICROSECOND))<=120000000
 AND ABS(TIMESTAMP_DIFF(c.created_at,m.outcome_timestamp,MICROSECOND))<=120000000
 AND c.created_at>=m.exposed_at
), closest_canonical AS (
 -- One mirror may match only one canonical click; repeated mirrors cannot multiply an accepted click.
 SELECT * FROM canonical_candidates
 QUALIFY ROW_NUMBER() OVER(PARTITION BY mirror_id ORDER BY time_distance,canonical_id)=1
), accepted_live_clicks AS (
 SELECT * FROM closest_canonical
 QUALIFY ROW_NUMBER() OVER(PARTITION BY canonical_id ORDER BY time_distance,mirror_id)=1
), visit_actions AS (
 SELECT e.visit_id,e.page_slug,
 COUNT(DISTINCT IF(a.name='Click On Search Result',a.id,NULL)) prebuilt_clicks,
 COUNT(DISTINCT IF(a.name='Shop Nobi Refine Search',a.id,NULL)) refine_actions,
 COUNT(DISTINCT IF(a.name='Shop Nobi Landing Outcome' AND a.outcome='message-submitted' AND a.outcome_surface='live',a.id,NULL)) live_message_events,
 COUNT(DISTINCT IF(a.name='Shop Nobi Landing Outcome' AND a.outcome='product-click' AND a.outcome_surface='live',a.id,NULL)) live_mirror_events
 FROM exposures e LEFT JOIN attributed_actions a USING(visit_id,page_slug)
 GROUP BY e.visit_id,e.page_slug
), live_visit_counts AS (
 SELECT visit_id,page_slug,COUNT(DISTINCT canonical_id) accepted_live_clicks
 FROM accepted_live_clicks GROUP BY visit_id,page_slug
), unmatched_mirrors AS (
 SELECT m.visit_id,m.page_slug,COUNT(DISTINCT m.id) unmatched_live_mirrors
 FROM live_mirrors m LEFT JOIN canonical_candidates c ON c.mirror_id=m.id
 WHERE c.mirror_id IS NULL GROUP BY m.visit_id,m.page_slug
)
SELECT e.variant,e.traffic_group,COUNT(*) exposed_visits,COUNT(DISTINCT e.page_slug) exposed_pages,
 SUM(e.exposure_events) raw_exposure_events,
 COUNTIF(p.prebuilt_clicks>0) visits_with_prebuilt_product_click,
 SUM(p.prebuilt_clicks) prebuilt_product_click_events,
 COUNTIF(p.prebuilt_clicks>0 OR COALESCE(l.accepted_live_clicks,0)>0) visits_with_any_product_click,
 SAFE_DIVIDE(COUNTIF(p.prebuilt_clicks>0 OR COALESCE(l.accepted_live_clicks,0)>0),COUNT(*)) any_product_click_visit_rate,
 COUNTIF(COALESCE(l.accepted_live_clicks,0)>0) visits_with_accepted_live_product_click,
 SUM(COALESCE(l.accepted_live_clicks,0)) accepted_live_product_click_events,
 SUM(p.live_mirror_events) observed_live_click_mirror_events,
 SUM(COALESCE(u.unmatched_live_mirrors,0)) unmatched_live_click_mirrors,
 COUNTIF(p.live_message_events>0) visits_with_live_message_submitted,
 COUNTIF(p.refine_actions>0) visits_with_refine_action,
 COUNTIF(e.missing_shopper_id) visits_missing_shopper_id,
 COUNTIF(e.unknown_exclusion_flag) visits_with_unknown_exclusion_flag
FROM exposures e JOIN visit_actions p USING(visit_id,page_slug)
LEFT JOIN live_visit_counts l USING(visit_id,page_slug)
LEFT JOIN unmatched_mirrors u USING(visit_id,page_slug)
GROUP BY e.variant,e.traffic_group ORDER BY e.traffic_group,e.variant;

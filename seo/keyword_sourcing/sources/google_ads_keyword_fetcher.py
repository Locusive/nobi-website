"""
Google Ads Keyword Planner fetcher.

Seeds keyword ideas from:
  A) Existing keyword_candidates (generated + bigquery_faq sources)
  B) Competitor "alternative/vs" seed phrases

Requires Basic-level developer token (not test-level).
Gracefully skips if google-ads.yaml is not found.

CSV bootstrap: until Basic access is approved, high-signal keywords are
imported directly via bootstrap_from_csv.py. This fetcher will auto-enable
once the yaml is present and the token is upgraded.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from keyword_sourcing.db import get_conn, init_db

MIN_MONTHLY_SEARCHES = 50
BATCH_SIZE = 20

_COMPETITOR_SEEDS = [
    "algolia alternative",
    "elasticsearch alternative",
    "constructor.io alternative",
    "searchspring alternative",
    "bloomreach alternative",
    "AI search assistant for ecommerce",
    "best site search for shopify",
    "ecommerce chatbot alternative",
]

_GEO_TARGET = "geoTargetConstants/2840"   # United States
_LANGUAGE   = "languageConstants/1000"    # English


def _tag_intent(kw: str) -> str:
    q = kw.lower()
    if any(w in q for w in ["best", "top", "vs", "alternative", "comparison", "review"]):
        return "bofu"
    if any(w in q for w in ["how to", "what is", "guide", "tutorial"]):
        return "tofu"
    return "mofu"


def fetch_and_store():
    yaml_path = os.getenv("GOOGLE_ADS_YAML", os.path.expanduser("~/.nobi/google-ads.yaml"))
    yaml_path = os.path.expanduser(yaml_path)

    if not os.path.exists(yaml_path):
        print(f"[google_ads] {yaml_path} not found — skipping (run google_ads_oauth.py first)")
        return

    try:
        from google.ads.googleads.client import GoogleAdsClient
        from google.ads.googleads.errors import GoogleAdsException
    except ImportError:
        print("[google_ads] google-ads package not installed — skipping")
        return

    init_db()
    conn = get_conn()

    try:
        client = GoogleAdsClient.load_from_storage(yaml_path)
    except Exception as e:
        print(f"[google_ads] Could not load client: {e}")
        conn.close()
        return

    customer_id = os.getenv(
        "GOOGLE_ADS_CUSTOMER_ID",
        os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID", "")
    ).replace("-", "")

    if not customer_id:
        print("[google_ads] GOOGLE_ADS_CUSTOMER_ID not set — skipping")
        conn.close()
        return

    # Seed A: existing candidates
    existing = conn.execute(
        "SELECT DISTINCT raw_signal FROM keyword_candidates WHERE source IN ('generated', 'bigquery_faq') LIMIT 200"
    ).fetchall()
    seed_a = [r["raw_signal"] for r in existing]

    # Seed B: competitor phrases
    seed_b = _COMPETITOR_SEEDS

    all_seeds = list(dict.fromkeys(seed_a + seed_b))  # dedupe preserving order

    service = client.get_service("KeywordPlanIdeaService")
    request_type = client.get_type("GenerateKeywordIdeasRequest")

    inserted = skipped = 0

    for i in range(0, len(all_seeds), BATCH_SIZE):
        batch = all_seeds[i : i + BATCH_SIZE]
        try:
            request = client.get_type("GenerateKeywordIdeasRequest")
            request.customer_id = customer_id
            request.geo_target_constants.append(
                client.get_service("GeoTargetConstantService").geo_target_constant_path(
                    _GEO_TARGET.split("/")[1]
                )
            )
            request.language = client.get_service("LanguageConstantService").language_constant_path(
                _LANGUAGE.split("/")[1]
            )
            request.keyword_seed.keywords.extend(batch)

            response = service.generate_keyword_ideas(request=request)

            for idea in response:
                kw = idea.text
                metrics = idea.keyword_idea_metrics
                avg_searches = metrics.avg_monthly_searches if metrics else 0
                competition = str(metrics.competition.name) if metrics else "UNKNOWN"

                if avg_searches < MIN_MONTHLY_SEARCHES:
                    continue
                if competition == "UNKNOWN":
                    continue

                intent = _tag_intent(kw)
                if intent == "tofu":
                    continue  # skip top-of-funnel

                try:
                    conn.execute(
                        """
                        INSERT INTO keyword_candidates (source, raw_signal, intent_tag, impressions)
                        VALUES (?, ?, ?, ?)
                        ON CONFLICT(source, raw_signal) DO UPDATE SET
                            impressions = MAX(excluded.impressions, keyword_candidates.impressions)
                        """,
                        ("google_ads", kw, intent, avg_searches),
                    )
                    inserted += 1
                except Exception as e:
                    print(f"  Error inserting {kw!r}: {e}")
                    skipped += 1

        except GoogleAdsException as ex:
            for error in ex.failure.errors:
                code = error.error_code
                msg = error.message
                if "DEVELOPER_TOKEN_NOT_APPROVED" in str(code) or "USER_PERMISSION_DENIED" in str(code):
                    print(
                        f"[google_ads] Developer token not approved for production access. "
                        f"Awaiting Basic access review. Skipping. ({msg})"
                    )
                    conn.close()
                    return
                print(f"[google_ads] API error: {code} — {msg}")
        except Exception as e:
            print(f"[google_ads] Unexpected error on batch {i}: {e}")

    conn.commit()
    conn.close()
    print(f"[google_ads] Inserted/updated {inserted}, skipped {skipped}")


if __name__ == "__main__":
    fetch_and_store()

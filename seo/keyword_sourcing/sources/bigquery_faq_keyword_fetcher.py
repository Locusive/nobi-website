"""
Fetches prospect-intent FAQ queries from BigQuery (daily_merchant_query_metrics)
and upserts into keyword_candidates.

Only keeps queries where the intent_category indicates someone evaluating Nobi
as a product — not shoppers using the assistant to find products.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from keyword_sourcing.db import get_conn, init_db

NOBI_MERCHANT_ID = os.getenv("NOBI_MERCHANT_ID", "460cbe82-9195-424f-a616-b1cb3e3caca0")
BQ_PROJECT = os.getenv("BQ_PROJECT", "locusive-production")
DAYS_BACK = int(os.getenv("BQ_DAYS_BACK", "90"))
MIN_COUNT = int(os.getenv("BQ_MIN_COUNT", "2"))

# Only keep queries where intent signals someone evaluating Nobi as a vendor.
# Shopper queries (finding products, outfit help, etc.) are excluded.
_PROSPECT_INTENT_CATEGORIES = frozenset({
    "Pricing inquiry",
    "Implementation inquiry",
    "Feature inquiry",
    "Feature request",
    "Capability inquiry",
    "Company info inquiry",
    "Demo request",
    "Comparison inquiry",
    "Career inquiry",
    "Technical issue",
    "General information request",
    "Agent request",
})

_SQL = """
SELECT
    m.query_text,
    SUM(m.count)   AS total_count,
    SUM(m.clicks)  AS total_clicks,
    MAX(a.intent_category) AS intent_category
FROM `{project}.analytics.daily_merchant_query_metrics` m
LEFT JOIN `{project}.analytics.query_attributes` a
    ON m.query_text = a.query_text
WHERE
    m.merchant_id = '{merchant_id}'
    AND m.date >= DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY)
GROUP BY m.query_text
HAVING SUM(m.count) >= {min_count}
ORDER BY total_count DESC
""".strip()


def _tag_intent(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["best", "top", "vs", "alternative", "comparison", "review"]):
        return "bofu"
    if any(w in q for w in ["how to", "what is", "guide", "tutorial"]):
        return "tofu"
    return "mofu"


def fetch_and_store():
    from google.cloud import bigquery
    import json

    init_db()

    # Build BQ client using the same SA credentials as Search Console
    path = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON_PATH")
    if path:
        path = os.path.expanduser(path)
        client = bigquery.Client.from_service_account_json(path, project=BQ_PROJECT)
    else:
        raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not raw:
            raise RuntimeError("Set GOOGLE_SERVICE_ACCOUNT_JSON_PATH or GOOGLE_SERVICE_ACCOUNT_JSON")
        info = json.loads(raw)
        from google.oauth2 import service_account as sa_module
        from google.cloud import bigquery as bq
        creds = sa_module.Credentials.from_service_account_info(
            info,
            scopes=["https://www.googleapis.com/auth/bigquery.readonly"],
        )
        client = bq.Client(project=BQ_PROJECT, credentials=creds)

    sql = _SQL.format(
        project=BQ_PROJECT,
        merchant_id=NOBI_MERCHANT_ID,
        days=DAYS_BACK,
        min_count=MIN_COUNT,
    )

    print(f"[bigquery_faq] Running query for merchant {NOBI_MERCHANT_ID}...")
    rows = list(client.query(sql).result())
    print(f"[bigquery_faq] Got {len(rows)} rows")

    conn = get_conn()
    inserted = skipped = filtered = 0

    for row in rows:
        query_text = row["query_text"].strip()
        intent_cat = row["intent_category"]  # may be None
        clicks = int(row["total_clicks"] or 0)
        count = int(row["total_count"] or 0)

        # Apply prospect-intent filter
        if intent_cat is not None:
            if intent_cat not in _PROSPECT_INTENT_CATEGORIES:
                filtered += 1
                continue
        else:
            # NULL intent — only keep if query mentions nobi explicitly
            if "nobi" not in query_text.lower():
                filtered += 1
                continue

        intent_tag = _tag_intent(query_text)
        try:
            conn.execute(
                """
                INSERT INTO keyword_candidates (source, raw_signal, intent_tag, impressions, clicks)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(source, raw_signal) DO UPDATE SET
                    impressions = excluded.impressions,
                    clicks      = excluded.clicks
                """,
                ("bigquery_faq", query_text, intent_tag, count, clicks),
            )
            inserted += 1
        except Exception as e:
            print(f"  Error inserting {query_text!r}: {e}")
            skipped += 1

    conn.commit()
    conn.close()
    print(
        f"[bigquery_faq] Inserted/updated {inserted}, filtered (off-intent) {filtered}, skipped {skipped}"
    )


if __name__ == "__main__":
    fetch_and_store()

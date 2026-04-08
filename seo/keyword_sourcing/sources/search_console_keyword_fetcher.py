"""
Fetches query-level data from Google Search Console and upserts into keyword_candidates.
Uses a service account with domain-wide delegation or direct SA access to the property.
"""
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from google.oauth2 import service_account
from googleapiclient.discovery import build

from keyword_sourcing.db import get_conn, init_db

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
SITE_URL = os.getenv("SEARCH_CONSOLE_SITE_URL", "sc-domain:nobi.ai")
DAYS_BACK = int(os.getenv("SEARCH_CONSOLE_DAYS_BACK", "90"))
MIN_IMPRESSIONS = int(os.getenv("SEARCH_CONSOLE_MIN_IMPRESSIONS", "10"))
ROW_LIMIT = 5000


def _build_service():
    path = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON_PATH")
    if path:
        path = os.path.expanduser(path)
        with open(path) as fh:
            info = json.load(fh)
    else:
        raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
        if not raw:
            raise RuntimeError(
                "Set GOOGLE_SERVICE_ACCOUNT_JSON_PATH (path to SA JSON file) "
                "or GOOGLE_SERVICE_ACCOUNT_JSON (inline JSON string)."
            )
        info = json.loads(raw)
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def _tag_intent(query: str) -> str:
    q = query.lower()
    if any(w in q for w in ["best", "top", "vs", " vs ", "alternative", "comparison", "review"]):
        return "bofu"
    if any(w in q for w in ["how to", "what is", "guide", "tutorial", "example"]):
        return "tofu"
    return "mofu"


def fetch_and_store():
    from datetime import date, timedelta

    init_db()
    svc = _build_service()

    end_date = date.today().isoformat()
    start_date = (date.today() - timedelta(days=DAYS_BACK)).isoformat()

    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query"],
        "rowLimit": ROW_LIMIT,
        "startRow": 0,
    }

    resp = svc.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
    rows = resp.get("rows", [])
    print(f"[search_console] Got {len(rows)} rows from Search Console")

    conn = get_conn()
    inserted = skipped = 0
    for row in rows:
        query = row["keys"][0]
        impressions = int(row.get("impressions", 0))
        clicks = int(row.get("clicks", 0))
        position = row.get("position")

        if impressions < MIN_IMPRESSIONS:
            continue

        intent = _tag_intent(query)
        try:
            conn.execute(
                """
                INSERT INTO keyword_candidates (source, raw_signal, intent_tag, impressions, clicks, avg_position)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(source, raw_signal) DO UPDATE SET
                    impressions  = excluded.impressions,
                    clicks       = excluded.clicks,
                    avg_position = excluded.avg_position
                """,
                ("search_console", query, intent, impressions, clicks, position),
            )
            inserted += 1
        except Exception as e:
            print(f"  Error inserting {query!r}: {e}")
            skipped += 1

    conn.commit()
    conn.close()
    print(f"[search_console] Inserted/updated {inserted}, skipped {skipped}")


if __name__ == "__main__":
    fetch_and_store()

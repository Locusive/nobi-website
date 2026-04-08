"""
Phase 2 orchestrator: runs all keyword sourcing steps in order.

Order:
  1. bofu_keyword_generator    — template expansions (no external API)
  2. search_console_fetcher    — organic query data from GSC
  3. bigquery_faq_fetcher      — prospect FAQ queries from Nobi's BQ
  4. google_ads_fetcher        — keyword planner ideas (skips if yaml missing)

Each fetcher is independent. A failure in one does not block others.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Load .env if present (for local runs)
_env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
if os.path.exists(_env_path):
    with open(_env_path) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _, _v = _line.partition("=")
                os.environ.setdefault(_k.strip(), _v.strip())


def _run_step(name: str, fn):
    print(f"\n{'─'*60}")
    print(f"STEP: {name}")
    print("─" * 60)
    try:
        fn()
    except Exception as e:
        print(f"[ERROR] {name} failed: {e}")
        import traceback
        traceback.print_exc()


def main():
    from keyword_sourcing.bofu_keyword_generator import generate_and_store
    from keyword_sourcing.sources.search_console_keyword_fetcher import fetch_and_store as sc_fetch
    from keyword_sourcing.sources.bigquery_faq_keyword_fetcher import fetch_and_store as bq_fetch
    from keyword_sourcing.sources.google_ads_keyword_fetcher import fetch_and_store as ads_fetch

    _run_step("BoFu keyword generator (templates)", generate_and_store)
    _run_step("Search Console (organic queries)", sc_fetch)
    _run_step("BigQuery FAQ (prospect queries)", bq_fetch)
    _run_step("Google Ads keyword planner", ads_fetch)

    # Summary
    from keyword_sourcing.db import get_conn
    conn = get_conn()
    total = conn.execute("SELECT COUNT(*) FROM keyword_candidates").fetchone()[0]
    by_source = conn.execute(
        "SELECT source, COUNT(*) as n FROM keyword_candidates GROUP BY source ORDER BY source"
    ).fetchall()
    conn.close()

    print(f"\n{'='*60}")
    print(f"DONE — {total} total keyword candidates")
    for row in by_source:
        print(f"  {row[0]}: {row[1]}")


if __name__ == "__main__":
    main()

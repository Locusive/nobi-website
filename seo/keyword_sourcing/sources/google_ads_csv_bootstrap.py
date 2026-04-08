"""
One-time bootstrap: imports high-signal keywords from exported Google Ads CSVs.

Only keeps keywords that meet the high-signal bar:
  - At least 1 conversion, OR
  - At least 5 clicks (ecommerce-relevant campaigns only), OR
  - At least 100 impressions with CTR >= 2%

Excludes automotive/dealership campaigns entirely (zero conversions, wrong vertical).

Usage:
    python google_ads_csv_bootstrap.py path/to/BoFu.csv path/to/MoFu.csv ...

    Or set CSV_PATHS env var (colon-separated) and run with no args.
"""
import csv
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from keyword_sourcing.db import get_conn, init_db

# Campaigns whose keywords are entirely off-vertical and should be excluded.
# Match against the filename (case-insensitive).
_EXCLUDED_CAMPAIGNS = {"automotive", "dealer", "dealership", "car dealer", "search keyword"}


def _parse_num(v):
    try:
        return float(str(v).replace(",", "").replace("--", "0").strip() or 0)
    except Exception:
        return 0.0


def _parse_pct(v):
    try:
        return float(str(v).replace("%", "").replace("--", "0").strip() or 0)
    except Exception:
        return 0.0


def _tag_intent(kw: str) -> str:
    q = kw.lower()
    if any(w in q for w in ["best", "top", "vs", "alternative", "comparison", "review"]):
        return "bofu"
    if any(w in q for w in ["how to", "what is", "guide", "tutorial"]):
        return "tofu"
    return "mofu"


def _is_excluded_campaign(path: str) -> bool:
    name = os.path.basename(path).lower()
    return any(excl in name for excl in _EXCLUDED_CAMPAIGNS)


def _find_header(lines):
    for i, line in enumerate(lines):
        if ("Keyword" in line or "Search keyword" in line) and (
            "Clicks" in line or "Impr" in line or "Cost" in line
        ):
            return i
    return None


def _keyword_col(fieldnames):
    for col in fieldnames:
        if col.strip() in ("Keyword", "Search keyword"):
            return col.strip()
    return None


def import_csv(path: str, conn) -> tuple[int, int]:
    if _is_excluded_campaign(path):
        print(f"[bootstrap] Skipping excluded campaign file: {os.path.basename(path)}")
        return 0, 0

    with open(path, encoding="utf-8-sig") as f:
        lines = f.readlines()

    header_idx = _find_header(lines)
    if header_idx is None:
        print(f"[bootstrap] Could not find header row in {path}")
        return 0, 0

    reader = csv.DictReader(lines[header_idx:])
    kw_col = _keyword_col(reader.fieldnames or [])
    if not kw_col:
        print(f"[bootstrap] No keyword column found in {path} (fields: {reader.fieldnames})")
        return 0, 0

    inserted = filtered = 0
    for row in reader:
        kw = row.get(kw_col, "").strip()
        if not kw or kw.startswith("Total") or kw in ("--", ""):
            continue

        clicks = _parse_num(row.get("Clicks", 0))
        impr   = _parse_num(row.get("Impr.", row.get("Impressions", 0)))
        convs  = _parse_num(row.get("Conversions", row.get("Conv.", 0)))
        ctr    = _parse_pct(row.get("CTR", "0"))

        # High-signal gate
        keep = (
            convs >= 1
            or clicks >= 5
            or (impr >= 100 and ctr >= 2.0)
        )
        if not keep:
            filtered += 1
            continue

        intent = _tag_intent(kw)
        try:
            conn.execute(
                """
                INSERT INTO keyword_candidates (source, raw_signal, intent_tag, impressions, clicks)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(source, raw_signal) DO UPDATE SET
                    impressions = MAX(excluded.impressions, keyword_candidates.impressions),
                    clicks      = MAX(excluded.clicks, keyword_candidates.clicks)
                """,
                ("google_ads", kw, intent, int(impr), int(clicks)),
            )
            inserted += 1
        except Exception as e:
            print(f"  Error inserting {kw!r}: {e}")

    print(
        f"[bootstrap] {os.path.basename(path)}: {inserted} inserted, {filtered} below threshold"
    )
    return inserted, filtered


def run(csv_paths: list[str]):
    init_db()
    conn = get_conn()

    # Clear any existing google_ads rows before bootstrapping
    before = conn.execute(
        "SELECT COUNT(*) FROM keyword_candidates WHERE source='google_ads'"
    ).fetchone()[0]
    if before:
        conn.execute("DELETE FROM keyword_candidates WHERE source='google_ads'")
        print(f"[bootstrap] Cleared {before} existing google_ads rows")

    total_inserted = total_filtered = 0
    for path in csv_paths:
        ins, filt = import_csv(path, conn)
        total_inserted += ins
        total_filtered += filt

    conn.commit()

    total = conn.execute("SELECT COUNT(*) FROM keyword_candidates").fetchone()[0]
    by_source = conn.execute(
        "SELECT source, COUNT(*) FROM keyword_candidates GROUP BY source ORDER BY source"
    ).fetchall()
    conn.close()

    print(f"\n[bootstrap] Done. Inserted {total_inserted} high-signal keywords "
          f"({total_filtered} below threshold).")
    print(f"[bootstrap] Total in DB: {total}")
    for row in by_source:
        print(f"  {row[0]}: {row[1]}")


if __name__ == "__main__":
    paths = sys.argv[1:]
    if not paths:
        env_paths = os.getenv("CSV_PATHS", "")
        paths = [p for p in env_paths.split(":") if p]
    if not paths:
        print("Usage: python google_ads_csv_bootstrap.py file1.csv file2.csv ...")
        sys.exit(1)
    run(paths)

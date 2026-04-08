"""Shared DB helpers for the SEO keyword pipeline."""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "seo_pipeline.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS keyword_candidates (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            source      TEXT NOT NULL,
            raw_signal  TEXT NOT NULL,
            intent_tag  TEXT,
            impressions INTEGER DEFAULT 0,
            clicks      INTEGER DEFAULT 0,
            avg_position REAL,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(source, raw_signal)
        )
    """)
    conn.commit()
    conn.close()

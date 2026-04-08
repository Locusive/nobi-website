"""
Generates BoFu keyword candidates by expanding templates from keyword_variables.yml
using itertools.product. Inserts results into keyword_candidates with source='generated'.

Skips combinations where two variable slots resolve to the same value
(e.g. "Algolia vs Algolia").
"""
import itertools
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import yaml

from keyword_sourcing.db import get_conn, init_db

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config", "keyword_variables.yml")


def _tag_intent(kw: str) -> str:
    q = kw.lower()
    if any(w in q for w in ["best", "top", "vs", "alternative", "comparison", "review"]):
        return "bofu"
    if any(w in q for w in ["how to", "what is", "guide", "tutorial"]):
        return "tofu"
    return "mofu"


def generate_and_store():
    with open(CONFIG_PATH) as fh:
        config = yaml.safe_load(fh)

    templates: list[str] = config["templates"]
    variables: dict[str, list[str]] = config["variables"]

    init_db()
    conn = get_conn()

    inserted = skipped_dup = skipped_same = 0

    for template in templates:
        # Find which variable names appear in this template
        import string
        formatter = string.Formatter()
        field_names = [
            fname for _, fname, _, _ in formatter.parse(template) if fname
        ]

        if not field_names:
            continue

        # Build list of value-lists in field order
        value_lists = []
        for name in field_names:
            if name not in variables:
                print(f"  Warning: variable '{name}' not found in config, skipping template")
                value_lists = []
                break
            value_lists.append(variables[name])

        if not value_lists:
            continue

        for combo in itertools.product(*value_lists):
            # Skip combos where any two slots have the same value
            if len(set(combo)) < len(combo):
                skipped_same += 1
                continue

            kwargs = dict(zip(field_names, combo))
            keyword = template.format(**kwargs).strip()
            intent = _tag_intent(keyword)

            try:
                conn.execute(
                    """
                    INSERT INTO keyword_candidates (source, raw_signal, intent_tag)
                    VALUES (?, ?, ?)
                    ON CONFLICT(source, raw_signal) DO NOTHING
                    """,
                    ("generated", keyword, intent),
                )
                inserted += 1
            except Exception as e:
                print(f"  Error inserting {keyword!r}: {e}")
                skipped_dup += 1

    conn.commit()
    conn.close()
    print(
        f"[bofu_generator] Inserted {inserted} keywords "
        f"({skipped_same} same-value combos skipped, {skipped_dup} duplicates)"
    )


if __name__ == "__main__":
    generate_and_store()

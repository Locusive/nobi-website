// Dates describe recorded content revisions, never product freshness or a build's wall clock.
const DatePattern = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/;
const DateFormat = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };

/** Returns a recorded ISO timestamp only when it parses successfully. */
function validDate(value) {
  return typeof value === "string" && DatePattern.test(value) && Number.isFinite(Date.parse(value)) ? value : null;
}

/** Collects independently visible editorial fragments, excluding catalog data and dates. */
export function editorialFragments(page) {
  const fragments = ["title", "description"].flatMap(key => page[key] ? [`${key}:${page[key]}`] : []);
  for (const paragraph of page.guide ?? []) fragments.push(`guide:${paragraph}`);
  for (const entry of page.faq ?? []) fragments.push(`faq:${JSON.stringify([entry.question, entry.answer])}`);
  for (const source of page.guideSources ?? []) fragments.push(`source:${JSON.stringify([source.label, source.url])}`);
  for (const related of page.related ?? []) fragments.push(`related:${JSON.stringify([related.slug, related.title, related.query])}`);
  if (page.comparison?.rows?.length) {
    fragments.push(`caption:${page.comparison.caption}`, `note:${page.comparison.note}`);
    fragments.push(`columns:${JSON.stringify(page.comparison.columns)}`);
    for (const row of page.comparison.rows) fragments.push(`row:${JSON.stringify([row.model, row.setup, row.adjustment, row.fit])}`);
  }
  return fragments;
}

/** Records only newly introduced fragments; later suppression can invalidate each independently. */
export function recordEditorialRevision(revisions, before, after, date) {
  if (!validDate(date)) return after;
  const previous = new Set(editorialFragments(before));
  const fragments = editorialFragments(after).filter(fragment => !previous.has(fragment));
  if (fragments.length) revisions.push({ date, fragments });
  return after;
}

/** Dates final output only for surviving changes, plus the final quality rule's actual edits/removals. */
export function withPublicationDates(source, published, revisions, qualityChanged = false) {
  const { editorialModifiedAt: ignoredEditorial, editorialUpdatedDate: ignoredLabel, lastModifiedAt: ignoredLast, ...page } = published;
  if (!page.products?.length) return page;
  const surviving = new Set(editorialFragments(page));
  const dates = revisions.filter(revision => revision.fragments.some(fragment => surviving.has(fragment))).map(revision => revision.date);
  if (qualityChanged) dates.push("2026-10-27T20:22:16Z");
  // Reapplying the same pipeline preserves our recorded date; changed/suppressed output must earn its date again.
  if (JSON.stringify(editorialFragments(source)) === JSON.stringify(editorialFragments(page)) && validDate(source.editorialModifiedAt)) {
    dates.push(source.editorialModifiedAt);
  }
  const editorialModifiedAt = dates.filter(validDate).sort((left, right) => Date.parse(right) - Date.parse(left))[0];
  const catalogDate = validDate(page.refreshedAt);
  const lastModifiedAt = [catalogDate, editorialModifiedAt].filter(Boolean).sort((left, right) => Date.parse(right) - Date.parse(left))[0];
  return {
    ...page,
    ...(editorialModifiedAt ? { editorialModifiedAt, editorialUpdatedDate: new Date(editorialModifiedAt).toLocaleDateString("en-US", DateFormat) } : {}),
    ...(editorialModifiedAt && lastModifiedAt ? { lastModifiedAt } : {}),
  };
}

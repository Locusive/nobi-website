import { GiftGuideTopics, GiftGuideSourceCopy } from "../src/content/shopGiftGuideTopics.js";

const MaxProducts = 8;
const MinProducts = 5;
const FirstPublishedAt = "2026-11-05T00:00:00Z";

/** Select current catalog matches in search order, spreading picks across a guide's categories and stores. */
export function buildGiftGuides(searchPages, generatedAt = null) {
  const bySlug = new Map(searchPages.map((page) => [page.slug, page]));
  return GiftGuideTopics.flatMap((topic) => {
    const sourcePages = topic.sources.map((slug) => bySlug.get(slug)).filter(Boolean);
    const pools = sourcePages.map((page) => page.products
      .filter((product) => product.isInStock && product.name && product.url && product.imageUrl)
      .filter((product) => !/\b(refurbished|renewed|open box)\b/i.test(product.name))
      .map((product) => ({ ...product, sourceQuery: page.query, sourceSlug: page.slug,
        editorialWhy: GiftGuideSourceCopy[page.slug]?.[0] ?? topic.why,
        editorialCheck: GiftGuideSourceCopy[page.slug]?.[1] ?? topic.check })));
    const products = [];
    const seen = new Set();
    const storeCounts = new Map();
    for (let round = 0; products.length < MaxProducts && pools.some((pool) => pool.length); round++) {
      for (const pool of pools) {
        if (!pool.length || products.length >= MaxProducts) continue;
        const candidates = pool.splice(0, Math.min(pool.length, 8)).filter((product) => !seen.has(product.productVariantId || product.url));
        candidates.sort((a, b) => {
          const as = storeCounts.get(a.storeName) ?? 0;
          const bs = storeCounts.get(b.storeName) ?? 0;
          return as - bs;
        });
        const chosen = candidates[0];
        pool.unshift(...candidates.slice(1));
        if (!chosen) continue;
        products.push(chosen);
        seen.add(chosen.productVariantId || chosen.url);
        storeCounts.set(chosen.storeName, (storeCounts.get(chosen.storeName) ?? 0) + 1);
      }
    }
    if (products.length < MinProducts) return [];
    return [{ ...topic, path: `/gift-guides/${topic.slug}`, products, generatedAt,
      refreshedAt: sourcePages.map((page) => page.refreshedAt).filter(Boolean).sort().at(-1) ?? null,
      lastModifiedAt: [FirstPublishedAt, ...sourcePages.map((page) => page.refreshedAt).filter(Boolean)].sort().at(-1),
      paidCount: products.filter((product) => product.paidLink && product.encodedStoreLink).length }];
  });
}

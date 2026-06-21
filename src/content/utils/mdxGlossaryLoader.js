// Centralized glossary registry built from MDX files in ../glossary.
// Each MDX file exports `meta` (term, slug, definition, category, related,
// faqItems) and a default component (the What/How/Why/FAQ body).
//
// Mirrors mdxPostLoader.js but for the lightweight /glossary section: glossary
// entries are structured definition pages, not blog posts (no hero, author,
// or date chrome).
const modules = import.meta.glob('../glossary/*.mdx', { eager: true });

const allTerms = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = mod.meta?.slug || path.split('/').pop().replace(/\.mdx?$/, '');
    return {
      slug,
      meta: {
        ...mod.meta,
        term: mod.meta?.term || slug,
        definition: mod.meta?.definition || '',
        category: mod.meta?.category || '',
        related: mod.meta?.related || null,
        faqItems: mod.meta?.faqItems || [],
        draft: Boolean(mod.meta?.draft),
      },
      Component: mod.default,
    };
  })
  .filter((t) => !t.meta.draft)
  // Alphabetical by term — a glossary is read A→Z, not by date.
  .sort((a, b) => a.meta.term.localeCompare(b.meta.term));

export const terms = allTerms;

export const getTermBySlug = (slug) => allTerms.find((t) => t.slug === slug);

// Group terms by their first letter for the A–Z index layout.
export const termsByLetter = () => {
  const groups = {};
  for (const t of allTerms) {
    const letter = (t.meta.term[0] || '#').toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : '#';
    (groups[key] = groups[key] || []).push(t);
  }
  return groups;
};

// HMR: adding/renaming an MDX file under ../glossary/ should refresh the
// registry without a dev-server restart (same rationale as mdxPostLoader).
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Centralized posts registry built from MDX files in ../posts.
// Each MDX file should export `meta` and a default component.
const modules = import.meta.glob('../posts/*.mdx', { eager: true });

const allPosts = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = mod.meta?.slug || path.split('/').pop().replace(/\.mdx?$/, '');
    return {
      slug,
      meta: {
        ...mod.meta,
        title: mod.meta?.title || slug,
        date: mod.meta?.date || new Date().toISOString(),
        excerpt: mod.meta?.excerpt || '',
        tags: mod.meta?.tags || [],
        author: mod.meta?.author || 'Nobi Team',
        heroImage: mod.meta?.heroImage || null,
        featured: Boolean(mod.meta?.featured),
        draft: Boolean(mod.meta?.draft),
      },
      Component: mod.default,
    };
  })
  .filter((p) => !p.meta.draft)
  .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));

// Published posts: excludes future-dated posts (used for blog listing)
export const posts = allPosts.filter((p) => {
  const publishDate = p.meta.publishedAt || p.meta.date;
  if (publishDate) {
    const today = new Date().toISOString().slice(0, 10);
    if (publishDate > today) return false;
  }
  return true;
});

// Direct lookup: finds any non-draft post by slug (including scheduled)
export const getPostBySlug = (slug) => allPosts.find((p) => p.slug === slug);

// Format a YYYY-MM-DD frontmatter date as a localized human-readable string.
// Parses the bare "YYYY-MM-DD" form as a local date instead of UTC midnight,
// which is what `new Date("YYYY-MM-DD")` does by default and which displays
// the day before for any visitor west of UTC.
export const formatPostDate = (dateStr, options = { year: "numeric", month: "long", day: "numeric" }) => {
  if (!dateStr) return "";
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const d = ymd
    ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]))
    : new Date(dateStr);
  return d.toLocaleDateString(undefined, options);
};

// A Flipboard-ready feed of the newest currently publishable authored guides.
// Use the same guide list and verified story posters as the public site build.

const Origin = "https://nobi.ai";
const FeedPath = "/shop-nobi-editorial.xml";
const FeedLimit = 20;

export function flipboardGuideUrl(path) {
  const url = new URL(path, Origin);
  url.searchParams.set("utm_source", "flipboard");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "editorial_pilot");
  return url.toString();
}

function xml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

function imageType(url) {
  const extension = new URL(url).pathname.match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase();
  return extension === "jpg" || extension === "jpeg" ? "image/jpeg"
    : extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : null;
}

export function buildEditorialFeed(guides, stories) {
  const posters = new Map(stories.map(({ guide, plan }) => [guide.slug, plan.posterUrl]));
  const entries = guides.filter((guide) => guide.editorial && guide.products.length === 10 && posters.has(guide.slug))
    .filter((guide) => Number.isFinite(Date.parse(guide.authoredAt)))
    .sort((a, b) => Date.parse(b.authoredAt) - Date.parse(a.authoredAt))
    .slice(0, FeedLimit);
  // Flipboard asks publisher feeds to contain generally at least 20 recent items.
  if (entries.length < FeedLimit) return null;
  const items = entries.map((guide) => {
    const image = posters.get(guide.slug);
    const description = `${guide.intro} ${guide.methodology || ""}`.trim();
    if (description.length < 300) throw new Error(`Editorial feed description too short: ${guide.slug}`);
    const mediaType = imageType(image);
    if (!mediaType) throw new Error(`Editorial feed image type unknown: ${guide.slug}`);
    const url = flipboardGuideUrl(guide.path);
    return `    <item>\n      <title>${xml(guide.title)}</title>\n      <link>${xml(url)}</link>\n      <guid isPermaLink="false">${xml(`${Origin}${guide.path}`)}</guid>\n      <pubDate>${new Date(guide.authoredAt).toUTCString()}</pubDate>\n      <dc:creator>Shop Nobi Editorial Team</dc:creator>\n      <description>${xml(description)}</description>\n      <enclosure url="${xml(image)}" type="${mediaType}" length="0" />\n    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">\n  <channel>\n    <title>Shop Nobi Buying Guides</title>\n    <link>${Origin}/gift-guides</link>\n    <description>Researched product comparisons from Shop Nobi. Each guide explains its picks and links to current store listings.</description>\n    <language>en-us</language>\n    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${Origin}${FeedPath}" rel="self" type="application/rss+xml" />\n${items.join("\n")}\n  </channel>\n</rss>\n`;
}

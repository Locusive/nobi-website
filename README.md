# Nobi Landing – Vercel/Netlify Starter

## Local dev (optional)
1) Install Node 18+
2) `npm install`
3) `npm run dev`

## Deploy to Cloudflare Pages
- Simply push your changes to the main branch and Cloudflare Pages will build and deploy automatically.

## Deploy to Vercel (deprecated)
- Push this folder to a GitHub repo.
- Import the repo in Vercel.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Hit Deploy.

## Static assets
Put images/videos under `public/media` and reference them as `/media/filename.ext`.

## Static page content

`npm run build` renders the homepage, pricing, and product components into HTML
using React's Node renderer. It does not require Chromium. Browser JavaScript
still mounts the same components for the bundle slider, navigation, and forms.
Blog and glossary pages retain their existing content prerendering.

The homepage is served through an exact Cloudflare Pages rewrite so the empty
`index.html` shell remains available for other client-side routes. This avoids
serving homepage text as the content of unrelated pages.

Run `npm test` to build the site and check page content, pricing facts, URL forms,
asset references, and signup attribution. Register additional pages in both
`scripts/prerender-pages.js` and `scripts/render-pages.jsx`.

## Local pricing page

Run `npm run preview:pricing` with Node 18+ and open
http://127.0.0.1:5174/pricing. The page shows a bundle slider, the full bundle
table behind "See all bundles", what counts as a message, and the going-over
settings. The bundle list lives in `src/constants/pricing.js`. The previous
`/pricing/ideas` preview URL redirects to the pricing page on loopback hosts.
Rebuild to see edits.

`npm test` builds the prerendered pages and checks the bundle slider, the bundle
table, the pricing facts, and existing page regressions.

## Shop Nobi search pages

`scripts/prerender-shop.js` builds one page per Shop Nobi search at
`/shop/s/<slug>`, with the products in the HTML, one page per top category at
`/shop/c/<slug>`, and a list of popular searches on `/shop`. It also writes
`/shop/pins.xml`, an RSS feed with one item per search page, which Pinterest
reads to publish a pin for each page. It also writes one feed per top-level
category at `/shop/pins/<slug>.xml`, one for each Pinterest board, and lists
them with their item counts in `/shop/pins/index.json`. Mature pages stay out
of every feed. The outside accounts behind this
(Search Console, Bing, IndexNow, Pinterest) are recorded in nobi-marketing's
[search engines and discovery sites doc](https://github.com/Locusive/nobi-marketing/blob/main/docs/search_engines_and_discovery_sites.md). It fetches the page data from
`https://api.nobi.ai/v1/shop/pages`. `SHOP_PAGES_API_URL` points the build at
another API base address. If the fetch fails, the build fails, so Cloudflare
keeps the last good deploy live.

In the browser, a search page keeps its prebuilt products above the live search,
and a category page keeps its searches under the search box, until the assistant
bundle draws live products. A refused or failed live search therefore leaves the
prebuilt content in place. A click on a prebuilt product sends the API the same
"Click On Search Result" event as a live product, with the same entry point,
"AI Search Bar". Prebuilt clicks omit the conversation ID so the API records them
without waiting for a live conversation to be saved. This also means a prebuilt
card gives no cross-merchant AI conversation credit after a shopper uses the
assistant. Live assistant results keep their own conversation attribution.
Crawlers, automated browsers and local copies send none. In a
smoke test's tab, the click carries the bundle's `nobi_smoke_test` marker, so
the API drops it as it drops the bundle's own smoke-test events.

Each search page with at least two short guide pages and two product pictures,
one of them a Shopify picture whose 3:4 cut is at least 640 by 853 pixels (the
build downloads the start of each poster to check), also gets a Google Web
Story at `/shop/stories/<slug>`, an AMP story built by
`scripts/shop-nobi-web-story-plan.js` and `scripts/shop-nobi-web-story.js`. It
shows a cover, the guide in pages of at most 180 characters, up to three
products with nofollow store links, questions that fit, and a last page that
links back to the search page with `utm_source=google_web_stories`. The search
page links to its story, and `sitemap-shop.xml` lists the stories. Each store
link goes through `https://api.nobi.ai/v1/shop/story-go` with the plain store
link and the story's slug; the API counts the tap and forwards to the store,
through the store's affiliate link when one pays us. Stories get
only the file room left after the pages. Mature pages get no story. To check
one, run `npx amphtml-validator dist/shop/stories/<slug>.html`.

Store links can earn a commission. For each product the API may send `storeLink`
(the finished link for search pages) and `paidLink` (true when the link earns a
commission). The website never builds or tags a paid link itself, and keeps one
only for paid products. A search page keeps the plain store link in its HTML and
holds the paid link only in base64, so crawlers never see it. A person's click
opens the paid link, with its sub-ID parameter (the one whose value is
`shop_nobi`) set to `<slug>.<visit id>`, at most 50 characters and stable within
the page view (`src/utils/shopNobiClickId.js`). The click event records that
finished link along with incoming traffic tags and referrer. A crawler's
click opens the plain link with Shop Nobi's tags. Plain prebuilt links remove
any stale `nobi-conversation-id`. A paid link, on search pages
and in stories, gets `rel="sponsored"` and a small "We may earn a commission"
notice under it (`CommissionNotice` in `src/utils/shopNobiPage.js`).

Every entry in `sitemap-shop.xml` has a lastmod: the page's refresh time, or the
time the API built the data when a page has none.

The last build step, `scripts/submit-indexnow.js`, tells IndexNow (Bing, Yandex
and the other engines that share it) about the Shop Nobi pages that are new or
have a new lastmod since the `sitemap-shop.xml` the live site serves, in batches
of up to 10,000. The key file is `public/b20309cb84825b184afe0ffcf36630a7.txt`;
the key is public by design. Only a Cloudflare Pages build of `main` from the
real page data submits. Local builds, preview builds and builds with
`SHOP_PAGES_API_URL` skip it, and so does a build that cannot read the live
sitemap. The step never fails the build and logs counts only. It runs before
Cloudflare publishes the build, so an engine that fetches a new page in the
first minutes can still see the last deploy.

The GitHub workflow `nightly-shop-nobi-rebuild.yml` rebuilds the site every
day at 10:00 UTC, after the API's overnight refresh, by calling the Cloudflare
Pages deploy hook in the `CLOUDFLARE_DEPLOY_HOOK_URL` secret.

To build without the network, serve the test data:
`node tests/shop-nobi-pages-server.js 4789`, then
`SHOP_PAGES_API_URL=http://127.0.0.1:4789 npm test`.

## Cove/Cubby comparison utility

`/tools/cove-vs-cubby` renders the comparison facts in HTML and runs its
floor-space calculator locally in the browser. It keeps the site's existing
floating assistant behavior outside `/shop`; the calculator sends no query.
Manufacturer facts, checked date, exact catalog variant IDs and reviewed
server-built store links are authored in `src/content/coveCubbyComparison.js`.
Recheck these inputs before changing the dated price claims. Do not construct
a second affiliate URL template in the website.

Purchase clicks reuse the standalone visit handler with the actual
`Shop Nobi Utility` surface, page URL, acquisition tags and variant ID.
Unfiltered click reporting retains the surface; the current backend report
validator does not yet accept it as an exact entry-point filter.
Standalone utility clicks have no conversation-derived search text; the current
report's `/shop/s` extractor also leaves their page slug empty. Page URL,
`details.query`, traffic tags and the final affiliate reference remain available
for acquisition joins. Do not create a synthetic search or conversation.
Run the footprint tests with `node --test tests/cat-footprint-fit.test.js`;
the full offline website suite also checks the built comparison HTML.

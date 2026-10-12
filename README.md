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
still mounts the same components for the calculator, navigation, and forms.
Blog and glossary pages retain their existing content prerendering.

The homepage is served through an exact Cloudflare Pages rewrite so the empty
`index.html` shell remains available for other client-side routes. This avoids
serving homepage text as the content of unrelated pages.

Run `npm test` to build the site and check page content, pricing facts, URL forms,
asset references, and signup attribution. Register additional pages in both
`scripts/prerender-pages.js` and `scripts/render-pages.jsx`.

## Local pricing wizard

Run `npm run preview:pricing` with Node 18+ and open
http://127.0.0.1:5174/pricing. The plan overview shows the base price, included
usage, and search/message rates before the inline interview. Both panels can be
opened independently. Usage sliders show a live monthly estimate, with site traffic
available as a secondary option. Counts use comma separators, and the sliders
start with limits of 100,000 searches and 10,000 messages; entering larger counts
expands those limits. The previous `/pricing/ideas` preview URL
redirects to the pricing page on loopback hosts.

Use the bundled preview for Chrome so ad blockers do not block the
development-only `eventTracker` module path. The existing traffic lookup and
contact form remain available under the activity question. Rebuild to see edits.

`npm test` builds the prerendered pages and checks the pricing arithmetic,
allowances, usage modes, input validation, and existing page regressions.

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
"Click On Search Result" event as a live product, with the entry point
"Shop Nobi Page". Crawlers, automated browsers and local copies send none.

Each search page with at least two short guide pages and two product pictures,
one of them a Shopify picture whose 3:4 cut is at least 640 by 853 pixels (the
build downloads the start of each poster to check), also gets a Google Web
Story at `/shop/stories/<slug>`, an AMP story built by
`scripts/shop-nobi-web-story-plan.js` and `scripts/shop-nobi-web-story.js`. It
shows a cover, the guide in pages of at most 180 characters, up to three
products with nofollow store links, questions that fit, and a last page that
links back to the search page with `utm_source=google_web_stories`. The search
page links to its story, and `sitemap-shop.xml` lists the stories. When a
shopper taps through a store link, `amp-analytics` sends a beacon to
`https://api.nobi.ai/v1/shop/story-click` with the store link and the story's
slug; the link itself still goes straight to the store. Stories get
only the file room left after the pages. Mature pages get no story. To check
one, run `npx amphtml-validator dist/shop/stories/<slug>.html`.

The GitHub workflow `nightly-shop-nobi-rebuild.yml` rebuilds the site every
day at 10:00 UTC, after the API's overnight refresh, by calling the Cloudflare
Pages deploy hook in the `CLOUDFLARE_DEPLOY_HOOK_URL` secret.

To build without the network, serve the test data:
`node tests/shop-nobi-pages-server.js 4789`, then
`SHOP_PAGES_API_URL=http://127.0.0.1:4789 npm test`.

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
of every feed. A feed item whose page contains an explicitly paid product
starts its description with a commission notice about some page links; unpaid
page descriptions remain unchanged. This does not change item identity or imply
that Pinterest updates an existing Pin. The outside accounts behind this
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

Each page view of a search page also sends one "Displayed Product Collection"
event, the event the bundle sends for the products it shows. Its `shownProducts`
list names each prebuilt product with an id, in order: `productVariantId`,
`owningMerchantId`, `position` (the `positionInGrid` its click sends) and
`isPaidLink`. It carries `pageSlug` and the collection name `Prebuilt search page`,
so a report can tell it from the live search. The build keeps a product's
`productVariantId` and `owningMerchantId` only when the API sent both as real ids,
and prebuilt clicks then carry both too. The same people-only rules apply.

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
through the store's affiliate link when one pays us. The story's amp-analytics
sends `https://api.nobi.ai/v1/shop/story-view` the slug and the id of each page
in view. A product page's id is `product-<place>-<variant id>-<store id>` when the
API sent both ids, and the API records that product as shown; it ignores every
other page and every bot. Stories get
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
and the other engines that share it) about new or changed Shop Nobi pages from
`sitemap-shop.xml` and canonical `/tools/` pages from `sitemap-pages.xml`.
Shop pages are compared with the live sitemap by address and lastmod. Utilities
are selected from the authored sitemap and compared with the live
`utility-revisions.json`, which prerendering writes from each delivered HTML
page and its referenced local image bytes. This covers rendered facts,
metadata, disclosures, links and shared JS/CSS bundle fingerprints. A shared
bundle change can conservatively notify all utilities, but unchanged builds
and same-day content changes are distinguished without a build clock or git.
Utility sitemap entries omit lastmod rather than invent a modification date.
Unchanged pages and other authored marketing pages are not submitted. Only
canonical HTTPS destinations on nobi.ai are accepted. Duplicate addresses are
removed before batching up to 10,000 URLs. The key file is `public/b20309cb84825b184afe0ffcf36630a7.txt`;
the key is public by design. Only a Cloudflare Pages build of `main` from the
real page data submits. Local builds, preview builds and builds with
`SHOP_PAGES_API_URL` skip it. An unreadable live Shop sitemap skips submission;
unknown or invalid live authored-sitemap/revision metadata visibly skips only
utility notifications, preserving Shop notifications. A missing built file,
incomplete revision artifact or failed submission remains visible in the build
log. A missing referenced local image stops prerendering. The IndexNow step
never fails the build and logs counts only. It runs before
Cloudflare publishes the build, so an engine that fetches a new page in the
first minutes can still see the last deploy. Acceptance acknowledges the
notification; it does not prove indexing, search traffic or commission.
The first revision-manifest deployment cannot compare against a nonexistent
live manifest. A separate bounded initial notification is an operator action;
the build never treats unknown live metadata as unchanged or force-replays it.

The GitHub workflow `nightly-shop-nobi-rebuild.yml` rebuilds the site every
day at 10:00 UTC, after the API's overnight refresh, by calling the Cloudflare
Pages deploy hook in the `CLOUDFLARE_DEPLOY_HOOK_URL` secret.

To build without the network, serve the test data:
`node tests/shop-nobi-pages-server.js 4789`, then
`SHOP_PAGES_API_URL=http://127.0.0.1:4789 npm test`.

## Election Night checklist

`/election-night-survival-kit` is a static, nonpartisan November 3, 2026
checklist with a disclosure above optional shopping links. It reuses the
standalone product-exit handler and an actual offline Java builder record for
the exact Baseus CR11 variant in `src/content/electionNightLink.js`. It does not
construct an affiliate template or promise stock, arrival, runtime or a purchase.
The Marley link opens the existing cost calculator and carries only incoming
UTM tags so its existing offer-exit event retains acquisition context. No
calculator or model call was added. Original diagrams, three Pins and the silent
15-second video are under `public/media/election-night-*`; the video loads only
when requested. The page CSS is loaded with the main stylesheet so the static
HTML stays styled without JavaScript. After November 4, review the dated
seasonal copy before promoting it again.

`tests/election-night-page.test.js` checks static content, disclosure order,
media/metadata/sitemap, the exact product exit and calculator attribution tags.

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

## Marley Spoon subscription cost utility

`/tools/marley-spoon-cost` is one authored SUBSCRIPTION/PER_DELIVERY offering,
not a physical product catalog entry or generic MCP/service search. It models
only the dated two-person/three-meal plan and food-discount schedule in
`src/content/marleySpoonCost.js`. Food rounds once in integer cents before
shipping is added. Delivered-box totals never promise future checkout prices.

`src/content/marleySpoonLink.js` contains actual Java store-link-builder output
from the independently verified non-catalog owner. Validation runs on import
and fails the build for missing/invalid reviewed link configuration. Do not
construct a second affiliate redirect or create a fake product to represent an
offer. New prices, codes or ownership changes need source review and fresh
builder output before publication.

The merchant exit shares person/visit/smoke/local and beacon/fetch behavior
with product exits, but sends a distinct `Click On Offer` generic event with
the offering kind, price basis, authored owner, final link and acquisition
context. It includes no product/variant or conversation IDs and sends no
calculator selections. Owner metadata is authored, not server-resolved.
Current counted physical-click SQL selects only `Click On Search Result`,
so offer adoption needs a separate raw-event-to-affiliate-reference ledger.
The current exact entry-point report filter also omits Shop Nobi Utility.

Run `node --test tests/delivery-cost.test.js tests/shop-nobi-offer-click.test.js`
for calculator, configuration and click behavior, then the full offline
website suite for static content and existing product regressions.


## Baseus independent-screen selector

`/tools/baseus-two-screens` compares only the US NU1 Air Mac B0114400 and RD1 Pro WIN B0114600.
The local pure selector separates documented conditional display fit, known incompatibility and
missing evidence, then evaluates laptop charging independently. It does not infer hardware
capabilities from a laptop name, run a search, install software or claim physical testing.
Manufacturer diagrams and software/manual sources are dated October 17, 2026. The NU1 dual-4K
marketing conflict and the mirrored manual's unverified hardware revision remain explicit.

The exact catalog IDs and actual offline Java builder outputs are authored in
`src/content/baseusScreenLinks.js`. Missing product identity or invalid destinations fail the
build. Exits use the existing standalone product handler with `Shop Nobi Utility`, a real
variant and the fixed topic; selector answers are not added to click events. Generic event
ingestion and reporting-filter registration are separate backend responsibilities. Tests cover
decision boundaries, emitted exit attribution and both built HTML URL forms, sources and
disclosures. The original diagram is under `public/media/baseus-independent-screens.svg`;
Pin creative specifications are in `agents/creative_specs/baseus_screen_pins.md`.

## MindTheColor digital-license checklist

`/tools/mindthecolor-fit` checks declared Photoshop, platform, installation,
connectivity and single-user license prerequisites. Missing answers stay unknown;
known mismatches take priority. It does not inspect hardware or guarantee
compatibility. Changing an answer clears a previous result. Answers remain local.
The source price is €179 plus VAT, checked October 17, 2026. Adobe Photoshop is
separate. The original dependency diagram uses no merchant images or software UI.

This is one authored DIGITAL_SOFTWARE/PER_LICENSE offer, separate from physical
search and MCP catalogs. `src/content/mindTheColorLink.js` contains actual offline
Java builder output from the independently verified excluded Gumroad marketplace
owner and its parameter configuration. Import validation rejects altered identity,
source tags, duplicate/missing publisher parameters or incomplete provenance.
Regenerate through the real builder after source/configuration changes; never
construct a second affiliate URL in the website.

Exits reuse `Click On Offer` and preserve Gumroad's publisher parameter. Gumroad's
checked link has no verified per-visit sub-ID, so our acquisition event does not
establish an exact order-to-visit join. Marketplace access and the generated link
do not prove retained commission or payout; account payout onboarding remains
unfinished. This page does not change it. Run `node --test
tests/mindthecolor-fit.test.js tests/mindthecolor-offer-click.test.js`, then the
full offline suite for the built page, discovery metadata and existing regressions.

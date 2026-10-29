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
The blog's static Markdown renderer preserves explicitly authored literal
HTTPS links with `rel="sponsored nofollow"`, matching their runtime MDX links.
It keeps other HTML escaped. A direct affiliate anchor records a network
referral; it does not invoke the Shop Nobi product-click handler or prove an order.

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

Published search pages keep the API's catalog refresh timestamp separate from recorded editorial revisions.
`shop-nobi-editorial-revision-dates.js` records substantive source revisions by slug; generic rules retain
independent revision dates. Dates are in UTC and are not an inventory check or a claim of public release time.
Ecru and the silver FAQ rule use their verified deployment receipts for known release dates. Only changed editorial fragments that
survive final publication contribute a date; suppressed or unmatched guidance does not make a page newer.
The sitemap uses the later valid catalog or editorial date from the same published data as HTML.
Visible labels distinguish “Catalog refreshed” and “Content revised”. Stories, categories and product-offer
check dates keep their separate meanings. Never set all dates to the build time or a shared module's mtime.
When materially revising an authored entry or rule, update its recorded revision and provenance; a no-op
rebuild or date-only edit is not a new content revision. The offline tests cover suppression and stability.

Generic `Best ...` search-page titles (including the `from Top Stores` suffix) are replaced at publication
with catalog-backed titles and descriptions by `scripts/shop-nobi-catalog-copy.js`.
Related-search labels also remove that generic ranking wording at publication, retaining
custom labels, link order, destinations and original query fallbacks.
The copy names the displayed listing count and up to two actual retailers, and
only invites price comparison when multiple displayed records have prices and
currencies. The shared `shop-nobi-publication-quality.js` rule also removes fixed
monetary assertions from source guide sentences and FAQs and supplies a price
summary computed from the displayed records. Mixed currencies are not combined
into a range. Clear visitor-entered search examples retain their budget amounts.
When publication filters remove records, dependent source guide/FAQ copy is
withheld because it may describe products no longer shown. Empty pages offer a
search path, have matching noindex metadata in HTML and the browser, and are
omitted from the search sitemap and llms.txt links. Populated pages return to
normal publication automatically on a later build when their listings return.
Reviewed editorial guidance remains subject to the same publication checks.
The generic-copy branch replaces 16 reviewed exact suede-care FAQ pairs and three
waterproof-selection FAQ pairs on uncited `Best ... from Top Stores` source pages.
The tailored answers ask shoppers to check exact-model care or waterproof
specifications instead of assuming protection from a material or finish alone.
Thirty-four reviewed jewelry FAQ pairs containing unsupported skin-suitability
assurances also receive exact-item composition guidance. The everyday-wear question
retains ring fit, finish and care advice. Each correction requires its original
slug, title and complete question/answer pair. Titles without `from Top Stores`
are permitted only for those exact records; this does not widen the suede or
waterproof rules. Other custom titles and cited source guidance are preserved. The rule does not match
broad care or water-related keywords or change reviewed guides, other FAQs, or
product data. Unfamiliar wording remains subject to separate review.
This is not a general fact-check of qualitative product advice. The same
publication data supplies HTML, metadata, FAQ schema and browser hydration;
source guides, product ordering, product facts, affiliate links, Pinterest feeds
and Stories are unchanged. This is a
site-wide rollout, not a controlled click-through experiment, and it does not
guarantee Google's chosen title/snippet or indexing.

The existing `laptop-stands` page also has a concise manufacturer-specification
comparison in its buying guide. `scripts/shop-nobi-laptop-comparison.js` requires
the exact reviewed listing name, brand, merchant, product ID and variant URL for
each row. A changed or removed listing loses its row and source; empty or
publication-filtered pages show no comparison. Prices and stock remain in the
unchanged product cards. The optional semantic table scrolls on narrow screens
and follows the guide's existing landing-experiment position. These specifications
are attributed references, not hands-on performance rankings.

The `womens-khaki-pants` page uses the same comparison layout with clothing-specific
headers. Its four reviewed models distinguish petite/tall hiking cuts, cotton-twill
wide-leg trousers and cotton reverse-sateen double-front pants. The unresolved
25-inch travel color is excluded from the comparison. Exact identity guards and
publication-filter suppression apply; no size availability, office suitability
or universal best ranking is inferred.

`scripts/prerender-shop.js` builds one page per Shop Nobi search at
`/shop/s/<slug>`, with the products in the HTML, one page per top category at
`/shop/c/<slug>`, and a list of popular searches on `/shop`. It also writes
`/shop/pins.xml`, an RSS feed with one item per search page, which Pinterest
reads to publish selected product Pins linking to existing search pages. It also writes one feed per top-level
category at `/shop/pins/<slug>.xml`, one for each Pinterest board, and lists
them with their item counts in `/shop/pins/index.json`. Pinterest has its own
selection in `scripts/shop-nobi-pin-selection.js`: explicitly available, priced
USD products with safe native photos; a relevant earning product is preferred
within the page's existing results. Product/photo identities are deduplicated
across board feeds, with alternate eligible products keeping distinct pages
represented. The pictured product supplies factual Pin copy, and mixed earning
pages start with `#ad` and the commission disclosure. Canonical GUIDs stay the
same; refresh times do not become publication dates. This does not change search
ranking, website cards, SEO previews or Web Stories.

`scripts/shop-nobi-editorial-copy.js` combines reviewed, page-specific buying
guidance dictionaries, including the original `sterling-silver-rings` guide.
The page writer applies each selected page's title,
description, guide and FAQs together to rendered HTML, metadata, structured data
and embedded browser content. Product facts, shopping links and snapshot dates
stay intact. The shared source plan, Pinterest feeds and Web Stories retain
their existing copy; replacements apply only to the explicitly selected search pages.
The same publication path supplies the `pencil-skirts` buying guide, replacing
the fixed price-range and general fabric-care advice with exact-item checks and
an invitation to enter preferences in the existing search box. Catalog prices,
product links, snapshot dates, feeds and Stories are unchanged.
The clothing/accessory copy module also covers fourteen observed-query pages:
`red-blouses`, `navy-cardigans`, `multicolor-sweaters`, `gray-cargo-pants`,
`yellow-midi-dresses`, `green-wallets`, `pink-swim-trunks`, `blue-navy-blouses`, `pink-hoodies` and
`charcoal-hoodies`, `navy-suits`, `blue-navy-suits`, `blue-navy-casual-dresses`
and `green-maxi-dresses`. Their guidance
distinguishes sizing, construction and variant choices, replaces unsupported
superlatives and care/performance claims, and suggests visitor-entered searches.
These edits do not certify stock, merchant claims or ranking improvements.
`shop-nobi-additional-buying-copy.js` covers `black-stud-earrings`,
`cream-rugs`, `brown-mini-dresses`, `sundresses`, `silver-watches` and
`black-maxi-dresses`, `amethyst-earrings`, `emerald-jewelry`, `brown-suede-boots`
`brown-boots`, `diamond-bangles`, `aquamarine-rings`, `mens-signet-rings`, `amethyst-jewelry`, `gold-white-bangles` and
`purple-violet-jewelry`, `gold-bracelets`, `blossom-jewelry`, `saw-accessories`,
`table-saw-accessories`, `miter-saw-accessories`, `ecru-puzzles`, `red-electric-guitars`, `mens-diamond-bracelets` and
`yellow-gold-diamond-earrings` through the same
publication-only path.
It replaces allergy-prevention and blanket cleaning claims with quantity,
measurement, component, size-variant and exact-item care checks. Saw guides
distinguish accessory systems from add-ons and category placement from verified
compatibility; they provide buying comparisons, not cutting or setup instructions.
The Ecru clarification uses the [maker FAQ](https://www.artifactpuzzles.com/pages/faq)
and [collection](https://www.artifactpuzzles.com/collections/ecru-puzzles) to distinguish
the named puzzle line from a color and separate difficulty from piece count.
Red electric guitar guidance distinguishes exact finish from a builder name,
compares condition and specifications, and avoids unsupported tone or tuning promises.
Men's diamond bracelet guidance separates link shape from stone coverage and
replaces universal stone, allergy and care claims with exact-item disclosures.
Yellow gold diamond earring comparisons clarify selling quantity, component
materials, dimensions, piercing requirements and the stated stone-weight basis.

The care, material, apparel, equipment and jewelry guide modules correct specific
observed claims against retained catalog records. The fit modules distinguish
product names from compatible models, material labels from care instructions,
and accessories from complete products. The accessory-identity module separates
bag charms from jewelry, selected metal construction from a color or karat label,
and exact sizing services from blanket resizing promises. These corrections do
not authenticate materials, establish skin suitability, or certify fresh stock.
The parameterized guide-review test checks removal of recorded defects and
agreement between visible copy, FAQ schema and browser hydration while retaining
product records, query and snapshot date.

The equipment-claim module also covers bicycle chains, hubs and shifters, tent footprints,
snowboard binding parts, camping lanterns, earplugs, electric massagers and beige/brown
electric guitars. Its buying guidance separates complete products from accessories,
exact compatibility from broad category names, and finish labels from materials. It
does not supply servicing procedures or unsupported safety and performance promises.

`scripts/shop-nobi-pin-editorial.js` records reviewed page/product/photo pairs,
with the reason and observed Pin. A reviewed page is omitted from Pinterest if
its chosen product or photo changes or becomes unavailable, until another hero
is reviewed. This does not ban its merchant or country of manufacture. URL
checks do not certify resolution or composition;
new native heroes still need visual review, including recognition at a 236px
card width. Source media stays intact. Existing published Pins are not promised
to update when RSS changes, and no feed reconnect or artificial GUID is used to
force a repost. Non-affiliate pages also receive pictured-product copy, without
a commission claim. Availability comes from the saved page snapshot; it is not
rechecked when Pinterest imports the item. Mature pages stay out of every feed.

Prebuilt CUCKOO cards use text, price and the existing product link, with the
programme's exact `Disclosure: Compensated Affiliate.` notice. Its current terms
require Awin-provided imagery, and no matching blender creative was found. The
normalized view omits CUCKOO pictures from HTML, embedded hydration data,
structured data and image-dependent previews, Stories and Pins. Stored catalogue
images remain intact, and other merchants keep their existing presentation.
This is a prebuilt-page rule, not certification of live assistant results,
every SKU's commission or other channels. Feed connections and canonical GUIDs
are unchanged; existing published Pins are not edited or deleted by this rule.

Prebuilt ESR product records are omitted while permission for the retained
product materials and published prices is unresolved. This happens before cards,
hydration, product schema, previews, Stories and Pin selection, so those surfaces
cannot retain a partial product promotion. Source catalog tuples, inclusion and
assigned links are untouched; this is not a store rejection or a live-search
filter. Generic guide text is not rewritten. Mixed pages retain the other cards;
an ESR-only page retains its editorial content without product records or
image-dependent Story/Pin items. No supplied homepage creative is presented as a
product link. Feed/board mappings and canonical GUID rules remain unchanged,
although eligible hero, frame and item sets can change. Existing Pins are not
removed or edited by this build rule.

The outside accounts behind this
(Search Console, Bing, IndexNow, Pinterest) are recorded in nobi-marketing's
[search engines and discovery sites doc](https://github.com/Locusive/nobi-marketing/blob/main/docs/search_engines_and_discovery_sites.md). It fetches the page data from
`https://api.nobi.ai/v1/shop/pages`. `SHOP_PAGES_API_URL` points the build at
another API base address. If the fetch fails, the build fails, so Cloudflare
keeps the last good deploy live.

The API may initially serve its previous answer while rebuilding the cached
listing. The build accepts listings up to 15 minutes old, accommodating the
API's ten-minute cache and a rebuild allowance. Older valid listings receive
at most four reads of the same route, two seconds apart, under one shared
60-second budget. Persistently old data, invalid generation times, HTTP errors
or malformed responses stop the build before any Shop pages or feeds are
written. No cache-bypass query or source mutation is used.

Related searches keep their existing prebuilt page links. If a known related
search falls outside the build's file limit, its link opens `/shop?q=...` with
the original query instead of becoming plain text or pointing to an unbuilt
page. Older embedded data falls back to the related search's title.

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
list holds every prebuilt product, in order: `productVariantId`, `isPaidLink`,
and `owningMerchantId` when the store is not Shop Nobi, which every event is posted
under. A product built before the API sent ids keeps its place with a null
`productVariantId`, and a page with no ids sends no event. The event's
`shownProductsStartPosition` is 1, so the product at list index `i` (from 0) is at
place `1 + i`, the `positionInGrid` its click sends. It carries `pageSlug` and the
collection name `Prebuilt search page`, so a report can tell it from the live
search. The build keeps a product's `productVariantId` and `owningMerchantId` only
when the API sent both as real ids, and prebuilt clicks then carry both too. The
same people-only rules apply.

Each search page with at least two short guide pages and two product pictures,
one of them a Shopify picture whose 3:4 cut is at least 640 by 853 pixels (the
build downloads the start of each poster to check), also gets a Google Web
Story at `/shop/stories/<slug>`, an AMP story built by
`scripts/shop-nobi-web-story-plan.js` and `scripts/shop-nobi-web-story.js`. It
shows a cover, the guide in pages of at most 180 characters, up to three
products with nofollow store links, questions that fit, and a last page that
links back to the search page with `utm_source=google_web_stories`. The search
CTA on the `sofas` story instead links to the `/shop` search home with
`utm_campaign=story_to_search` and `utm_content=sofas`, so a visitor must enter
their own query. Its product links remain available. The search page links to
its story, and `sitemap-shop.xml` lists the stories. Each store
link goes through `https://api.nobi.ai/v1/shop/story-go` with the plain store
link and the story's slug; the API counts the tap and forwards to the store,
through the store's affiliate link when one pays us. The story's amp-analytics
sends `https://api.nobi.ai/v1/shop/story-view` the slug and the id of each page
in view. A product page's id is `product-<place>-<variant id>-<store id>` when the
API sent both ids, and the API records that product as shown, with its place as
the event's `shownProductsStartPosition`; it ignores every
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

Every published Shop Nobi search page includes its eligible displayed product
photos in `sitemap-shop.xml`, deduplicated per page and capped at 1,000 images.
Existing merchant restrictions and unsafe-image filtering apply before sitemap
generation. Categories, Stories and image-free pages keep their normal URL
entries without product-image tags. Image discovery and indexing are not guaranteed;
Google documents Search Console verification for externally hosted image domains.

Search entries in `sitemap-shop.xml` use their resolved catalog/editorial modification date.
Other entries retain their own refresh/offer-check timestamp, with the API export time as a fallback.

The last build step, `scripts/submit-indexnow.js`, tells IndexNow (Bing, Yandex
and the other engines that share it) about new or changed Shop Nobi pages from
`sitemap-shop.xml` and NEW canonical authored pages from `sitemap-pages.xml`, including hubs and blog articles.
Shop pages are compared with the live sitemap by address and lastmod. Utilities
are selected from the authored sitemap and compared with the live
`utility-revisions.json`, which prerendering writes from each delivered HTML
page and its referenced local image bytes. This covers rendered facts,
metadata, disclosures, links and shared JS/CSS bundle fingerprints. A shared
bundle change can conservatively notify all utilities, but unchanged builds
and same-day content changes are distinguished without a build clock or git.
Utility sitemap entries omit lastmod rather than invent a modification date.
Existing nonutility authored pages are not replayed for date-only changes. Only
canonical HTTPS destinations on nobi.ai are accepted. Duplicate addresses are
removed before batching up to 10,000 URLs. The key file is `public/b20309cb84825b184afe0ffcf36630a7.txt`;
the key is public by design. Only a Cloudflare Pages build of `main` from the
real page data submits. Local builds, preview builds and builds with
`SHOP_PAGES_API_URL` skip it. An unreadable live Shop sitemap skips only Shop notifications;
unknown live authored sitemap metadata skips authored notifications, while unknown utility revisions skip only utilities, preserving new nonutility and Shop notifications. A missing built file,
incomplete revision artifact or failed submission remains visible in the build
log. A missing referenced local image stops prerendering. The IndexNow step
never fails the build and saves `dist/indexnow-submission-receipt.json` with exact public URLs, batch HTTP acceptance/failure and explicit skip reasons. No keys or response bodies are saved. Google sitemap submission is a separate authorized release operation; IndexNow does not notify Google or prove indexing. It runs before
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

## Gift chooser prototype

`/tools/gift-chooser` uses twelve source-dated product examples for coffee,
painting and charging. A visitor explicitly chooses an interest, per-item USD
budget and applicable preferences. The local filter returns up to three
explained options, including fewer or no options when constraints cannot be
met. It does not run a model, backend search or automatic query.

The main shopping link opens the actual existing Nobi collection, without
pretending the answers are carried over as filters. Native retailer URLs are
secondary source/details links; no affiliate template is constructed from
saved objects. An optional editable request can be copied into the supported
manual search at `https://nobi.ai/shop`. These absolute canonical handoffs also
keep a local preview from presenting fixture Shop results as real inventory.

`src/content/giftChooserProducts.js` holds the reviewed records and explanations;
`src/utils/giftChoice.js` handles native form data and selection. Prices and
availability are dated snapshots, not live quotes. Tests use actual product
records, native FormData and the actual React result component through Vite
SSR, plus the normal built page and utility-revision checks. They are not a
browser interaction test or verified purchase/commission evidence.

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

## Duvet dimension comparison

`/tools/duvet-cover-size` compares one insert with up to three covers. Entered
hundredths of an inch or centimetre normalize to integer micrometres, preserving
exact cross-unit equality and nonzero differences. Outputs compare each axis,
without a fit tolerance, automatic rotation or product ranking. Inputs remain
in component memory. The existing event sender receives only fixed completion
labels once per page mount after a valid comparison; normal local/crawler QA
is excluded. The internal shopping link retains existing acquisition tags and
a fixed tool marker, never dimensions. Event persistence and later report
completeness remain separate from the local delivery tests.

## USB-C shared power worksheet

`/tools/usb-c-power-check` compares two entered device targets with documented
simultaneous port outputs in integer tenths of a watt. Unknown outputs remain
unknown; the stated total never supplies a power split. Source examples apply
only to Apple’s named 35W dual-port adapter. The worksheet does not certify
compatibility, fast charging or safety. Inputs stay in component memory, with
no storage or input telemetry. Static controls remain disabled until JavaScript
is ready, avoiding a fallback form submission of the entered values.

## Phone case checklist

`/tools/phone-case-check` records shopper-entered phone and selected case identities,
self-reported listing evidence and separate optional charging/accessory questions.
Notes remain in component memory and reset to unanswered; the tool does not match
model names, certify compatibility, store notes or send a new analytics event.
Apple examples illustrate named models only. The `/shop` landing page links to it.

### Reviewed guide and FAQ corrections

The care, material, jewelry, apparel, equipment and safety `shop-nobi-*-guide-copy.js` modules contain
page-specific corrections for care, fiber composition, product format and sizing.
The shared editorial selector applies their metadata, visible guidance and FAQs
together. Publication filters still take priority: empty or filtered listings
cannot resurrect dependent inventory claims. These reviewed pages are a bounded
batch, not a claim that every catalog guide has been fact-checked.

The reviewed apparel and household comparison dictionaries add twenty targeted
guide/FAQ corrections through `shop-nobi-editorial-copy.js`. They distinguish
product types, exact composition, documented performance and model compatibility.
Product records, ranking, earning links and source queries remain unchanged.
`tests/shop-nobi-guide-review.test.js` checks removal of each retained legacy
claim and consistency across visible HTML, FAQ schema and browser data.
### Landing-page product-click experiment

Populated prebuilt search pages participate in `shop-landing-products-v1`.
A stable slug hash assigns each page to the existing guide-first layout or to
products-first with an early same-page search jump. Crawlers and browsers see
the same layout. Guide text, metadata, product ordering and earning links stay
unchanged. The jump focuses the existing live-search input without submitting
any query or navigating away from the original acquisition URL.

The existing product-display and prebuilt-click events carry `experimentId`,
`experimentVariant`, `pageSlug` and `landingVisitId`. The visit ID belongs to the
loaded document, does not identify a person, and needs no persistent storage.
A `nobi-analytics` listener remains mounted after live results replace the
prebuilt grid. It sends separate `Shop Nobi Landing Outcome` events for live
product-click intentions and submitted messages, never a duplicate legacy click/search.
Live click intentions count toward the primary measure only when joined to an
accepted canonical click with matching conversation, product and shopper within
a bounded time window. Unmatched intentions remain diagnostic. A message can
be a question, so message submission is not labeled a completed product search.
`Shop Nobi Refine Search` records successful focus of the search input. Existing
local/bot/automation suppression and smoke-test tagging apply to all events.

Read raw event partitions, not the current reporting view (which drops product
exposures and referrer fields). Count exposed visits with either kind of product
click, divided by exposed visits; retain separate prebuilt and live outcomes.
Filter known operator/test visits, retain missing-provenance counts, and never
call client-supplied Google referrers verified people. Compare complete periods,
page/query mix and cohort exposure; this is a page-level observational split,
not visitor randomization or a revenue result. The plan is in
`agents/feature_plans/shop_landing_product_conversion.md`.

### Teak set comparison

The existing teak outdoor furniture page compares three reviewed Outer models by
package contents, layout and ordering checks. Manufacturer model facts require exact
catalog identities; filtered or removed products cannot retain their comparison rows
or sources. No selected cushion color, current stock or offer is inferred. The catalog
records, search query, earning links and landing experiment remain unchanged.

### Cloth napkin comparison

The existing cloth napkin page compares three exact catalog models by format, set
count, dimensions and specific care instructions. Dinner and cocktail formats remain
distinct; linen composition does not imply common washing or drying instructions.
Unknown Matouk shape details are omitted. Exact identity and publication-filter gates
control each row and source, preserving product cards and landing allocation.

### Men’s silver chain model comparison

`shop-nobi-silver-chain-comparison.js` distinguishes sterling-silver and steel base metals, plating, chain construction and model length options using three manufacturer sources. Exact catalog identity gates and publication-filter suppression match the existing comparisons. Product cards and landing experiment allocation remain unchanged; the table does not guarantee pendant compatibility, durability or stock.

### Brown shirt model comparison

`shop-nobi-brown-shirt-comparison.js` compares documented fabric composition, cut and model-specific care for three shirts. Exact identity gates and publication-filter suppression preserve the existing comparison contract. All product records, source context and landing experiment allocation remain unchanged; model facts do not promise current stock, comfort or durability.

## Hand lotion comparison

The existing hand-lotion page compares two exact reviewed models by labeled
volume, scent description and labeled hand or hand-and-body use. It replaces
unsupported price-to-richness and botanical-benefit claims. Model rows and
references disappear when an identity changes or publication filtering applies.
Product cards, prices, links, ordering and landing-experiment allocation remain
unchanged. Manufacturer descriptions are dated evidence, not clinical tests or
current stock assurances.

## Audited product guidance

`shop-nobi-published-claim-copy.js` corrects ten existing bedding, phone-case,
children's apparel, jewelry, bowl, footwear and bath-soak pages. It replaces
unsupported health, weather, durability and universal care claims with
page-specific selection criteria. It adds no product specifications, ratings
or inventory assertions. Normal empty/filtered publication rules still apply;
product records, prices, links, order and landing assignment stay unchanged.

The separate `shop-nobi-catalog-fit-guide-copy.js` batch corrects ten more
existing pages. It distinguishes replacement storage lids from complete units,
Pearl names from decoration, selected colors and pack contents, and exact
intended use from category labels. Children’s necklace guidance requires maker
age and sizing information rather than a universal chain length. The shared
rendered tests cover both batches, including filtered and empty publication;
product cards, source data, feeds and landing assignment remain unchanged.

### One-model Bodum product comparison

`/shop/p/bodum-tribute-12076-57us-34oz` compares the reviewed Bodum Tribute
12076-57US, 34 oz seller variants. The normal current page export supplies
eligible identities and original outbound links. Its stored snapshot amounts
are not considered fresh offer observations. Only this page makes four bounded,
anonymous build-time GETs: each reviewed retailer's product JSON and currency
JSON. Exact IDs, SKU, title, capacity, USD, positive integer cents and single-unit
purchase terms must match. Errors and mismatches remove that seller option.
No merchant reads happen when the export lacks its exact eligible row.

A successful observation lasts 24 hours. Public static HTML always contains the
useful no-price fallback. Prerendering generates `generated/bodum-document.js`
outside `dist`; the narrow Pages Function imports that private document and
serves prices only within their observation window. Known aliases redirect to
the canonical route, and Function responses use `no-store` without validators.
Expired or invalid observations use the static fallback; browser display and
JSON-LD also expire while a page remains open. An empty eligible catalog leaves
a zero-seller `noindex` product page without sitemap or internal discovery links.

Two fresh matching offers produce one Product with AggregateOffer. There are no
invented reviews, availability guarantees or delivered-price claims. The initial
catalog links are direct tagged retailer links with `paidLink:false`; this test
measures visits and merchant click-outs, not established commissions. Existing
paid-link handling remains intact if future catalog records supply earning links.
The French-press category retains its products, ordering and landing assignment.

Offline coverage in `tests/shop-nobi-bodum-product.test.js` exercises source
validation, actual prerendering, removed identities, static/private separation,
expiry, aliases, HEAD/conditional headers, hydration and outbound attribution.
Run the full suite with the existing local page-data fixture server, never live
model-backed search. A normal `npm run build` generates the private document;
then `WRANGLER_SEND_METRICS=false npx --no-install wrangler pages dev dist
--ip 127.0.0.1 --port 4820 --compatibility-date 2026-10-28` previews the actual
Function. Vite alone serves the intentionally unpriced static fallback.

### Travel and gemstone guide corrections

Five existing guides (`suitcases`, `hunting-shooting-jackets`,
`14k-yellow-gold-huggie-earrings`, `ruby-rings`, and `ruby-earrings`) use reviewed
copy from `scripts/shop-nobi-travel-gemstone-guide-copy.js`. The guides compare
model measurements, intended use, package quantity and disclosed stone details
without inferring weather performance, comfortable fit or gemstone authenticity.
The existing publication filter still withholds guide and FAQ copy when products
are removed. Product cards, ordering, prices, links and experiment assignments
are unchanged. The consolidated published-claims matrices cover these five pages
alongside the previous thirty, including filtered and empty states.

### Apparel and pearl/silver guide corrections

`shop-nobi-apparel-pearl-guide-copy.js` supplies reviewed guidance for women's
white sweatpants, sterling silver bracelets, pearl rings, men's parkas and men's
blue T-shirts. It compares fit, disclosed construction, components and care
instructions without universal performance or material assurances. The existing
publication filter, product records, shopping links and experiment assignments
remain unchanged. The consolidated published-claims matrices now cover forty
pages, including filtered and empty states. Clear phone cases were excluded
because existing publication filtering already withholds their guide and FAQ.

### Wallet organization and carrying-clothing guides

`shop-nobi-red-wallet-comparison.js` adds a model-level wallet table for three
exact reviewed catalog identities. It compares sourced card pockets and closures,
omitting disputed dimensions and unverified Bosca/Zegna color mappings. Rows and
references disappear when the corresponding identity changes or publication is
filtered or empty. Product cards and tracked retailer destinations are unchanged.
`shop-nobi-bag-sweatpant-guide-copy.js` adds practical shoulder-bag and sweatpant
guidance without universal spray, durability, wicking or washing claims. The
same three published-claims matrices cover all forty-three reviewed pages,
including wallet identity mutations and filtered/empty publication.

### Appliance, eyewear and family-accessory guides

`shop-nobi-appliance-play-guide-copy.js` supplies reviewed guidance for espresso
accessories, men's black sunglasses, stroller accessories, water tables and rice
cookers. The copy distinguishes model compatibility, condition, package contents
and measurements without universal replacement, performance or certification
claims. Water-play basins are explicitly separated from the retained wooden
furniture listing. All product records, paid destinations, CUCKOO disclosures and
image restrictions remain unchanged. The existing three published-claims
matrices cover forty-eight pages, including filtered and empty publication.

### Leather sneaker shopping answers

`shop-nobi-leather-sneaker-answer.js` answers where-to-find questions using the
first displayed model from up to three distinct retailers, in existing card
order. Examples refresh with the displayed records and remain subject to the
normal filtered/empty publication rules. Size, upper, construction and care
guidance replaces unsupported material-quality, rain and resoling assurances.
The same three published-claims matrices now cover forty-nine pages, including
renamed and removed retailer examples; product records and destinations stay intact.

### Material and intended-use shopping guides

`shop-nobi-material-use-guide-copy.js` supplies eight existing guides with
practical comparisons of bag compartments and finishes, jewelry components,
bedding pieces, child sizing and office-mat uses. The copy avoids general
skin-safety, environmental, weather-performance and treatment assurances.
Product identities, order, prices, paid links, images, disclosures and landing
assignments stay unchanged. The same three published-claims matrices cover
these additions, including filtered and empty publication.

### Fit, configuration and care shopping guides

`shop-nobi-fit-care-guide-copy.js` supplies five existing guides for pencil
cases, red outerwear, red shoulder bags, black office furniture and blue
athletic shorts. The copy compares actual measurements, formats, closures,
configuration and garment care rather than inferring reliability or performance.
All product records and publication gates remain unchanged. The same three
published-claims matrices cover these additions alongside prior corrections.
### Ecru jigsaw puzzle line

`shop-nobi-ecru-jigsaw-copy.js` explains Artifact Puzzles’ Ecru line using its
official FAQ and collection references. It distinguishes the line’s matte images
and closer piece cuts from a beige artwork filter, then helps shoppers compare
piece count, difficulty, cut design and finished dimensions. No named product,
stock, price or mystery-puzzle feature is asserted in the guide. All twenty
retained cards, source records, destinations and landing assignment remain intact.
The existing three published-claims matrices cover the page and its filtered
and empty states; references are withheld with suppressed guidance.

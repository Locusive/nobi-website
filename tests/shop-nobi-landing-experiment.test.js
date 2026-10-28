import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPageRenderer } from '../scripts/page-renderer.js';
import { makeBrowser } from './fixtures/shop-nobi-click-browser.js';
import { handleProductLinkClick } from '../src/utils/shopNobiProductClick.js';
import { sendSearchPageShownProducts } from '../src/utils/shopNobiShownProducts.js';
import { focusLandingSearch, landingVariant, LandingExperimentId, watchLandingOutcomes } from '../src/utils/shopNobiLandingExperiment.js';

const Product = { name: 'Catalog product', url: 'https://example.com/item', productVariantId: 'known-variant', price: 10, currency: 'USD' };
const Page = { slug: 'boots', query: 'boots', title: 'Boots', description: 'Compare boots.', guide: ['Retained buying guidance.'], guideSources: [], faq: [], breadcrumbs: [], related: [], products: [Product] };

/** Add the actual EventTarget contract to the transport fixture. */
function eventBrowser(options) {
  const browser = makeBrowser(options);
  const events = new EventTarget();
  for (const method of ['addEventListener', 'removeEventListener', 'dispatchEvent']) browser[method] = events[method].bind(events);
  return browser;
}

/** Dispatch the public bundle contract; this does not call any search/model endpoint. */
function bundleEvent(browser, event, entryPoint = 'AI Search Bar', source = 'nobi') {
  browser.dispatchEvent(new CustomEvent('nobi-analytics', { detail: { event, source, timestamp: '2026-10-28T15:00:00Z', data: { entryPoint, conversationId: 'live-conversation', productVariantId: 'variant-123', productVariantInternalId: 'internal-456', shopperId: 'shopper-1' } } }));
}

test('exposure, prebuilt click and live outcomes share a visit and retain acquisition without duplicating legacy counts', () => {
  const browser = eventBrowser();
  const stop = watchLandingOutcomes(Page, browser);
  sendSearchPageShownProducts(Page, browser);
  handleProductLinkClick({ button: 0, currentTarget: { href: Product.url } }, { product: Product, position: 1, query: Page.query, slug: Page.slug, landingExperiment: true }, browser);
  bundleEvent(browser, 'Send Message');
  bundleEvent(browser, 'Click On Search Result');
  bundleEvent(browser, 'Displayed Product Collection');
  bundleEvent(browser, 'Click On Search Result', 'PDP Assistant');
  bundleEvent(browser, 'Click On Search Result', 'AI Search Bar', 'other');
  stop();
  bundleEvent(browser, 'Click On Search Result');
  assert.deepEqual(browser.beacons.map(({event}) => event.name), ['Displayed Product Collection', 'Click On Search Result', 'Shop Nobi Landing Outcome', 'Shop Nobi Landing Outcome']);
  const details = browser.beacons.map(({event}) => event.details);
  assert.ok(details[0].landingVisitId);
  for (const detail of details) {
    assert.equal(detail.landingVisitId, details[0].landingVisitId);
    assert.equal(detail.experimentId, LandingExperimentId);
    assert.equal(detail.experimentVariant, landingVariant(Page.slug));
    assert.equal(detail.pageSlug, Page.slug);
    assert.equal(detail.utm_source, 'pinterest');
    assert.equal(detail.referrer, 'https://www.google.com/');
  }
  assert.equal(details[3].outcomeConversationId, 'live-conversation');
  assert.equal(details[3].outcomeProductVariantId, 'variant-123');
  assert.equal(details[3].outcomeProductVariantInternalId, 'internal-456');
  assert.equal(details[3].outcomeShopperId, 'shopper-1');
  assert.equal(details[3].outcomeTimestamp, '2026-10-28T15:00:00Z');
  assert.deepEqual(details.slice(2).map(d=>d.outcome), ['message-submitted', 'product-click']);
  const next = eventBrowser();
  sendSearchPageShownProducts(Page, next);
  assert.notEqual(next.beacons[0].event.details.landingVisitId, details[0].landingVisitId);
});

test('live outcome capture keeps local, automated and smoke-test protections and ignores empty pages', () => {
  for (const options of [{webdriver:true}, {pageUrl:'http://localhost:5173/shop/s/boots'}, {userAgent:'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}]) {
    const browser = eventBrowser(options);
    watchLandingOutcomes(Page, browser);
    bundleEvent(browser, 'Click On Search Result');
    assert.equal(browser.beacons.length, 0);
  }
  const smoke = eventBrowser({smokeTestToken:'operator-check'});
  watchLandingOutcomes(Page, smoke);
  bundleEvent(smoke, 'Click On Search Result');
  assert.match(smoke.beacons[0].url, /nobi_smoke_test=operator-check/);
  const empty = eventBrowser();
  watchLandingOutcomes({...Page, products:[]}, empty);
  bundleEvent(empty, 'Send Message');
  assert.equal(empty.beacons.length, 0);
});

test('refinement focuses existing input without search submission or URL changes, with native anchor fallback', () => {
  for (const ready of [true,false]) {
    const browser = eventBrowser();
    let focus = 0, scroll = 0, prevented = 0;
    const original = browser.location.href;
    browser.document.querySelector = selector => {
      assert.equal(selector, '#shop-nobi-live-search [data-testid="message-input"]');
      return ready ? {focus:()=>focus++,scrollIntoView:()=>scroll++} : null;
    };
    focusLandingSearch({preventDefault:()=>prevented++}, Page.slug, browser);
    assert.equal(focus, Number(ready));
    assert.equal(scroll, Number(ready));
    assert.equal(prevented, Number(ready));
    assert.equal(browser.location.href, original);
    assert.deepEqual(browser.beacons.map(b=>b.event.name), ready?['Shop Nobi Refine Search']:[]);
  }
});

test('both built cohorts preserve products and guidance, treatment moves guidance after products with a same-page search path', async () => {
  const renderer = await loadPageRenderer();
  const render = renderer.renderPrebuiltPageBody;
  assert.equal(typeof render, 'function');
  const slugs = ['boots','boot'];
  assert.equal(new Set(slugs.map(landingVariant)).size, 2);
  const comparison = { caption: 'Setup comparison', note: 'Reviewed specifications.', rows: [{ model: 'Stand <A>', setup: 'Separate & folding', adjustment: 'Tilt', fit: 'Check device dimensions' }] };
  for (const slug of slugs) {
    const html = render({kind:'search-page',path:`/shop/s/${slug}`,data:{...Page,slug,comparison}});
    const product = html.indexOf('Catalog product');
    const guide = html.indexOf('Retained buying guidance.');
    assert.ok(product>0 && guide>0);
    const treatment = landingVariant(slug)==='products-first';
    assert.equal(product<guide,treatment);
    const table = html.indexOf('<table');
    assert.ok(table > guide, 'The comparison remains with the buying guide');
    assert.equal(product<table,treatment);
    assert.ok(html.includes('Stand &lt;A&gt;') && html.includes('Separate &amp; folding'));
    assert.ok(!html.includes('Stand <A>'));
    assert.ok(html.includes('overflow-x-auto') && html.includes('min-w-[40rem]'), 'Narrow screens can scroll the table without widening the page');
    assert.ok(html.includes('role="region" aria-label="Setup comparison" tabindex="0"'));
    const scrollRegion = html.indexOf('role="region" aria-label="Setup comparison"');
    const heading = html.indexOf('>Setup comparison</h2>');
    const note = html.indexOf('Reviewed specifications.</p>');
    assert.ok(heading > guide && heading < note && note < scrollRegion, 'The visible heading and note wrap outside the wide scrolling table');
    assert.ok(html.includes('<caption class="sr-only">Setup comparison</caption>'), 'The table retains its matching semantic caption');
    assert.match(html, /<p class="[^"]*sm:hidden">Scroll sideways to compare all details\.<\/p>/);
    assert.equal((html.match(/scope="col"/g) ?? []).length, 4);
    assert.ok(html.includes('scope="row"'));
    assert.equal(html.includes('Search for something more specific'),treatment);
    assert.ok(html.includes('id="shop-nobi-live-search"'));
    assert.ok(html.includes('href="https://example.com/item"'));
  }
});

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildBodumProductPage, BodumSellers } from '../scripts/shop-nobi-bodum-product.js';
import { buildSearchPages } from '../scripts/shop-nobi-search-page-view.js';
import { buildShopNobiSitemap } from '../scripts/shop-nobi-search-page-listings.js';
import { serveBodumDocument } from '../scripts/shop-nobi-product-response.js';
import { BodumPath, BodumSlug, OfferLifetimeMs, buildProductPageSeo, withoutProductPrices } from '../src/utils/shopNobiProductPage.js';
import { readEmbeddedPrebuiltContent, PrebuiltContentKind } from '../src/utils/shopNobiPrebuiltContent.js';
import { handleProductLinkClick } from '../src/utils/shopNobiProductClick.js';
import { encodePaidLink } from '../src/utils/shopNobiPaidLink.js';
import { makeBrowser } from './fixtures/shop-nobi-click-browser.js';
import { readScriptJson, makeDistCopy, prerenderWith } from './shop-nobi-test-build.js';

const Fixture = JSON.parse(readFileSync(new URL('./fixtures/bodum-product.json', import.meta.url)));

/** Offline source responses exercise the real build boundary without any merchant request. */
function offerSource(change = () => {}, currency = 'USD') {
  const requests = [];
  return { requests, fetchOffer: async (url, options) => {
    requests.push({ url, options });
    const index = BodumSellers.findIndex(seller => url.startsWith(seller.origin));
    assert.ok(index >= 0);
    if (url.endsWith('/cart.js')) return Response.json({ currency });
    const data = structuredClone(Fixture.merchantProducts[index]);
    change(data, index);
    return Response.json(data);
  } };
}

/** Normalizes the same dated catalog records as production, with no source mutation. */
function normalized(raw = Fixture.page) { return buildSearchPages([raw], 1).pages; }

async function makePage(source = offerSource(), pages = normalized(), now = Date.now()) {
  return buildBodumProductPage(pages, { ...source, now: () => now, rawPages: [Fixture.page] });
}

test('exact current offers replace snapshot prices while preserving eligible identity, links and catalog', async () => {
  const pages = normalized();
  const before = structuredClone(pages);
  const source = offerSource(data => { data.variants[0].price += 123; });
  const now = Date.now();
  const page = await makePage(source, pages, now);
  assert.equal(page.products.length, 2);
  assert.deepEqual(page.products.map(product => product.price), [41.22, 51.18]);
  assert.equal(source.requests.length, 4);
  assert.ok(source.requests.every(({ options }) => options.credentials === 'omit' && options.redirect === 'error' && !options.headers));
  assert.deepEqual(pages, before);
  assert.deepEqual(page.products.map(product => product.taggedStoreLink), Fixture.page.products.map(product => product.storeLink));
  const schema = buildProductPageSeo(page, now).schema.find(item => item['@type'] === 'Product');
  assert.equal(schema.mpn, '12076-57US');
  assert.deepEqual([schema.offers.lowPrice, schema.offers.highPrice, schema.offers.offerCount], [41.22, 51.18, 2]);
  assert.ok(schema.offers.offers.every(offer => !('availability' in offer)));
  assert.ok(!schema.review && !schema.aggregateRating);
  assert.equal(buildProductPageSeo(page, now + OfferLifetimeMs).schema.length, 1);
});

test('changed, removed and unverified identities or source terms cannot create stale offers', async () => {
  for (const field of ['name', 'brand', 'url', 'productVariantId', 'owningMerchantId', 'storeName']) {
    const pages = normalized(); pages[0].products[0][field] += '-changed';
    const result = await makePage(offerSource(), pages);
    assert.equal(result.products.length, 1, field);
    assert.equal(buildProductPageSeo(result).schema.length, 1);
  }
  for (const change of [
    data => { data.id++; }, data => { data.title += ' Other'; }, data => { data.vendor = 'Other'; },
    data => { data.handle += '-other'; }, data => { data.description = '12 oz capacity'; },
    data => { data.variants[0].id++; }, data => { data.variants[0].sku = 'other'; },
    data => { data.variants[0].title = 'Other'; }, data => { data.variants[0].available = false; },
    data => { data.variants[0].price = -1; }, data => { data.variants[0].price = 42.2; },
    data => { data.requires_selling_plan = true; }, data => { data.variants[0].requires_selling_plan = true; },
    data => { data.variants[0].quantity_rule.min = 2; }, data => { data.variants[0].quantity_rule.increment = 2; },
    data => { data.variants.push(structuredClone(data.variants[0])); },
  ]) assert.equal((await makePage(offerSource(change))).products.length, 0, change.toString());
  for (const source of [offerSource(() => {}, 'CAD'), { fetchOffer: async () => new Response('', { status: 403 }) },
    { fetchOffer: async () => { throw new Error('Unavailable'); } }]) {
    const result = await makePage(source);
    assert.deepEqual(result.products, []);
    assert.equal(result.offersCheckedAt, null);
  }
  const noRequests = { fetchOffer: () => { throw new Error('Must not read excluded catalog'); } };
  assert.deepEqual((await makePage(noRequests, [])).products, []);
  const duplicate = normalized(); duplicate[0].products.push(duplicate[0].products[0]);
  assert.equal((await makePage(offerSource(), duplicate)).products.length, 1);
});

test('real render keeps public static assets unpriced, private offers visible and sitemap canonical', async () => {
  const folder = makeDistCopy();
  const privateFolder = mkdtempSync(join(tmpdir(), 'bodum-private-'));
  try {
    const page = await makePage();
    const pages = normalized().map(item => ({ ...item, productComparisonPath: BodumPath }));
    const documentPath = join(privateFolder, 'private-document.mjs');
    await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [Fixture.page], retired: [] } }, folder, { ...offerSource(), privateDocumentPath: documentPath, now: () => Date.parse(page.offersCheckedAt) });
    const fallback = readFileSync(join(folder, `${BodumPath}.html`), 'utf8');
    const { default: document } = await import(`file://${documentPath}`);
    for (const html of [fallback, document.html]) {
      assert.match(html, /scope="col"/); assert.match(html, /scope="row"/);
      assert.match(html, /aria-label="View at Seattle Coffee Gear"/); assert.match(html, /34 oz/);
      assert.ok(html.indexOf('id="seller-heading"') < html.indexOf('id="capacity-heading"'), "Seller choices precede the capacity explanation");
      assert.match(html, /canonical" href="https:\/\/nobi.ai\/shop\/p\/bodum-tribute-12076-57us-34oz/);
      assert.doesNotMatch(html, /exactly 4 US|two places|Both seller/);
    }
    assert.match(document.html, /AggregateOffer/);
    assert.match(document.html, /\$39\.99/);
    assert.doesNotMatch(fallback, /AggregateOffer|\$39\.99|\$49\.95/);
    const embedded = readScriptJson(fallback, 'shop-nobi-prebuilt-content');
    assert.deepEqual(embedded.data, withoutProductPrices(page));
    assert.match(readFileSync(join(folder, 'sitemap-shop.xml'), 'utf8'), new RegExp(BodumPath));
    assert.match(readFileSync(join(folder, 'shop/s/french-presses.html'), 'utf8'), new RegExp(BodumPath));
    const sitemap = buildShopNobiSitemap([], pages, [], '2026-10-28', page);
    assert.equal(sitemap.split(`<loc>https://nobi.ai${BodumPath}</loc>`).length - 1, 1);
    assert.doesNotMatch(buildShopNobiSitemap([], [], [], '2026-10-28', { products: [] }), new RegExp(BodumPath));
    await prerenderWith({ body: { generatedAt: new Date().toISOString(), pages: [], retired: [] } }, folder, { fetchOffer: () => { throw new Error('No eligible catalog rows'); }, privateDocumentPath: documentPath });
    const removedHtml = readFileSync(join(folder, `${BodumPath}.html`), 'utf8');
    assert.match(removedHtml, /no verified seller choices/);
    assert.match(removedHtml, /noindex, nofollow/);
    assert.doesNotMatch(removedHtml, /AggregateOffer|\$39\.99/);
    assert.doesNotMatch(readFileSync(join(folder, 'sitemap-shop.xml'), 'utf8'), new RegExp(BodumPath));
  } finally { rmSync(folder, { recursive: true, force: true }); rmSync(privateFolder, { recursive: true, force: true }); }
});

test('edge freshness and conditional HEAD handling cannot expose expired amounts through aliases', async () => {
  const now = Date.now();
  const page = await makePage(offerSource(), normalized(), now);
  const document = { ...page, html: '<html>fresh $39.99</html>' };
  const requests = [];
  const context = (path = BodumPath, method = 'GET') => ({
    request: new Request(`https://nobi.ai${path}`, { method, headers: { 'If-None-Match': 'old-price', Cookie: 'private' } }),
    next: async () => new Response('static fallback'),
    env: { ASSETS: { fetch: async request => { requests.push(request); return new Response('<html>Check at store</html>', { headers: { ETag: 'old', 'Last-Modified': 'yesterday' } }); } } },
  });
  for (const [offset, expected] of [[0, true], [OfferLifetimeMs - 1, true], [OfferLifetimeMs, false], [-1, false]]) {
    const response = await serveBodumDocument(context(), document, now + offset);
    assert.equal((await response.text()).includes('$39.99'), expected);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('ETag'), null);
    assert.equal(response.headers.get('Last-Modified'), null);
  }
  for (const invalid of [null, { ...document, offersExpireAt: 'invalid' }, { ...document, offersExpireAt: new Date(now + 1000).toISOString() }]) {
    assert.match(await (await serveBodumDocument(context(), invalid, now)).text(), /Check at store/);
  }
  for (const suffix of ['/', '.html', '/index.html']) {
    const response = await serveBodumDocument(context(BodumPath + suffix), document, now);
    assert.equal(response.status, 308); assert.equal(response.headers.get('Location'), `https://nobi.ai${BodumPath}`);
  }
  for (const offset of [0, OfferLifetimeMs]) assert.equal(await (await serveBodumDocument(context(BodumPath, 'HEAD'), document, now + offset)).text(), '');
  assert.equal((await serveBodumDocument(context(BodumPath, 'POST'), document, now)).status, 405);
  assert.equal(await (await serveBodumDocument(context('/shop/p/internal-fresh.html'), document, now)).text(), 'static fallback');
  assert.ok(requests.every(request => !request.headers.has('Cookie') && !request.headers.has('If-None-Match')));
});

test('expired embedded data and direct or future paid clicks preserve model identity and page context', async () => {
  const page = await makePage();
  const oldDocument = globalThis.document;
  try {
    globalThis.document = { getElementById: () => ({ textContent: JSON.stringify({ kind: PrebuiltContentKind.ProductPage, path: BodumPath,
      data: { ...page, offersCheckedAt: '2020-01-01T00:00:00Z', offersExpireAt: '2020-01-02T00:00:00Z' } }) }) };
    const embedded = readEmbeddedPrebuiltContent(BodumPath);
    assert.ok(embedded.data.products.every(product => product.price === null));
    assert.equal(buildProductPageSeo(embedded.data).schema.length, 1);
  } finally { globalThis.document = oldDocument; }
  for (const paidLink of [false, true]) {
    const browser = makeBrowser({ pageUrl: `https://nobi.ai${BodumPath}` });
    const product = { ...page.products[0], paidLink, ...(paidLink ? { encodedStoreLink: encodePaidLink('https://www.awin1.com/cread.php?awinmid=1&clickref=shop_nobi&ued=https%3A%2F%2Fseattlecoffeegear.com') } : {}) };
    const event = { button: 0, currentTarget: { href: product.url } };
    handleProductLinkClick(event, { product, position: 1, query: page.query, slug: BodumSlug }, browser);
    const details = browser.beacons[0].event.details;
    assert.equal(details.productVariantId, product.productVariantId);
    assert.equal(details.pageUrl, `https://nobi.ai${BodumPath}`);
    assert.equal(details.isPaidLink, paidLink);
    if (paidLink) assert.match(event.currentTarget.href, /awin1\.com/);
    else assert.equal(event.currentTarget.href, Fixture.page.products[0].storeLink);
  }
});

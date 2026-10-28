import { BaseUrl, ShopNobiImage } from './shopNobiPage.js';
import { buildBreadcrumbSchema } from './shopNobiStructuredData.js';

export const BodumSlug = 'bodum-tribute-12076-57us-34oz';
export const BodumPath = `/shop/p/${BodumSlug}`;
export const OfferLifetimeMs = 24 * 60 * 60 * 1000;

/** Uses the same bounded observation window in the build, browser and edge response. */
export function hasCurrentProductOffers(page, now = Date.now()) {
  const observed = Date.parse(page?.offersCheckedAt);
  const expires = Date.parse(page?.offersExpireAt);
  return Number.isFinite(observed) && Number.isFinite(expires) && observed <= now
    && expires > now && expires - observed === OfferLifetimeMs;
}

/** Removes expired amounts from both visible seller choices and embedded browser data. */
export function withoutProductPrices(page) {
  return { ...page, offersCheckedAt: null, offersExpireAt: null,
    products: page.products.map(product => ({ ...product, price: null, currency: null })) };
}

/** Describes one actual model, never a category grid or range of different variants. */
export function buildProductPageSeo(page, now = Date.now()) {
  const url = `${BaseUrl}${BodumPath}`;
  const schema = [buildBreadcrumbSchema([
    { name: 'French presses', url: `${BaseUrl}/shop/s/french-presses` },
    { name: page.title, url },
  ])];
  const priced = page.products.filter(product => Number.isFinite(product.price) && product.price > 0 && product.currency === 'USD');
  if (hasCurrentProductOffers(page, now) && priced.length === 2) {
    schema.push({ '@context': 'https://schema.org', '@type': 'Product', name: 'Bodum Tribute Double Wall French Press, 34 oz',
      description: page.description, url, brand: { '@type': 'Brand', name: 'Bodum' }, mpn: '12076-57US',
      ...(priced[0].imageUrl ? { image: priced[0].imageUrl } : {}),
      offers: { '@type': 'AggregateOffer', priceCurrency: 'USD',
        lowPrice: Math.min(...priced.map(product => product.price)),
        highPrice: Math.max(...priced.map(product => product.price)), offerCount: priced.length,
        offers: priced.map(product => ({ '@type': 'Offer', price: product.price, priceCurrency: 'USD',
          url: product.url, seller: { '@type': 'Organization', name: product.storeName } })),
      },
    });
  }
  return { title: `${page.title} | Shop Nobi`, description: page.description, path: BodumPath,
    image: page.products.find(product => product.imageUrl)?.imageUrl ?? ShopNobiImage,
    noindex: page.products.length === 0, schema };
}

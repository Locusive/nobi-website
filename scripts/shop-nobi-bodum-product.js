import { BodumSlug, OfferLifetimeMs } from '../src/utils/shopNobiProductPage.js';

const ProductName = 'Bodum Tribute Double Wall French Press';
/** Exact reviewed single-unit variants; prices are intentionally absent from this identity map. */
export const BodumSellers = [
  { storeName: 'Seattle Coffee Gear', merchantId: 'a4d716d5-f252-49b4-ba1a-e64dd17a04ee',
    variantId: 'c76e9271-1ea1-4fbd-8d6d-4b0046d20aa9', shopifyProductId: 10212922884403,
    shopifyVariantId: 53465563562291, sku: 'CFP861P0400', handle: 'bodum-tribute-double-wall-french-press',
    url: 'https://seattlecoffeegear.com/products/bodum-tribute-double-wall-french-press?variant=53465563562291',
    origin: 'https://www.seattlecoffeegear.com' },
  { storeName: 'Kitchen Kapers', merchantId: 'e310fff6-9a8c-4654-8e78-eca20e7d28a5',
    variantId: 'f01d6eb1-68ad-48d8-9225-59756887fa98', shopifyProductId: 8287876513988,
    shopifyVariantId: 44936103723204, sku: '46151', handle: 'bodum-tribute-double-wall-ss-8-cup-french-press',
    url: 'https://www.kitchenkapers.com/products/bodum-tribute-double-wall-ss-8-cup-french-press?variant=44936103723204',
    origin: 'https://www.kitchenkapers.com' },
];

/** Builds only this reviewed model from currently eligible catalog rows and bounded anonymous source reads. */
export async function buildBodumProductPage(searchPages, { fetchOffer = fetch, now = Date.now, rawPages = [] } = {}) {
  const source = searchPages.find(page => page.slug === 'french-presses');
  const products = [];
  const checkedAt = now();
  for (const seller of BodumSellers) {
    const matches = (source?.products ?? []).filter(product => matchesSeller(product, seller));
    if (matches.length !== 1) continue;
    const product = { ...matches[0], price: null, currency: null };
    const rawProduct = rawPages.find(page => page.slug === 'french-presses')?.products?.find(row => row.productVariantId === seller.variantId);
    if (rawProduct?.storeLink && !product.paidLink) product.taggedStoreLink = readMatchingTaggedLink(rawProduct.storeLink, seller.url);
    try {
      const data = await readPublicJson(`${seller.origin}/products/${seller.handle}.js`, fetchOffer);
      const cart = await readPublicJson(`${seller.origin}/cart.js`, fetchOffer);
      const price = readExactOffer(data, cart, seller);
      if (price === null) continue;
      Object.assign(product, { price, currency: 'USD' });
    } catch {
      // An unavailable or changed source cannot publish a stale offer or a newly unverified model.
      continue;
    }
    products.push(product);
  }
  const hasPrice = products.some(product => product.price !== null);
  return { slug: BodumSlug, query: 'Bodum Tribute 12076-57US 34 oz French press',
    title: 'Bodum Tribute 34 oz French Press: Compare Sellers',
    description: 'Compare seller options for the Bodum Tribute 12076-57US French press. Understand its 34 oz capacity and the 8-cup label before choosing a retailer.',
    products, offersCheckedAt: hasPrice ? new Date(checkedAt).toISOString() : null,
    offersExpireAt: hasPrice ? new Date(checkedAt + OfferLifetimeMs).toISOString() : null };
}

/** Requires the exact retained identity, leaving earning-link fields and source data untouched. */
function matchesSeller(product, seller) {
  return product.name === ProductName && product.brand === 'Bodum' && product.url === seller.url
    && product.productVariantId === seller.variantId && product.owningMerchantId === seller.merchantId
    && product.storeName === seller.storeName;
}

/** Public anonymous reads have no credentials, cookies, retries or alternate clients. */
async function readPublicJson(url, fetchOffer) {
  const response = await fetchOffer(url, { credentials: 'omit', redirect: 'error', signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Offer source unavailable');
  return response.json();
}

/** Rejects changed variants, capacity, currency and nonpositive/nonintegral minor-unit amounts. */
function readExactOffer(data, cart, seller) {
  if (data?.id !== seller.shopifyProductId || data.title !== ProductName || data.vendor !== 'Bodum'
    || data.handle !== seller.handle || cart?.currency !== 'USD'
    || !/34\s*(?:oz\.?|ounce)/i.test(data.description ?? '')) return null;
  const variants = (Array.isArray(data.variants) ? data.variants : []).filter(variant => variant.id === seller.shopifyVariantId);
  if (variants.length !== 1) return null;
  const variant = variants[0];
  const rule = variant.quantity_rule;
  if (data.requires_selling_plan === true || variant.requires_selling_plan === true
    || (rule && (rule.min !== 1 || rule.increment !== 1 || (rule.max !== null && rule.max < 1)))) return null;
  return variant.sku === seller.sku && variant.title === 'Default Title' && variant.available === true
    && Number.isSafeInteger(variant.price) && variant.price > 0 ? variant.price / 100 : null;
}

/** Retains only the catalog's direct link to this exact destination, including its acquisition tags. */
function readMatchingTaggedLink(value, canonical) {
  try {
    const parsed = new URL(value);
    for (const key of [...parsed.searchParams.keys()]) if (key.startsWith('utm_')) parsed.searchParams.delete(key);
    return parsed.href === canonical ? value : null;
  } catch { return null; }
}

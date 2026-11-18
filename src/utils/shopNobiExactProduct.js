const VariantIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** A shareable exact catalog item. The page never starts a search. */
export function exactProductPath(variantId) {
  return VariantIdPattern.test(variantId || '') ? `/shop/item/${variantId}` : null;
}

export function exactProductApiUrl(variantId) {
  return exactProductPath(variantId) ? `https://api.nobi.ai/v1/shop/products/${variantId}` : null;
}

/** Accept only the requested, currently eligible variant and its Nobi click redirect. */
export function readExactProductCard(payload, variantId) {
  if (payload?.variantId !== variantId || !payload.product?.inStock) return null;
  const product = payload.product;
  if (!product.name || !product.store || !Number.isFinite(product.price) || product.price <= 0) return null;
  try {
    const url = new URL(product.url);
    if (url.origin !== 'https://api.nobi.ai' || !url.pathname.startsWith('/v1/shop/go/')) return null;
  } catch { return null; }
  return { ...product, paidLink: Boolean(product.paidLink) };
}

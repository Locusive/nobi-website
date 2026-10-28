import React from 'react';
import { handleProductLinkClick } from '../../utils/shopNobiProductClick.js';
import { formatPrice } from '../../utils/shopNobiSearchPage.js';
import { readStoreLinkRel } from '../../utils/shopNobiPage.js';
import { LiveSearchAnchor, focusSearchInput } from '../../utils/shopNobiLandingExperiment.js';

/** One model and its verified seller choices, with the same outbound events as existing product cards. */
export default function ShopNobiProductPageContent({ page }) {
  return <main className="mx-auto max-w-5xl px-4 py-8 text-black dark:text-white">
    <nav aria-label="Breadcrumb" className="text-sm"><a href="/shop" className="underline">Shop Nobi</a> / <a href="/shop/s/french-presses" className="underline">French presses</a></nav>
    <h1 className="mt-5 max-w-3xl text-3xl font-semibold">{page.title}</h1>
    <p className="mt-3 max-w-3xl text-black/70 dark:text-white/70">Compare retailer options for the Bodum Tribute Double Wall French Press, model 12076-57US, with a stated capacity of 34 oz.</p>
    <section className="mt-8 rounded-xl border border-black/15 dark:border-white/20" aria-labelledby="seller-heading">
      <div className="p-4"><h2 id="seller-heading" className="text-xl font-semibold">Compare seller choices</h2>
        <p className="mt-2 text-sm">Item prices exclude shipping and tax. Compare each retailer's final total, delivery estimate and return terms before choosing.</p>
        {page.offersCheckedAt && <p className="mt-2 text-sm">Prices checked {new Date(page.offersCheckedAt).toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' })} UTC. Confirm the current price at the store.</p>}
</div>
      {page.products.length ? <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Seller comparison">
        <table className="w-full text-left text-sm"><caption className="sr-only">Bodum Tribute 12076-57US, 34 oz seller comparison</caption>
          <thead><tr className="border-t border-black/10 dark:border-white/20"><th className="p-3 sm:p-4" scope="col">Seller</th><th className="hidden p-4 sm:table-cell" scope="col">Model and capacity</th><th className="p-3 sm:p-4" scope="col">Item price</th><th className="p-3 sm:p-4" scope="col">Retailer</th></tr></thead>
          <tbody>{page.products.map((product, index) => <tr key={product.productVariantId} className="border-t border-black/10 dark:border-white/20">
            <th className="p-3 font-medium sm:p-4" scope="row">{product.storeName}</th><td className="hidden p-4 sm:table-cell">12076-57US<br />34 oz</td>
            <td className="p-3 sm:p-4">{product.price === null ? 'Check at store' : formatPrice(product.price, product.currency)}</td>
            <td className="p-3 sm:p-4"><a className="underline" aria-label={`View at ${product.storeName}`} href={product.taggedStoreLink || product.url} target="_blank" rel={readStoreLinkRel(product.paidLink)}
              onClick={event => handleProductLinkClick(event, { product, position: index + 1, query: page.query, slug: page.slug })}
              onAuxClick={event => handleProductLinkClick(event, { product, position: index + 1, query: page.query, slug: page.slug })}>View</a></td>
          </tr>)}</tbody>
        </table></div> : <p className="p-4">There are no verified seller choices to show right now. Browse other French presses or search for the model below.</p>}
    </section>
    <section className="mt-7 grid gap-6 sm:grid-cols-[180px_1fr]" aria-labelledby="capacity-heading">
      {page.products[0]?.imageUrl && <img src={page.products[0].imageUrl} alt="Bodum Tribute Double Wall French Press" width="180" height="180" className="h-44 w-44 object-contain" />}
      <div><h2 id="capacity-heading" className="text-xl font-semibold">34 oz and the 8-cup label</h2>
        <p className="mt-2">The 8-cup label uses the retailer's serving convention. It does not mean eight 8 oz mugs. Compare the stated 34 oz volume when deciding how many servings you need.</p>
        <p className="mt-2">This comparison identifies one model and capacity. Check the model number and selected item on the retailer's page before ordering.</p></div>
    </section>
    <section className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold">Which retailer should I choose?</h2>
      <p className="mt-2">Start with the item price, then compare shipping to your address, the promised delivery date and the return policy. A lower item price may not mean a lower order total. Shop Nobi helps you compare; your order is placed with the retailer.</p>
      <h2 className="mt-6 text-xl font-semibold">Looking for a different capacity or style?</h2>
      <p className="mt-2"><a href="/shop/s/french-presses" className="underline">Browse French presses</a> or <a href={`#${LiveSearchAnchor}`} onClick={event => focusSearchInput(event)} className="underline">enter your own search below</a>. Include the capacity, material or model you want to compare.</p>
    </section>
  </main>;
}

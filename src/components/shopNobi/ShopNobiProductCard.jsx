import React from "react";
import { handleProductLinkClick } from "../../utils/shopNobiProductClick";
import { formatPrice } from "../../utils/shopNobiSearchPage";
import { CommissionNotice, readStoreLinkRel } from "../../utils/shopNobiPage";

/**
 * One product: its picture, name, store and price, linking to the store's page in a new tab. A click sets the link to
 * open and is counted. A marked-down product shows the store's earlier price struck through before its price now.
 *
 * @param {{product: object, position: number, query: string, slug: string}} props The product, its place, its search and slug.
 */
export default function ShopNobiProductCard({ product, position, query, slug }) {
  const handleClick = (event) => handleProductLinkClick(event, { product, position, query, slug });

  return (
    <li>
      <a
        href={product.url}
        rel={readStoreLinkRel(product.paidLink)}
        target="_blank"
        onClick={handleClick}
        onAuxClick={handleClick}
        className="group block"
      >
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} loading="lazy" className="aspect-square w-full rounded-lg bg-black/5 object-cover" />
        )}
        <p className="mt-2 text-sm font-medium group-hover:underline">{product.name}</p>
      </a>
      {product.storeName && <p className="text-sm text-black/60 dark:text-white/60">{product.storeName}</p>}
      <Price product={product} />
      {product.paidLink && <p className="mt-1 text-[10px] leading-tight text-black/40 dark:text-white/40">{CommissionNotice}</p>}
    </li>
  );
}

/** The price now, after the store's own earlier price when the product is marked down. */
function Price({ product }) {
  const price = formatPrice(product.price, product.currency);
  if (!price) {
    return null;
  }
  if (typeof product.wasPrice !== "number") {
    return <p className="text-sm font-semibold">{price}</p>;
  }

  return (
    <p className="text-sm">
      <span className="sr-only">Was </span>
      <s className="text-black/50 dark:text-white/50">{formatPrice(product.wasPrice, product.currency)}</s>{" "}
      <span className="sr-only">now </span>
      <span className="font-semibold">{price}</span>
    </p>
  );
}

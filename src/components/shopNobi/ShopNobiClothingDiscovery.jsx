import React from "react";
import { searchPagePath } from "../../utils/shopNobiSearchPage";

/** Persistent, quiet browsing links below the live search on the shop and clothing landing pages. */
export default function ShopNobiClothingDiscovery({ choices = [] }) {
  if (choices.length === 0) return null;

  return (
    <nav aria-labelledby="clothing-discovery-heading" className="mx-auto max-w-6xl px-4 py-8 text-black dark:text-white">
      <h2 id="clothing-discovery-heading" className="text-lg font-semibold">Browse clothing by colour & style</h2>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {choices.map(({ slug, label }) => (
          <li key={slug}>
            <a href={searchPagePath(slug)} className="inline-block rounded text-sm text-black/70 underline decoration-black/20 underline-offset-4 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-white/70 dark:decoration-white/30 dark:hover:text-white">{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

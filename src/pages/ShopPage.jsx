// src/pages/ShopPage.jsx
import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/home/Nav";
import ShopNobiSearchPageContent from "../components/shopNobi/ShopNobiSearchPageContent";
import "../components/home/homepage.css";
import { useAdoptedAssistantContainer } from "../hooks/useAdoptedAssistantContainer";
import { useSEO } from "../hooks/useSEO";
import { buildSearchPageSeo, readEmbeddedSearchPage } from "../utils/shopNobiSearchPage";

// The same metadata and structured data prerender-pages.js bakes into the
// static head, so React keeps them after it mounts instead of wiping them.
const ShopPageSeo = {
  title: "Shop Nobi | Nobi",
  description:
    "The best products from the best stores online, in one search. Shop Nobi is a search engine: you buy directly from the store.",
  path: "/shop",
  image: "https://nobi.ai/shop-nobi-og-image.png",
  // Crawlers may index this page but must not follow product links, which would count as visits to the stores.
  nofollow: true,
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Nobi",
      url: "https://nobi.ai",
      logo: "https://nobi.ai/og-image.png",
    },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Shop Nobi", url: "https://nobi.ai/shop" },
  ],
};

/**
 * The Shop Nobi page: the site's header, scrolling away with the page instead of pinned to the top, with the
 * search experience the assistant bundle boots on /shop moved into the slot under it. On a prebuilt search page
 * (/shop/s/<slug>) the slot shows that page's products until the live search arrives.
 *
 * @param {{searchPage?: object}} props The build passes the search page data; in the browser it comes from the HTML.
 */
export default function ShopPage({ searchPage: builtSearchPage = null }) {
  const slotRef = useRef(null);
  const assistantHasMounted = useAdoptedAssistantContainer(slotRef);
  const { pathname } = useLocation();
  const embeddedSearchPage = useMemo(() => readEmbeddedSearchPage(pathname), [pathname]);
  const searchPage = builtSearchPage || embeddedSearchPage;

  useSEO(searchPage ? buildSearchPageSeo(searchPage) : ShopPageSeo);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <header>
        <Nav active="shop" pinned={false} />
      </header>
      <div ref={slotRef}>
        {!assistantHasMounted && (searchPage ? <ShopNobiSearchPageContent page={searchPage} /> : <LoadingMessage />)}
      </div>
    </div>
  );
}

/** Shown on /shop until the live search arrives. */
function LoadingMessage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-black/60 dark:text-white/60">
      <p>Loading Shop Nobi…</p>
    </div>
  );
}

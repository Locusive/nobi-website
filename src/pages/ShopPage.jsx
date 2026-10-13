// src/pages/ShopPage.jsx
import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/home/Nav";
import AddYourStoreLink from "../components/shopNobi/AddYourStoreLink";
import ShopNobiCategoryPageContent from "../components/shopNobi/ShopNobiCategoryPageContent";
import ShopNobiPopularSearches from "../components/shopNobi/ShopNobiPopularSearches";
import ShopNobiSearchPageContent from "../components/shopNobi/ShopNobiSearchPageContent";
import "../components/home/homepage.css";
import "./ShopPage.css";
import { useAdoptedAssistantContainer } from "../hooks/useAdoptedAssistantContainer";
import { useLiveResultsHaveDrawn } from "../hooks/useLiveResultsHaveDrawn";
import { useSEO } from "../hooks/useSEO";
import { ShopNobiPageSeo } from "../utils/shopNobiPage";
import {
  buildPrebuiltContentSeo,
  choosePrebuiltContentPlace,
  PrebuiltContentKind,
  PrebuiltContentPlace,
  readEmbeddedPrebuiltContent,
} from "../utils/shopNobiPrebuiltContent";

/** Marks the live search slot when the category's own content sits under it. ShopPage.css then hides the general headline. */
const CategorySearchClass = "shop-nobi-category-search";

/**
 * The Shop Nobi page: the site's header, then the live search from the assistant bundle in the slot under it.
 * The prebuilt content and the store owners' link, right under the slot, show until live products are drawn.
 *
 * @param {{prebuiltContent?: object}} props The build passes the prebuilt content; in the browser it comes from the HTML.
 */
export default function ShopPage({ prebuiltContent: builtContent = null }) {
  const slotRef = useRef(null);
  const assistantHasMounted = useAdoptedAssistantContainer(slotRef);
  const liveResultsHaveDrawn = useLiveResultsHaveDrawn();
  const { pathname } = useLocation();
  const embeddedContent = useMemo(() => readEmbeddedPrebuiltContent(pathname), [pathname]);
  const prebuiltContent = builtContent || embeddedContent;
  const place = choosePrebuiltContentPlace(prebuiltContent?.kind, { assistantHasMounted, liveResultsHaveDrawn });

  useSEO(prebuiltContent ? buildPrebuiltContentSeo(prebuiltContent) : ShopNobiPageSeo);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <header>
        <Nav active="shop" pinned={false} />
      </header>
      {place === PrebuiltContentPlace.AboveSearch && <PrebuiltContent content={prebuiltContent} />}
      <div ref={slotRef} className={place === PrebuiltContentPlace.BelowSearch ? CategorySearchClass : undefined} />
      <AddYourStoreLink isLinkHidden={liveResultsHaveDrawn} />
      {place === PrebuiltContentPlace.BelowSearch && <PrebuiltContent content={prebuiltContent} />}
    </div>
  );
}

/** Shows the prebuilt content for its kind, or a loading message when the page has none. */
function PrebuiltContent({ content }) {
  if (!content) {
    return <LoadingMessage />;
  }
  if (content.kind === PrebuiltContentKind.SearchPage) {
    return <ShopNobiSearchPageContent page={content.data} />;
  }
  if (content.kind === PrebuiltContentKind.CategoryPage) {
    return <ShopNobiCategoryPageContent category={content.data} />;
  }
  return <ShopNobiPopularSearches popularSearches={content.data} />;
}

/** Shown on /shop until the live search arrives. */
function LoadingMessage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-black/60 dark:text-white/60">
      <p>Loading Shop Nobi…</p>
    </div>
  );
}

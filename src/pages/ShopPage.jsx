// src/pages/ShopPage.jsx
import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../components/home/Nav";
import ShopNobiCategoryPageContent from "../components/shopNobi/ShopNobiCategoryPageContent";
import ShopNobiPopularSearches from "../components/shopNobi/ShopNobiPopularSearches";
import ShopNobiSearchPageContent from "../components/shopNobi/ShopNobiSearchPageContent";
import "../components/home/homepage.css";
import { useAdoptedAssistantContainer } from "../hooks/useAdoptedAssistantContainer";
import { useSEO } from "../hooks/useSEO";
import { ShopNobiPageSeo } from "../utils/shopNobiPage";
import { buildPrebuiltContentSeo, PrebuiltContentKind, readEmbeddedPrebuiltContent } from "../utils/shopNobiPrebuiltContent";

/**
 * The Shop Nobi page: the site's header, then the live search from the assistant bundle in the slot under it.
 * Until the live search arrives, the slot shows the prebuilt content the build wrote for this path, if any.
 *
 * @param {{prebuiltContent?: object}} props The build passes the prebuilt content; in the browser it comes from the HTML.
 */
export default function ShopPage({ prebuiltContent: builtContent = null }) {
  const slotRef = useRef(null);
  const assistantHasMounted = useAdoptedAssistantContainer(slotRef);
  const { pathname } = useLocation();
  const embeddedContent = useMemo(() => readEmbeddedPrebuiltContent(pathname), [pathname]);
  const prebuiltContent = builtContent || embeddedContent;

  useSEO(prebuiltContent ? buildPrebuiltContentSeo(prebuiltContent) : ShopNobiPageSeo);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <header>
        <Nav active="shop" pinned={false} />
      </header>
      <div ref={slotRef}>
        {!assistantHasMounted && (prebuiltContent ? <PrebuiltContent content={prebuiltContent} /> : <LoadingMessage />)}
      </div>
    </div>
  );
}

/** Shows the prebuilt content for its kind. */
function PrebuiltContent({ content }) {
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

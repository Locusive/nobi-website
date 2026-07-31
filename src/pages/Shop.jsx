import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import NotFound from "./NotFound.jsx";
import shopPages from "../content/shop/shop_pages.json";

// The assistant bundle is the same one index.html loads for the floating
// chat. Shop mode is a separate entry point on it (window.Nobi.initializeShop)
// that may not exist in the deployed bundle yet, so this page always renders
// a working static shell and only hands over to the bundle when the entry
// point is actually present.
const NOBI_BUNDLE_URL = "https://assistant-script.nobi.ai/nobi.bundle.js";
const NOBI_API_BASE_URL = "https://api.nobi.ai";
const SHOP_ROOT_SELECTOR = "#shop-root";
const BUNDLE_POLL_INTERVAL_MS = 250;
const BUNDLE_POLL_TIMEOUT_MS = 10000;
const BASE_URL = "https://nobi.ai";

// Keep this title/description in sync with the /shop entry in
// scripts/prerender-pages.js (same rule as every other money page).
const SHOP_TITLE = "Shop across Nobi's stores | Nobi";
const SHOP_DESCRIPTION =
  "Search products across the independent stores powered by Nobi. One search compares styles, brands, and prices across every store's catalog.";

/**
 * Resolves which assistant bundle URL to load. Production always uses the
 * canonical bundle; in dev only, a ?scriptUrl= query parameter can point the
 * page at a locally built bundle for testing the shop entry point.
 */
function resolveBundleUrl(searchParams) {
  if (import.meta.env.DEV) {
    const override = searchParams.get("scriptUrl");
    if (override) return override;
  }
  return NOBI_BUNDLE_URL;
}

/**
 * Makes sure a script tag for the bundle exists. index.html already loads the
 * canonical bundle on every page, so this is a no-op unless a dev override
 * points at a different URL.
 */
function ensureBundleScript(url) {
  const alreadyLoaded = Array.from(document.querySelectorAll("script[src]")).some(
    (script) => script.getAttribute("src") === url
  );
  if (alreadyLoaded) return;
  const script = document.createElement("script");
  script.src = url;
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Polls until window.Nobi.initializeShop exists, the caller cancels, or the
 * timeout passes. Resolves true when the shop entry point is available.
 * Polling (rather than a script onload listener) also covers the case where
 * index.html's copy of the bundle finished loading before this page mounted.
 */
function waitForInitializeShop(isCancelled) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (isCancelled() || Date.now() - startedAt >= BUNDLE_POLL_TIMEOUT_MS) {
        clearInterval(timer);
        resolve(false);
        return;
      }
      if (window.Nobi && typeof window.Nobi.initializeShop === "function") {
        clearInterval(timer);
        resolve(true);
      }
    }, BUNDLE_POLL_INTERVAL_MS);
  });
}

/**
 * Shop Nobi: one search across every store powered by Nobi.
 *
 * Serves three URL shapes with one component:
 * - /shop            the indexable landing page
 * - /shop/s/:slug    indexable, pre-seeded landing pages from
 *                    src/content/shop/shop_pages.json (prerendered for
 *                    crawlers by scripts/prerender-shop.js)
 * - /shop?q=...      live searches; noindexed, canonical points at /shop
 */
export default function Shop() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const seededPage = slug ? shopPages.find((page) => page.slug === slug) : null;
  const liveQuery = searchParams.get("q") || "";
  const seedQuery = seededPage ? seededPage.query : liveQuery;

  const [searchText, setSearchText] = useState(seedQuery);
  const [bundleActive, setBundleActive] = useState(false);

  const path = seededPage ? `/shop/s/${seededPage.slug}` : "/shop";
  const title = seededPage ? `${seededPage.title} | Nobi` : SHOP_TITLE;
  const description = seededPage ? seededPage.description : SHOP_DESCRIPTION;
  useSEO({
    title: slug && !seededPage ? undefined : title,
    description: slug && !seededPage ? undefined : description,
    path: slug && !seededPage ? undefined : path,
    // Live searches (/shop?q=...) are endless permutations - keep them out
    // of the index. The canonical above already points them back at /shop.
    noindex: Boolean(liveQuery),
    schema:
      slug && !seededPage
        ? null
        : {
            "@context": "https://schema.org",
            "@type": seededPage ? "CollectionPage" : "WebPage",
            name: seededPage ? seededPage.title : "Shop across Nobi's stores",
            description,
            url: `${BASE_URL}${path}`,
          },
  });

  const bundleUrl = resolveBundleUrl(searchParams);
  useEffect(() => {
    let cancelled = false;
    ensureBundleScript(bundleUrl);
    waitForInitializeShop(() => cancelled).then((available) => {
      if (cancelled || !available) return;
      try {
        window.Nobi.initializeShop({
          container: SHOP_ROOT_SELECTOR,
          apiBaseUrl: NOBI_API_BASE_URL,
          ...(seedQuery ? { query: seedQuery } : {}),
        });
        setBundleActive(true);
      } catch (error) {
        console.warn("Nobi shop mode failed to start; keeping the static page.", error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [bundleUrl, seedQuery]);

  if (slug && !seededPage) {
    return <NotFound />;
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white min-h-screen">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-20">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            {seededPage ? seededPage.title : "Shop across Nobi's stores"}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl">
            Search products across stores powered by Nobi
          </p>

          {/* Static shell search. Hidden once the bundle mounts its own
              full-page experience into #shop-root, so there's never a dead
              duplicate input. */}
          {!bundleActive && (
            <form onSubmit={handleSearchSubmit} className="mt-8 flex max-w-2xl gap-3">
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder='Search for anything, like "red dresses under $100"'
                aria-label="Search products across Nobi's stores"
                className="w-full rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 px-5 py-3 text-base outline-none focus:border-purple-500 dark:focus:border-purple-400"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-[#7c3aed] px-6 py-3 font-medium text-white shadow-sm hover:bg-[#6d28d9]"
              >
                Search
              </button>
            </form>
          )}

          {seededPage && (
            <p className="mt-4 text-sm text-black/60 dark:text-white/60">
              <a href="/shop" className="underline hover:text-purple-600">
                Search everything on Shop Nobi
              </a>
            </p>
          )}

          {/* The assistant bundle mounts the full-page shop experience here
              when window.Nobi.initializeShop exists. Until then (or if the
              deployed bundle doesn't ship shop mode yet) it stays empty and
              the static shell above keeps working. */}
          <div id="shop-root" className="mt-10" />
        </div>
      </div>
    </PageLayout>
  );
}

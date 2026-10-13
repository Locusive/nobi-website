import React, { useState } from "react";
import { ArrowUp, ChevronDown, Store } from "lucide-react";
import { AllStores, buildTrySearchPath, StoreChoices } from "../../utils/shopNobiTryStores";

/**
 * A small copy of Shop Nobi's search box: a visitor picks a store, types or taps an example, and Shop Nobi opens
 * with that search running, so they see what Nobi search looks like on a real store.
 */
export default function TryShopNobi() {
  const [storeId, setStoreId] = useState(AllStores.id);
  const [query, setQuery] = useState("");
  const store = StoreChoices.find((choice) => choice.id === storeId) || AllStores;

  const openSearch = (words) => {
    if (words.trim()) {
      window.location.assign(buildTrySearchPath(words, storeId));
    }
  };
  const submitForm = (event) => {
    event.preventDefault();
    openSearch(query);
  };
  const submitOnEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      openSearch(query);
    }
  };

  return (
    <section id="try-shop-nobi" style={{ padding: "16px clamp(24px,5vw,80px) 96px", background: "#ffffff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>
          Try it yourself
        </span>
        <h2 style={{ margin: "14px 0 0", fontSize: "clamp(28px,3.6vw,40px)", lineHeight: 1.12, fontWeight: 700, color: "#1b1626", textAlign: "center", textWrap: "balance" }}>
          Search a real store with Nobi
        </h2>
        <p style={{ margin: "12px 0 0", maxWidth: 560, fontSize: 16.5, lineHeight: 1.55, color: "#57536a", textAlign: "center" }}>
          Pick a store and ask for something in your own words. It is the same search we put on your site.
        </p>
        <form action="/shop" method="get" role="search" onSubmit={submitForm} className="nb-try-box">
          <label htmlFor="try-shop-nobi-search" className="nb-visually-hidden">Describe what you're looking for</label>
          <textarea
            id="try-shop-nobi-search"
            name="q"
            rows={2}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={submitOnEnter}
            placeholder="Describe what you're looking for"
            className="nb-try-input"
          />
          <div className="nb-try-bar">
            <label className="nb-try-store">
              <Store size={15} strokeWidth={2} aria-hidden="true" />
              <span className="nb-visually-hidden">Store to search</span>
              <select name="stores" value={storeId} onChange={(event) => setStoreId(event.target.value)}>
                {StoreChoices.map((choice) => (
                  <option key={choice.name} value={choice.id}>{choice.name}</option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
            </label>
            <button type="submit" className="nb-try-send" disabled={!query.trim()} aria-label="Search">
              <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </form>
        <div className="nb-try-pills">
          {store.examples.map((example) => (
            <button key={example} type="button" className="nb-try-pill" onClick={() => openSearch(example)}>
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

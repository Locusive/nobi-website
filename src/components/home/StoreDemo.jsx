import React, { useEffect, useState } from "react";
import { ArrowUp, Search } from "lucide-react";
import { buildDemoStoresUrl, findDemoStores, openStoreDemo, prepareStoreDemo, readDemoStores } from "../../utils/storeDemo";

const StoreListState = { Loading: "loading", Ready: "ready", Failed: "failed" };

/**
 * Lets a visitor see Nobi on a real store: they pick a recently refreshed store, then search it, and Nobi's normal
 * modal opens with that store's results, the way it would on their own site.
 */
export default function StoreDemo() {
  const { stores, listState } = useDemoStores();
  const [pickedStore, setPickedStore] = useState(null);

  const pickStore = (store) => {
    setPickedStore(store);
    prepareStoreDemo(store.id);
  };

  return (
    <section id="store-demo" style={{ padding: "16px clamp(24px,5vw,80px) 96px", background: "#ffffff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>
          Try it yourself
        </span>
        <h2 style={{ margin: "14px 0 0", fontSize: "clamp(28px,3.6vw,40px)", lineHeight: 1.12, fontWeight: 700, color: "#1b1626", textAlign: "center", textWrap: "balance" }}>
          See Nobi on a real store
        </h2>
        <p style={{ margin: "12px 0 0", maxWidth: 560, fontSize: 16.5, lineHeight: 1.55, color: "#57536a", textAlign: "center" }}>
          Pick a store, then search it the way its shoppers would. Results open in Nobi, just like on your site.
        </p>
        {pickedStore
          ? <StoreSearch store={pickedStore} onChangeStore={() => setPickedStore(null)} />
          : <StorePicker stores={stores} listState={listState} onPick={pickStore} />}
      </div>
    </section>
  );
}

/** Loads the stores whose catalog was refreshed recently. */
function useDemoStores() {
  const [stores, setStores] = useState([]);
  const [listState, setListState] = useState(StoreListState.Loading);

  useEffect(() => {
    let isCurrent = true;
    fetch(buildDemoStoresUrl(window.location.hostname))
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data) => {
        if (isCurrent) {
          setStores(readDemoStores(data));
          setListState(StoreListState.Ready);
        }
      })
      .catch(() => isCurrent && setListState(StoreListState.Failed));
    return () => {
      isCurrent = false;
    };
  }, []);

  return { stores, listState };
}

/** The first step: a store field and the list of stores to pick from. */
function StorePicker({ stores, listState, onPick }) {
  const [words, setWords] = useState("");
  const shownStores = findDemoStores(stores, words);

  return (
    <div className="nb-demo-box">
      <label htmlFor="store-demo-store" className="nb-demo-question">Which store should Nobi search?</label>
      <div className="nb-demo-find">
        <Search size={17} color="#8a8498" strokeWidth={2.2} aria-hidden="true" />
        <input
          id="store-demo-store"
          type="search"
          value={words}
          onChange={(event) => setWords(event.target.value)}
          placeholder="Find a store"
          autoComplete="off"
        />
      </div>
      <StoreList stores={shownStores} listState={listState} onPick={onPick} />
    </div>
  );
}

/** The stores as buttons, or a short message while they load, when none match, or when they could not load. */
function StoreList({ stores, listState, onPick }) {
  if (listState === StoreListState.Loading) {
    return <p className="nb-demo-note">Loading stores…</p>;
  }
  if (listState === StoreListState.Failed) {
    return <p className="nb-demo-note">The stores could not load. Please try again in a moment.</p>;
  }
  if (stores.length === 0) {
    return <p className="nb-demo-note">No stores match that.</p>;
  }

  return (
    <ul className="nb-demo-stores">
      {stores.map((store) => (
        <li key={store.id}>
          <button type="button" className="nb-demo-store" onClick={() => onPick(store)}>
            <StoreMark store={store} />
            <span>{store.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** A store's logo, or its first letter when it has none. */
function StoreMark({ store }) {
  if (store.logoUrl) {
    return <img src={store.logoUrl} alt="" loading="lazy" className="nb-demo-mark" />;
  }
  return <span className="nb-demo-mark nb-demo-initial" aria-hidden="true">{store.name.charAt(0).toUpperCase()}</span>;
}

/** The second step: search the picked store; a search or an example opens Nobi's modal on that store. */
function StoreSearch({ store, onChangeStore }) {
  const [query, setQuery] = useState("");
  const search = (words) => openStoreDemo(words, store.id);
  const submitForm = (event) => {
    event.preventDefault();
    search(query);
  };
  const submitOnEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      submitForm(event);
    }
  };

  return (
    <>
      <form role="search" onSubmit={submitForm} className="nb-demo-box">
        <div className="nb-demo-picked">
          <StoreMark store={store} />
          <span className="nb-demo-picked-name">{store.name}</span>
          <button type="button" className="nb-demo-change" onClick={onChangeStore}>Change store</button>
        </div>
        <label htmlFor="store-demo-search" className="nb-visually-hidden">Search {store.name}</label>
        <textarea
          id="store-demo-search"
          rows={2}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={submitOnEnter}
          placeholder={`Search ${store.name} the way its shoppers would`}
          className="nb-demo-input"
        />
        <div className="nb-demo-bar">
          <button type="submit" className="nb-demo-send" disabled={!query.trim()} aria-label="Search">
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </form>
      {store.exampleSearches.length > 0 && (
        <div className="nb-demo-pills">
          {store.exampleSearches.map((example) => (
            <button key={example} type="button" className="nb-demo-pill" onClick={() => search(example)}>
              {example}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Search } from "lucide-react";
import {
  buildDemoStoresUrl,
  DefaultStore,
  findDemoStores,
  openStoreDemo,
  prepareStoreDemo,
  readDemoStoreId,
  readDemoStores,
  readStoreSearches,
} from "../../utils/storeDemo";
import OwnStoreDemo from "./OwnStoreDemo";

const StoreListState = { Loading: "loading", Ready: "ready", Failed: "failed" };
const OwnStoreNotice = "Some items may be out of date. Once you sign up, your catalog stays current.";

/**
 * Lets a visitor search a real store in Nobi's modal: it starts on Lucchese, and any recently refreshed store,
 * the visitor's own store, or the store a ?demoStore=<id> link names can be shown instead.
 */
export default function StoreDemo() {
  const { stores, listState } = useDemoStores();
  const [pickedStore, setPickedStore] = useState(DefaultStore);
  const [isOwnStore, setIsOwnStore] = useState(false);
  const [query, setQuery] = useState("");
  const hasPrepared = useRef(false);
  const sectionRef = useRef(null);
  const shownStore = stores.find((store) => store.id === pickedStore.id) || pickedStore;

  const prepareOnce = () => {
    if (!hasPrepared.current) {
      hasPrepared.current = true;
      prepareStoreDemo(shownStore.id);
    }
  };
  const pickStore = (store) => {
    setPickedStore(store);
    setIsOwnStore(false);
    prepareStoreDemo(store.id);
  };
  const showOwnStore = (store) => {
    pickStore(store);
    setIsOwnStore(true);
  };
  useLinkedStore(stores, sectionRef, pickStore);
  const search = (words) => openStoreDemo(words, shownStore.id);
  const submitForm = (event) => {
    event.preventDefault();
    search(query);
  };
  const submitOnEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      submitForm(event);
    }
  };
  const storeSearches = readStoreSearches(shownStore);

  return (
    <section id="store-demo" ref={sectionRef} style={{ padding: "16px clamp(24px,5vw,80px) 96px", background: "#ffffff" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>
          Try it yourself
        </span>
        <h2 style={{ margin: "14px 0 0", fontSize: "clamp(28px,3.6vw,40px)", lineHeight: 1.12, fontWeight: 700, color: "#1b1626", textAlign: "center", textWrap: "balance" }}>
          See Nobi on a real store
        </h2>
        <p style={{ margin: "12px 0 0", maxWidth: 560, fontSize: 16.5, lineHeight: 1.55, color: "#57536a", textAlign: "center" }}>
          Search a store the way its shoppers would. Results open in Nobi, just like on your site.
        </p>
        <form role="search" onSubmit={submitForm} onFocus={prepareOnce} className="nb-demo-box">
          <label htmlFor="store-demo-search" className="nb-visually-hidden">Search {shownStore.name}</label>
          <textarea
            id="store-demo-search"
            rows={2}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={submitOnEnter}
            placeholder={`Search ${shownStore.name} the way its shoppers would`}
            className="nb-demo-input"
          />
          <div className="nb-demo-bar">
            <StoreSwitcher store={shownStore} stores={stores} listState={listState} onPick={pickStore} />
            <button type="submit" className="nb-demo-send" disabled={!query.trim()} aria-label="Search">
              <ArrowUp size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </form>
        {isOwnStore && <p className="nb-demo-own-notice" role="status">{OwnStoreNotice}</p>}
        {storeSearches.length > 0 && (
          <div className="nb-demo-pills">
            {storeSearches.map((example) => (
              <button key={example} type="button" className="nb-demo-pill" onClick={() => search(example)}>
                {example}
              </button>
            ))}
          </div>
        )}
        <OwnStoreDemo onStoreFound={showOwnStore} />
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

/**
 * Opens the demo on the store a ?demoStore=<id> link names, once the store list has it, and scrolls the demo into
 * view. Stores missing from the list (not refreshed recently) are ignored, so the demo stays on its default store.
 */
function useLinkedStore(stores, sectionRef, pickStore) {
  const hasApplied = useRef(false);

  useEffect(() => {
    const linkedStoreId = readDemoStoreId(window.location.search);
    const linkedStore = stores.find((store) => store.id === linkedStoreId);
    if (hasApplied.current || !linkedStore) {
      return;
    }

    hasApplied.current = true;
    pickStore(linkedStore);
    sectionRef.current?.scrollIntoView({ block: "center" });
  }, [stores, sectionRef, pickStore]);
}

/** The picked store as a button in the search box; it opens the list of stores, with a pulsing hint until first used. */
function StoreSwitcher({ store, stores, listState, onPick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const switcherRef = useRef(null);
  useCloseOnOutsideClick(isOpen, switcherRef, () => setIsOpen(false));

  const toggle = () => {
    setIsOpen((open) => !open);
    setHasOpened(true);
  };
  const pick = (picked) => {
    onPick(picked);
    setIsOpen(false);
  };

  return (
    <div className="nb-demo-switcher" ref={switcherRef}>
      <button type="button" className="nb-demo-store-button" onClick={toggle} aria-expanded={isOpen} aria-label={`Store: ${store.name}. Change store`}>
        <StoreMark store={store} />
        <span>{store.name}</span>
        <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
      </button>
      {!hasOpened && (
        <span className="nb-demo-hint" aria-hidden="true">
          <span className="nb-demo-pulse" />
          Try another store
        </span>
      )}
      {isOpen && <StorePicker stores={stores} listState={listState} onPick={pick} />}
    </div>
  );
}

/** Closes the store list on a click outside it or on Escape, while it is open. */
function useCloseOnOutsideClick(isOpen, containerRef, close) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        close();
      }
    };
    const closeOnEscape = (event) => event.key === "Escape" && close();
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, containerRef, close]);
}

/** The store field and the list of stores to pick from. */
function StorePicker({ stores, listState, onPick }) {
  const [words, setWords] = useState("");
  const shownStores = findDemoStores(stores, words);

  return (
    <div className="nb-demo-popover">
      <label htmlFor="store-demo-store" className="nb-visually-hidden">Find a store</label>
      <div className="nb-demo-find">
        <Search size={17} color="#8a8498" strokeWidth={2.2} aria-hidden="true" />
        <input
          id="store-demo-store"
          type="search"
          value={words}
          onChange={(event) => setWords(event.target.value)}
          placeholder="Find a store"
          autoComplete="off"
          autoFocus
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

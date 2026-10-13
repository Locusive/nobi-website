import React, { useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { formatPrice } from "../../utils/shopNobiSearchPage";
import { liveSearchPath, TryExamplesFile } from "../../utils/shopNobiTryExamples";

const Gradient = "linear-gradient(90deg,#6d3bff,#d541b3)";
const SearchPlaceholder = "Try “warm ski jacket under $200”";

/**
 * Lets a visitor try Shop Nobi: their own search opens the live search, and each example shows real results at once.
 * The results are one labeled picture, so the Nobi assistant reads the label, not the products, as page content.
 */
export default function TryShopNobi() {
  const examples = useTryExamples();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedExample = examples[selectedIndex] || null;

  return (
    <section id="try-shop-nobi" style={{ padding: "24px clamp(24px,5vw,80px) 88px", background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a49dba" }}>
          Try it yourself
        </span>
        <h2 style={{ margin: "14px 0 0", fontSize: "clamp(30px,4vw,44px)", lineHeight: 1.1, fontWeight: 700, color: "#1b1626", textAlign: "center", textWrap: "balance" }}>
          See Nobi search on real stores
        </h2>
        <p style={{ margin: "14px 0 0", maxWidth: 620, fontSize: 17, lineHeight: 1.55, color: "#57536a", textAlign: "center" }}>
          Shop Nobi runs on the same AI search we put on your site. Search the best products from top online stores the
          way your shoppers would.
        </p>
        <SearchForm />
        {examples.length > 0 && (
          <ExamplePicker examples={examples} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        )}
        {selectedExample && <ExampleResults example={selectedExample} />}
      </div>
    </section>
  );
}

/** Loads the example searches the build wrote; an empty list when the file is missing, so the search box still works. */
function useTryExamples() {
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    let isCurrent = true;
    fetch(`/${TryExamplesFile}`)
      .then((response) => (response.ok ? response.json() : { examples: [] }))
      .then((data) => {
        if (isCurrent && Array.isArray(data?.examples)) {
          setExamples(data.examples);
        }
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, []);

  return examples;
}

/** The visitor's own search. It is a plain form, so it opens Shop Nobi even before the page's script runs. */
function SearchForm() {
  const openLiveSearch = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString() || "";
    if (query.trim()) {
      window.location.assign(liveSearchPath(query));
    }
  };

  return (
    <form action="/shop" method="get" role="search" onSubmit={openLiveSearch} className="nb-try-form">
      <Search size={19} color="#8a8498" strokeWidth={2.3} style={{ flex: "none" }} aria-hidden="true" />
      <label htmlFor="try-shop-nobi-search" className="nb-visually-hidden">Search Shop Nobi</label>
      <input id="try-shop-nobi-search" name="q" type="search" placeholder={SearchPlaceholder} autoComplete="off" className="nb-try-input" />
      <button type="submit" className="nb-try-submit" style={{ background: Gradient }}>
        Search
      </button>
    </form>
  );
}

/** The example searches as buttons; the selected one shows its results below. */
function ExamplePicker({ examples, selectedIndex, onSelect }) {
  return (
    <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 13.5, color: "#8a8498", marginRight: 2 }}>Or pick an example:</span>
      {examples.map((example, index) => (
        <button
          key={example.slug}
          type="button"
          aria-pressed={index === selectedIndex}
          onClick={() => onSelect(index)}
          className={index === selectedIndex ? "nb-try-pill nb-try-pill-on" : "nb-try-pill"}
        >
          {example.query}
        </button>
      ))}
    </div>
  );
}

/** One example's products, as a single labeled picture that links to its full Shop Nobi page. */
function ExampleResults({ example }) {
  const label = `Example Shop Nobi results for “${example.query}”`;

  return (
    <div style={{ marginTop: 28, width: "100%" }}>
      <a href={example.path} className="nb-try-results" aria-label={`See all Shop Nobi results for “${example.query}”`}>
        <div role="img" aria-label={label} className="nb-try-grid">
          {example.products.map((product, index) => (
            <ExampleProduct key={`${example.slug}-${index}`} product={product} />
          ))}
        </div>
      </a>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
        <a href={example.path} className="nb-try-more">
          See all results for “{example.query}” on Shop Nobi
          <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/** One product: its picture, name, store and price. */
function ExampleProduct({ product }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ aspectRatio: "1 / 1", borderRadius: 14, overflow: "hidden", background: "#f6f3fa" }}>
        <img src={product.imageUrl} alt="" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="nb-try-name">{product.name}</div>
      <div style={{ marginTop: 3, fontSize: 12.5, color: "#8a8498", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {product.storeName}
      </div>
      <div style={{ marginTop: 3, fontSize: 13.5, fontWeight: 700, color: "#1b1626" }}>{formatPrice(product.price, product.currency)}</div>
    </div>
  );
}

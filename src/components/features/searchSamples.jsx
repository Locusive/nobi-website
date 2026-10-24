import React from "react";
import { CheckCircle2, FileText, Search, Sparkles } from "lucide-react";
import { INK, MUTED, SampleCard, SampleLabel, VIOLET } from "./sampleParts";

// Sample screens for the search features. Each one is a labeled picture, so its sample text is not read as page content.

const DRESSES = [
  { img: "/media/prod-1.webp", name: "Crochet maxi dress", price: "$98" },
  { img: "/media/prod-2.webp", name: "Bow back maxi", price: "$155" },
  { img: "/media/prod-3.webp", name: "Ruffle maxi dress", price: "$178" },
];

/** A search bar showing what the visitor typed, with an optional typing cursor. */
function SampleSearchBar({ query, typing }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
      <Search size={18} color={VIOLET} strokeWidth={2.3} style={{ flex: "none" }} />
      <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, color: INK }}>
        {query}
        {typing && <span style={{ display: "inline-block", width: 2, height: 17, marginLeft: 2, verticalAlign: "middle", background: VIOLET, animation: "nb-blink 1s step-end infinite" }} />}
      </span>
    </div>
  );
}

/** A row of product cards with picture, name and price. */
function ProductRow({ products, imageRatio = "4/5" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${products.length},1fr)`, gap: 10 }}>
      {products.map((product) => (
        <div key={product.name} style={{ minWidth: 0 }}>
          <div style={{ aspectRatio: imageRatio, borderRadius: 12, overflow: "hidden", background: "#f4eef2" }}>
            <img src={product.img} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ marginTop: 7, fontSize: 12.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{product.price}</div>
        </div>
      ))}
    </div>
  );
}

/** AI search: a long, plain-language search, what Nobi understood from it, and matching products. */
export function AiSearchSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi understanding a plain-language search on a sample clothing store" shadow={shadow}>
      <SampleSearchBar query="something red for a beach wedding, under $200" />
      <div style={{ padding: "14px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, paddingBottom: 12, color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <CheckCircle2 size={15} color={VIOLET} strokeWidth={2.2} />
          Understood: red &middot; beach wedding &middot; under $200
        </div>
        <ProductRow products={DRESSES} />
      </div>
    </SampleCard>
  );
}

/** Search as you type: suggested searches and products appearing under a half-typed search. */
export function SearchAsYouTypeSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi suggesting searches and products while a shopper types on a sample store" shadow={shadow}>
      <SampleSearchBar query="red maxi dress" typing />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>Suggestions</SampleLabel>
        <div style={{ marginTop: 6 }}>
          {["red maxi dress for a wedding", "red maxi dress with sleeves", "red linen dress"].map((suggestion) => (
            <div key={suggestion} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14.5, color: INK }}>
              <Search size={14} color={MUTED} />
              {suggestion}
            </div>
          ))}
        </div>
        <div style={{ margin: "14px 0 10px" }}>
          <SampleLabel>Products</SampleLabel>
        </div>
        <ProductRow products={DRESSES} />
      </div>
    </SampleCard>
  );
}

/** One filter group in the sample search page's sidebar. */
function FilterGroup({ title, options }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{title}</div>
      {options.map(([label, checked]) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7, fontSize: 12.5, color: checked ? INK : MUTED }}>
          <span style={{ width: 13, height: 13, borderRadius: 4, border: checked ? "none" : "1.5px solid #cfc9dc", background: checked ? VIOLET : "transparent" }} />
          {label}
        </div>
      ))}
    </div>
  );
}

/** Shopify search page: a full results page with filters and a field to filter by describing what you want. */
export function ShopifySearchPageSample({ shadow }) {
  return (
    <SampleCard label="Example of a Shopify store's search results page run by Nobi, with filters and a Filter with AI field" shadow={shadow}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <div style={{ fontSize: 12.5, color: MUTED }}>Search results for</div>
        <div style={{ fontSize: 19, fontWeight: 700, color: INK, marginTop: 2 }}>maxi dress</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "118px 1fr", gap: 16, padding: "14px 18px 20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(109,59,255,0.3)", fontSize: 12, color: VIOLET, fontWeight: 600 }}>
            <Sparkles size={13} /> Filter with AI
          </div>
          <FilterGroup title="Color" options={[["Red", true], ["Ivory", false], ["Black", false]]} />
          <FilterGroup title="Size" options={[["S", false], ["M", true], ["L", false]]} />
        </div>
        <ProductRow products={DRESSES.slice(0, 2)} imageRatio="3/4" />
      </div>
    </SampleCard>
  );
}

/** One cited page under an answer. */
function SourcePill({ title }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid rgba(109,59,255,0.22)", borderRadius: 999, padding: "7px 12px", fontSize: 12.5, fontWeight: 600, color: VIOLET }}>
      <FileText size={13} /> {title}
    </span>
  );
}

/** Answers from your site: a question answered in plain words, with the pages the answer came from. */
export function SiteAnswersSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi answering a question from a sample store's own pages, with the pages it cites" shadow={shadow}>
      <SampleSearchBar query="Do you ship to Canada?" />
      <div style={{ padding: "20px 20px 22px", background: "linear-gradient(180deg,#faf8ff,#ffffff)" }}>
        <div style={{ fontSize: 16.5, lineHeight: 1.6, color: INK, fontWeight: 500 }}>
          Yes. Orders to Canada ship in 3 to 5 business days, and duties are included at checkout.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <SourcePill title="Shipping policy" />
          <SourcePill title="International orders" />
        </div>
      </div>
    </SampleCard>
  );
}

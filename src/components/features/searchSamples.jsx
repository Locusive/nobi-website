import React from "react";
import { CheckCircle2, FileText, Search, Sparkles } from "lucide-react";
import { INK, MUTED, SampleCard, SampleLabel, VIOLET } from "./sampleParts";
import { ProductTileRow, SAMPLE_PRODUCT as P } from "./productTiles";

// Sample screens for the search features. Each one is a labeled picture, so its sample text is not read as page content.

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

/** AI search: a long, plain-language search, what Nobi understood from it, and matching products. */
export function AiSearchSample({ shadow }) {
  const products = [P.hoka, P.allbirds, P.kizik];

  return (
    <SampleCard label="Example of Nobi understanding a plain-language search on a sample store" shadow={shadow}>
      <SampleSearchBar query="waterproof hiking boots for wide feet" />
      <div style={{ padding: "14px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, paddingBottom: 12, color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          <CheckCircle2 size={15} color={VIOLET} strokeWidth={2.2} />
          Understood: waterproof &middot; hiking &middot; wide fit
        </div>
        <ProductTileRow products={products} />
      </div>
    </SampleCard>
  );
}

/** Typeahead search: suggested searches and products appearing under a half-typed search. */
export function SearchAsYouTypeSample({ shadow }) {
  const products = [P.earbuds, P.melobuds, P.headphones];

  return (
    <SampleCard label="Example of Nobi suggesting searches and products while a shopper types on a sample store" shadow={shadow}>
      <SampleSearchBar query="wireless ear" typing />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>Suggestions</SampleLabel>
        <div style={{ marginTop: 6 }}>
          {["wireless earbuds", "wireless earbuds for running", "wireless earbuds noise cancelling"].map((suggestion) => (
            <div key={suggestion} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14.5, color: INK }}>
              <Search size={14} color={MUTED} />
              {suggestion}
            </div>
          ))}
        </div>
        <div style={{ margin: "14px 0 10px" }}>
          <SampleLabel>Products</SampleLabel>
        </div>
        <ProductTileRow products={products} />
      </div>
    </SampleCard>
  );
}

/** One cited page under an answer. */
function SourcePill({ title }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid rgba(109,59,255,0.22)", borderRadius: 999, padding: "6px 11px", fontSize: 12, fontWeight: 600, color: VIOLET }}>
      <FileText size={12} /> {title}
    </span>
  );
}

/** AI answers: one question, answered in plain words, with the products and the pages behind it, all in one. */
export function SmartAnswersSample({ shadow }) {
  const products = [P.tentDagger, P.tentChogori];

  return (
    <SampleCard label="Example of Nobi answering a question with an AI answer, matching products and the pages it cites, all on one screen" shadow={shadow}>
      <SampleSearchBar query="what tent do I need for winter camping?" />
      <div style={{ padding: "18px 18px 20px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={15} color="#fff" />
          </span>
          <div style={{ fontSize: 15.5, lineHeight: 1.5, color: INK }}>
            You want a four-season tent: a sturdier pole set and less mesh hold up to snow and wind. These two are built for it.
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <SampleLabel>Products</SampleLabel>
          <div style={{ marginTop: 10 }}>
            <ProductTileRow products={products} />
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <SourcePill title="Winter camping guide" />
          <SourcePill title="Tent buying guide" />
        </div>
      </div>
    </SampleCard>
  );
}

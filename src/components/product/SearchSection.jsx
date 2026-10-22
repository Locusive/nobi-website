import React from "react";
import { Search } from "lucide-react";
import ProductSection from "./ProductSection";
import { INK, MUTED, SampleCard, SampleLabel, VIOLET } from "./sampleParts";

const SUGGESTIONS = ["red maxi dress for a wedding", "red maxi dress with sleeves", "red linen dress"];

const PRODUCTS = [
  { img: "/media/prod-1.webp", name: "Crochet maxi dress", price: "$98" },
  { img: "/media/prod-2.webp", name: "Bow back maxi", price: "$155" },
  { img: "/media/prod-3.webp", name: "Ruffle maxi dress", price: "$178" },
];

/** A sample search bar with suggested searches and products appearing as the shopper types. */
function SearchSample() {
  return (
    <SampleCard label="Example of Nobi suggesting searches and products while a shopper types on a sample store" shadow="0 50px 100px -40px rgba(20,6,60,0.7)">
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <Search size={18} color={VIOLET} strokeWidth={2.3} style={{ flex: "none" }} />
        <span style={{ flex: 1, fontSize: 15.5, color: INK }}>
          red maxi dress
          <span style={{ display: "inline-block", width: 2, height: 17, marginLeft: 2, verticalAlign: "middle", background: VIOLET, animation: "nb-blink 1s step-end infinite" }} />
        </span>
      </div>
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>Suggestions</SampleLabel>
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column" }}>
          {SUGGESTIONS.map((suggestion) => (
            <div key={suggestion} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14.5, color: INK }}>
              <Search size={14} color={MUTED} />
              {suggestion}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <SampleLabel>Products</SampleLabel>
        </div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {PRODUCTS.map((product) => (
            <div key={product.name} style={{ minWidth: 0 }}>
              <div style={{ aspectRatio: "4/5", borderRadius: 12, overflow: "hidden", background: "#f4eef2" }}>
                <img src={product.img} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 7, fontSize: 12.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {product.name}
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{product.price}</div>
            </div>
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

/** The Product page section on Nobi's search. */
export default function SearchSection() {
  return (
    <ProductSection
      sectionId="search"
      bg="#4a2fb8"
      radial="radial-gradient(70% 60% at 85% 15%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 5% 95%, rgba(20,6,70,0.5), rgba(20,6,70,0) 70%)"
      title="Search that understands shoppers"
      titleMaxCh={12}
      textColor="rgba(255,247,255,0.84)"
      text="Nobi reads what shoppers mean, not just the words they type. It suggests products as they type, and on Shopify it can run your whole search results page."
      sample={<SearchSample />}
    />
  );
}

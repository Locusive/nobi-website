import React from "react";
import { Search, ShoppingBag, X } from "lucide-react";
import { INK, MUTED, NobiReply, SampleCard, SampleLabel } from "./sampleParts";

// Sample screens for the ecommerce features. Each one is a labeled picture, so its sample text is not read as page content.

/** A small product card: picture, name and price. */
function MiniProduct({ product }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ aspectRatio: "1/1", borderRadius: 12, overflow: "hidden", background: "#f4eef2" }}>
        <img src={product.img} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ marginTop: 7, fontSize: 12.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</div>
      <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{product.price}</div>
    </div>
  );
}

/** The top of a sample product page: the product's picture, name and price. */
function ProductPageHeader({ product }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
      <img src={product.img} alt="" style={{ width: 64, height: 80, borderRadius: 10, objectFit: "cover" }} />
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{product.name}</div>
        <div style={{ fontSize: 14, color: MUTED, marginTop: 3 }}>{product.price}</div>
      </div>
    </div>
  );
}

/** Product recommendations: related products shown on a product page. */
export function ProductRecommendationsSample({ shadow }) {
  const related = [
    { img: "/media/prod-4.webp", name: "Smocked mini dress", price: "$84" },
    { img: "/media/prod-5.webp", name: "Embroidered midi", price: "$128" },
    { img: "/media/prod-6.webp", name: "Printed slip dress", price: "$112" },
  ];

  return (
    <SampleCard label="Example of Nobi showing related products on a sample store's product page" shadow={shadow}>
      <ProductPageHeader product={{ img: "/media/prod-default-3.webp", name: "Ribbed polo dress", price: "$118" }} />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>You might also like</SampleLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
          {related.map((product) => (
            <MiniProduct key={product.name} product={product} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

const QUESTIONS = [
  { question: "Does it wrinkle easily?", answer: "Not much. It's a taffeta blend that holds its shape through a full event." },
  { question: "Is it lined?", answer: "Yes, it's fully lined, so it isn't see-through." },
];

/** Product page Q&A: past shopper questions on a product page, with a box to search them. */
export function ProductPageQaSample({ shadow }) {
  return (
    <SampleCard label="Example of past shopper questions and answers on a sample store's product page" shadow={shadow}>
      <ProductPageHeader product={{ img: "/media/prod-default-1.webp", name: "Strapless taffeta gown", price: "$168" }} />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>Questions about this product</SampleLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, padding: "10px 12px", border: "1px solid rgba(20,16,40,0.12)", borderRadius: 12, fontSize: 14, color: MUTED }}>
          <Search size={15} /> Search questions
        </div>
        {QUESTIONS.map(({ question, answer }) => (
          <div key={question} style={{ padding: "14px 0 0" }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>{question}</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: "#615b70", marginTop: 4 }}>{answer}</div>
          </div>
        ))}
      </div>
    </SampleCard>
  );
}

/** Cart assistant: a message and suggestions that appear when a shopper adds something to the cart. */
export function CartAssistantSample({ shadow }) {
  const suggestions = [
    { img: "/media/prod-default-3.webp", name: "Ribbed polo dress", price: "$118" },
    { img: "/media/prod-4.webp", name: "Smocked mini dress", price: "$84" },
  ];

  return (
    <SampleCard label="Example of Nobi's message and suggestions in a sample store's cart after a shopper adds a dress" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "15px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <ShoppingBag size={17} color={INK} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>Your cart</span>
        <X size={16} color={MUTED} style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
        <img src="/media/prod-6.webp" alt="" style={{ width: 48, height: 60, borderRadius: 8, objectFit: "cover" }} />
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: INK }}>Printed slip dress</div>
        <div style={{ fontSize: 14, color: INK }}>$112</div>
      </div>
      <div style={{ padding: "4px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <NobiReply>Good choice. Here are two similar styles you might like:</NobiReply>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginLeft: 40 }}>
          {suggestions.map((product) => (
            <MiniProduct key={product.name} product={product} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

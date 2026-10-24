import React from "react";
import { CheckCircle2, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { ChatBubble, INK, MUTED, NobiReply, SampleCard, SampleLabel, VIOLET } from "./sampleParts";

// Sample screens for the ecommerce features. Each one is a labeled picture, so its sample text is not read as page content.

const RELATED = [
  { img: "/media/prod-4.webp", name: "Smocked mini dress", price: "$84" },
  { img: "/media/prod-5.webp", name: "Embroidered midi", price: "$128" },
  { img: "/media/prod-6.webp", name: "Printed slip dress", price: "$112" },
];

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

/** The top of a sample product page: picture, name and price. */
function ProductPageHeader() {
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
      <img src="/media/prod-1.webp" alt="" style={{ width: 64, height: 80, borderRadius: 10, objectFit: "cover" }} />
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>Crochet maxi dress</div>
        <div style={{ fontSize: 14, color: MUTED, marginTop: 3 }}>$98</div>
      </div>
    </div>
  );
}

/** Product recommendations: related products shown on a product page. */
export function ProductRecommendationsSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi showing related products on a sample store's product page" shadow={shadow}>
      <ProductPageHeader />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>You might also like</SampleLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 12 }}>
          {RELATED.map((product) => (
            <MiniProduct key={product.name} product={product} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

const QUESTIONS = [
  { question: "Is it see-through?", answer: "No. It's fully lined, so it isn't see-through." },
  { question: "Can it be machine washed?", answer: "Yes, on a cold, gentle cycle. Lay it flat to dry." },
];

/** Product page Q&A: past shopper questions on a product page, with a box to search them. */
export function ProductPageQaSample({ shadow }) {
  return (
    <SampleCard label="Example of past shopper questions and answers on a sample store's product page" shadow={shadow}>
      <ProductPageHeader />
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
  return (
    <SampleCard label="Example of Nobi's message and suggestions in a sample store's cart after a shopper adds a dress" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "15px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <ShoppingBag size={17} color={INK} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>Your cart</span>
        <X size={16} color={MUTED} style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
        <img src="/media/prod-1.webp" alt="" style={{ width: 48, height: 60, borderRadius: 8, objectFit: "cover" }} />
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: INK }}>Crochet maxi dress</div>
        <div style={{ fontSize: 14, color: INK }}>$98</div>
      </div>
      <div style={{ padding: "4px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <NobiReply>Good choice. Here are two similar styles you might like:</NobiReply>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginLeft: 40 }}>
          {RELATED.slice(0, 2).map((product) => (
            <MiniProduct key={product.name} product={product} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

/** Ask AI filters: a shopper describes what they want, and the page's own filters are set from it. */
export function AskAiFiltersSample({ shadow }) {
  return (
    <SampleCard label="Example of a shopper describing what they want and Nobi setting a sample store's filters" shadow={shadow}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", border: "1.5px solid rgba(109,59,255,0.35)", borderRadius: 12 }}>
          <Sparkles size={16} color={VIOLET} />
          <span style={{ fontSize: 14.5, color: INK }}>red dress, size medium, under $150</span>
        </div>
      </div>
      <div style={{ padding: "14px 18px 20px" }}>
        <SampleLabel>Filters set</SampleLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {["Color: Red", "Size: M", "Price: Under $150"].map((chip) => (
            <span key={chip} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#ffffff", background: VIOLET, borderRadius: 999, padding: "7px 12px" }}>
              <CheckCircle2 size={13} /> {chip}
            </span>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
          {[{ img: "/media/prod-1.webp", name: "Crochet maxi dress", price: "$98" }, { img: "/media/prod-2.webp", name: "Bow back maxi", price: "$135" }, { img: "/media/prod-3.webp", name: "Ruffle midi dress", price: "$118" }].map((product) => (
            <MiniProduct key={product.name} product={product} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

/** One-click add to cart: a search result with sizes and an add button, and the added message. */
export function QuickAddSample({ shadow }) {
  return (
    <SampleCard label="Example of a shopper adding a product to the cart straight from Nobi's search results on a sample store" shadow={shadow}>
      <div style={{ display: "flex", gap: 16, padding: 18 }}>
        <img src="/media/prod-2.webp" alt="" style={{ width: 140, height: 175, borderRadius: 14, objectFit: "cover" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>Bow back maxi</div>
          <div style={{ fontSize: 14, color: MUTED, marginTop: 3 }}>$155</div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {["S", "M", "L"].map((size) => (
              <span key={size} style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: size === "M" ? "#ffffff" : INK, background: size === "M" ? INK : "#ffffff", border: "1px solid rgba(20,16,40,0.15)" }}>{size}</span>
            ))}
          </div>
          <div style={{ marginTop: 14, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#ffffff", background: VIOLET, borderRadius: 11, padding: "11px 0" }}>Add to cart</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 18px 18px", padding: "11px 13px", borderRadius: 12, background: "#ecfdf5", fontSize: 13.5, fontWeight: 600, color: "#0f8a54" }}>
        <CheckCircle2 size={16} /> Added to cart. Keep shopping, or check out.
      </div>
    </SampleCard>
  );
}

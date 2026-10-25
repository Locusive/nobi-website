import React from "react";
import { CheckCircle2, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { INK, MUTED, NobiReply, SampleCard, SampleLabel, VIOLET } from "./sampleParts";
import { ProductImage, ProductTileRow, SAMPLE_PRODUCT as P } from "./productTiles";

// Sample screens for the ecommerce features. Each one is a labeled picture, so its sample text is not read as page content.

/** The top of a sample product page: the product's photo, name and price. */
function ProductPageHeader({ product }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)", alignItems: "center" }}>
      <div style={{ width: 60, height: 60, flex: "none" }}>
        <ProductImage product={product} radius={10} />
      </div>
      <div>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{product.name}</div>
        <div style={{ fontSize: 14, color: MUTED, marginTop: 3 }}>{product.price}</div>
      </div>
    </div>
  );
}

/** Product recommendations: related products shown on a product page. */
export function ProductRecommendationsSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi showing related products on a sample store's product page" shadow={shadow}>
      <ProductPageHeader product={P.jacket} />
      <div style={{ padding: "16px 18px 20px" }}>
        <SampleLabel>Goes well with</SampleLabel>
        <div style={{ marginTop: 12 }}>
          <ProductTileRow products={[P.kizik, P.backpack, P.watch]} />
        </div>
      </div>
    </SampleCard>
  );
}

const QUESTIONS = [
  { question: "Does it hold up in high wind?", answer: "Yes. Its sturdier pole set and lower-mesh design handle snow and strong wind, so it's rated as a four-season tent." },
  { question: "What's the packed weight?", answer: "It packs down to about 6 lbs 2 oz, light enough to carry in on a two-day trek." },
];

/** Product page Q&A: past shopper questions on a product page, with a box to search them. */
export function ProductPageQaSample({ shadow }) {
  return (
    <SampleCard label="Example of past shopper questions and answers on a sample store's product page" shadow={shadow}>
      <ProductPageHeader product={P.tentChogori} />
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
    <SampleCard label="Example of Nobi's message and suggestions in a sample store's cart after a shopper adds an item" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "15px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <ShoppingBag size={17} color={INK} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>Your cart</span>
        <X size={16} color={MUTED} style={{ marginLeft: "auto" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px" }}>
        <div style={{ width: 48, height: 48, flex: "none" }}>
          <ProductImage product={P.kettle} radius={8} />
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: INK }}>{P.kettle.name}</div>
        <div style={{ fontSize: 14, color: INK }}>{P.kettle.price}</div>
      </div>
      <div style={{ padding: "4px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <NobiReply>Nice pick. Most people who buy the kettle add these:</NobiReply>
        <div style={{ marginLeft: 40 }}>
          <ProductTileRow products={[P.mug, P.grinder]} />
        </div>
      </div>
    </SampleCard>
  );
}

/** AI filters: a shopper describes what they want, and the collection page's own filters are set from it. */
export function AskAiFiltersSample({ shadow }) {
  return (
    <SampleCard label="Example of a shopper describing what they want and Nobi setting a sample store's filters" shadow={shadow}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", border: "1.5px solid rgba(109,59,255,0.35)", borderRadius: 12 }}>
          <Sparkles size={16} color={VIOLET} />
          <span style={{ fontSize: 14.5, color: INK }}>trail running shoes under $180, waterproof</span>
        </div>
      </div>
      <div style={{ padding: "14px 18px 20px" }}>
        <SampleLabel>Filters set</SampleLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {["Type: Trail running", "Waterproof", "Price: Under $180"].map((chip) => (
            <span key={chip} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#ffffff", background: VIOLET, borderRadius: 999, padding: "7px 12px" }}>
              <CheckCircle2 size={13} /> {chip}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <ProductTileRow products={[P.hoka, P.allbirds, P.kizik]} />
        </div>
      </div>
    </SampleCard>
  );
}

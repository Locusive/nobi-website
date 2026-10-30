import React from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { INK, MUTED, SampleCard, VIOLET } from "./sampleParts";
import { ProductImage, SAMPLE_PRODUCT as P } from "./productTiles";

// Sample screen for the AI connectors feature. It is a labeled picture, so its sample text is not read as page content.

const ASSISTANTS = [
  { name: "ChatGPT", tint: "#e4f5ee", ink: "#0f8a54" },
  { name: "Claude", tint: "#fbeee4", ink: "#b2521c" },
];

/** AI connectors: an assistant answering with the store's own product, listed under the store's own name. */
export function AiConnectorsSample({ shadow }) {
  return (
    <SampleCard label="Example of an AI assistant answering a shopper with a sample store's own product, through that store's connector" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <MessageSquare size={17} color={VIOLET} strokeWidth={2.2} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>In an AI assistant</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {ASSISTANTS.map(({ name, tint, ink }) => (
            <span key={name} style={{ fontSize: 11.5, fontWeight: 700, color: ink, background: tint, borderRadius: 999, padding: "4px 9px" }}>
              {name}
            </span>
          ))}
        </span>
      </div>

      <div style={{ padding: "20px 22px 10px" }}>
        <div style={{ fontSize: 16.5, fontWeight: 600, color: MUTED }}>&ldquo;Find me a waterproof jacket under $200.&rdquo;</div>
      </div>

      <div style={{ padding: "0 22px 8px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: "none", width: 64 }}>
          <ProductImage product={P.jacket} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{P.jacket.name}</div>
          <div style={{ marginTop: 3, fontSize: 14, color: MUTED }}>{P.jacket.price} &middot; In stock</div>
        </div>
      </div>

      <div style={{ padding: "12px 22px 20px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#f3f0fa", border: "1px solid rgba(109,59,255,0.2)", borderRadius: 999, padding: "8px 14px" }}>
          <CheckCircle2 size={14} color={VIOLET} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: VIOLET }}>From your store, under your own name</span>
        </div>
      </div>
    </SampleCard>
  );
}

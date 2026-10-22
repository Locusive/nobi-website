import React from "react";
import { Mail } from "lucide-react";
import ProductSection from "./ProductSection";
import { ChatBubble, INK, MUTED, NobiReply, SampleCard, VIOLET } from "./sampleParts";

/** A sample product page chat: one question answered from the store's size guide, one handed to the store's team. */
function SupportSample() {
  return (
    <SampleCard
      label="Example of Nobi answering a shopper's questions on a sample store's product page, then offering a follow-up from the store's team"
      shadow="0 50px 100px -40px rgba(6,12,38,0.85)"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <img src="/media/prod-1.webp" alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>Crochet maxi dress</div>
          <div style={{ fontSize: 12.5, color: MUTED }}>Ask about this product</div>
        </div>
      </div>
      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>Is it lined? I&rsquo;m between sizes.</ChatBubble>
        <NobiReply>
          Yes, it&rsquo;s fully lined. It runs true to size, so most shoppers between sizes pick the larger one.
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: VIOLET }}>Source: Size guide</div>
        </NobiReply>
        <ChatBubble fromShopper>Can I change the address on my order?</ChatBubble>
        <NobiReply>I can&rsquo;t change orders, but our team can. Want them to email you?</NobiReply>
        <div style={{ marginLeft: 40, display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(109,59,255,0.25)", borderRadius: 12, padding: "9px 9px 9px 13px" }}>
          <Mail size={16} color={MUTED} />
          <span style={{ flex: 1, fontSize: 14, color: MUTED }}>you@email.com</span>
          <span style={{ background: VIOLET, color: "#fff", borderRadius: 9, padding: "7px 13px", fontSize: 13, fontWeight: 600 }}>Send</span>
        </div>
      </div>
    </SampleCard>
  );
}

/** The Product page section on automated support. */
export default function SupportSection() {
  return (
    <ProductSection
      sectionId="support"
      bg="#152a5c"
      radial="radial-gradient(70% 60% at 12% 15%, rgba(150,190,255,0.22), rgba(150,190,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(8,16,44,0.55), rgba(8,16,44,0) 70%)"
      title="Answers customers on every page"
      titleMaxCh={13}
      textColor="rgba(238,244,255,0.84)"
      text="Shoppers ask about fit, shipping, or returns, and Nobi answers from your own pages and policies, with the source. When it can't answer, it can pass the question to your team."
      sample={<SupportSample />}
    />
  );
}

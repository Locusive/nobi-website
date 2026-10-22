import React from "react";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, EyeOff, Pin } from "lucide-react";
import ProductSection from "./ProductSection";
import { INK, MUTED, SampleCard } from "./sampleParts";

const RULES = [
  { Icon: Pin, action: "Pin", target: "Bestsellers to the top" },
  { Icon: ArrowUp, action: "Boost", target: "New arrivals" },
  { Icon: ArrowDown, action: "Bury", target: "Final sale items" },
  { Icon: EyeOff, action: "Hide", target: "Out of stock products" },
  { Icon: ArrowRight, action: "Redirect", target: "“returns” to the returns page" },
];

/** A sample list of live merchandising rules. */
function MerchandisingSample() {
  return (
    <SampleCard label="Example of merchandising rules in Nobi for a sample store" shadow="0 50px 100px -45px rgba(4,30,26,0.75)">
      <div style={{ padding: "15px 20px", borderBottom: "1px solid rgba(20,16,40,0.06)", display: "flex", alignItems: "center", gap: 9 }}>
        <CheckCircle2 size={17} color="#0f8a54" strokeWidth={2.2} />
        <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>Search rules</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "4px 10px" }}>Live</span>
      </div>
      <div style={{ padding: "6px 20px 10px" }}>
        {RULES.map(({ Icon, action, target }, index) => (
          <div
            key={action}
            style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderTop: index === 0 ? "none" : "1px solid rgba(20,16,40,0.06)" }}
          >
            <span style={{ flex: "none", width: 34, height: 34, borderRadius: 10, background: "#e0f7ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={17} color="#0c4f46" strokeWidth={2.3} />
            </span>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: INK, width: 70 }}>{action}</span>
            <span style={{ fontSize: 14.5, color: MUTED }}>{target}</span>
          </div>
        ))}
      </div>
    </SampleCard>
  );
}

/** The Product page section on merchandising rules and query overrides. */
export default function MerchandisingSection() {
  return (
    <ProductSection
      sectionId="merchandising"
      bg="#0c4f46"
      radial="radial-gradient(70% 60% at 88% 15%, rgba(120,255,220,0.22), rgba(120,255,220,0) 70%), radial-gradient(60% 55% at 6% 92%, rgba(6,40,34,0.55), rgba(6,40,34,0) 70%)"
      title="Stay in control of every result"
      titleMaxCh={13}
      textColor="rgba(240,255,250,0.84)"
      text="Pin, boost, bury, or hide products, and send any search straight to the right page. No code needed."
      sample={<MerchandisingSample />}
    />
  );
}

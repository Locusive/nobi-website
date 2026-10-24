import React from "react";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, EyeOff, Pin, TrendingDown, TrendingUp } from "lucide-react";
import { INK, MUTED, SampleCard, SampleLabel } from "./sampleParts";

// Sample screens for the features that shape and measure search. Each one is a labeled picture.

const RULES = [
  { Icon: Pin, action: "Pin", target: "Bestsellers to the top" },
  { Icon: ArrowUp, action: "Boost", target: "New arrivals" },
  { Icon: ArrowDown, action: "Bury", target: "Final sale items" },
  { Icon: EyeOff, action: "Hide", target: "Out of stock products" },
  { Icon: ArrowRight, action: "Redirect", target: "“returns” to the returns page" },
];

/** Merchandising: a list of live rules that pin, boost, bury, hide and redirect. */
export function MerchandisingSample({ shadow }) {
  return (
    <SampleCard label="Example of merchandising rules in Nobi for a sample store" shadow={shadow}>
      <div style={{ padding: "15px 20px", borderBottom: "1px solid rgba(20,16,40,0.06)", display: "flex", alignItems: "center", gap: 9 }}>
        <CheckCircle2 size={17} color="#0f8a54" strokeWidth={2.2} />
        <span style={{ fontSize: 14, fontWeight: 600, color: INK }}>Search rules</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#0f8a54", background: "#ecfdf5", borderRadius: 999, padding: "4px 10px" }}>Live</span>
      </div>
      <div style={{ padding: "6px 20px 10px" }}>
        {RULES.map(({ Icon, action, target }, index) => (
          <div key={action} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderTop: index === 0 ? "none" : "1px solid rgba(20,16,40,0.06)" }}>
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

const TRENDING = [
  { query: "maxi dress", change: "+64%", width: "92%", rising: true },
  { query: "wedding guest", change: "+41%", width: "70%", rising: true },
  { query: "white sneakers", change: "-12%", width: "38%", rising: false },
];

/** One trending search: the search, a bar for its volume, and how much it changed. */
function TrendingRow({ query, change, width, rising }) {
  const Icon = rising ? TrendingUp : TrendingDown;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "118px 1fr 64px", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <span style={{ fontSize: 14, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{query}</span>
      <span style={{ height: 8, borderRadius: 99, background: "#f1ecff", overflow: "hidden" }}>
        <span style={{ display: "block", width, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#6d3bff,#d541b3)" }} />
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 13, fontWeight: 700, color: rising ? "#0f8a54" : "#c2410c" }}>
        <Icon size={14} strokeWidth={2.4} />
        {change}
      </span>
    </div>
  );
}

const TOPICS = [
  { label: "Sizing & fit", share: "28%", width: "92%" },
  { label: "Shipping & delivery", share: "19%", width: "63%" },
  { label: "Materials", share: "14%", width: "46%" },
];

/** One topic shoppers are asking about, with a bar for its share. */
function TopicRow({ label, share, width }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "128px 1fr 40px", alignItems: "center", gap: 12, padding: "7px 0" }}>
      <span style={{ fontSize: 14, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ height: 8, borderRadius: 99, background: "#f1ecff", overflow: "hidden" }}>
        <span style={{ display: "block", width, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#6d3bff,#d541b3)" }} />
      </span>
      <span style={{ fontSize: 13, fontWeight: 700, color: MUTED, textAlign: "right" }}>{share}</span>
    </div>
  );
}

/** Insights: what customers search for, what is trending, and what they ask about. */
export function InsightsSample({ shadow }) {
  return (
    <SampleCard label="Example of the Nobi insights report for a sample store" shadow={shadow}>
      <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <SampleLabel>Trending searches</SampleLabel>
        <div style={{ marginTop: 8 }}>
          {TRENDING.map((row) => (
            <TrendingRow key={row.query} {...row} />
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 20px 18px" }}>
        <SampleLabel>What shoppers ask about</SampleLabel>
        <div style={{ marginTop: 8 }}>
          {TOPICS.map((topic) => (
            <TopicRow key={topic.label} {...topic} />
          ))}
        </div>
      </div>
    </SampleCard>
  );
}

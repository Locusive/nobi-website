import React from "react";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle2, EyeOff, Pin, Search, TrendingDown, TrendingUp } from "lucide-react";
import { INK, MUTED, SampleCard, SampleLabel, VIOLET } from "./sampleParts";

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

/** Search analytics: trending searches, the best converting searches, and revenue from search. */
export function SearchAnalyticsSample({ shadow }) {
  return (
    <SampleCard label="Example of the Nobi search analytics report for a sample store" shadow={shadow}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <SampleLabel>Trending searches</SampleLabel>
        <div style={{ marginTop: 8 }}>
          {TRENDING.map((row) => (
            <TrendingRow key={row.query} {...row} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "16px 20px 20px", borderRight: "1px solid rgba(20,16,40,0.07)" }}>
          <SampleLabel>Best converting</SampleLabel>
          {[["gift for dad", "9.4%"], ["rain jacket", "7.1%"]].map(([query, rate]) => (
            <div key={query} style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, color: INK }}>
              <span>{query}</span>
              <span style={{ fontWeight: 700 }}>{rate}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 20px 20px" }}>
          <SampleLabel>Revenue from search</SampleLabel>
          <div style={{ marginTop: 10, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}>$48,210</div>
          <div style={{ marginTop: 2, fontSize: 12.5, color: MUTED }}>This month</div>
        </div>
      </div>
    </SampleCard>
  );
}

/** One ad platform that received the search, and the event it received. */
function PixelEvent({ platform, eventName }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderTop: "1px solid rgba(20,16,40,0.07)" }}>
      <CheckCircle2 size={18} color="#1fab6d" strokeWidth={2.4} />
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: INK }}>{platform}</span>
      <code style={{ fontSize: 12.5, color: VIOLET, background: "#f1ecff", borderRadius: 8, padding: "4px 8px" }}>{eventName}</code>
    </div>
  );
}

/** Remarketing: one search sent on to the store's Meta Pixel and Google Tag Manager. */
export function RemarketingSample({ shadow }) {
  return (
    <SampleCard label="Example of a search on a sample store being sent to its Meta Pixel and Google Tag Manager" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 20px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <Search size={18} color={VIOLET} strokeWidth={2.3} />
        <span style={{ fontSize: 15.5, color: INK }}>trail running shoes</span>
      </div>
      <div style={{ padding: "10px 20px 8px" }}>
        <div style={{ padding: "6px 0 4px" }}>
          <SampleLabel>Sent to</SampleLabel>
        </div>
        <PixelEvent platform="Meta Pixel" eventName="Search" />
        <PixelEvent platform="Google Tag Manager" eventName="nobi_search" />
      </div>
    </SampleCard>
  );
}

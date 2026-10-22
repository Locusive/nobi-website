import React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import ProductSection from "./ProductSection";
import { INK, MUTED, SampleCard, SampleLabel } from "./sampleParts";

const TRENDING_SEARCHES = [
  { query: "maxi dress", change: "+64%", width: "92%", rising: true },
  { query: "wedding guest", change: "+41%", width: "70%", rising: true },
  { query: "white sneakers", change: "-12%", width: "38%", rising: false },
];

const CONVERTING_SEARCHES = [
  { query: "gift for dad", rate: "9.4%" },
  { query: "rain jacket", rate: "7.1%" },
];

/** One row of the sample trending searches: the search, a bar for its volume, and its change. */
function TrendingRow({ query, change, width, rising }) {
  const Icon = rising ? TrendingUp : TrendingDown;
  const color = rising ? "#0f8a54" : "#c2410c";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "118px 1fr 64px", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <span style={{ fontSize: 14, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{query}</span>
      <span style={{ height: 8, borderRadius: 99, background: "#f1ecff", overflow: "hidden" }}>
        <span style={{ display: "block", width, height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#6d3bff,#d541b3)" }} />
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, fontSize: 13, fontWeight: 700, color }}>
        <Icon size={14} strokeWidth={2.4} />
        {change}
      </span>
    </div>
  );
}

/** A sample insights report: trending searches, the searches that convert best, and revenue from search. */
function InsightsSample() {
  return (
    <SampleCard label="Example of the Nobi insights report for a sample store" shadow="0 50px 100px -40px rgba(50,18,2,0.8)">
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <SampleLabel>Trending searches</SampleLabel>
        <div style={{ marginTop: 8 }}>
          {TRENDING_SEARCHES.map((row) => (
            <TrendingRow key={row.query} {...row} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "16px 20px 20px", borderRight: "1px solid rgba(20,16,40,0.07)" }}>
          <SampleLabel>Best converting</SampleLabel>
          {CONVERTING_SEARCHES.map((row) => (
            <div key={row.query} style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 14, color: INK }}>
              <span>{row.query}</span>
              <span style={{ fontWeight: 700 }}>{row.rate}</span>
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

/** The Product page section on search insights. */
export default function InsightsSection() {
  return (
    <ProductSection
      sectionId="insights"
      bg="#9a4a0c"
      radial="radial-gradient(70% 60% at 88% 15%, rgba(255,214,150,0.24), rgba(255,214,150,0) 70%), radial-gradient(60% 55% at 6% 92%, rgba(60,20,4,0.55), rgba(60,20,4,0) 70%)"
      title="See what shoppers want"
      titleMaxCh={12}
      textColor="rgba(255,248,240,0.86)"
      text="See which searches are trending, which ones convert, and how much revenue search brings in. UNTUCKit's team reviews them every week."
      sample={<InsightsSample />}
    />
  );
}

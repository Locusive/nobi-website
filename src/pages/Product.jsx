import React from "react";
import { useSEO } from "../hooks/useSEO";
import { ProductSeo } from "../content/product";
import { FEATURE_GROUPS, listFeaturesInGroup } from "../content/features";
import "../components/home/homepage.css";
import Nav from "../components/home/Nav";
import FooterCTA from "../components/home/FooterCTA";
import SiteFooter from "../components/home/SiteFooter";
import FeatureGroupSection from "../components/features/FeatureGroupSection";

// The group sections alternate between these backgrounds so each group reads as its own block.
const GROUP_BACKGROUNDS = ["#ffffff", "#f7f5fc"];

/** A jump link to one group's section, showing the group name and how many features it holds. */
function GroupChip({ group }) {
  const count = listFeaturesInGroup(group.id).length;

  return (
    <a href={`#${group.id}`} className="nb-group-chip">
      {group.name}
      <span className="nb-group-chip-count">{count}</span>
    </a>
  );
}

/** The page's opening: what Nobi does across the shopping journey, with a jump link to each group. */
function AllFeaturesHero() {
  return (
    <header style={{ position: "relative", overflow: "hidden", background: "#120d21", color: "#fff", padding: "150px clamp(24px,5vw,80px) 64px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(50% 60% at 18% 0%, rgba(109,59,255,0.5), rgba(109,59,255,0) 70%), radial-gradient(45% 55% at 92% 20%, rgba(213,65,179,0.38), rgba(213,65,179,0) 70%)" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1120, margin: "0 auto" }}>
        <span style={{ fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
          All features
        </span>
        <h1 style={{ margin: "22px 0 0", fontSize: "clamp(44px,6.4vw,94px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.96, maxWidth: "16ch" }}>
          Help shoppers find it, ask about it, and buy it.
        </h1>
        <p style={{ margin: "26px 0 0", maxWidth: "52ch", fontSize: "clamp(17px,1.4vw,21px)", lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>
          One AI assistant across your whole site. Here is everything it does, grouped by the job it gets done.
        </p>
        <nav aria-label="Feature groups" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 38 }}>
          {FEATURE_GROUPS.map((group) => (
            <GroupChip key={group.id} group={group} />
          ))}
        </nav>
      </div>
    </header>
  );
}

/** The All features page: every Nobi feature, by group, each linking to its own page. */
export default function Product() {
  useSEO(ProductSeo);

  return (
    <div style={{ fontFamily: "'Schibsted Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif", background: "#ffffff" }}>
      <Nav active="product" />
      <AllFeaturesHero />
      {FEATURE_GROUPS.map((group, index) => (
        <FeatureGroupSection key={group.id} group={group} background={GROUP_BACKGROUNDS[index % GROUP_BACKGROUNDS.length]} />
      ))}
      <FooterCTA />
      <SiteFooter />
    </div>
  );
}

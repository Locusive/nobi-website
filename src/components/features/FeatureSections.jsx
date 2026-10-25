import React from "react";
import { ArrowRight, Check } from "lucide-react";
import ScrollLink from "../home/ScrollLink";
import FeatureCard from "./FeatureCard";
import { ALL_FEATURES_PATH, listFeaturesInGroup } from "../../content/features";

const INK = "#1b1626";
const BODY = "#615b70";
const SECTION_PADDING = "clamp(88px,10vw,140px) clamp(24px,5vw,80px)";
const BIG_HEADING = { margin: 0, fontSize: "clamp(36px,4.4vw,64px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02, color: INK };

/** Why a feature helps: a lead line and the outcomes it drives. */
export function WhyItHelps({ heading, benefits }) {
  return (
    <section style={{ background: "#ffffff", padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ ...BIG_HEADING, maxWidth: "18ch" }}>{heading}</h2>
        <div className="nb-grid3" style={{ marginTop: "clamp(44px,5vw,64px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(24px,3vw,40px)" }}>
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: 11, alignItems: "center", justifyContent: "center", background: "#f1ecff", color: "#6d3bff" }}>
                <Check size={21} strokeWidth={2.6} />
              </span>
              <h3 style={{ margin: "18px 0 0", fontSize: "clamp(19px,1.6vw,23px)", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2, color: INK }}>{benefit.title}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 16.5, lineHeight: 1.55, color: BODY }}>{benefit.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Where a feature fits: one short example per industry, so a reader sees themselves in it. */
export function WorksFor({ examples, background }) {
  return (
    <section style={{ background, padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={BIG_HEADING}>Works for your business</h2>
        <div className="nb-grid-auto" style={{ marginTop: "clamp(40px,4vw,56px)", display: "grid", gridTemplateColumns: `repeat(${examples.length},1fr)`, gap: 16 }}>
          {examples.map((example) => (
            <div key={example.vertical} style={{ padding: "26px 26px 28px", background: "#ffffff", border: "1px solid rgba(20,16,40,0.09)", borderRadius: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6d3bff" }}>{example.vertical}</div>
              <p style={{ margin: "14px 0 0", fontSize: "clamp(17px,1.4vw,20px)", lineHeight: 1.5, color: INK }}>{example.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** What a feature includes: the distinct capabilities inside it, as a grid of bordered cards. */
export function WhatsIncluded({ items, background }) {
  return (
    <section style={{ background, padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={BIG_HEADING}>What&rsquo;s included</h2>
        <div className="nb-grid2" style={{ marginTop: "clamp(40px,4vw,56px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {items.map((item) => (
            <div key={item.title} style={{ display: "flex", gap: 16, padding: "26px 26px 28px", background: "#ffffff", border: "1px solid rgba(20,16,40,0.09)", borderRadius: 20 }}>
              <span style={{ flex: "none", width: 44, height: 44, borderRadius: 12, background: "#f1ecff", color: "#6d3bff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={22} strokeWidth={2.4} />
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: "clamp(18px,1.5vw,22px)", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2, color: INK }}>{item.title}</h3>
                <p style={{ margin: "9px 0 0", fontSize: 16, lineHeight: 1.55, color: BODY }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One question and its answer, opening and closing on click. */
function FaqItem({ question, answer }) {
  return (
    <details className="nb-faq" style={{ borderTop: "1px solid rgba(20,16,40,0.12)", padding: "22px 0" }}>
      <summary style={{ listStyle: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center", fontSize: "clamp(18px,1.5vw,22px)", fontWeight: 700, letterSpacing: "-0.015em", color: INK }}>
        {question}
        <span className="nb-faq-mark" style={{ flex: "none", fontSize: 26, fontWeight: 400, color: "#6d3bff", lineHeight: 1 }}>+</span>
      </summary>
      <p style={{ margin: "14px 0 0", maxWidth: "70ch", fontSize: 17, lineHeight: 1.6, color: BODY }}>{answer}</p>
    </details>
  );
}

/** Common questions about a feature. Doubles as text search engines can read. */
export function FeatureFaq({ faq }) {
  return (
    <section style={{ background: "#ffffff", padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={BIG_HEADING}>Common questions</h2>
        <div style={{ marginTop: "clamp(32px,4vw,48px)" }}>
          {faq.map((item) => (
            <FaqItem key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** The three steps of how a feature works. They are numbered because they happen in that order. */
export function HowItWorks({ steps }) {
  return (
    <section style={{ background: "#ffffff", padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={BIG_HEADING}>How it works</h2>
        <ol className="nb-steps" style={{ listStyle: "none", margin: "clamp(44px,5vw,64px) 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(28px,4vw,56px)" }}>
          {steps.map((step, index) => (
            <li key={step.title} style={{ borderTop: "2px solid #1b1626", paddingTop: 22 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#6d3bff" }}>Step {index + 1}</div>
              <h3 style={{ margin: "10px 0 0", fontSize: "clamp(22px,1.9vw,27px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, color: INK }}>{step.title}</h3>
              <p style={{ margin: "12px 0 0", fontSize: 17, lineHeight: 1.55, color: BODY }}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A real customer result for this feature, from a published case study, with a link to the story. */
export function FeatureProof({ proof }) {
  return (
    <section style={{ background: "#1b1626", padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#ffc07a" }}>{proof.customer}</div>
          <div style={{ marginTop: 16, fontSize: "clamp(64px,9vw,132px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.92, color: "#ffffff" }}>{proof.stat}</div>
          <p style={{ margin: "22px 0 0", fontSize: "clamp(18px,1.6vw,23px)", lineHeight: 1.45, color: "rgba(255,255,255,0.78)", maxWidth: "40ch" }}>{proof.detail}</p>
        </div>
        <ScrollLink to={proof.storyPath} className="nb-proof-link" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 700, color: "#ffffff", textDecoration: "none", borderBottom: "2px solid rgba(255,255,255,0.4)", paddingBottom: 4 }}>
          Read the story <ArrowRight size={17} />
        </ScrollLink>
      </div>
    </section>
  );
}

/** The other features in the same group, then a link to every feature. */
export function RelatedFeatures({ feature, groupName }) {
  const others = listFeaturesInGroup(feature.group).filter((other) => other.slug !== feature.slug);

  return (
    <section style={{ background: "#f7f5fc", padding: SECTION_PADDING }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={BIG_HEADING}>More in {groupName}</h2>
        <div className="nb-grid3" style={{ marginTop: "clamp(36px,4vw,52px)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {others.map((other) => (
            <FeatureCard key={other.slug} slug={other.slug} />
          ))}
        </div>
        <ScrollLink to={ALL_FEATURES_PATH} className="nb-proof-link" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 36, fontSize: 16, fontWeight: 700, color: "#6d3bff", textDecoration: "none" }}>
          Explore all features <ArrowRight size={17} />
        </ScrollLink>
      </div>
    </section>
  );
}

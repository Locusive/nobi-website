import React from "react";

// Every claim here was checked against the Nobi code before it was written. Check again before adding one.
const ALSO_IN_NOBI = [
  { title: "Proactive prompts", body: "Start a conversation when a visitor is about to leave, stops scrolling, or arrives from a search engine." },
  { title: "One-click add to cart", body: "Shoppers add products to their cart straight from search results." },
  { title: "Any language", body: "Nobi replies in the language the shopper writes in." },
  { title: "Remarketing", body: "Send Nobi searches to your Meta Pixel and Google Tag Manager." },
  { title: "Custom actions", body: "Developers can let Nobi run actions on your site, like opening a booking form." },
];

// Enterprise features are the ones the Nobi team sets up for a store, unlike the rest of Nobi, which is self-service.
const ENTERPRISE_FEATURES = [
  { title: "Product recommendations", body: "Related products on product pages and in the cart, chosen for the product being viewed." },
  { title: "Product page Q&A", body: "Past shopper questions and answers, searchable on each product page." },
  { title: "Cart assistant", body: "A message and product suggestions when a shopper adds to cart." },
  { title: "Ask AI filters", body: "Shoppers describe what they want, and Nobi sets the page's filters." },
];

/** One feature in a list: a bold name over a single line of description. */
function FeatureItem({ title, body }) {
  return (
    <li style={{ padding: "20px 0", borderTop: "1px solid rgba(20,16,40,0.09)" }}>
      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.015em", color: "#1b1626" }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 16, lineHeight: 1.5, color: "#615b70" }}>{body}</div>
    </li>
  );
}

/** One titled column of features. note is a short line under the title; the space is kept when it is empty so both columns line up. */
function FeatureColumn({ heading, note, items }) {
  return (
    <div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6d3bff" }}>
        {heading}
      </h3>
      <p style={{ margin: "8px 0 14px", minHeight: 24, fontSize: 15.5, color: "#615b70" }}>{note}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item) => (
          <FeatureItem key={item.title} {...item} />
        ))}
      </ul>
    </div>
  );
}

/** The closing list on the Product page: smaller features, and enterprise features the Nobi team sets up. */
export default function AlsoInNobi() {
  return (
    <section style={{ background: "#ffffff", padding: "clamp(96px,11vw,150px) clamp(24px,5vw,80px)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ margin: 0, fontSize: "clamp(40px,5vw,74px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1, color: "#1b1626" }}>
          And there&rsquo;s more
        </h2>
        <div className="nb-grid2" style={{ marginTop: "clamp(48px,6vw,72px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,96px)" }}>
          <FeatureColumn heading="Also in Nobi" items={ALSO_IN_NOBI} />
          <FeatureColumn heading="Enterprise" note="Our team sets these up for you." items={ENTERPRISE_FEATURES} />
        </div>
      </div>
    </section>
  );
}

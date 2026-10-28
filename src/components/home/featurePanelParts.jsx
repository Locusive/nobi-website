import React from "react";

// Shared type and texture for the large colored feature panels on the homepage and the Product page.

/** A fine grain laid over a panel's color so large flat areas do not look plastic. */
export const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** The small monospace label above a panel headline. */
export function Kicker({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'SF Mono',ui-monospace,Menlo,monospace",
        fontSize: 13,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

/** The large panel headline. maxCh caps the line length so the headline wraps into a tight block.
 *  as picks the heading level, so a page's opening panel can hold its one h1. */
export function FeatH2({ children, maxCh, as: Heading = "h2" }) {
  return (
    <Heading
      style={{
        margin: "16px 0 0",
        fontSize: "clamp(40px,5vw,74px)",
        fontWeight: 700,
        letterSpacing: "-0.035em",
        color: "#fff",
        lineHeight: 1.0,
        maxWidth: `${maxCh}ch`,
      }}
    >
      {children}
    </Heading>
  );
}

/** The paragraph under a panel headline. */
export function FeatP({ children, color }) {
  return <p style={{ margin: "22px 0 0", maxWidth: "42ch", fontSize: "clamp(17px,1.4vw,22px)", lineHeight: 1.5, color }}>{children}</p>;
}

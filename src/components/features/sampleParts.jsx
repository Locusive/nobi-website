import React from "react";
import { Sparkles } from "lucide-react";

// Small building blocks for the sample screens on the Product page.

export const INK = "#1b1626";
export const MUTED = "#8a8498";
export const VIOLET = "#6d3bff";

/**
 * The white card that holds a section's sample screen. It is marked as a labeled picture,
 * so its sample text is not read as real page content. label describes the sample.
 */
export function SampleCard({ label, shadow, children }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ width: "min(480px,100%)", background: "#ffffff", borderRadius: 24, boxShadow: shadow, overflow: "hidden" }}
    >
      {children}
    </div>
  );
}

/** One message in a sample chat. fromShopper puts it on the right in a tinted bubble. */
export function ChatBubble({ fromShopper, children }) {
  return (
    <div style={{ display: "flex", justifyContent: fromShopper ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "86%",
          padding: "12px 15px",
          borderRadius: 16,
          borderBottomRightRadius: fromShopper ? 5 : 16,
          borderBottomLeftRadius: fromShopper ? 16 : 5,
          background: fromShopper ? "#f1ecff" : "#f7f6fa",
          color: INK,
          fontSize: 15,
          lineHeight: 1.5,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A reply from Nobi in a sample chat: the gradient mark, then the message. */
export function NobiReply({ children }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      <span
        style={{
          flex: "none",
          width: 30,
          height: 30,
          borderRadius: 9,
          background: "linear-gradient(135deg,#6d3bff,#d541b3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles size={15} color="#fff" />
      </span>
      <ChatBubble>{children}</ChatBubble>
    </div>
  );
}

/** The small uppercase heading over a group of rows inside a sample screen. */
export function SampleLabel({ children }) {
  return (
    <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a49dba" }}>
      {children}
    </div>
  );
}

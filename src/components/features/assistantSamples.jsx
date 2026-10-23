import React from "react";
import { Car, CheckCircle2, Mail, Sparkles, Wrench, Zap } from "lucide-react";
import { ChatBubble, INK, MUTED, NobiReply, SampleCard, SampleLabel, VIOLET } from "./sampleParts";

// Sample screens for the assistant features. Each one is a labeled picture, so its sample text is not read as page content.

/** Automated support: one question answered from the store's size guide, one handed to the store's team. */
export function AutomatedSupportSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi answering a visitor's questions on a sample store, then offering a follow-up from the store's team" shadow={shadow}>
      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>Is the crochet dress lined? I&rsquo;m between sizes.</ChatBubble>
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

const LEADS = [
  { Icon: Car, summary: "Test drive on Saturday", kind: "Sales lead", team: "Sales team" },
  { Icon: Wrench, summary: "Brake check next week", kind: "Service lead", team: "Service team" },
];

/** Lead capture: a dealership chat that captures a sales lead, beside a service lead sent to another team. */
export function LeadCaptureSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi capturing a sales lead and a service lead on a sample car dealership's site and sending each to a different team" shadow={shadow}>
      <div style={{ padding: "18px 18px 6px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>Do you have the hybrid SUV in blue? I&rsquo;d like a test drive Saturday.</ChatBubble>
        <NobiReply>We have two in stock. What&rsquo;s the best number to reach you?</NobiReply>
      </div>
      <div style={{ padding: "18px 18px 8px" }}>
        <div style={{ paddingBottom: 6 }}>
          <SampleLabel>New leads</SampleLabel>
        </div>
        {LEADS.map(({ Icon, summary, kind, team }) => (
          <div key={summary} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderTop: "1px solid rgba(20,16,40,0.07)" }}>
            <span style={{ flex: "none", width: 36, height: 36, borderRadius: 10, background: "#ffe6f4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={18} color="#b81e6a" strokeWidth={2.2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>{summary}</div>
              <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{kind}</div>
            </div>
            <span style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#0f8a54" }}>
              <CheckCircle2 size={15} color="#1fab6d" strokeWidth={2.6} />
              {team}
            </span>
          </div>
        ))}
      </div>
    </SampleCard>
  );
}

/** Proactive prompts: a message card that appears when a visitor is about to leave a product page. */
export function ProactivePromptsSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi starting a conversation with a visitor who is about to leave a sample store's product page" shadow={shadow}>
      <div style={{ position: "relative", height: 380, background: "linear-gradient(180deg,#f7f5fc,#efeaf8)" }}>
        <div style={{ position: "absolute", top: 22, left: 22, right: 22, display: "flex", gap: 16 }}>
          <img src="/media/prod-2.webp" alt="" style={{ width: 120, height: 150, borderRadius: 14, objectFit: "cover" }} />
          <div style={{ flex: 1, paddingTop: 6 }}>
            <div style={{ height: 12, width: "70%", borderRadius: 6, background: "#ddd6ec" }} />
            <div style={{ height: 10, width: "40%", borderRadius: 6, background: "#e6e0f1", marginTop: 12 }} />
            <div style={{ height: 34, width: "60%", borderRadius: 10, background: "#ddd6ec", marginTop: 22 }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, background: "#ffffff", borderRadius: 18, padding: 18, boxShadow: "0 24px 50px -24px rgba(40,20,90,0.55)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED }}>
            <Zap size={13} color={VIOLET} /> Shown when the visitor is about to leave
          </div>
          <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.5, color: INK }}>Still deciding? I can compare sizes, or find something similar in stock.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {["Compare sizes", "Show similar"].map((label) => (
              <span key={label} style={{ fontSize: 13, fontWeight: 600, color: VIOLET, border: "1px solid rgba(109,59,255,0.3)", borderRadius: 999, padding: "7px 13px" }}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </SampleCard>
  );
}

/** Any language: a visitor writes in Spanish and Nobi answers in Spanish. */
export function AnyLanguageSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi replying in Spanish to a visitor who wrote in Spanish on a sample store" shadow={shadow}>
      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>&iquest;Este vestido viene en talla mediana?</ChatBubble>
        <NobiReply>S&iacute;, la talla M est&aacute; disponible en rojo y en marfil. &iquest;Quieres que te muestre los dos?</NobiReply>
        <ChatBubble fromShopper>Do you ship to Canada?</ChatBubble>
        <NobiReply>Yes, orders to Canada arrive in 3 to 5 business days.</NobiReply>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4, fontSize: 12, fontWeight: 600, color: MUTED }}>
          <Sparkles size={13} color={VIOLET} /> Each reply matches the language of the message
        </div>
      </div>
    </SampleCard>
  );
}

const CODE_LINES = [
  ["#c9c2e0", "window.NobiTools = [{"],
  ["#86efac", "  name: 'bookTestDrive',"],
  ["#86efac", "  description: 'Books a test drive for a car',"],
  ["#c9c2e0", "  parameters: { type: 'object', properties: { ... } },"],
  ["#7dd3fc", "  handler: async (args) => openBookingForm(args),"],
  ["#c9c2e0", "}];"],
];

/** Custom actions: a developer registers an action, and Nobi runs it when a visitor asks for it. */
export function CustomActionsSample({ shadow }) {
  return (
    <SampleCard label="Example of a custom action a developer adds to a site, and Nobi running it when a visitor asks to book a test drive" shadow={shadow}>
      <div style={{ background: "#14101f", padding: "16px 18px", fontFamily: "'SF Mono',ui-monospace,Menlo,monospace", fontSize: 12.5, lineHeight: 1.75, overflowX: "hidden" }}>
        {CODE_LINES.map(([color, line]) => (
          <div key={line} style={{ color, whiteSpace: "pre" }}>{line}</div>
        ))}
      </div>
      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>Can I book a test drive for Saturday morning?</ChatBubble>
        <NobiReply>Done. I opened the booking form with Saturday morning filled in.</NobiReply>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: 40, fontSize: 12, fontWeight: 600, color: "#0f8a54" }}>
          <CheckCircle2 size={14} /> Ran bookTestDrive on your site
        </div>
      </div>
    </SampleCard>
  );
}

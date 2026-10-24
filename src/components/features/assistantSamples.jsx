import React from "react";
import { Car, CheckCircle2, FileText, Sparkles, UserPlus, Wrench, Zap } from "lucide-react";
import { ChatBubble, INK, MUTED, NobiReply, SampleCard, VIOLET } from "./sampleParts";
import { ProductImage } from "./productTiles";

// Sample screens for the assistant features. Each one is a labeled picture, so its sample text is not read as page content.

/** Automated support: one shopper question, one clear cited answer, in large type. */
export function AutomatedSupportSample({ shadow }) {
  return (
    <SampleCard label="Example of Nobi answering a visitor's question on a sample store, with the page it cites" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6d3bff,#d541b3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={15} color="#fff" />
        </span>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>Ask anything</span>
      </div>
      <div style={{ padding: "22px 22px 24px" }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: MUTED }}>&ldquo;Do these boots run true to size?&rdquo;</div>
        <div style={{ marginTop: 16, fontSize: 22, lineHeight: 1.4, fontWeight: 600, color: INK }}>
          They run about half a size large. Most customers order a half size down.
        </div>
        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 7, background: "#f3f0fa", border: "1px solid rgba(109,59,255,0.2)", borderRadius: 999, padding: "8px 14px" }}>
          <FileText size={14} color={VIOLET} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: VIOLET }}>From your Fit guide</span>
        </div>
      </div>
    </SampleCard>
  );
}

const LEADS = [
  { Icon: Car, name: "Jordan Fuller", detail: "Wants a test drive this Saturday", kind: "Sales", team: "Sales team", tint: "#ede9ff", ink: "#5a2fe0" },
  { Icon: Wrench, name: "Priya Shah", detail: "Needs a brake check next week", kind: "Service", team: "Service team", tint: "#e0f7ef", ink: "#0f8a54" },
];

/** Lead capture: the leads Nobi collected, each tagged sales or service and routed to the right team. */
export function LeadCaptureSample({ shadow }) {
  return (
    <SampleCard label="Example of the leads Nobi captured on a sample car dealership's site, each routed to the right team" shadow={shadow}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(20,16,40,0.07)" }}>
        <UserPlus size={18} color="#b81e6a" strokeWidth={2.2} />
        <span style={{ fontSize: 14.5, fontWeight: 700, color: INK }}>New leads</span>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: MUTED }}>Today</span>
      </div>
      <div style={{ padding: "8px 20px 18px" }}>
        {LEADS.map(({ Icon, name, detail, kind, team, tint, ink }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 0", borderBottom: "1px solid rgba(20,16,40,0.06)" }}>
            <span style={{ flex: "none", width: 42, height: 42, borderRadius: 12, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={20} color={ink} strokeWidth={2.2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{name}</div>
              <div style={{ fontSize: 13.5, color: MUTED, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{detail}</div>
            </div>
            <div style={{ flex: "none", textAlign: "right" }}>
              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: ink, background: tint, borderRadius: 999, padding: "4px 10px" }}>{kind}</span>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 5 }}>&rarr; {team}</div>
            </div>
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
          <div style={{ width: 120, height: 150, flex: "none" }}>
            <ProductImage category="electronics" ratio="4/5" radius={14} />
          </div>
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
          <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.5, color: INK }}>Still deciding? I can compare these, or find something similar in stock.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {["Compare options", "Show similar"].map((label) => (
              <span key={label} style={{ fontSize: 13, fontWeight: 600, color: VIOLET, border: "1px solid rgba(109,59,255,0.3)", borderRadius: 999, padding: "7px 13px" }}>{label}</span>
            ))}
          </div>
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

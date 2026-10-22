import React from "react";
import { Car, CheckCircle2, Wrench } from "lucide-react";
import ProductSection from "./ProductSection";
import { ChatBubble, INK, MUTED, NobiReply, SampleCard, SampleLabel } from "./sampleParts";

const LEADS = [
  { Icon: Car, summary: "Test drive on Saturday", kind: "Sales lead", team: "Sales team" },
  { Icon: Wrench, summary: "Brake check next week", kind: "Service lead", team: "Service team" },
];

/** One captured lead in the sample: what the visitor wants, its kind, and the team it was emailed to. */
function LeadRow({ Icon, summary, kind, team }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderTop: "1px solid rgba(20,16,40,0.07)" }}>
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
  );
}

/** A sample dealership chat that captures a sales lead, beside a service lead sent to a different team. */
function LeadCaptureSample() {
  return (
    <SampleCard
      label="Example of Nobi capturing a sales lead and a service lead on a sample car dealership's site and sending each to a different team"
      shadow="0 50px 100px -40px rgba(40,6,30,0.8)"
    >
      <div style={{ padding: "18px 18px 6px", display: "flex", flexDirection: "column", gap: 12 }}>
        <ChatBubble fromShopper>Do you have the hybrid SUV in blue? I&rsquo;d like a test drive Saturday.</ChatBubble>
        <NobiReply>We have two in stock. What&rsquo;s the best number to reach you?</NobiReply>
      </div>
      <div style={{ padding: "18px 18px 8px" }}>
        <div style={{ paddingBottom: 6 }}>
          <SampleLabel>New leads</SampleLabel>
        </div>
        {LEADS.map((lead) => (
          <LeadRow key={lead.summary} {...lead} />
        ))}
      </div>
    </SampleCard>
  );
}

/** The Product page section on lead capture. */
export default function LeadCaptureSection() {
  return (
    <ProductSection
      sectionId="lead-capture"
      bg="#b81e6a"
      radial="radial-gradient(70% 60% at 12% 18%, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%), radial-gradient(60% 55% at 92% 92%, rgba(40,6,60,0.5), rgba(40,6,60,0) 70%)"
      title="Turn conversations into leads"
      titleMaxCh={13}
      textColor="rgba(255,247,255,0.86)"
      text="Nobi asks for contact details at the right moment, tells sales requests from service requests, and emails each lead to the right team."
      sample={<LeadCaptureSample />}
    />
  );
}

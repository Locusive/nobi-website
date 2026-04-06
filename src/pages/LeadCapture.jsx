import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import Marquee from "react-fast-marquee";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "Faherty", src: "/media/logos/faherty.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

export default function LeadCapture() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Lead Capture | Nobi";
  }, []);

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                  Lead capture
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Turn browsers into{" "}
                  <span className={GRADIENT}>contacts</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Nobi collects contact info inside the conversation, at the exact moment a visitor is engaged. No pop-up forms. No interruptions. Every lead goes straight to your CRM with full source attribution.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={getSignupUrl()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base w-full sm:w-auto"
                  >
                    Sign up free
                  </a>
                  <button
                    onClick={onOpen}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-black/10 bg-white/70 h-12 px-6 text-base w-full sm:w-auto hover:border-black/30"
                  >
                    Get a demo
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-violet-200/60 via-white to-fuchsia-200/60 rounded-[34px] blur-3xl opacity-80" aria-hidden />
                <ConversationMock />
              </div>
            </div>
          </div>
        </section>

        {/* Logo bar */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white pb-16 pt-12">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-4">
            <p className="text-center text-sm text-black/50 tracking-[0.04em]">
              Used by ecommerce teams that care about converting visitors
            </p>
            <div className="marquee-container">
              <div className="bg-white rounded-xl border border-[#d6d6d6] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.45)] overflow-hidden py-5 px-2">
                <Marquee speed={36} gradient={false} pauseOnHover>
                  {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((logo, idx) => (
                    <img
                      key={logo.alt + idx}
                      src={logo.src}
                      alt={logo.alt}
                      className="h-5 w-auto object-contain grayscale opacity-60 hover:opacity-100 transition mx-4"
                      loading="lazy"
                    />
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {[
                {
                  stat: "17.6%",
                  label: "conversion rate",
                  desc: "UNTUCKit Nobi users vs. 15.0% on Shopify default in a direct A/B test.",
                  palette: "blue",
                },
                {
                  stat: "+21.3%",
                  label: "revenue per referral",
                  desc: "Faherty Brand after switching to Nobi lead capture, measured against their prior tool.",
                  palette: "purple",
                },
                {
                  stat: "100%",
                  label: "of leads attributed",
                  desc: "Every contact tagged with the conversation, campaign, and channel that drove it.",
                  palette: "blue",
                },
              ].map((item) => (
                <div
                  key={item.stat}
                  className={`relative overflow-hidden rounded-xl border text-white shadow-[0_18px_42px_-24px_rgba(64,41,153,0.45)] ${
                    item.palette === "blue"
                      ? "border-[#3f6bff] bg-gradient-to-br from-[#3fb7ff] via-[#4f7dff] to-[#6b52d9]"
                      : "border-[#4c3ab8] bg-gradient-to-br from-[#4a47a8] via-[#6b52d9] to-[#7f4ff0]"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_36%)]" aria-hidden />
                  <div className="relative px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-2">
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">{item.stat}</div>
                    <div className="text-xs sm:text-sm font-medium text-white/85">{item.label}</div>
                    <div className="text-xs text-white/70 leading-relaxed pt-1">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alternating benefits - dark section */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10 sm:space-y-14">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Lead capture that fits the conversation
              </h2>
              <p className="text-base text-slate-300">
                Nobi asks at the right moment, routes every lead to your CRM, and tags each one with exactly where it came from.
              </p>
            </div>

            {[
              {
                title: "Asks at the right moment, not at random",
                body: "You configure when Nobi asks for contact info: after a set time on site, on exit intent, after a visitor views specific pages, or when they get stuck. The ask happens inside a conversation the visitor is already in, so it feels natural instead of intrusive.",
                visual: "timing",
              },
              {
                title: "Every lead routes straight to your CRM",
                body: "No Zapier, no manual exports. You configure the destination once. Nobi handles delivery, deduplication, and tagging automatically. Works with Klaviyo, HubSpot, Salesforce, or any webhook endpoint you already use.",
                visual: "crm",
              },
              {
                title: "Full attribution on every contact",
                body: "Each lead is tagged with UTM source, the page where the conversation started, the query that triggered it, and a summary of what the visitor was trying to do. You know which campaigns and channels are driving real pipeline, not just form fills.",
                visual: "attribution",
              },
            ].map((item, idx) => {
              const reverse = idx % 2 === 1;
              return (
                <div
                  key={item.title}
                  className={`grid md:grid-cols-2 gap-8 sm:gap-10 items-center ${reverse ? "md:[&>*:first-child]:order-last" : ""} pb-14 sm:pb-20`}
                >
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-base text-slate-300 leading-relaxed">{item.body}</p>
                  </div>
                  <BenefitVisual type={item.visual} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Faherty case study */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1">
                Case study
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-slate-900">
                How Faherty Brand grew revenue per referral by 21.3%
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Faherty was running a timed pop-up for lead capture, but visitors dismissed it immediately. They hadn't engaged with anything yet. After switching to Nobi, lead collection moved into active conversations. Visitors gave their email because they wanted a follow-up, not because a form blocked their way.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Revenue per referral", value: "+21.3%" },
                  { label: "Lead attribution", value: "100%" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_32px_-26px_rgba(15,23,42,0.35)]">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</div>
                    <div className="text-2xl font-semibold text-slate-900 mt-1">{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900">What changed</h3>
                <ul className="space-y-2 text-base text-slate-600 list-disc list-inside">
                  <li>Lead capture moved from a blocking pop-up into an active conversation.</li>
                  <li>Every lead automatically tagged with UTM source, page, and conversation context.</li>
                  <li>CRM sync replaced a manual export workflow with zero extra tooling.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_22px_60px_-30px_rgba(15,23,42,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_40%)]" />
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <img src="/media/logos/faherty.svg" alt="Faherty" className="h-6 w-auto object-contain" />
                </div>
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <p className="font-semibold text-slate-900 text-base mb-2">The problem with forms</p>
                    <p>A timed pop-up asked for email after 30 seconds. Most visitors dismissed it immediately. The form collected some leads but had no context about what they actually wanted.</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 border border-violet-200 p-4">
                    <p className="font-semibold text-slate-900 text-base mb-2">What Nobi does instead</p>
                    <p>Nobi waits until a visitor is actively looking for something. Then it offers to follow up by email. Visitors say yes because they actually want to hear back.</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 italic">
                  "We were getting emails from people who actually wanted to buy, with full context about what they were looking at."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Start capturing better leads today
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Set up in minutes. Works with any CRM you already use.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:bg-white/90 shadow-sm h-12 px-6 text-base"
                >
                  Sign up free
                </a>
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/30 bg-white/10 text-white h-12 px-6 text-base hover:border-white/50"
                >
                  Get a demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

function ConversationMock() {
  return (
    <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(236,72,153,0.08),transparent_40%)]" aria-hidden />
      <div className="relative flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white/80">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">N</div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Nobi</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </div>
      <div className="relative px-4 py-4 space-y-3 text-sm">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-slate-900 text-white px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
            Looking for a gift for my girlfriend. She loves boho style, around $150.
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 max-w-[80%] text-[13px] text-slate-800 leading-snug">
            Great taste. Here are a few she would love:
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {["Breezy Midi $148", "Linen Set $138", "Wrap Dress $152"].map((p) => (
                <div key={p} className="rounded-xl border border-slate-200 bg-white p-1.5 text-center shadow-sm">
                  <div className="h-10 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 mb-1.5" />
                  <div className="text-[9px] font-semibold text-slate-800 leading-tight">{p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 max-w-[80%] text-[13px] text-slate-800 leading-snug">
            Want me to send these to your email?
          </div>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 space-y-2">
          <div className="text-[10px] font-semibold text-violet-700 uppercase tracking-[0.12em]">Your email</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-400">sarah@example.com</div>
            <div className="rounded-lg bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-3 py-1.5 text-white text-[11px] font-semibold shrink-0">Send</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
          <span className="h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">✓</span>
          <div className="text-[11px] text-emerald-800 font-medium">Lead synced to Klaviyo · utm_source=instagram</div>
        </div>
      </div>
    </div>
  );
}

function BenefitVisual({ type }) {
  const shell = "relative w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]";

  if (type === "timing") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(167,139,250,0.08),transparent_45%)]" />
        <div className="relative space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Trigger rules</div>
          {[
            { label: "Exit intent", enabled: true },
            { label: "45 seconds on page", enabled: true },
            { label: "After product view", enabled: true },
            { label: "Cart abandonment", enabled: false },
          ].map((rule) => (
            <div key={rule.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
              <span className="text-[13px] text-slate-200">{rule.label}</span>
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${rule.enabled ? "text-emerald-400" : "text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${rule.enabled ? "bg-emerald-500" : "bg-slate-600"}`} />
                {rule.enabled ? "Active" : "Off"}
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-[12px] text-violet-300">
            Never interrupts mid-checkout. Asks once per session.
          </div>
        </div>
      </div>
    );
  }

  if (type === "crm") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(59,130,246,0.08),transparent_40%)]" />
        <div className="relative space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Connected CRMs</div>
          {[
            { name: "Klaviyo", icon: "K", color: "bg-green-600", detail: "List sync + tags" },
            { name: "HubSpot", icon: "H", color: "bg-orange-500", detail: "Contact + deal creation" },
            { name: "Salesforce", icon: "S", color: "bg-blue-600", detail: "Lead object + activity" },
            { name: "Webhook", icon: "→", color: "bg-slate-600", detail: "Any endpoint" },
          ].map((crm) => (
            <div key={crm.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <div className={`h-7 w-7 rounded-lg ${crm.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{crm.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-slate-200">{crm.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{crm.detail}</div>
              </div>
              <span className="text-[10px] font-medium text-emerald-400 shrink-0">Active</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "attribution") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_82%,rgba(59,130,246,0.08),transparent_46%)]" />
        <div className="relative space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Lead record</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2 text-[12px]">
            {[
              { label: "Contact", value: "sarah@example.com" },
              { label: "Source", value: "utm_source=instagram" },
              { label: "Captured on", value: "/collections/dresses" },
              { label: "Intent", value: "Gift, boho style, ~$150" },
              { label: "Products", value: "Breezy Midi, Linen Set" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <span className="text-slate-500 w-20 shrink-0 leading-tight">{row.label}</span>
                <span className="text-slate-200 font-medium leading-tight">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            Synced to Klaviyo 2 minutes ago
          </div>
        </div>
      </div>
    );
  }

  return null;
}

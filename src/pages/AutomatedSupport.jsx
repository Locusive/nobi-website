import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import Marquee from "react-fast-marquee";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.webp" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

export default function AutomatedSupport() {
  const { onOpen } = useDemoForm();

  useSEO({
    title: "Automated Support That Cuts Repeat Tickets | Nobi",
    description: "Nobi answers shipping, returns, billing, and policy questions on your site — with a citation to the source — so the same tickets stop landing in your queue.",
    path: "/why-nobi/automated-support",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi Automated Support",
      "description": "AI assistant that automates support on your site, answering repeat questions instantly and with citations, so your team only handles the tickets that actually need a human.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "url": "https://nobi.ai/why-nobi/automated-support",
      "offers": { "@type": "Offer", "price": "25", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
    },
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                  Automated support
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Stop answering{" "}
                  <span className={GRADIENT}>the same five tickets</span>{" "}
                  over and over
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Nobi answers shipping, returns, billing, and policy questions on your site — with a citation to the doc it pulled from — so repeat tickets stop landing in your queue and your team only sees the cases that actually need a human.
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
                <SupportConversationMock />
              </div>
            </div>
          </div>
        </section>

        {/* Logo bar */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white pb-16 pt-12">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-4">
            <p className="text-center text-sm text-black/50 tracking-[0.04em]">
              Trusted by teams that would rather solve real problems than answer the same questions
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

        {/* Top tickets that disappear */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-600 font-semibold">
                The questions filling your queue
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                The same handful of questions, every single day
              </h2>
              <p className="text-base text-slate-600">
                The answers are already in your help center. Visitors just can't find them fast enough — so they email, file a ticket, or bounce. Nobi answers them in the chat, instantly.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { tag: "Shipping",  q: "When will my order ship?",                  a: "Pulled from your shipping policy page" },
                { tag: "Returns",   q: "How do I return something I ordered?",      a: "Pulled from your returns FAQ" },
                { tag: "Sizing",    q: "Do these run small?",                       a: "Pulled from the product page + reviews" },
                { tag: "Billing",   q: "Can I change the card on my subscription?", a: "Pulled from your billing help article" },
                { tag: "Account",   q: "How do I reset my password?",               a: "Pulled from your account help docs" },
                { tag: "Policy",    q: "Do you ship to Canada?",                    a: "Pulled from your shipping zones page" },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.18)] space-y-3"
                >
                  <div className="inline-flex items-center rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fuchsia-600">
                    {item.tag}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">"{item.q}"</p>
                  <div className="flex items-start gap-2 pt-1">
                    <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before / after comparison */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-5xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                A ticket that never gets filed is the cheapest one to solve
              </h2>
              <p className="text-base text-slate-600">
                When the same question gets answered on the website, your team's queue gets a lot shorter — and the cases that remain are the ones worth a human's time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Without Nobi */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="text-sm font-semibold text-slate-500">Without Nobi</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {[
                    "Visitor scans your FAQ, gives up after 30 seconds",
                    "Files a ticket or sends an email",
                    "Waits hours (or days) for a response",
                    "An agent copy-pastes the same canned answer for the 40th time this week",
                    "The ticket queue grows faster than it shrinks",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="text-slate-300 mt-0.5">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* With Nobi */}
              <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-white to-violet-50/50 p-6 space-y-4 shadow-[0_8px_24px_-16px_rgba(109,40,217,0.2)]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
                  <span className="text-sm font-semibold text-violet-700">With Nobi</span>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {[
                    "Visitor asks Nobi in plain language, on the page they're already on",
                    "Gets an instant answer with a link to the source doc",
                    "Resolves the question without ever opening a ticket",
                    "If the question really does need a human, Nobi hands off with the full chat history",
                    "Your team's queue is only the cases that needed them in the first place",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What you get section - dark */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10 sm:space-y-14">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">
                How Nobi automates support without dropping the ball
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Trustworthy answers, real handoffs, no hallucinations
              </h2>
              <p className="text-base text-slate-300">
                Deflection is only useful if the answers are right and the hard cases still reach a human. Nobi is designed for both.
              </p>
            </div>

            {[
              {
                title: "Grounded in your actual content",
                body: "Nobi pulls answers from your help center, policy pages, product pages, and any docs you sync. Two AI passes verify every claim against your source content before the response goes out — if it can't prove it, it won't say it.",
                visual: "grounded",
              },
              {
                title: "Every answer cites its source",
                body: "Visitors see exactly which help article or policy page the answer came from, so the response is trusted instead of second-guessed. Agents can verify the answer in one click if it ever escalates.",
                visual: "citations",
              },
              {
                title: "Knows when to hand off to a human",
                body: "When a question needs a person — refunds outside policy, account-specific issues, anything Nobi isn't confident about — it routes the conversation to your team with the full chat history attached. No starting from scratch on the agent's side.",
                visual: "handoff",
              },
              {
                title: "Lock in exact answers when wording matters",
                body: "For sensitive questions where AI summaries aren't good enough — pricing edge cases, legal disclaimers, regulated language — write a guided answer in the dashboard and Nobi uses it word-for-word.",
                visual: "guided",
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
                  <SupportVisual type={item.visual} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Setup steps */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-600 font-semibold">
                Get up and running
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Live in an afternoon, not a quarter
              </h2>
              <p className="text-base text-slate-600">
                You don't have to rebuild your help center or replace your helpdesk. Point Nobi at the docs you already have and it starts answering on day one.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Sync your existing content",
                  body: "Import your help center, policy pages, product pages, and any internal docs. Nobi keeps them indexed automatically as they change.",
                },
                {
                  step: "2",
                  title: "Drop Nobi onto your site",
                  body: "Add one script tag and Nobi appears wherever you want it — site-wide chat, embedded on your help center, or on specific high-volume pages.",
                },
                {
                  step: "3",
                  title: "Watch tickets disappear",
                  body: "See which questions are being answered in chat, which are still escalating, and where new content gaps are showing up — all in your Nobi dashboard.",
                },
              ].map((card) => (
                <div key={card.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.2)] space-y-3">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white text-sm font-bold">
                    {card.step}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] text-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="space-y-8 text-center max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Give your support team back their week
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Sign up free and let Nobi start answering the questions that don't need a human — so your team can focus on the ones that do.
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

// Hero visual: visitor asks support question, Nobi answers with citation
function SupportConversationMock() {
  return (
    <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.08),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(236,72,153,0.08),transparent_40%)]" aria-hidden />
      <div className="relative px-4 pt-5 pb-4 space-y-3 text-sm">
        {/* Visitor message */}
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-violet-100 text-violet-900 px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
            How long do I have to return something I ordered last week?
          </div>
        </div>
        {/* Nobi reply with citation */}
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 text-[13px] text-slate-800 leading-snug">
              You have <span className="font-semibold">30 days from delivery</span> to return unworn items in their original packaging. Refunds post to the original payment method within 5–7 business days.
            </div>
            <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-slate-300">
              <span className="text-fuchsia-500">📄</span>
              <span className="font-medium">Source:</span> Returns &amp; Exchanges
            </a>
          </div>
        </div>
        {/* Visitor follow-up */}
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-violet-100 text-violet-900 px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
            Mine arrived damaged though — what do I do?
          </div>
        </div>
        {/* Nobi handoff */}
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 text-[13px] text-slate-800 leading-snug">
              That one I'll route to a person. Connecting you to support — they'll have the full conversation in front of them.
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              Handed off to support · Conversation summary attached
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportVisual({ type }) {
  const shell = "relative w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]";

  if (type === "grounded") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(167,139,250,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Connected sources</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Help center", note: "127 articles" },
              { name: "Shipping policy", note: "Synced today" },
              { name: "Returns FAQ", note: "Synced today" },
              { name: "Product pages", note: "412 pages" },
              { name: "Billing help", note: "Synced today" },
              { name: "Account docs", note: "Synced today" },
            ].map((src) => (
              <div key={src.name} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-200">
                  <span className="text-fuchsia-400">📄</span>
                  {src.name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{src.note}</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            Two-pass verification: every answer is checked against your sources
          </div>
        </div>
      </div>
    );
  }

  if (type === "citations") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Cited answer</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5 text-[12px]">
            <div className="flex gap-2 items-start">
              <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300 text-[10px] font-bold shrink-0 mt-0.5">?</div>
              <div className="rounded-xl bg-white/5 px-3 py-2 text-slate-300 leading-snug">
                Do you charge for international shipping?
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">N</div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="rounded-xl bg-white/10 px-3 py-2 text-slate-200 leading-snug">
                  Yes — international shipping starts at $14.95, with free shipping on orders over $200 USD.
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">
                    <span className="text-fuchsia-300">📄</span>
                    International Shipping
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">
                    <span className="text-fuchsia-300">📄</span>
                    Shipping Rates
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 px-1">Click any citation to jump to the exact page the answer came from.</div>
        </div>
      </div>
    );
  }

  if (type === "handoff") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_70%,rgba(236,72,153,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Escalation, with context</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5 text-[12px]">
            <div className="rounded-lg bg-white/5 px-3 py-2 text-[11px] text-slate-300 leading-snug">
              <span className="text-fuchsia-300 font-semibold">Customer:</span> "My charge looks wrong, I was billed twice."
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-[11px] text-slate-300 leading-snug">
              <span className="text-fuchsia-300 font-semibold">Nobi:</span> Account-specific — handing off to a human.
            </div>
          </div>
          <div className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-3 space-y-1.5">
            <div className="text-[10px] uppercase tracking-[0.12em] text-blue-200 font-semibold">Routed to support</div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-300 shrink-0" /> Full conversation transcript</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-300 shrink-0" /> Page the visitor was on</div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-300 shrink-0" /> Identified order or account, when known</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "guided") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(99,102,241,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Guided answer (used verbatim)</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5 text-[12px]">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-slate-200">Question pattern</div>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                Locked
              </span>
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-[11px] text-slate-300 italic">
              Anything about cancellations or subscription pauses
            </div>
            <div className="text-[11px] font-semibold text-slate-200 pt-1">Exact answer Nobi will use</div>
            <div className="rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-[11px] text-slate-200 leading-snug">
              You can pause your subscription anytime from your account settings. Pauses take effect on your next billing date — we won't charge you while it's paused. To cancel entirely, visit Account → Subscription → Cancel.
            </div>
          </div>
          <div className="text-[11px] text-slate-400 px-1">Use guided answers for legal language, pricing edge cases, or anything that needs to be exactly right.</div>
        </div>
      </div>
    );
  }

  return null;
}

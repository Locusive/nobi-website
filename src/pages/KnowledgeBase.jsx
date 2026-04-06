import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import Marquee from "react-fast-marquee";

const GRADIENT = "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

export default function KnowledgeBase() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Accurate Answers | Nobi";
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
                  Accurate answers
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Answers from your content,{" "}
                  <span className={GRADIENT}>not from thin air</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Nobi pulls answers from your existing help docs, product pages, and policies — and shows visitors exactly where each answer came from. For questions you want to control precisely, write a guided answer and Nobi uses it word-for-word.
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
                <div className="absolute -inset-6 bg-gradient-to-r from-indigo-200/60 via-white to-violet-200/60 rounded-[34px] blur-3xl opacity-80" aria-hidden />
                <AnswerMock />
              </div>
            </div>
          </div>
        </section>

        {/* Logo bar */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white pb-16 pt-12">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-4">
            <p className="text-center text-sm text-black/50 tracking-[0.04em]">
              Trusted by ecommerce teams who care about what their assistant says
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
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                What accurate answers actually do
              </h2>
              <p className="text-base text-slate-600">
                When visitors get real answers — sourced from your content, not guessed — they trust the site more and buy more often.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-1 max-w-xl mx-auto">
              {[
                {
                  stat: "6x",
                  label: "more likely to purchase",
                  desc: "Based on Nobi's internal data across customers: visitors who engage with the assistant and get a real answer are 6x more likely to purchase than visitors who don't interact.",
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
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Grounded in your content, controlled by you
              </h2>
              <p className="text-base text-slate-300">
                Nobi answers from what you've already written — and you can lock in exact answers for anything where AI summaries aren't good enough.
              </p>
            </div>

            {[
              {
                title: "Import your existing content, not re-write it",
                body: "Point Nobi at your help center URLs, product pages, policy docs, or PDFs. Nobi reads and indexes them automatically. You don't need to reformat anything or paste content into a new tool. When your content changes, Nobi re-crawls and updates within hours.",
                visual: "import",
              },
              {
                title: "Every answer cites its source",
                body: "Nobi shows visitors exactly where each answer came from — the page title, section, or document. Visitors can verify it themselves. This matters especially for return policies, sizing, shipping rules, and any question where accuracy affects whether someone buys.",
                visual: "citation",
              },
              {
                title: "Write guided answers for questions you want to control",
                body: "Some questions need a specific answer, not an AI summary. Write a guided answer and Nobi uses it word-for-word whenever a visitor asks that question. Useful for brand positioning, pricing objections, sensitive policy questions, or anything you've been burned by AI getting wrong before.",
                visual: "override",
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
                  <KBVisual type={item.visual} />
                </div>
              );
            })}
          </div>
        </section>

        {/* What to import */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Import what you already have
              </h2>
              <p className="text-base text-slate-600">
                No new content to write. Nobi reads what's already on your site.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  emoji: "📄",
                  title: "Help center pages",
                  desc: "FAQs, policy pages, how-to guides. Nobi answers questions from them directly.",
                },
                {
                  emoji: "🛍️",
                  title: "Product pages",
                  desc: "Sizing, materials, care instructions, compatibility. Answers that actually match what you sell.",
                },
                {
                  emoji: "📦",
                  title: "Shipping and returns",
                  desc: "Exact policies pulled from your own pages, not an AI guess.",
                },
                {
                  emoji: "📋",
                  title: "PDFs and documents",
                  desc: "Spec sheets, manuals, size guides. Upload them and Nobi reads them.",
                },
                {
                  emoji: "🗂️",
                  title: "Brand and company pages",
                  desc: "About pages, mission, values. Nobi can answer brand questions accurately.",
                },
                {
                  emoji: "✏️",
                  title: "Guided answer overrides",
                  desc: "Write specific answers for questions where you need exact control.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.2)] space-y-3">
                  <div className="text-3xl">{card.emoji}</div>
                  <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
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
                  Stop losing sales to wrong answers
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Import your content in minutes. No reformatting, no manual tagging.
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

// Hero visual: Q&A with citation and guided override
function AnswerMock() {
  return (
    <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(167,139,250,0.08),transparent_40%)]" aria-hidden />

      <div className="relative px-4 pt-5 pb-4 space-y-4 text-sm">
        {/* Q&A 1: cited answer */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-tr-sm bg-violet-100 text-violet-900 px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
              What's your return window for sale items?
            </div>
          </div>
          <div className="flex justify-start gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
            <div className="space-y-2 max-w-[85%]">
              <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 text-[13px] text-slate-800 leading-snug">
                Sale items can be returned within 30 days for store credit. Final sale items are marked clearly at checkout and cannot be returned.
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
                  📄 Return Policy
                </span>
                <span className="text-[10px] text-slate-400">Source verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        {/* Q&A 2: guided override */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-tr-sm bg-violet-100 text-violet-900 px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
              How do your boots compare to competitors?
            </div>
          </div>
          <div className="flex justify-start gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
            <div className="space-y-2 max-w-[85%]">
              <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 text-[13px] text-slate-800 leading-snug">
                Lucchese boots are handcrafted in El Paso using 100-year-old methods. Each pair takes 200+ steps to make. That's not something you can shortcut.
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                  ✏️ Guided answer
                </span>
                <span className="text-[10px] text-slate-400">Your exact words</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KBVisual({ type }) {
  const shell = "relative w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]";

  if (type === "import") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.08),transparent_45%)]" />
        <div className="relative space-y-2.5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Content sources</div>
          {[
            { label: "help.yoursite.com (47 pages)", icon: "🌐", status: "Indexed", color: "text-emerald-400" },
            { label: "Return Policy", icon: "📄", status: "Indexed", color: "text-emerald-400" },
            { label: "Size Guide PDF", icon: "📋", status: "Indexed", color: "text-emerald-400" },
            { label: "Product catalog (1,240 items)", icon: "🛍️", status: "Syncing...", color: "text-amber-400" },
          ].map((source) => (
            <div key={source.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <span className="text-base shrink-0">{source.icon}</span>
              <span className="text-[12px] text-slate-200 flex-1 truncate">{source.label}</span>
              <span className={`text-[10px] font-medium shrink-0 ${source.color}`}>{source.status}</span>
            </div>
          ))}
          <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-[11px] text-indigo-300">
            Auto-refreshes twice daily. No manual updates needed.
          </div>
        </div>
      </div>
    );
  }

  if (type === "citation") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(167,139,250,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Cited answer</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5">
            <div className="text-[12px] text-slate-400">Visitor asks:</div>
            <div className="rounded-lg bg-white/10 px-3 py-2 text-[12px] text-slate-200">
              "Do your trail shoes fit true to size?"
            </div>
            <div className="text-[12px] text-slate-400">Nobi answers:</div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-slate-200 leading-snug">
              Yes, they fit true to size for most runners. If you have a wide foot or wear thick socks, consider sizing up.
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
                📄 Sizing guide
              </span>
              <span className="text-[10px] text-slate-500">Verified from your content</span>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            Nobi checked 3 sources before answering
          </div>
        </div>
      </div>
    );
  }

  if (type === "override") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(236,72,153,0.06),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Guided answer editor</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1">Question</div>
              <div className="rounded-lg bg-white/10 px-3 py-2 text-[12px] text-slate-300">
                "Are your prices going up?"
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-1">Your exact answer</div>
              <div className="rounded-lg border border-violet-400/30 bg-violet-500/10 px-3 py-2.5 text-[12px] text-slate-200 leading-snug">
                Prices are set annually and locked for the full year. No mid-year increases. You can always see current pricing at checkout.
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="h-4 w-4 rounded-full bg-violet-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">✓</span>
              <span className="text-[11px] text-violet-300 font-medium">Nobi uses this word-for-word</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

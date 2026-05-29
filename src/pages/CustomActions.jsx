import React, { useEffect } from "react";
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

export default function CustomActions() {
  const { onOpen } = useDemoForm();

  useSEO({
    title: "Custom Actions & Hooks for AI Search | Nobi",
    description: "Inject custom badges, sorting, and business logic into Nobi without touching our code. Full control over how search results look and behave.",
    path: "/custom-actions",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi Custom Actions",
      "description": "Inject custom badges, sorting rules, and business logic into Nobi without touching the core code. Full control over how results look and behave.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "url": "https://nobi.ai/custom-actions",
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
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                  Custom actions
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  Let visitors{" "}
                  <span className={GRADIENT}>do things</span>,
                  not just ask questions
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Connect Nobi to your existing JavaScript with a few lines. Visitors can book appointments, start returns, apply filters, or trigger any workflow you've already built, all from inside the conversation.
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
                <div className="absolute -inset-6 bg-gradient-to-r from-slate-900/10 via-violet-200/40 to-indigo-200/40 rounded-[34px] blur-3xl opacity-70" aria-hidden />
                <CodeVisual />
              </div>
            </div>
          </div>
        </section>

        {/* Logo bar */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white pb-16 pt-12">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-4">
            <p className="text-center text-sm text-black/50 tracking-[0.04em]">
              Running on Shopify, headless, and custom stacks
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

        {/* What you can build */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-600 font-semibold">What you can build</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Any workflow your site already supports
              </h2>
              <p className="text-base text-slate-600">
                If your site can do it with JavaScript, Nobi can trigger it from inside a conversation.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  emoji: "📅",
                  title: "Book an appointment",
                  desc: "Visitor says \"I need a consultation\" — Nobi opens your scheduling modal directly in the chat flow.",
                },
                {
                  emoji: "↩️",
                  title: "Start a return",
                  desc: "Visitor asks about returning an order — Nobi pre-fills the return form with their order ID and opens it.",
                },
                {
                  emoji: "🛒",
                  title: "Add to cart",
                  desc: "Nobi recommends a product and lets the visitor add it without leaving the conversation.",
                },
                {
                  emoji: "📋",
                  title: "Submit a form",
                  desc: "Collect information through conversation, then submit it to any form endpoint you already use.",
                },
                {
                  emoji: "🔍",
                  title: "Apply search filters",
                  desc: "Visitor says \"show trail running shoes under $150\" — Nobi applies your site's existing filter logic.",
                },
                {
                  emoji: "💬",
                  title: "Open a support ticket",
                  desc: "Escalate from Nobi to a live agent or support system with full conversation context attached.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_46px_-32px_rgba(15,23,42,0.25)] p-6 space-y-3"
                >
                  <div className="text-3xl">{card.emoji}</div>
                  <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works: alternating dark section */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10 sm:space-y-14">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">
                The API
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                A few lines of JavaScript, no new infrastructure
              </h2>
              <p className="text-base text-slate-300">
                Three primitives: open Nobi from any element, pre-fill it with context, and register actions it can call.
              </p>
            </div>

            {[
              {
                title: "Open Nobi from any element on your site",
                body: "Call window.Nobi.openChat() from any button, link, or event handler. A \"Need help?\" nav item, a product page CTA, a sticky help button — anything that can run JavaScript can open Nobi. No custom UI to build.",
                visual: "open",
              },
              {
                title: "Pre-fill the conversation with context",
                body: "Pass an intent and context object when you open Nobi. Open it from a returns page and Nobi already knows the visitor wants to return something. Open from a specific product page and Nobi leads with that product. The conversation starts in the right place.",
                visual: "prefill",
              },
              {
                title: "Register actions Nobi can trigger",
                body: "Define which JavaScript functions Nobi is allowed to call, and when. From the Nobi dashboard, you configure the trigger conditions in plain language. When a visitor matches, Nobi calls your function. Your existing code runs. No new backend required.",
                visual: "register",
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
                    {idx === 2 && (
                      <a
                        href="https://docs.nobi.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                      >
                        Read the JS API docs
                      </a>
                    )}
                  </div>
                  <ActionVisual type={item.visual} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical specs / compatibility */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Works with any stack
              </h2>
              <p className="text-base text-slate-600">
                The JS API is framework-agnostic. If it runs JavaScript, it works with Nobi.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Shopify", note: "Liquid + custom apps" },
                { name: "Headless", note: "Next.js, Nuxt, Remix" },
                { name: "React / Vue", note: "Any SPA framework" },
                { name: "Plain HTML", note: "One script tag" },
              ].map((stack) => (
                <div key={stack.name} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_12px_32px_-24px_rgba(15,23,42,0.2)]">
                  <div className="text-lg font-semibold text-slate-900">{stack.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{stack.note}</div>
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
                  Build your first action in minutes
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Drop in the script tag, register an action, and watch it fire from inside a real conversation.
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

// Hero visual: styled code block showing the JS API
function CodeVisual() {
  return (
    <div className="relative rounded-3xl bg-[#0d1117] border border-white/10 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.6)] overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="h-3 w-3 rounded-full bg-rose-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[11px] text-slate-500 font-mono">nobi-actions.js</span>
      </div>
      {/* Code */}
      <div className="px-5 py-5 font-mono text-[13px] leading-6 space-y-4 overflow-x-auto">
        <div>
          <span className="text-slate-500">{"// Open Nobi from any button"}</span>
          <br />
          <span className="text-blue-400">document</span>
          <span className="text-slate-300">.querySelector(</span>
          <span className="text-emerald-300">'#help-btn'</span>
          <span className="text-slate-300">)</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;.addEventListener(</span>
          <span className="text-emerald-300">'click'</span>
          <span className="text-slate-300">, () {"=> {"}</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span className="text-yellow-300">window</span>
          <span className="text-slate-300">.Nobi.</span>
          <span className="text-blue-300">openChat</span>
          <span className="text-slate-300">{"()"}</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;{"}"}</span>
          <span className="text-slate-300">{")"}</span>
        </div>

        <div>
          <span className="text-slate-500">{"// Pre-fill with page context"}</span>
          <br />
          <span className="text-yellow-300">window</span>
          <span className="text-slate-300">.Nobi.</span>
          <span className="text-blue-300">openChat</span>
          <span className="text-slate-300">{"({"}</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;intent: </span>
          <span className="text-emerald-300">'returns'</span>
          <span className="text-slate-300">,</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;orderId: order.</span>
          <span className="text-blue-300">id</span>
          <br />
          <span className="text-slate-300">{"}"}</span>
          <span className="text-slate-300">{")"}</span>
        </div>

        <div>
          <span className="text-slate-500">{"// Register an action Nobi can trigger"}</span>
          <br />
          <span className="text-yellow-300">window</span>
          <span className="text-slate-300">.Nobi.</span>
          <span className="text-blue-300">registerAction</span>
          <span className="text-slate-300">{"("}</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;</span>
          <span className="text-emerald-300">'openBooking'</span>
          <span className="text-slate-300">,</span>
          <br />
          <span className="text-slate-300">&nbsp;&nbsp;() </span>
          <span className="text-slate-300">{"=> "}</span>
          <span className="text-blue-400">BookingWidget</span>
          <span className="text-slate-300">.</span>
          <span className="text-blue-300">open</span>
          <span className="text-slate-300">{"()"}</span>
          <br />
          <span className="text-slate-300">{")"}</span>
        </div>
      </div>
      {/* Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
    </div>
  );
}

function ActionVisual({ type }) {
  const shell = "relative w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]";

  if (type === "open") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(167,139,250,0.08),transparent_45%)]" />
        <div className="relative space-y-3 text-[13px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Trigger points</div>
          {[
            { label: "Nav help link", code: "Nobi.openChat()" },
            { label: "Product page CTA", code: "Nobi.openChat()" },
            { label: "Sticky help button", code: "Nobi.openChat()" },
            { label: "Email campaign link", code: "Nobi.openChat()" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 gap-3">
              <span className="text-slate-300 text-[12px]">{item.label}</span>
              <span className="font-mono text-[10px] text-violet-300 bg-violet-500/10 rounded px-2 py-1 shrink-0">{item.code}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "prefill") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(236,72,153,0.06),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Pre-filled conversation</div>
          <div className="rounded-xl border border-white/10 bg-[#0d1117] p-3 font-mono text-[11px] leading-5">
            <div className="text-slate-500">// Opened from /returns</div>
            <div><span className="text-yellow-300">window</span><span className="text-slate-300">.Nobi.</span><span className="text-blue-300">openChat</span><span className="text-slate-300">{"({"}</span></div>
            <div><span className="text-slate-300">&nbsp;&nbsp;intent: </span><span className="text-emerald-300">'returns'</span><span className="text-slate-300">,</span></div>
            <div><span className="text-slate-300">&nbsp;&nbsp;orderId: </span><span className="text-emerald-300">'#10042'</span></div>
            <div><span className="text-slate-300">{"}"}</span><span className="text-slate-300">{")"}</span></div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2">
            <div className="text-[11px] text-slate-400">Visitor sees:</div>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">N</div>
              <div className="rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2 text-[12px] text-slate-200 leading-snug">
                I can help you with order #10042. What would you like to do?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "register") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_75%,rgba(59,130,246,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">Registered actions</div>
          {[
            { name: "openBooking", trigger: "When visitor asks to schedule", status: "active" },
            { name: "startReturn", trigger: "When visitor mentions a return", status: "active" },
            { name: "addToCart", trigger: "When visitor wants to buy", status: "active" },
          ].map((action) => (
            <div key={action.name} className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-violet-300">{action.name}()</span>
                <span className="text-[10px] font-medium text-emerald-400">Active</span>
              </div>
              <div className="text-[11px] text-slate-400">{action.trigger}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

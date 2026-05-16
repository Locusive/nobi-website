import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { Bot, Globe, Sparkles, FileText } from "lucide-react";

const HERO_PRODUCTS = [
  { name: "Classic Crew",   price: "$265", img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=300" },
  { name: "Rib Turtleneck", price: "$295", img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=300" },
  { name: "Cable Knit",     price: "$245", img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=300" },
];

export default function AgentEndpoint() {
  const { onOpen: openDemoForm } = useDemoForm();

  useSEO({
    title: "Reach AI Agents - Your Business, Inside Every AI Your Customers Use | Nobi",
    description: "Nobi makes your business findable and callable by AI agents. Structured content AI crawlers can index, plus a live endpoint they can call. Both automatic.",
    path: "/why-nobi/ai-agents",
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Nobi AI Agent Endpoint",
      "description": "Nobi makes your business findable and callable by AI agents automatically.",
      "brand": { "@type": "Brand", "name": "Nobi" },
      "url": "https://nobi.ai/why-nobi/ai-agents",
    },
  });

  return (
    <PageLayout>
      <div className="bg-white text-black min-h-screen">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-slate-100">
          <div className="absolute -left-40 -top-32 w-96 h-96 bg-violet-100/60 blur-3xl" aria-hidden />
          <div className="absolute right-[-160px] top-20 w-96 h-96 bg-indigo-100/60 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

              <div className="space-y-7">
                <p className="text-sm font-semibold tracking-[0.2em] text-violet-600 uppercase">A new channel</p>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.05] text-slate-900 text-balance">
                  Your business, inside every AI your{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">customers use</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                  When someone asks Claude or ChatGPT for a recommendation, Nobi makes sure your business shows up - and can answer follow-up questions directly. No website visit required.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={getSignupUrl()} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium bg-black text-white hover:opacity-90 h-12 px-6 text-base w-full sm:w-auto">
                    Get started free
                  </a>
                  <button onClick={openDemoForm} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium border border-black/10 bg-white h-12 px-6 text-base w-full sm:w-auto hover:border-black/30">
                    Get a demo
                  </button>
                </div>
              </div>

              {/* Hero visual: merchant's view — AI agent queries handled automatically */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-violet-100/80 to-indigo-100/80 rounded-[2rem] blur-2xl" aria-hidden />
                <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-semibold text-slate-700">Your Nobi agent</span>
                    </div>
                    <span className="text-xs text-slate-400">Live · today</span>
                  </div>

                  {/* Query rows */}
                  <div className="divide-y divide-slate-50">
                    {[
                      { query: "Find me a luxury cashmere sweater gift", result: "3 products returned", from: "Claude" },
                      { query: "Do they offer gift wrapping?",            result: "Yes, complimentary on all orders", from: "ChatGPT" },
                      { query: "What is the return policy?",              result: "30-day returns, free shipping", from: "Perplexity" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 px-5 py-4">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-700 leading-snug">"{item.query}"</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.result}</div>
                        </div>
                        <div className="text-xs font-medium text-slate-300 flex-shrink-0 mt-0.5">{item.from}</div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-violet-50 border-t border-violet-100">
                    <span className="text-xs font-medium text-violet-700">3 queries answered automatically</span>
                    <span className="text-xs text-violet-400">0 human hours used</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Two mechanisms ───────────────────────────────────────────────── */}
        <section className="py-24 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="text-center mb-14 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Two ways Nobi puts you in front of AI
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Being present in the AI channel means two different things. Nobi handles both.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Find */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 space-y-5 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Get found</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">AI systems learn who you are</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Nobi turns real visitor conversations into structured content that AI crawlers can read and index. When an AI is asked about your category, it already knows you exist and what you offer - before the customer even asks a follow-up.
                  </p>
                </div>
              </div>

              {/* Talk */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 space-y-5 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">Get called</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">AI agents get live answers from you</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Every Nobi assistant is also a callable endpoint. When an AI agent wants real answers about your products, pricing, or policies, it calls your Nobi agent directly and gets a grounded response - with follow-ups handled too.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How Nobi handles it ──────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-14">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Nobi sets it all up for you
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">
                No separate configuration. No new tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  Icon: FileText,
                  title: "Conversations become indexed content",
                  body: "Real questions your visitors ask get sanitized and surfaced as structured FAQ content on your site. AI crawlers read it, index it, and use it when someone asks about your category.",
                },
                {
                  Icon: Globe,
                  title: "Your endpoint is auto-registered",
                  body: "Nobi adds your agent endpoint to your site's llms.txt file automatically. Any AI agent that does discovery finds your business and knows it can call you for live answers.",
                },
                {
                  Icon: Bot,
                  title: "Multi-turn questions, all answered",
                  body: "Your Nobi agent handles the full conversation - products, policies, pricing, follow-ups - the same knowledge base that answers your human visitors answers AI agents too.",
                },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="rounded-2xl bg-white border border-slate-200 p-7 space-y-4 shadow-sm">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Be present before your competitors are
            </h2>
            <p className="text-lg text-slate-500">
              The businesses establishing a presence in the AI channel now will be the ones AI systems recommend later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a href={getSignupUrl()} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium bg-black text-white hover:opacity-90 h-12 px-6 text-base">
                Get started free
              </a>
              <button onClick={openDemoForm} className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium border border-black/10 bg-white h-12 px-6 text-base hover:border-black/30">
                Get a demo
              </button>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}

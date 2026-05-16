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
                  Your business,{" "}
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">inside every AI</span>{" "}
                  your customers use
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

              {/* Hero visual */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-violet-100/80 to-indigo-100/80 rounded-[2rem] blur-2xl" aria-hidden />
                <div className="relative rounded-3xl bg-[#f9f9fb] border border-slate-200/80 shadow-2xl overflow-hidden">

                  {/* Claude header */}
                  <div className="flex items-center gap-2.5 px-5 py-3.5 bg-white border-b border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">C</div>
                    <span className="text-sm font-semibold text-slate-700">Claude</span>
                  </div>

                  <div className="p-5 space-y-3">

                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-slate-800 shadow-sm">
                        Find me a luxury cashmere sweater gift
                      </div>
                    </div>

                    {/* Thinking trace — shows Claude discovering the Nobi endpoint */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.001 3.001 0 01-.765.51" />
                        </svg>
                        Thinking
                      </div>
                      <div className="font-mono text-[11px] text-slate-500 space-y-1 leading-relaxed">
                        <div>Looking for registered business agents for this query...</div>
                        <div className="text-violet-500">→ Found: summitcashmere.nobi.ai</div>
                        <div className="text-slate-400">Calling agent endpoint <span className="text-slate-600">summit-cashmere · mcp/query</span></div>
                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Response received · 3 products + policies
                        </div>
                      </div>
                    </div>

                    {/* Hard break — agent handoff divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-violet-200" />
                      <div className="flex items-center gap-1.5 rounded-full bg-violet-100 border border-violet-200 px-3 py-1">
                        <svg className="h-3 w-auto" viewBox="0 0 22 18" fill="none">
                          <path d="M11 2L20 16H2L11 2Z" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[10px] font-semibold text-violet-700">Summit Cashmere · Nobi agent</span>
                      </div>
                      <div className="flex-1 h-px bg-violet-200" />
                    </div>

                    {/* Business agent response — branded, unmistakably from a different source */}
                    <div className="rounded-2xl border border-violet-200 bg-white shadow-md overflow-hidden">
                      <div className="grid grid-cols-3 gap-3 p-4">
                        {[
                          { name: "Classic Crew",   price: "$265", img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=300" },
                          { name: "Rib Turtleneck", price: "$295", img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=300" },
                          { name: "Cable Knit",     price: "$245", img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=300" },
                        ].map((p) => (
                          <div key={p.name} className="rounded-xl overflow-hidden border border-slate-100 bg-white shadow-sm">
                            <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                            <div className="px-2 py-2">
                              <div className="text-xs font-semibold text-slate-700 truncate">{p.name}</div>
                              <div className="text-xs text-slate-400">{p.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-100 px-3 py-2">
                          <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-violet-800">We offer complimentary gift wrapping on all orders.</span>
                        </div>
                      </div>
                    </div>

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

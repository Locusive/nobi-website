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

              {/* Hero visual: two agents, static mid-conversation */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-violet-100/80 to-indigo-100/80 rounded-[2rem] blur-2xl" aria-hidden />
                <div className="relative flex items-stretch gap-3">

                  {/* Left: Customer's AI */}
                  <div className="flex-1 rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-black/5">
                      <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-black/60">Customer's AI</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-black/5 rounded-2xl rounded-br-sm px-3 py-2 text-sm text-black/80">
                          Find me a cashmere sweater gift
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <p className="text-sm text-black/60">Summit Cashmere has great options:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { name: "Classic Crew",   price: "$265", img: "https://www.alpsandmeters.com/cdn/shop/products/Cashmere_Alpine_Guide_Sweater_Camel.jpg?v=1753426053&width=200" },
                              { name: "Rib Turtleneck", price: "$295", img: "https://www.alpsandmeters.com/cdn/shop/products/Ski_Race_Knit_Sports_Club_Navy.jpg?v=1753426053&width=200" },
                              { name: "Cable Knit",     price: "$245", img: "https://www.alpsandmeters.com/cdn/shop/products/Classic_Cable_Knit_IVORY_Front.jpg?v=1753426168&width=200" },
                            ].map((p) => (
                              <div key={p.name} className="rounded-lg overflow-hidden border border-black/5 shadow-sm bg-white">
                                <div className="aspect-[3/4]"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /></div>
                                <div className="px-1.5 py-1.5">
                                  <div className="text-[10px] font-semibold text-black/70 truncate">{p.name}</div>
                                  <div className="text-[10px] text-black/40">{p.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-slate-50 border border-black/8 rounded-xl px-3 py-2 text-xs text-black/60">
                            They gift wrap — complimentary on all orders.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center: wire */}
                  <div className="flex flex-col items-center justify-center gap-2 w-10 flex-shrink-0">
                    <div className="relative w-full" style={{ height: 16 }}>
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-300" />
                      {[0.1, 0.45, 0.78].map((pos, i) => (
                        <div key={i} className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_2px_rgba(139,92,246,0.5)]"
                          style={{ left: `${pos * 100}%` }} />
                      ))}
                    </div>
                    <div className="font-mono text-[8px] text-violet-400">{"{}"}</div>
                  </div>

                  {/* Right: Business's Nobi agent */}
                  <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                      <svg className="h-4 w-auto flex-shrink-0" viewBox="0 0 22 18" fill="none">
                        <path d="M11 2L20 16H2L11 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M7.5 16L11 10.5L14.5 16" stroke="white" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"/>
                      </svg>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">Summit Cashmere</div>
                        <div className="text-[9px] text-slate-400">Powered by Nobi</div>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="p-4 font-mono space-y-3 text-xs">
                      <div className="space-y-1">
                        <div className="text-slate-500">POST /mcp/query</div>
                        <div className="text-slate-300 pl-2">"cashmere sweater gift"</div>
                        <div className="text-emerald-400">200 OK · products: [3]</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-slate-500">POST /mcp/query</div>
                        <div className="text-slate-300 pl-2">"do you gift wrap?"</div>
                        <div className="text-emerald-400">200 OK · "Yes, complimentary"</div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ── Three things ─────────────────────────────────────────────────── */}
        <section className="py-20 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  Icon: FileText,
                  label: "Get found",
                  title: "Your conversations become indexed content",
                  body: "Real questions visitors ask get surfaced as structured content AI crawlers can read. When an AI is asked about your category, it already knows you exist.",
                },
                {
                  Icon: Globe,
                  label: "Get registered",
                  title: "Your endpoint is listed automatically",
                  body: "Nobi registers your agent endpoint in your site's llms.txt. Any AI agent doing discovery finds your business and knows it can call you directly.",
                },
                {
                  Icon: Bot,
                  label: "Get called",
                  title: "AI agents get live answers from you",
                  body: "Your Nobi agent handles products, policies, pricing, and follow-ups - the same knowledge base that answers human visitors answers AI agents too.",
                },
              ].map(({ Icon, label, title, body }) => (
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-violet-500 mb-2">{label}</div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
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

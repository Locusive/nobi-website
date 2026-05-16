import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { Bot, Globe, Sparkles, FileText, MessageSquare, ArrowRight } from "lucide-react";

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
                  When someone asks Claude or ChatGPT for a recommendation, Nobi makes sure your business shows up — and can answer follow-up questions directly. No extra setup. It comes with your existing Nobi assistant.
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

              {/* Static two-panel mid-conversation */}
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
                  {/* Wire */}
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
                  {/* Right: Business Nobi agent */}
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

        {/* ── Story beat 1 ─────────────────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center border-b border-slate-100 bg-[#0a0a12] px-6 py-20 gap-12 relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.15),transparent_70%)]" aria-hidden />

          {/* Big bold heading */}
          <div className="relative text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-8 rounded-full bg-violet-400" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <div className="h-1 w-1 rounded-full bg-white/20" />
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
              Right now,<br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">someone is searching.</span>
            </h2>
          </div>

          {/* Stylized AI interface */}
          <div className="relative w-full max-w-2xl">
            {/* Outer glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-violet-500/40 to-fuchsia-500/20" style={{ filter: "blur(1px)" }} aria-hidden />
            <div className="absolute -inset-8 bg-violet-500/10 rounded-[3rem] blur-3xl" aria-hidden />

            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111118]">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="text-xs text-white/30 font-mono">chatgpt.com</span>
                </div>
              </div>

              {/* Chat body */}
              <div className="px-8 py-16 flex flex-col items-center gap-10">
                <p className="text-2xl font-semibold text-white/80">What's on the agenda today?</p>

                {/* Input */}
                <div className="w-full relative">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-70" />
                  <div className="relative flex items-center gap-3 rounded-2xl bg-[#1a1a28] px-5 py-4">
                    <span className="text-white/30 text-xl flex-shrink-0">+</span>
                    <span className="flex-1 text-white text-lg font-light">Find me a luxury cashmere sweater gift</span>
                    <span className="w-0.5 h-6 bg-violet-400 animate-pulse flex-shrink-0" />
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/20">AI can make mistakes. Consider checking important information.</p>
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="relative text-2xl font-medium text-white/60 text-center max-w-xl">
            Someone just asked their AI to find a business like yours.
          </p>

          {/* Big scroll button */}
          <button
            className="relative flex flex-col items-center gap-3 group"
            onClick={() => {
              const next = document.getElementById("beat-2");
              if (next) next.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/40 group-hover:text-white/70 transition-colors">Scroll to see what happens</span>
            <div className="w-14 h-14 rounded-full border-2 border-white/20 group-hover:border-violet-400 flex items-center justify-center transition-colors animate-bounce">
              <svg className="w-6 h-6 text-white/40 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

        </section>

        {/* ── Three concrete scenarios ──────────────────────────────────────── */}
        <section id="beat-2" className="py-24 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">What becomes possible</h2>
              <p className="text-lg text-slate-500">Three things that now happen automatically, with no extra work from you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Card 1: queries coming in while you sleep */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 p-8 flex flex-col items-center justify-center gap-4 bg-slate-50">
                  <div className="text-7xl font-black text-slate-900 tracking-tight">47</div>
                  <div className="flex items-center gap-6">
                    {[
                      { initial: "C", color: "bg-amber-400",   label: "Claude" },
                      { initial: "G", color: "bg-emerald-500", label: "ChatGPT" },
                      { initial: "P", color: "bg-indigo-500",  label: "Perplexity" },
                    ].map((ai) => (
                      <div key={ai.label} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full ${ai.color} flex items-center justify-center text-white text-xs font-bold`}>{ai.initial}</div>
                        <span className="text-[9px] text-slate-400">{ai.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">0 human hours</span>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100">
                  <p className="text-base font-semibold text-slate-900">AI queries answered this week.</p>
                </div>
              </div>

              {/* Card 2: surfacing in AI results */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 p-8 bg-slate-50 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[8px] font-bold">P</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600">Perplexity</span>
                  </div>
                  <div className="rounded-2xl border-2 border-violet-300 bg-violet-50 px-4 py-3 shadow-md">
                    <div className="text-sm font-bold text-violet-800">Summit Cashmere</div>
                    <div className="text-xs text-violet-500 mt-0.5">summitcashmere.com</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 opacity-40">
                    <div className="text-sm font-semibold text-slate-600">Other brand</div>
                    <div className="text-xs text-slate-400 mt-0.5">otherbrand.com</div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 opacity-20">
                    <div className="text-sm font-semibold text-slate-600">Another brand</div>
                    <div className="text-xs text-slate-400 mt-0.5">anotherbrand.com</div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100">
                  <p className="text-base font-semibold text-slate-900">Your business, first in AI results.</p>
                </div>
              </div>

              {/* Card 3: live agent call */}
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 bg-slate-900 p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400 font-mono">live</span>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <div className="text-slate-500 text-xs">question →</div>
                      <div className="text-white mt-0.5">"Do you gift wrap?"</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">answer →</div>
                      <div className="text-emerald-400 mt-0.5">"Yes, complimentary."</div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100">
                  <p className="text-base font-semibold text-slate-900">Real answers. No human in the loop.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── How ──────────────────────────────────────────────────────────── */}
        <section className="py-24 bg-slate-50 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">How Nobi makes it happen</h2>
              <p className="text-lg text-slate-500">Two things, both automatic, both included.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
                  <FileText size={18} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-violet-500">Get found</div>
                <h3 className="text-xl font-semibold text-slate-900">Real conversations become indexed content</h3>
                <p className="text-slate-500 leading-relaxed">Visitor questions to your Nobi assistant get sanitized and rendered as structured FAQ content on your pages. AI crawlers read it and index it. You get AI discoverability from conversations that were already happening.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 space-y-4 shadow-sm">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
                  <Bot size={18} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-violet-500">Get called</div>
                <h3 className="text-xl font-semibold text-slate-900">Your assistant is already a live endpoint</h3>
                <p className="text-slate-500 leading-relaxed">Every Nobi assistant is an MCP endpoint, auto-registered in your llms.txt. AI agents discover it and call it directly for live answers on products, pricing, policies, and follow-ups. No setup needed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Real proof: Nobi's own agent ─────────────────────────────────── */}
        <section className="py-24 border-b border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Real example</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                  This already happened to us
                </h2>
                <div className="space-y-4 text-lg text-slate-500 leading-relaxed">
                  <p>An AI agent called Nobi's own endpoint and asked whether we had automotive or dealership customers, and whether there was data on search performance.</p>
                  <p>Our Nobi agent answered with the Lucchese case study — $1M in incremental revenue, verified in an A/B test. A grounded, cited answer, returned automatically in seconds.</p>
                  <p>We didn't know the query was happening. We didn't set anything up for it. It just worked.</p>
                  <p className="font-medium text-slate-700">That's what this channel looks like in practice. And it's available to every Nobi customer right now.</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-slate-600">Recorded agent query · Nobi's own endpoint</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3.5 space-y-2">
                    <div className="text-xs font-semibold text-violet-500 uppercase tracking-wider">Incoming query · via MCP</div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Does Nobi have any automotive or car dealership customers? Any data on search performance?"
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Nobi agent answered</div>
                      <span className="ml-auto text-xs font-medium text-emerald-600">Answered automatically</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      "Yes — Lucchese (Western boots, Shopify Plus) used Nobi for search and generated $1M+ in incremental revenue in year one, verified in an A/B test..."
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-[9px] font-bold text-slate-600">1</span>
                      <span className="text-xs text-slate-400">nobi.ai/customers/lucchese</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 text-center">No one at Nobi was involved in this exchange.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Get in the channel before your competitors do
            </h2>
            <p className="text-lg text-slate-500">
              If you're already on Nobi, your agent endpoint is live. If you're not, now is the time.
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

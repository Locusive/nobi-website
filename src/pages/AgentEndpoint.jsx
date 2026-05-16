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

        {/* ── The channel pitch ────────────────────────────────────────────── */}
        <section className="py-24 border-b border-slate-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-12">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold tracking-[0.2em] text-violet-600 uppercase">Why this matters</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                This is the next channel. And you're already in it.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Millions of people use Claude, ChatGPT, and Perplexity to discover businesses every day. Unlike search, there's no auction to win — AI agents find you based on what you know and whether you have an endpoint to call. If you're on Nobi, you're already there.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { stat: "Included",    label: "with Nobi",               desc: "No extra tier. No new tool. It's built into your existing assistant.", palette: "violet" },
                { stat: "24/7",        label: "automatic",               desc: "Your endpoint answers AI agent queries around the clock.", palette: "blue" },
                { stat: "Every major", label: "AI assistant",            desc: "Claude, ChatGPT, Perplexity, Gemini — any MCP-compatible agent.", palette: "violet" },
                { stat: "First mover", label: "advantage available now", desc: "Most businesses aren't here yet. Being early compounds.", palette: "blue" },
              ].map((s) => (
                <div key={s.label} className={`relative overflow-hidden rounded-2xl text-white p-6 space-y-3 shadow-lg ${
                  s.palette === "violet"
                    ? "bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 shadow-violet-200"
                    : "bg-gradient-to-br from-indigo-500 via-violet-500 to-violet-600 shadow-indigo-200"
                }`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%)]" aria-hidden />
                  <div className="relative">
                    <div className="text-2xl font-bold tracking-tight">{s.stat}</div>
                    <div className="text-sm font-medium text-white/80 mt-0.5">{s.label}</div>
                    <p className="text-xs text-white/60 leading-relaxed mt-2">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dark: How it actually works ───────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-24 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-20">

            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300 font-semibold">How it works</p>
              <h2 className="text-3xl sm:text-4xl font-semibold">Two things Nobi does for you automatically</h2>
            </div>

            {/* Part 1: FAQ pipeline */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 border border-violet-400/30 px-3 py-1">
                  <FileText size={13} className="text-violet-300" />
                  <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Get found</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  Visitor conversations become your AI presence
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Every question a visitor asks your Nobi assistant gets sanitized and surfaced as structured FAQ content on your pages. AI crawlers index it. When someone later asks Claude or ChatGPT about your category, your answers are already in its knowledge — automatically built from real conversations, not articles you had to write.
                </p>
              </div>

              {/* Visual pipeline flow */}
              <div className="space-y-2">
                {[
                  { label: "Visitor asks a question",          sub: "on your site, in plain language",         color: "bg-violet-500/20 border-violet-400/20", dot: "bg-violet-400" },
                  { label: "Nobi answers it",                  sub: "instantly, cited from your content",      color: "bg-violet-500/20 border-violet-400/20", dot: "bg-violet-400" },
                  { label: "Conversation becomes an FAQ",      sub: "sanitized, structured, on your page",     color: "bg-indigo-500/20 border-indigo-400/20",  dot: "bg-indigo-400" },
                  { label: "AI crawlers read and index it",    sub: "GPTBot, ClaudeBot, Perplexity",           color: "bg-fuchsia-500/20 border-fuchsia-400/20", dot: "bg-fuchsia-400" },
                  { label: "AI assistants know about you",     sub: "before the customer even asks",           color: "bg-emerald-500/20 border-emerald-400/20", dot: "bg-emerald-400" },
                ].map((step, i) => (
                  <div key={i}>
                    <div className={`flex items-center gap-3 rounded-xl border ${step.color} px-4 py-3`}>
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${step.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{step.label}</div>
                        <div className="text-xs text-slate-400">{step.sub}</div>
                      </div>
                    </div>
                    {i < 4 && <div className="flex justify-start pl-[1.35rem]"><div className="w-px h-2 bg-white/15" /></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Part 2: Live endpoint */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-last md:order-first rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">What an agent call looks like</div>
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-1.5">
                    <div className="text-slate-500"># AI agent reads your llms.txt</div>
                    <div className="text-violet-300">GET summitcashmere.com/llms.txt</div>
                    <div className="text-emerald-400 pl-2">→ agent endpoint: api.nobi.ai/mcp/summit/rpc</div>
                  </div>
                  <div className="border-t border-white/5 pt-4 space-y-1.5">
                    <div className="text-slate-500"># Agent calls your endpoint directly</div>
                    <div className="text-violet-300">POST /mcp/query</div>
                    <div className="text-slate-300 pl-2">"What cashmere sweaters do you carry?"</div>
                    <div className="text-emerald-400">200 OK · 3 products returned</div>
                  </div>
                  <div className="border-t border-white/5 pt-4 space-y-1.5">
                    <div className="text-slate-500"># Follow-up, same session</div>
                    <div className="text-violet-300">POST /mcp/query</div>
                    <div className="text-slate-300 pl-2">"Do you offer gift wrapping?"</div>
                    <div className="text-emerald-400">200 OK · "Yes, complimentary on all orders"</div>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1">
                  <Bot size={13} className="text-emerald-300" />
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Get called</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">
                  When an AI agent finds you, it talks to you directly
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Your Nobi assistant is already an MCP endpoint, auto-registered in your llms.txt. When Claude or ChatGPT finds your listing, it calls your endpoint for live answers — products, pricing, policies, follow-ups. No separate setup. Same knowledge base, now serving AI agents too.
                </p>
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

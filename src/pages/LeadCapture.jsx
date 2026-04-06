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
                  Don't let interested visitors{" "}
                  <span className={GRADIENT}>leave empty-handed</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  When you set up Nobi to guide visitors through your product or service, some of them are ready to take the next step. Nobi captures their info inside the conversation they're already having, along with full context about what they were asking about. You get a lead. They get a real follow-up.
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
              Trusted by teams that rely on follow-up to close
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
              <p className="text-sm uppercase tracking-[0.2em] text-fuchsia-600 font-semibold">
                Results
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Higher-intent leads, with context already attached
              </h2>
              <p className="text-base text-slate-600">
                Visitors who engage with Nobi and ask to be followed up have already told you what they need. That changes what happens next.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {[
                {
                  stat: "6x",
                  label: "more likely to convert",
                  desc: "Based on Nobi's internal data: visitors who engage with the assistant are 6x more likely to become customers than those who don't interact.",
                  palette: "blue",
                },
                {
                  stat: "+21.3%",
                  label: "revenue per referral",
                  desc: "Faherty Brand measured a 21.3% increase in revenue per referral after adding Nobi to their site.",
                  palette: "purple",
                },
                {
                  stat: "100%",
                  label: "of leads include conversation context",
                  desc: "Every lead captured by Nobi includes a summary of what the visitor was asking about, so follow-ups aren't cold.",
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

        {/* Two modes */}
        <section className="bg-gradient-to-b from-[#17122f] via-[#1c1540] to-[#17122f] py-20 text-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10 sm:space-y-14">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300 font-semibold">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Two ways to capture leads — pick what fits your site
              </h2>
              <p className="text-base text-slate-300">
                Whether you want Nobi to collect info directly or route visitors to a form you already have, attribution is tracked either way.
              </p>
            </div>

            {[
              {
                title: "Native: Nobi collects inline",
                body: "After providing value in the conversation, Nobi naturally offers to connect the visitor with your team. It presents a short inline form — name, email, phone, or any custom fields you configure. The lead lands in your Nobi dashboard and your team gets an email notification with the full conversation summary.",
                visual: "native",
              },
              {
                title: "External form: Nobi refers, then tracks",
                body: "If you already have a contact form you want to keep using, Nobi directs visitors there and tracks which conversations led to a submission. You get attribution between the AI conversation and the form fill — without changing your existing setup. Works automatically for standard HTML forms, or manually with one line of JavaScript.",
                visual: "external",
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
                  <ModeVisual type={item.visual} />
                </div>
              );
            })}
          </div>
        </section>

        {/* What comes with every lead */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-white py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                What comes with every lead
              </h2>
              <p className="text-base text-slate-600">
                Every lead in your dashboard includes more than a name and email. You know what they were asking about before you call.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  emoji: "📋",
                  title: "Contact info",
                  body: "Name, email, and phone. You configure which fields to collect and which are required.",
                },
                {
                  emoji: "💬",
                  title: "Conversation summary",
                  body: "A summary of what the visitor asked Nobi, so you know exactly what they need before you reach out.",
                },
                {
                  emoji: "🔔",
                  title: "Email notification",
                  body: "Your team gets notified by email as soon as a new lead comes in, with a link to view it in the dashboard.",
                },
                {
                  emoji: "🗂️",
                  title: "Manage in dashboard",
                  body: "Search leads by name or email, view the full conversation, add follow-up notes, and manage from one place.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.2)] space-y-3">
                  <div className="text-3xl">{card.emoji}</div>
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
                  Start capturing leads from real conversations
                </h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Set up in minutes from the Nobi dashboard. No code changes required for native mode.
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

// Hero visual: non-ecom conversation (home services)
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
            I need someone to replace my HVAC before summer. What's involved?
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 max-w-[80%] text-[13px] text-slate-800 leading-snug">
            A full replacement typically takes one day. We'll assess your current system, recommend the right unit for your square footage, and handle permits and installation. Most homeowners are up and running in 6–8 hours.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-slate-900 text-white px-4 py-2.5 max-w-[80%] text-[13px] leading-snug">
            How much does it usually cost?
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">N</div>
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 px-4 py-2.5 max-w-[80%] text-[13px] text-slate-800 leading-snug">
            It depends on your home size and current setup. Our team can give you an exact quote. Want me to have someone reach out?
          </div>
        </div>
        {/* Lead capture form inline */}
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 space-y-2.5">
          <div className="text-[11px] font-semibold text-violet-700 uppercase tracking-[0.12em]">Get a free quote</div>
          <div className="space-y-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-400">Your name</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-400">Email address</div>
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-400">Phone number</div>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-3 py-2 text-white text-[12px] font-semibold text-center">
            Request a quote
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeVisual({ type }) {
  const shell = "relative w-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.5)]";

  if (type === "native") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(167,139,250,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">Native mode — inline collection</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5 text-[12px]">
            <div className="flex gap-2 items-start">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">N</div>
              <div className="rounded-xl bg-white/10 px-3 py-2 text-slate-200 leading-snug">
                Want someone from our team to follow up with a quote?
              </div>
            </div>
            <div className="rounded-lg border border-violet-400/30 bg-violet-500/10 p-3 space-y-2">
              <div className="text-[10px] uppercase tracking-[0.12em] text-violet-300 font-semibold">Inline form</div>
              {["Name", "Email", "Phone"].map((f) => (
                <div key={f} className="rounded border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-400">{f}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            Lead saved to dashboard · Team notified by email
          </div>
          <div className="text-[11px] text-slate-400 px-1">Configure which fields to collect and which are required in the Lead Capture settings.</div>
        </div>
      </div>
    );
  }

  if (type === "external") {
    return (
      <div className={shell}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.08),transparent_45%)]" />
        <div className="relative space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-3">External form mode — refer and track</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5 text-[12px]">
            <div className="flex gap-2 items-start">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">N</div>
              <div className="rounded-xl bg-white/10 px-3 py-2 text-slate-200 leading-snug">
                Our team would love to help. You can reach us through our contact form.
              </div>
            </div>
            <div className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2.5 flex items-center gap-2">
              <span className="text-[18px]">🔗</span>
              <div>
                <div className="text-[11px] font-semibold text-blue-300">yoursite.com/contact</div>
                <div className="text-[10px] text-slate-400">Visitor directed to your existing form</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5 text-[12px]">
            <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 mb-2">Attribution tracked automatically</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
              Conversation that referred the lead
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
              Time between conversation and form submission
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
              Works on any standard HTML form — or one JS call
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

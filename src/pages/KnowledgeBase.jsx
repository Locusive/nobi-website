import React, { useEffect } from "react";
import PageLayout from "../components/PageLayout";
import { getSignupUrl } from "../utils/signupUrl";
import { useDemoForm } from "../context/DemoFormContext";
import {
  FileText,
  CheckCircle2,
  RefreshCw,
  Search as SearchIcon,
} from "lucide-react";

const GRADIENT =
  "bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent";

export default function KnowledgeBase() {
  const { onOpen } = useDemoForm();

  useEffect(() => {
    document.title = "Knowledge Base | Nobi";
  }, []);

  const stats = [
    {
      number: "6x",
      label: "more purchases",
      desc: "Visitors who ask a question and get a real answer are 6x more likely to buy than visitors who don't engage.",
    },
    {
      number: "Zero",
      label: "hallucinations",
      desc: "Before sending, Nobi runs a second AI pass that verifies every claim against your knowledge base. It won't say what it can't prove.",
    },
    {
      number: "2x daily",
      label: "auto-refresh",
      desc: "Nobi re-crawls your knowledge base twice a day so answers stay current without any manual work on your end.",
    },
  ];

  const features = [
    {
      icon: FileText,
      title: "Reads your content automatically",
      desc: "Point Nobi at your web pages, upload PDFs, or paste in your help docs. It reads and indexes everything without any tagging or formatting required.",
    },
    {
      icon: CheckCircle2,
      title: "Cites every answer",
      desc: "Nobi shows visitors exactly where each answer came from in your content. They can see the source and trust the response.",
    },
    {
      icon: RefreshCw,
      title: "Fact-checks before sending",
      desc: "A second AI pass verifies dates, prices, and named claims against your knowledge base before every response. If it can't confirm something, it won't say it.",
    },
    {
      icon: SearchIcon,
      title: "Stays current automatically",
      desc: "Your knowledge base refreshes twice a day. Update a page, upload a new PDF, or change your pricing, and Nobi picks it up without any manual work.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Connect your content",
      desc: "Add URLs, upload PDFs, or paste in help docs. Nobi indexes everything and has it ready to answer questions in minutes.",
    },
    {
      number: "2",
      title: "Visitors ask, Nobi answers",
      desc: "Questions come in through the chat widget on your site. Nobi finds the right answer from your content and cites its source.",
    },
    {
      number: "3",
      title: "Answers stay fresh",
      desc: "Nobi re-crawls your connected sources twice a day. When you update a page or upload new docs, the answers update automatically.",
    },
  ];

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white via-white to-slate-50 text-black min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -left-32 -top-24 w-80 h-80 bg-purple-200/50 blur-3xl" aria-hidden />
          <div className="absolute right-[-120px] top-16 w-96 h-96 bg-blue-200/50 blur-3xl" aria-hidden />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 pb-14 pt-16 sm:pt-20 lg:pt-24">
            <div className="space-y-8 text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-600 uppercase">
                Knowledge base
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] text-slate-900">
                Answers from your content,{" "}
                <span className={GRADIENT}>cited and verified</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Upload your docs, PDFs, and web pages. Nobi answers visitor
                questions from them, shows where each answer came from, and
                double-checks facts before sending.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-black text-white hover:opacity-90 shadow-sm h-12 px-6 text-base"
                >
                  Get a demo
                </button>
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-black/10 bg-white/70 h-12 px-6 text-base hover:border-black/30"
                >
                  Get started free
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm"
                >
                  <div className={`text-4xl font-semibold ${GRADIENT}`}>
                    {stat.number}
                  </div>
                  <div className="mt-1 text-base font-semibold text-black/80">
                    {stat.label}
                  </div>
                  <p className="mt-3 text-sm text-black/60">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                How your knowledge base works
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
                Get started in three steps
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative"
                >
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>

                  <div className="pl-16 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dark bottom CTA */}
        <section className="bg-gradient-to-b from-[#17122f] to-[#1c1540] py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                  See knowledge base in action
                </h2>
                <p className="text-base text-slate-300">
                  Get a personalized walk-through of how Nobi answers questions
                  from your content.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onOpen}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition bg-white text-black hover:opacity-90 shadow-sm h-12 px-6 text-base"
                >
                  Get a demo
                </button>
                <a
                  href={getSignupUrl()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition border border-white/20 text-white hover:border-white/40 h-12 px-6 text-base"
                >
                  Get started free
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}

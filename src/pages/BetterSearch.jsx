import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import Button from "../components/Button";
import DemoCTAButton from "../components/DemoCTAButton";
import { VideoModal } from "../components/VideoModal";
import { Play, ArrowRight } from "lucide-react";
import { useDemoForm } from "../context/DemoFormContext";
import Marquee from "react-fast-marquee";

const CUSTOMER_LOGOS = [
  { alt: "UNTUCKit", src: "/media/logos/untuckit.svg" },
  { alt: "Lucchese", src: "/media/logos/lucchese.svg" },
  { alt: "Faherty", src: "/media/logos/faherty.svg" },
  { alt: "TOOLUP", src: "/media/logos/toolup.svg" },
  { alt: "Kilte", src: "/media/logos/kilte.svg" },
  { alt: "Alps and Meters", src: "/media/logos/alps_meters.png" },
];

export default function BetterSearch() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { onOpen: openDemoForm } = useDemoForm();

  useEffect(() => {
    document.title = "Semantic Search that Converts | Nobi";
  }, []);

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
                <p className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase">
                  Semantic search for better results
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-slate-900 text-balance">
                  More accurate results, zero dead ends
                </h1>
                <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                  Natural-language, typo-tolerant semantic search that ranks SKUs by purchase intent—proven conversion lift in days, verified by A/B tests.
                </p>

                <DemoCTAButton className="h-12 rounded-full bg-black text-white hover:opacity-90 shadow-sm px-6 w-full sm:w-auto" />
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-purple-200/70 via-white to-blue-200/70 rounded-[34px] blur-3xl opacity-90" aria-hidden />

                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_28px_80px_-30px_rgba(15,23,42,0.45)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.16),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(236,72,153,0.12),transparent_40%)]" aria-hidden />
                  <div className="relative aspect-[16/9]">
                    <iframe
                      className="absolute inset-0 h-full w-full rounded-2xl"
                      src="https://www.youtube.com/embed/RKqGC3CVZd0?rel=0&modestbranding=1"
                      title="Nobi semantic search demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="border-t border-slate-200/70 bg-gradient-to-b from-slate-50 to-white pb-20 pt-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 space-y-4">
            <p className="text-center text-base text-black/60 tracking-[0.04em]">
              Trusted by ecommerce teams who are serious about search & discovery
            </p>
            <div className="marquee-container">
              <div className="bg-white rounded-xl border border-[#d6d6d6] shadow-[0_8px_22px_-18px_rgba(15,23,42,0.45)] overflow-hidden py-5 px-2">
                <Marquee speed={36} gradient={false} pauseOnHover>
                  {[...CUSTOMER_LOGOS, ...CUSTOMER_LOGOS].map((logo, idx) => (
                    <img
                      key={`${logo.alt}-${idx}`}
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

        {/* Key metrics */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { stat: "Up to 30%", label: "Lift in conversion rate (A/B proven)" },
                { stat: "35.3%", label: "Lift in add-to-cart rate" },
                { stat: "55.8%", label: "Lift in average order value" },
                { stat: "6%", label: "Lift in product views" },
              ].map((item, idx) => (
                <div
                  key={item.stat}
                  className="relative overflow-hidden rounded-xl border border-[#4c3ab8] bg-gradient-to-br from-[#4a47a8] via-[#6b52d9] to-[#9d5af0] text-white shadow-[0_18px_42px_-24px_rgba(64,41,153,0.45)]"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_36%)]" aria-hidden />
                  <div className="relative px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-2 text-center">
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">{item.stat}</div>
                    <div className="text-xs sm:text-sm font-medium leading-relaxed text-white/85">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <VideoModal
          open={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          youtube="https://www.youtube.com/watch?v=RKqGC3CVZd0"
        />
      </div>
    </PageLayout>
  );
}

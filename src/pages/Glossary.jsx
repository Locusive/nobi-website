import React, { useMemo } from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";
import { terms, termsByLetter } from "../content/utils/mdxGlossaryLoader";

export default function Glossary() {
  const groups = useMemo(() => termsByLetter(), []);
  const letters = useMemo(() => Object.keys(groups).sort(), [groups]);

  // DefinedTermSet schema so answer engines can read the whole glossary as a
  // structured set of definitions, plus a DefinedTerm per entry.
  const schema = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://nobi.ai";
    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "name": "Nobi Glossary",
      "description": "Definitions of AI search, ecommerce, and dealership terms.",
      "url": `${origin}/glossary`,
      "hasDefinedTerm": terms.map((t) => ({
        "@type": "DefinedTerm",
        "name": t.meta.term,
        "description": t.meta.definition,
        "url": `${origin}/glossary/${t.slug}`,
      })),
    };
  }, []);

  useSEO({
    title: "Glossary of AI Search & Ecommerce Terms | Nobi",
    description:
      "Plain-English definitions of AI search, ecommerce, and dealership terms - what each means, how it works, and why it matters.",
    path: "/glossary",
    schema,
  });

  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-8 sm:pt-20">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">Glossary</h1>
          <p className="mt-3 text-base sm:text-lg text-black/70 dark:text-white/70 max-w-2xl">
            Plain-English definitions of the AI search, ecommerce, and dealership
            terms we get asked about most - what each one means, how it works,
            and why it matters.
          </p>

          {/* A–Z jump nav */}
          <div className="mt-6 flex flex-wrap gap-2">
            {letters.map((l) => (
              <a
                key={l}
                href={`#${l}`}
                className="px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 text-sm font-semibold text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 no-underline"
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          {letters.map((letter) => (
            <section key={letter} id={letter} className="scroll-mt-24 mt-10 first:mt-0">
              <h2 className="text-2xl font-semibold text-fuchsia-600">{letter}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {groups[letter].map((t) => (
                  <a
                    key={t.slug}
                    href={`/glossary/${t.slug}`}
                    className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-semibold group-hover:text-purple-600 transition-colors">
                      {t.meta.term}
                    </h3>
                    <p className="mt-2 text-sm text-black/70 dark:text-white/70 line-clamp-3">
                      {t.meta.definition}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

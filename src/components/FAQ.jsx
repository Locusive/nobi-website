import React from "react";
import { ChevronDown } from "lucide-react";

// Canonical list of FAQs used across the site
export const FAQ_ITEMS = [
  {
    q: "How long does install take?",
    a: "Typically ~15 minutes for Shopify themes and then it depends on how much you want to customize. Headless installs depend on your stack.",
  },
  {
    q: "Can we A/B test it?",
    a: "Yes. Nobi easily hooks into your A/B testing solution or we can build something custom for you.",
  },
  {
    q: "What can I do with Nobi?",
    a: "Nobi is really good at understanding natural language and showing relevant products quickly. So we recommend enabling it in your search bar, on collection pages, and anywhere else where shoppers may prefer to just describe what they're looking for.",
  },
  {
    q: "Does Nobi replace my current search?",
    a: "Up to you. Nobi can become your default search bar experience or layers on top so you can keep your existing keyword engine and optionally enable AI.",
  },
];

/**
 * Shared FAQ accordion.
 * @param {number} [limit] - Optional number of FAQs to display.
 * @param {string} [id="faq"] - Optional section id.
 * @param {string} [title] - Optional heading override.
 * @param {string} [description] - Optional lead paragraph below the heading.
 * @param {"left"|"center"} [headingAlign="left"] - Heading alignment.
 * @param {boolean} [showBorderTop=true] - Toggle border at the top of the section.
 * @param {string} [sectionClassName] - Extra classes on the section.
 * @param {string} [padding="py-20"] - Override vertical padding utility.
 * @param {number} [columns=1] - Column count for the FAQ list (>=2 switches to grid layout).
 */
export default function FAQ({
  limit,
  id = "faq",
  title = "You're not the first to ask",
  description,
  headingAlign = "left",
  showBorderTop = false,
  sectionClassName = "",
  padding = "",
  columns = 1,
}) {
  const items = typeof limit === "number" ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;
  const headingAlignClass = headingAlign === "center" ? "text-center" : "";
  const borderClass = showBorderTop ? "border-t border-black/5 dark:border-white/5" : "";
  const listClass =
    columns >= 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : "space-y-4";

  return (
    <section
      id={id}
      className={`scroll-mt-20 ${padding} ${borderClass} ${sectionClassName}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className={`${headingAlignClass} mb-10`}>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-3 text-base sm:text-lg text-black/70 dark:text-white/70">
              {description}
            </p>
          )}
        </div>

        <div className={listClass}>
          {items.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-sm"
            >
              <summary className="list-none cursor-pointer flex items-center justify-between gap-4 px-5 py-4 font-medium">
                <span>{f.q}</span>
                <ChevronDown
                  className="h-5 w-5 text-black/40 dark:text-white/60 transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-black/70 dark:text-white/70">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

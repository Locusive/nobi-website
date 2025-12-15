import React from "react";
import { ChevronDown } from "lucide-react";

// Canonical list of FAQs used across the site
export const FAQ_ITEMS = [
    {
        q: "What can I do with Nobi?",
        a: "So we recommend enabling it in your search bar, on collection pages, and anywhere else where shoppers may prefer to just describe what they're looking for.",
        category: "Product",
    },
    {
        q: "Does Nobi replace my current search?",
        a: "Up to you. Nobi can become your default search bar experience, or you can use other elements like our suggestion pills or button to prompt shoppers to use Nobi outside of search.",
        category: "Product",
    },
    {
        q: "How does Nobi handle accessibility?",
        a: "Nobi is built with accessibility in mind, following best practices to ensure it is usable by all shoppers, including those using assistive technologies. You can read more <a href='https://docs.nobi.ai/nobi-ux/accessibility/'>here</a>.",
        category: "Product",
    },
    {
        q: "Can Nobi be customized to match my brand?",
        a: "Yes! Nobi offers various customization options to align with your brand's look and feel, including colors, fonts, and messaging.",
        category: "Product",
    },
    {
        q: "What happens if someone asks a question Nobi can't answer?",
        a: "Nobi is designed to only use the content of your site or product catalog to answer questions. If a shopper asks something outside of that scope, Nobi is instructed to let visitors know it doesn't have enough information to help. While we can't guarantee there won't ever be hallucinations, we've found that this approach minimizes them significantly.",
        category: "Product",
    },
    {
        q: "Can Nobi handle multiple languages?",
        a: "Yes! Nobi supports multiple languages and can be configured to understand and respond in the languages your shoppers use.",
        category: "Product",
    },
    {
        q: "Is there a limit to the number of products Nobi can handle?",
        a: "Nobi can handle product catalogs of varying sizes, from small boutiques to large enterprises with hundreds of thousands of products. For very large catalogs, we recommend reaching out to our team to discuss the best setup for your needs.",
        category: "Product",
    },
    {
        q: "Do you have merchandising capabilities?",
        a: "Yes! Nobi includes merchandising features that allow you to boost or filter specific products, and also provides merchandising rules for more general control over search results.",
        category: "Product",
    },
    {
        q: "What kind of reporting do you have?",
        a: "Nobi provides performance metrics on search usage, conversion rates, and other key indicators to help you understand how Nobi is impacting your store's performance. In addition, we provide deep insights, analytics, trends, topic analytics, and search feature breakdowns in our dashboard.",
        category: "Product",
    },
    {
        q: "Can shoppers add products to their cart through Nobi?",
        a: "Yes! Nobi has a 'quick add' feature that allows shoppers to add products directly to their cart from the Nobi interface.",
        category: "Product",
    },
    {
        q: "Does Nobi collect PII?",
        a: "No. Nobi does not collect any personally identifiable information.",
        category: "Product",
    },
    {
        q: "Can we A/B test it?",
        a: "Yes. Nobi easily hooks into your A/B testing solution, and we also offer A/B testing as a service to help you optimize your setup.",
        category: "Product",
    },
    {
        q: "How hard is it to integrate my product catalog?",
        a: "If you're on Shopify, it's either automatic (for stores with fewer than 25K products), or 2 minutes to set up Nobi as a custom Shopify app. We'll handle the rest.",
        category: "Setup",
    },
    {
        q: "How long does install take?",
        a: "It takes a couple of minutes to add the base Nobi code and the event tracking code to your site, and then a few more minutes to add the Nobi element that you want to enable.",
        category: "Setup",
    },
    {
        q: "Can we try it before committing?",
        a: "Absolutely! We offer a free trial period of 30 days or up to 100K messages.",
        category: "Pricing",
    },
    {
        q: "How does pricing work?",
        a: "Nobi's pricing is based on the number of messages your shoppers send to Nobi each month, with a monthly minimum and discounts for higher volume usage and annual commitments.",
        category: "Pricing",
    },
    {
        q: "What kind of support do you offer?",
        a: "Our customers get full access to our founders and we even have Slack Connect channels for real-time support.",
        category: "Support",
    },
    {
        q: "Do you build your own models? Do you use ChatGPT?",
        a: "We don't build our own LLMs, instead, our system dynamically selects models from a selection of top LLM providers, with a focus on speed + accuracy. However, we do apply our own ranking and and personalization models on top of the LLM results to ensure the best possible answers for your shoppers.",
    }
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
 * @param {boolean} [groupByCategory=false] - When true, render FAQs grouped by their category label.
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
  groupByCategory = false,
}) {
  const items = typeof limit === "number" ? FAQ_ITEMS.slice(0, limit) : FAQ_ITEMS;
  const headingAlignClass = headingAlign === "center" ? "text-center" : "";
  const borderClass = showBorderTop ? "border-t border-black/5 dark:border-white/5" : "";
  const listClass =
    columns >= 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : "space-y-4";

  const withTargetBlank = (html = "") =>
    html
      // add target/rel when absent
      .replace(/<a\s+(?![^>]*target=)([^>]*?)>/gi, "<a $1 target=\"_blank\" rel=\"noopener noreferrer\">")
      // ensure rel exists if a target already present
      .replace(/<a([^>]*target=[\"']?_blank[\"']?)(?![^>]*rel=)([^>]*)>/gi, "<a$1 rel=\"noopener noreferrer\"$2>");

  const renderList = (list) => (
    <div className={listClass}>
      {list.map((f) => (
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

          <div className="px-5 pb-5 -mt-1 text-sm text-black/70 dark:text-white/70">
            {typeof f.a === "string" ? (
              <p
                className="leading-relaxed faq-answer"
                dangerouslySetInnerHTML={{ __html: withTargetBlank(f.a) }}
              />
            ) : (
              f.a
            )}
          </div>
        </details>
      ))}
    </div>
  );

  const grouped = React.useMemo(() => {
    if (!groupByCategory) return null;
    const order = [];
    const map = {};
    items.forEach((item) => {
      const cat = item.category || "General";
      if (!map[cat]) {
        map[cat] = [];
        order.push(cat);
      }
      map[cat].push(item);
    });
    return { order, map };
  }, [groupByCategory, items]);

  return (
    <section
      id={id}
      className={`scroll-mt-20 ${padding} ${borderClass} ${sectionClassName}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {(title || description) && (
          <div className={`${headingAlignClass} mb-10`}>
            {title && (
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-base sm:text-lg text-black/70 dark:text-white/70">
                {description}
              </p>
            )}
          </div>
        )}

        {groupByCategory && grouped ? (
          <div className="space-y-8">
            {grouped.order.map((cat) => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xl font-semibold">{cat}</h3>
                {renderList(grouped.map[cat])}
              </div>
            ))}
          </div>
        ) : (
          renderList(items)
        )}
      </div>
    </section>
  );
}

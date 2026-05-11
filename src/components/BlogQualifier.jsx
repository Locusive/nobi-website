import React from "react";

function buildMessages(context) {
  const ctx = context || "these tools";
  return [
    {
      id: "evaluating",
      label: "Actively evaluating tools right now",
      message: `I'm actively evaluating ${ctx}. Can you walk me through how Nobi compares and what it would look like on my site?`,
    },
    {
      id: "researching",
      label: "Still in research mode",
      message: `I'm still researching ${ctx}. What should I actually be looking for when comparing these tools?`,
    },
    {
      id: "switching",
      label: "Already using something, thinking of switching",
      message: `I'm currently using one of ${ctx} and thinking about switching. Can you give me an honest read on how Nobi compares?`,
    },
  ];
}

export default function BlogQualifier({ context }) {
  const [selected, setSelected] = React.useState(null);
  const options = buildMessages(context);

  function handleClick(option) {
    setSelected(option.id);

    // Fire GA4 event
    if (typeof window.gtag === "function") {
      window.gtag("event", "qualifier_click", {
        intent: option.id,
        article_path: window.location.pathname,
      });
    }

    // Pre-seed visitor context for when setVisitorContext ships
    if (window.Nobi?.setVisitorContext) {
      window.Nobi.setVisitorContext({
        intent: option.id,
        source_article: window.location.pathname,
        article_context: context || null,
        clicked_at: new Date().toISOString(),
      });
    }

    // Open Nobi with the selection as the USER's first message so Nobi responds naturally
    if (window.Nobi?.openChat) {
      window.Nobi.openChat({ message: option.message });
    }
  }

  return (
    <div className="my-8 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 px-5 py-4">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Where are you in your search?
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-3">
        Pick one and Nobi will respond based on where you are.
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleClick(option)}
            className={`text-left text-sm px-4 py-3 rounded-lg border transition-all flex items-center justify-between group ${
              selected === option.id
                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium"
                : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
            }`}
          >
            <span>{option.label}</span>
            <span className={`text-xs ml-2 shrink-0 transition-transform group-hover:translate-x-0.5 ${selected === option.id ? "opacity-100" : "opacity-40"}`}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

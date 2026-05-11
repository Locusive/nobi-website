import React from "react";

function buildMessages(context) {
  const ctx = context || "these tools";
  return [
    {
      id: "evaluating",
      label: "Actively evaluating tools right now",
      assistantMessage: `Looks like you're actively comparing ${ctx}. I can walk you through exactly how Nobi would perform on your site — what are you currently using, or what's your store URL?`,
    },
    {
      id: "researching",
      label: "Still in research mode",
      assistantMessage: `Still researching ${ctx} — no rush. What questions do you have? I can help you figure out what to actually look for when comparing these tools.`,
    },
    {
      id: "switching",
      label: "Already using something, thinking of switching",
      assistantMessage: `Thinking about switching away from one of ${ctx}? Tell me which tool you're on and what's frustrating you — I'll give you an honest read on how Nobi compares.`,
    },
  ];
}

export default function BlogQualifier({ context }) {
  const [selected, setSelected] = React.useState(null);
  const options = buildMessages(context);

  function handleClick(option) {
    setSelected(option.id);

    if (window.Nobi?.setVisitorContext) {
      window.Nobi.setVisitorContext({
        intent: option.id,
        source_article: window.location.pathname,
        article_context: context || null,
        clicked_at: new Date().toISOString(),
      });
    }

    if (window.Nobi?.openChat) {
      window.Nobi.openChat({ assistantMessage: option.assistantMessage });
    }
  }

  return (
    <div className="my-8 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 px-5 py-4">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        Where are you in your search?
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleClick(option)}
            className={`text-left text-sm px-4 py-2.5 rounded-lg border transition-colors ${
              selected === option.id
                ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium"
                : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

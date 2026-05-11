import React from "react";

const OPTIONS = [
  {
    id: "evaluating",
    label: "Actively evaluating tools right now",
    assistantMessage:
      "Looks like you're actively comparing tools. I can walk you through exactly how Nobi would perform on your site — what's your store URL or what are you currently using?",
  },
  {
    id: "researching",
    label: "Still in research mode",
    assistantMessage:
      "Still in research mode — no rush. What questions do you have? I can help you figure out what to actually look for when comparing these tools.",
  },
  {
    id: "switching",
    label: "Already using a competitor, thinking of switching",
    assistantMessage:
      "Thinking about switching? Tell me which tool you're on and what's frustrating you — I'll give you an honest read on how Nobi compares.",
  },
];

export default function BlogQualifier() {
  const [selected, setSelected] = React.useState(null);

  function handleClick(option) {
    setSelected(option.id);

    // Set visitor context for Nobi to use in the conversation
    if (window.Nobi?.setVisitorContext) {
      window.Nobi.setVisitorContext({
        intent: option.id,
        source_article: window.location.pathname,
        clicked_at: new Date().toISOString(),
      });
    }

    // Open Nobi with a tailored greeting
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
        {OPTIONS.map((option) => (
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

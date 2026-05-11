import React from "react";

/**
 * Inline callout directing the reader to try a specific prompt in the
 * Nobi chat bar already present on the page. Injected by the pipeline
 * decorator after the comparison table on every article.
 */
export default function BlogChatPrompt({ prompt }) {
  const [copied, setCopied] = React.useState(false);

  if (!prompt) return null;

  function copy() {
    navigator.clipboard?.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="my-8 rounded-xl border border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950/30 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
          Try it right now
        </p>
        <p className="text-sm text-purple-800 dark:text-purple-400">
          Ask the chat bar below:{" "}
          <span className="italic">"{prompt}"</span>
        </p>
      </div>
      <button
        onClick={copy}
        className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        {copied ? "Copied!" : "Copy prompt"}
      </button>
    </div>
  );
}

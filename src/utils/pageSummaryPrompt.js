export function buildPageSummaryPrompt() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "Summarize this Nobi page for a buyer evaluating conversational website assistants.";
  }

  const title = document.title || "Nobi";
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const url = window.location.href;

  return [
    "Summarize this Nobi page for a buyer evaluating conversational website assistants.",
    "",
    `Page title: ${title}`,
    description ? `Meta description: ${description}` : null,
    `Page URL: ${url}`,
    "",
    "Focus on what the page says Nobi does, who it is for, the proof points, and the next best action for the visitor.",
  ].filter(Boolean).join("\n");
}

export async function summarizeCurrentPageWithNobi() {
  const prompt = buildPageSummaryPrompt();

  window.Nobi?.addVisitorContext?.(
    `Visitor clicked the page summarization CTA on ${window.location.pathname}. They are asking Nobi to summarize the current page.`
  );

  if (window.Nobi?.openChat) {
    window.Nobi.openChat({ message: prompt });
    return { method: "nobi", prompt };
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(prompt);
    return { method: "clipboard", prompt };
  }

  return { method: "none", prompt };
}

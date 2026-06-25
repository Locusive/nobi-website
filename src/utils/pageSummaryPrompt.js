export function buildPageSummaryPrompt() {
  return "Summarize this page for me. Focus on the substantive content, not metadata like the title or author. If the page compares options or makes recommendations, cover the options, key tradeoffs, and who each option is best for.";
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

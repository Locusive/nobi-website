export function buildPageSummaryPrompt() {
  return "Summarize the current page.";
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

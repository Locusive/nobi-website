export function buildPageSummaryPrompt() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "Summarize this Nobi page for a buyer evaluating options.";
  }

  const title = document.title || "Nobi";
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const url = window.location.href;

  return [
    "Summarize this Nobi page for a buyer evaluating options.",
    "",
    `Page title: ${title}`,
    description ? `Meta description: ${description}` : null,
    `Page URL: ${url}`,
    "",
    "Cover the main options or recommendations on the page. For comparison pages, include the alternatives and key tradeoffs. Explain where Nobi fits, who the page is for, important proof points, and the best next step.",
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

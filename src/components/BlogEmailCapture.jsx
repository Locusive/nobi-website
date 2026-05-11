import React from "react";

const WEB3FORMS_KEY = "c7a3fd79-0e4f-47ce-aa30-c141616d21e3";

/**
 * Inline email capture block injected mid-article by the pipeline decorator.
 * Submits to Web3Forms with: email, article URL, article title, and the
 * hook prompt shown - so every lead arrives with full context for a
 * personal follow-up.
 */
export default function BlogEmailCapture({ hook, prompt, articleTitle }) {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState("");

  if (!hook) return null;

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const articleUrl = typeof window !== "undefined" ? window.location.href : "";
      const title = articleTitle || (typeof document !== "undefined" ? document.title : "");

      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_KEY);
      formData.append("subject", `Blog lead: ${title}`);
      formData.append("from_name", "Nobi Blog");
      formData.append("email", email.trim());
      formData.append("article_url", articleUrl);
      formData.append("article_title", title);
      formData.append("prompt_shown", prompt || hook);
      formData.append("botcheck", "");

      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const j = await r.json();
      if (!r.ok || !j.success) throw new Error(j.message || "Something went wrong.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="my-8 rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 px-5 py-4 text-center">
        <p className="text-sm font-semibold text-green-800 dark:text-green-300">Got it.</p>
        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
          You'll hear from us shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 px-5 py-5">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{hook}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        Drop your email and we'll follow up personally.
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-4 py-2 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

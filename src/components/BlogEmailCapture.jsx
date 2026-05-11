import React from "react";

const WEB3FORMS_KEY = "c7a3fd79-0e4f-47ce-aa30-c141616d21e3";

export default function BlogEmailCapture({ hook, subtext, articleTitle }) {
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
      formData.append("hook_shown", hook);
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
      <div className="my-6 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 px-5 py-4">
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">You're on the list.</div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">We'll be in touch shortly.</div>
      </div>
    );
  }

  return (
    <div className="my-6 rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 px-5 py-4">
      <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">{hook}</div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-3">{subtext || "Drop your email and we'll show you how Nobi works."}</div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-4 py-1.5 hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {submitting ? "…" : "Show me"}
        </button>
      </form>
      {error && <div className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</div>}
    </div>
  );
}

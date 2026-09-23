import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { EVENTS } from "../constants/events";
import { trackEvent } from "../utils/eventTracker";

const WEB3FORMS_ACCESS_KEY = "c7a3fd79-0e4f-47ce-aa30-c141616d21e3";
const URL_FORM_TIMEOUT_MS = 120000;
const TRAFFIC_MULTIPLIER = 5;

function buildLeadFormData({ url, name, email }) {
  const formData = new FormData();
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append(
    "subject",
    `Nobi Pricing Estimate Request: ${url || "(no URL)"}`
  );
  formData.append("from_name", "Nobi Pricing Calculator");
  formData.append("website", url || "");
  if (name) formData.append("name", name);
  if (email) formData.append("email", email);
  formData.append(
    "message",
    `Lead from pricing calculator. URL: ${url}${name ? ` · Name: ${name}` : " · (no name given)"}${email ? ` · Email: ${email}` : " · (no email given)"}`
  );
  return formData;
}

export default function PricingEstimateForm({ onEstimateInteraction, onTrafficLookup }) {
  const [step, setStep] = useState("idle");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [estimatedVisits, setEstimatedVisits] = useState(null);
  const [siteName, setSiteName] = useState("");

  const sentRef = useRef(false);
  const submittedRef = useRef(false);
  const timeoutRef = useRef(null);
  const latestRef = useRef({ url: "", name: "", email: "", estimatedVisits: null });

  useEffect(() => {
    latestRef.current = { url, name, email, estimatedVisits };
  }, [url, name, email, estimatedVisits]);

  const sendOnce = () => {
    if (sentRef.current) return false;
    if (!submittedRef.current) return false;
    if (!latestRef.current.url) return false;
    sentRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const formData = buildLeadFormData(latestRef.current);
    try {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        keepalive: true,
      }).catch(() => {});
      trackEvent(EVENTS.PRICING_CALCULATOR_LEAD_SUBMITTED, {
        website: latestRef.current.url,
        hasContact: Boolean(latestRef.current.email),
        estimatedVisits: latestRef.current.estimatedVisits,
      });
    } catch (_) {
      // ignore
    }
    return true;
  };

  useEffect(() => {
    const handler = () => {
      if (latestRef.current.url) sendOnce();
    };
    window.addEventListener("beforeunload", handler);
    window.addEventListener("pagehide", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      window.removeEventListener("pagehide", handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!url.trim()) {
      setError("Drop your site URL.");
      return;
    }
    onEstimateInteraction?.();
    submittedRef.current = true;
    setStep("loading");
    let visits = null;
    let resolvedName = "";
    try {
      const r = await fetch(
        `/api/traffic-lookup?domain=${encodeURIComponent(url.trim())}`
      );
      if (r.ok) {
        const data = await r.json();
        if (data?.monthlyVisits && data.monthlyVisits > 0) {
          visits = Math.round(data.monthlyVisits * TRAFFIC_MULTIPLIER);
        }
        resolvedName = data?.siteName || "";
      }
    } catch (_) {
      // ignore — fall through to details step regardless
    }

    if (visits) {
      setEstimatedVisits(visits);
      setSiteName(resolvedName);
      onTrafficLookup?.(visits);
    }

    if (window.Nobi?.addVisitorContext) {
      const site = resolvedName || url.trim();
      window.Nobi.addVisitorContext(
        `High-intent signal: visitor entered their site URL on the Nobi pricing page${site ? ` (${site})` : ""} to get a pricing estimate.`
      );
    }

    timeoutRef.current = setTimeout(() => {
      sendOnce();
      setStep((s) => (s === "details" ? "done-quiet" : s));
    }, URL_FORM_TIMEOUT_MS);

    setStep("details");
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    sendOnce();
    setStep("done");
    setSubmitting(false);
  };

  if (step === "done" || step === "done-quiet") {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 text-sm">
        <div className="font-semibold text-emerald-900">Thanks, we'll be in touch.</div>
        <div className="text-emerald-800 mt-0.5 text-xs">
          We'll review your site and reply within one business day.
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 flex items-center gap-3 text-sm text-slate-600">
        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
        Looking up traffic for {url}…
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        onSubmit={handleDetailsSubmit}
        className="mt-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
      >
        {estimatedVisits ? (
          <>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Updated your estimate using <span className="text-slate-700">{siteName || url}</span>.
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Want us to walk through the details? Drop your name and email.
            </div>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-slate-900 mb-1">
              We couldn't pull traffic data for <span className="text-slate-700">{url}</span>.
            </div>
            <div className="text-xs text-slate-500 mb-3">
              Drop your name and email and we'll review it manually and send you a custom estimate.
            </div>
          </>
        )}
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 transition whitespace-nowrap"
          >
            Get in touch
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleUrlSubmit}
      className="mt-4 rounded-2xl border border-slate-100 bg-white px-5 py-4"
    >
      <div className="text-xs text-slate-500 mb-2">
        Don't know your numbers? Drop your URL and we'll estimate them for you.
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] gap-2">
        <input
          name="websiteUrl"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yoursite.com"
          required
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition whitespace-nowrap"
        >
          Look it up
        </button>
      </div>
      {error ? <div className="text-xs text-red-600 mt-2">{error}</div> : null}
    </form>
  );
}

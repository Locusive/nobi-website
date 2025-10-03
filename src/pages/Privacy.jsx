// src/pages/Privacy.jsx
import React from "react";

const LEGAL_NAME = "Locusive, Inc. d/b/a Nobi";
const SHORT_NAME = "Nobi";
const EFFECTIVE = "October 1, 2025";
const CONTACT = "privacy@nobi.ai";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm font-semibold text-fuchsia-600">Legal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Effective {EFFECTIVE}. This Privacy Policy explains how {SHORT_NAME} collects, uses, and
            shares information. If you have questions, email{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </header>

        <section className="prose prose-slate dark:prose-invert max-w-none">
          <h2>Who we are</h2>
          <p>
            {LEGAL_NAME} (“<strong>{SHORT_NAME}</strong>”, “we”, “us”, or “our”) provides conversational
            product-search and related services for commerce brands (the “<strong>Service</strong>”).
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Account & Contact Data</strong> — name, email, role, company, and similar details
              when you request a demo, start a trial, or contact us.
            </li>
            <li>
              <strong>Commerce & Usage Data</strong> — queries, clicks, viewed items, conversation logs,
              device/browser info, IP address, timestamps, and interactions with our widgets or APIs.
            </li>
            <li>
              <strong>Technical Data</strong> — cookies, pixel tags, SDKs, error logs, performance metrics,
              and diagnostics to keep the Service reliable and secure.
            </li>
            <li>
              <strong>Customer Content</strong> — catalog data or end-user inputs that our brand customers
              send to {SHORT_NAME} to power the Service.
            </li>
          </ul>

          <h2>How we use information</h2>
          <ul>
            <li>Provide, operate, and improve the Service;</li>
            <li>Personalize results and measure performance (e.g., CTR, AOV, conversion);</li>
            <li>Detect, prevent, and investigate security incidents and abuse;</li>
            <li>Respond to inquiries and provide support;</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>Legal bases (EEA/UK)</h2>
          <p>
            Where GDPR applies, we rely on one or more of: performance of a contract, legitimate interests
            (e.g., improving the Service and ensuring security), consent (where required), and compliance
            with legal obligations.
          </p>

          <h2>How we share information</h2>
          <ul>
            <li>
              <strong>Vendors & Subprocessors</strong> — cloud hosting, analytics, error reporting,
              communications, model providers, and support tools under contractual safeguards.
            </li>
            <li>
              <strong>Partners & Integrations</strong> — when you choose to connect third-party services
              (e.g., commerce platforms), we share data as needed to make the integration work.
            </li>
            <li>
              <strong>Legal & Safety</strong> — to comply with law, protect rights, safety, and the Service.
            </li>
            <li>
              <strong>Business Transfers</strong> — as part of a merger, acquisition, or asset sale.
            </li>
          </ul>

          <h2>Retention</h2>
          <p>
            We retain information for as long as necessary to provide the Service, comply with our legal
            obligations, resolve disputes, and enforce agreements. We may de-identify or aggregate data
            for analytics and benchmarking.
          </p>

          <h2>Security</h2>
          <p>
            We employ administrative, technical, and physical safeguards designed to protect information.
            No method of transmission or storage is 100% secure.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>
              <strong>Marketing</strong> — you can opt out of marketing emails using the unsubscribe link
              or by contacting us.
            </li>
            <li>
              <strong>Cookies</strong> — browser settings may let you block or delete cookies; this may
              impact functionality.
            </li>
          </ul>

          <h2>Data subject rights (EEA/UK)</h2>
          <p>
            Where GDPR applies, you may have rights to request access, correction, deletion, restriction,
            or portability of your personal data, and to object to certain processing. You may also lodge a
            complaint with your local supervisory authority. If we process your data as a processor on
            behalf of a brand customer, please contact that brand first; we will support them in responding.
          </p>

          <h2>California privacy</h2>
          <p>
            If you are a California resident, you may have rights under the CCPA/CPRA, including to know,
            delete, correct, and opt out of “selling”/“sharing” (as defined by law). We do not knowingly
            sell personal information for money. To exercise rights, contact us at{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>

          <h2>International transfers</h2>
          <p>
            We may transfer, store, and process information in the United States and other countries where
            we or our service providers operate, with appropriate safeguards where required.
          </p>

          <h2>Children</h2>
          <p>
            The Service is not directed to children under 13 (or the age of digital consent where you live).
            We do not knowingly collect personal data from children. If you believe a child provided data,
            please contact us to delete it.
          </p>

          <h2>Do Not Track</h2>
          <p>
            Some browsers offer “Do Not Track” signals; we currently do not respond to such signals.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this Privacy Policy periodically. We will post the updated version with a new
            effective date. Material changes will be notified in a reasonable manner.
          </p>

          <h2>Contact</h2>
          <p>
            Questions or requests: <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
        </section>
      </main>
    </div>
  );
}

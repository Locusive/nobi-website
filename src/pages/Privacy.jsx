import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";

const Privacy = () => {
  useSEO({
    title: "Privacy Policy | Nobi",
    description: "How Nobi collects, uses, and protects your data. Read our privacy policy for full details.",
    path: "/privacy",
  });
  return (
  <PageLayout>
    <main className="prose prose-lg mx-auto px-4 py-8">
    {/* Page Heading and Intro */}
    <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
    <p className="text-sm text-gray-500 mb-8">
      Effective October&nbsp;11,&nbsp;2026. This Privacy Policy explains how Nobi
      collects, uses, and shares information.  If you have questions, email{" "}
      <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
        privacy@nobi.ai
      </a>.
    </p>

    {/* Who We Are */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Who We Are</h2>
      <p className="mb-4">
        Locusive, Inc. d/b/a Nobi (“Nobi”, “we”, “us”, or “our”) provides
        conversational product‑search and related services for commerce brands
        (the “Service”).
      </p>
      <p className="mb-4">
        We also run Shop Nobi, a free shopping search at nobi.ai/shop. The
        “Shop Nobi” section below explains how we handle shoppers’ information.
      </p>
    </section>

    {/* Information We Collect */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Account & Contact Data</strong> — name, email, role, company
          and similar details when you create an account, request a demo, start
          a trial or contact us. When you sign up through our self-service
          onboarding, we collect your Google account information (name and email)
          via Google authentication, your website URL, and business details you
          provide during setup.
        </li>
        <li>
          <strong>Commerce & Usage Data</strong> — queries, clicks, viewed
          items, conversation logs, device/browser info, IP address, timestamps,
          and interactions with our widgets or APIs. This includes intent signals
          you voluntarily express through interactive components on our site
          (for example, clicking a button on a blog post to indicate where you
          are in your buying journey). These signals are stored on your visitor
          profile for up to 12 months and used to personalize the Nobi
          assistant experience on future visits.
        </li>
        <li>
          <strong>Technical Data</strong> — cookies, pixel tags, SDKs, error
          logs, performance metrics and diagnostics that keep the Service
          reliable and secure.
        </li>
        <li>
          <strong>Customer Content</strong> — catalogue data or end‑user inputs
          that our brand customers send to Nobi to power the Service.
        </li>
        <li>
          <strong>Onboarding Data</strong> — when you create a self-service
          account, we automatically detect your website platform, scan publicly
          available pages (such as FAQ, shipping, and returns pages) to
          populate your knowledge base, and import your product catalogue. This
          data is used solely to provide the Service and is subject to the same
          protections as other Customer Content.
        </li>
        <li>
          <strong>Merchant-Supplied Visitor Context</strong> — merchants may
          use the <code>window.Nobi.addVisitorContext()</code> JavaScript API
          to supply free-form context strings describing a site visitor's
          situation or intent (for example, "visitor indicated they are actively
          evaluating tools"). This data is treated as Customer Content, stored
          on the visitor's profile, and used solely to personalize that
          visitor's assistant experience. Merchants are responsible for ensuring
          they have appropriate consent from their visitors before supplying
          this context.
        </li>
      </ul>
    </section>

    {/* How We Use Information */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">How We Use Information</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Provide, operate and improve the Service;</li>
        <li>
          Personalize results and measure performance (e.g., click‑through rate,
          average order value, conversion);
        </li>
        <li>Detect, prevent and investigate security incidents and abuse;</li>
        <li>Respond to inquiries and provide support;</li>
        <li>Comply with legal obligations.</li>
      </ul>
    </section>

    {/* Legal Bases */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">Legal Bases (EEA/UK)</h2>
      <p className="mb-4">
        Where GDPR applies, we rely on one or more of the following:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Performance of a contract</strong> with you;
        </li>
        <li>
          <strong>Legitimate interests</strong> (e.g. improving the Service and
          ensuring security);
        </li>
        <li>
          <strong>Consent</strong> (where required);
        </li>
        <li>
          <strong>Compliance with legal obligations</strong>.
        </li>
      </ul>
    </section>

    {/* How We Share Information */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-2">How We Share Information</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Vendors & Sub‑processors</strong> — cloud hosting, analytics,
          error reporting, communications, model providers and support tools
          under contractual safeguards.
        </li>
        <li>
          <strong>Partners & Integrations</strong> — when you connect third‑party
          services (e.g., commerce platforms), we share data as needed to make
          the integration work.
        </li>
        <li>
          <strong>Merchant‑Enabled Remarketing</strong> — when a merchant enables
          remarketing in their Nobi dashboard, we fire search query events to
          third‑party advertising pixels (such as Facebook/Meta Pixel or
          Google Tag Manager) that the merchant has already installed on their
          site. Nobi does not send data directly to these platforms; it triggers
          events on the merchant’s existing pixel installations. This feature
          is opt‑in and only active when explicitly enabled by the merchant.
        </li>
        <li>
          <strong>Business & Safety</strong> — to comply with law and protect
          rights, safety and the Service.
        </li>
        <li>
          <strong>Business Transfers</strong> — in connection with a merger,
          acquisition or asset sale.
        </li>
      </ul>
    </section>

    {/* Shop Nobi */}
    <section className="mb-10" id="shop-nobi">
      <h2 className="text-2xl font-semibold mb-2">Shop Nobi</h2>
      <p className="mb-4">
        Shop Nobi, at nobi.ai/shop, is a free shopping search. You do not need
        an account to use it. This section explains what we collect when you use
        Shop Nobi and how we use it. The rest of this policy also applies.
      </p>

      <h3 className="text-xl font-semibold mb-2">What we collect</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Searches and messages:</strong> the searches you type and the
          messages you send in chat.
        </li>
        <li>
          <strong>Products shown and clicked:</strong> the products we show you
          and the ones you click, including which store a click went to.
        </li>
        <li>
          <strong>A random shopper ID:</strong> a random ID kept in your
          browser’s local storage, so we can tell visits apart without knowing
          who you are.
        </li>
        <li>
          <strong>Device and connection information:</strong> your device and
          browser type, your IP address and similar technical details.
        </li>
        <li>
          <strong>Usage events:</strong> how you use Shop Nobi, such as the
          pages you view and the links you click.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Why we use it</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>To show you search results and answer your messages.</li>
        <li>To improve our search and the order of results.</li>
        <li>To count clicks for stores, so they know how many visits came from Shop Nobi.</li>
        <li>To prevent abuse, such as bots and automated scraping.</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Who we share it with</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>AI model providers:</strong> Groq, OpenAI, SambaNova and
          Google process your searches and messages to produce results and
          answers.
        </li>
        <li>
          <strong>Cloudflare:</strong> hosts our site and runs Turnstile, our
          robot check, which processes signals from your device and browser to
          tell people from bots.
        </li>
        <li>
          <strong>Analytics providers:</strong> our site loads Google Tag
          Manager, which loads Google Analytics and a Google Ads measurement
          tag, and Mixpanel. They receive information about your visit, such as
          the pages you view and details about your device.
        </li>
        <li>
          <strong>Stores:</strong> we share nothing with a store unless you
          follow a link to it. When you do, the store sees your visit as it sees
          any other visit, along with tags that show the visit came from Shop
          Nobi.
        </li>
      </ul>
      <p className="mb-4">We do not sell personal information.</p>

      <h3 className="text-xl font-semibold mb-2">How long we keep it</h3>
      <p className="mb-4">
        We keep Shop Nobi data for as long as we need it for the purposes in
        this section, or for as long as the law requires.
      </p>

      <h3 className="text-xl font-semibold mb-2">Your choices and rights</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          You can ask us for a copy of the data we hold about your use of Shop
          Nobi, or ask us to delete it, by emailing{" "}
          <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
            privacy@nobi.ai
          </a>. Because Shop Nobi has no accounts, tell us roughly when you
          searched and from which device, so we can find your data.
        </li>
        <li>
          You can remove your shopper ID at any time by clearing your browser’s
          site data for nobi.ai.
        </li>
        <li>
          <strong>California residents:</strong> under the California Consumer
          Privacy Act, as amended by the California Privacy Rights Act, you have
          the right to know what personal information we collect, use and
          disclose; to ask us to delete or correct it; to opt out of the sale or
          sharing of your personal information; and to not be treated
          differently for using these rights. Send requests to{" "}
          <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
            privacy@nobi.ai
          </a>.
        </li>
        <li>
          <strong>Do not sell or share my personal information:</strong> we do
          not sell personal information. Our site’s Google Ads tag may count as
          “sharing” for advertising under California law. To opt out of that
          sharing, email{" "}
          <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
            privacy@nobi.ai
          </a>{" "}
          with the subject “Do not sell or share my personal information.” You
          can also block these tags in your browser’s privacy settings.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">Children</h3>
      <p className="mb-4">
        Shop Nobi is not directed at children under 13, and we do not knowingly
        collect personal information from children under 13. If you believe a
        child has given us personal information, email{" "}
        <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
          privacy@nobi.ai
        </a>{" "}
        and we will delete it.
      </p>
    </section>

    <p className="mt-8">
      For additional details or to exercise your rights, please contact us at{" "}
      <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
        privacy@nobi.ai
      </a>.
    </p>
    </main>
  </PageLayout>
  );
};

export default Privacy;

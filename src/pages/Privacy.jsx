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
      Effective November&nbsp;10,&nbsp;2026. This Privacy Policy explains how Nobi
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
      <p className="mb-4">
        We also operate merchant-branded AI connectors, including the Lucchese
        connector for ChatGPT. The “AI connectors operated by Nobi” section
        below explains how this policy applies when you use those connectors.
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

    <section className="mb-10" id="ai-connectors">
      <h2 className="text-2xl font-semibold mb-2">AI connectors operated by Nobi</h2>
      <p className="mb-4">
        This section covers Nobi-operated connectors in ChatGPT and other AI
        applications, including Shop Nobi and merchant-branded connectors such
        as Lucchese. Locusive, Inc. d/b/a Nobi operates the connector service.
        A merchant-branded connector searches that merchant’s catalog and
        published information. The rest of this policy also applies to Nobi’s
        processing of connector data.
      </p>

      <h3 className="text-xl font-semibold mb-2">Information received and returned</h3>
      <ul className="list-disc list-inside space-y-2 mb-4">
        <li>
          <strong>Tool inputs:</strong> the search terms, questions, product
          identifiers or product links, filters and preferences that your AI
          application sends to a connector tool. This can include details such
          as size, color, material or budget. We receive the information sent
          with tool calls, rather than automatic access to your entire ChatGPT
          account or unrelated conversations.
        </li>
        <li>
          <strong>Results and conversation records:</strong> searches, questions,
          answers, products shown, document excerpts and source links. Results
          are returned to the AI application so it can respond to you. We store
          search and conversation records to provide the service, continue
          follow-up requests and report on its use.
        </li>
        <li>
          <strong>Identifiers and technical information:</strong> visitor,
          conversation and connection-session identifiers; the calling
          application’s name and version; request times, tool names, network
          addresses, request headers and referral or source tags. The network
          address may belong to the AI application’s servers. Visitor and
          conversation identifiers help associate follow-up calls. Product
          links may record a click before directing you to the merchant.
        </li>
        <li>
          <strong>Optional support requests:</strong> when you ask a merchant
          to contact you, a support tool can collect your name, email address,
          optional phone number and the message you want sent. Nobi records
          the request and sends it to the merchant’s designated team. You can
          use product search and questions without submitting a support request.
        </li>
      </ul>
      <p className="mb-4">
        The Lucchese connector does not access your order history, saved
        payment details or Lucchese account, and does not place orders or take
        payments. Do not include passwords, payment-card details, government
        identifiers or sensitive health information in connector inputs.
      </p>

      <h3 className="text-xl font-semibold mb-2">Purposes and recipients</h3>
      <p className="mb-4">
        We use connector information to find products, answer questions,
        continue conversations, deliver requested support, measure usage and
        product clicks, evaluate and improve search and answer quality, and
        detect abuse and troubleshoot errors. Nobi personnel and service
        providers supporting hosting, databases, analytics, AI processing and
        email delivery process information for these purposes. AI providers
        process the search or question content needed to produce results and
        answers. Our providers include Google Cloud, OpenAI, Groq and SambaNova;
        which providers receive a request depends on the tool and configuration.
      </p>
      <p className="mb-4">
        For merchant-branded connectors, the merchant can access its search,
        conversation and usage records through Nobi’s service and receives
        support requests you submit. OpenAI receives the results returned to
        ChatGPT and handles its own copy of your chat and tool activity under
        its policies. Merchant websites receive information when you open
        their links or load images they host, and their policies apply to
        those visits and to their handling of support requests. For Lucchese,
        see its{" "}
        <a href="https://www.lucchese.com/pages/privacy-policy" className="text-blue-600 underline">
          privacy policy
        </a>. Nobi does not sell connector personal information.
      </p>

      <h3 className="text-xl font-semibold mb-2">Retention</h3>
      <p className="mb-4">
        Connector search, conversation, support and analytics records currently
        have no fixed automatic expiration date. They remain stored unless
        deleted following a verified privacy request or another data-cleanup
        process. Our default Google Cloud operational log retention is 30 days;
        copies recorded in our analytics database follow the retention described
        in the preceding sentence. Backup copies persist until overwritten by
        the backup rotation. Information may be retained where required by law
        or to resolve disputes or security incidents. OpenAI, other AI
        applications and merchants control retention of copies they hold.
      </p>

      <h3 className="text-xl font-semibold mb-2">Your controls and privacy requests</h3>
      <p className="mb-4">
        You can stop new connector requests by disconnecting or disabling the
        connector in your AI application. Disconnecting does not itself erase
        records already held by Nobi. You can request access, correction or
        deletion by emailing{" "}
        <a href="mailto:privacy@nobi.ai" className="text-blue-600 underline">
          privacy@nobi.ai
        </a>. Tell us which connector you used and approximately when. If
        available, include the visitor or conversation identifier, or the email
        address used for a support request, so we can locate the relevant data.
        We may need to verify that the records belong to you. Do not send your
        full chat history or account password. To manage copies held by
        ChatGPT or a merchant, use that service’s privacy controls or contact
        the merchant. The rights described elsewhere in this policy also apply.
      </p>
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
        <li>
          To train, evaluate and improve our own machine learning models,
          including the models behind our search, our ranking and the answers
          and page text we write.
        </li>
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
          <strong>Stores:</strong> product pictures load from the stores or the
          services that host their images, so those servers see your IP address
          and browser details when you view results. We share nothing else with
          a store unless you follow a link to it. When you do, the store sees
          your visit as it sees any other visit, along with tags that show the
          visit came from Shop Nobi.
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
          with the subject “Do not sell or share my personal information.” We
          also honor Global Privacy Control as an opt-out of sharing: when your
          browser sends it, our site does not load Google Tag Manager, so the
          Google Analytics and Google Ads tags do not run. You can also block
          these tags in your browser’s privacy settings.
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

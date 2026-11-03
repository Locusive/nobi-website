// src/pages/Terms.jsx
import React from "react";
import { useSEO } from "../hooks/useSEO";
import PageLayout from "../components/PageLayout";

const LEGAL_NAME = "Locusive, Inc. d/b/a Nobi";
const SHORT_NAME = "Nobi";
const EFFECTIVE = "November 3, 2026";
const CONTACT = "legal@nobi.ai";

export default function Terms() {
  useSEO({
    title: "Terms of Service | Nobi",
    description: "Nobi's terms of service governing use of our AI assistant products and Shop Nobi.",
    path: "/terms",
  });
  return (
    <PageLayout>
      <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-black text-black dark:text-white py-16">
        <div className="mx-auto max-w-3xl px-6">
        <header className="mb-10">
          <p className="text-sm font-semibold text-fuchsia-600">Legal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Effective {EFFECTIVE}. If you have questions, email{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-5">
          <div className="text-sm font-medium mb-2">Contents</div>
          <ol className="list-decimal list-inside space-y-1 text-sm text-black/70 dark:text-white/70">
            <li><a href="#agreement" className="underline">Agreement to Terms</a></li>
            <li><a href="#eligibility" className="underline">Eligibility & Accounts</a></li>
            <li><a href="#license" className="underline">License & Acceptable Use</a></li>
            <li><a href="#agents" className="underline">AI Agents & Automated Access</a></li>
            <li><a href="#customer-data" className="underline">Customer Content & Data</a></li>
            <li><a href="#usage-data" className="underline">Usage Data & Model Training</a></li>
            <li><a href="#fees" className="underline">Fees, Renewals, Trials & Taxes</a></li>
            <li><a href="#confidentiality" className="underline">Confidentiality</a></li>
            <li><a href="#ip" className="underline">Intellectual Property</a></li>
            <li><a href="#marks" className="underline">Our Name & Marks</a></li>
            <li><a href="#feedback" className="underline">Feedback</a></li>
            <li><a href="#thirdparty" className="underline">Third-Party Services</a></li>
            <li><a href="#termination" className="underline">Term, Termination & Enforcement</a></li>
            <li><a href="#copyright" className="underline">Copyright Complaints</a></li>
            <li><a href="#disclaimers" className="underline">Disclaimers</a></li>
            <li><a href="#limitation" className="underline">Limitation of Liability</a></li>
            <li><a href="#indemnity" className="underline">Indemnification</a></li>
            <li><a href="#export" className="underline">Export Controls & Sanctions</a></li>
            <li><a href="#governing" className="underline">Governing Law; Disputes</a></li>
            <li><a href="#changes" className="underline">Changes to the Service or Terms</a></li>
            <li><a href="#notices" className="underline">Notices</a></li>
            <li><a href="#references" className="underline">Customer References</a></li>
            <li><a href="#force-majeure" className="underline">Events Outside Our Control</a></li>
            <li><a href="#misc" className="underline">Miscellaneous</a></li>
            <li><a href="#shop-nobi" className="underline">Shop Nobi</a></li>
          </ol>
        </nav>

        <section id="agreement" className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1) Agreement to Terms</h2>
          <p>
            These Terms of Service (the “<strong>Terms</strong>”) govern your access to and use of
            {` `}{SHORT_NAME}’s websites, products, and services (collectively, the “<strong>Service</strong>”).
            By accessing or using the Service, you agree to be bound by these Terms. If you are
            entering into these Terms on behalf of a company, you represent that you have authority
            to bind that company; “you” refers to that entity.
          </p>
          <p>
            The Service is provided by {LEGAL_NAME} (“<strong>{SHORT_NAME}</strong>,” “we,” “us,” or “our”). The
            Privacy Policy describes how we handle personal data and is incorporated into these Terms.
          </p>
          <p>
            These Terms cover everyone who uses the Service: a business that subscribes to
            {` `}{SHORT_NAME}’s products, a person who shops on Shop Nobi, and anyone who points software or
            an AI agent at either. Where a section applies to only one of them, it says so.
          </p>
          <p>
            The Service includes Shop Nobi, our free shopping search at nobi.ai/shop. Shop Nobi needs
            no account, and these Terms apply to it in full. Section 25 adds the terms that apply to
            Shop Nobi in particular.
          </p>

          <h2 id="eligibility">2) Eligibility & Accounts</h2>
          <p>
            You must be at least 18 years old to use the Service. You may create an account through
            our self-service sign-up process using Google authentication. You are responsible for maintaining
            the confidentiality of your account credentials and for all activities under your account.
            You agree to promptly notify us of any unauthorized use.
          </p>
          <p>
            Shop Nobi has no accounts, and it may be used by anyone at least 13 years old. Shop Nobi is
            not directed at children under 13, and we do not knowingly collect personal data from them.
            If you believe a child under 13 has given us personal data, email{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a> and we will delete it.
          </p>

          <h2 id="license">3) License & Acceptable Use</h2>
          <p>
            Subject to these Terms, {SHORT_NAME} grants you a limited, non-exclusive, non-transferable,
            revocable license to access and use the Service during your subscription term, and to use
            Shop Nobi while these Terms allow it. We reserve every right we do not grant you here.
          </p>
          <p className="font-medium">You agree not to:</p>
          <ul>
            <li>Reverse engineer, decompile, or attempt to extract source code or models;</li>
            <li>Use the Service to infringe, violate, or misappropriate any third-party rights;</li>
            <li>Upload malicious code or circumvent security features;</li>
            <li>Use the Service to develop competing products or benchmark without our consent;</li>
            <li>Process Prohibited Content (e.g., illegal content) or violate applicable law;</li>
            <li>Interfere with, disable, overburden or impair the Service, or anyone else’s use of it, including the stores and shoppers it serves;</li>
            <li>Give us false, misleading or deceptive information, or impersonate another person, business or agent;</li>
            <li>Reach the Service by automated means, an AI agent included, except as Section 4 allows;</li>
            <li>Remove, obscure or change any notice of ownership, disclosure or attribution we show.</li>
          </ul>

          <h2 id="agents">4) AI Agents & Automated Access</h2>
          <p>
            An “<strong>agent</strong>” is software that acts for a person or a business with little or no
            supervision, including an AI assistant that calls one of our connectors or reads our pages
            on someone’s behalf.
          </p>
          <p>
            You may point an agent at Shop Nobi through a connection we publish for that purpose, such
            as the Shop Nobi connector, to answer a shopper’s request while they are shopping. Any other
            automated access to the Service needs our prior written permission.
          </p>
          <p className="font-medium">An agent must:</p>
          <ul>
            <li>Identify itself in every request, naming itself in the request’s user agent string;</li>
            <li>Not hide that it is an agent, imitate a person, or solve or work around our robot check or any other measure meant to tell people from software;</li>
            <li>Answer truthfully when asked whether it is a person;</li>
            <li>Stay inside the rate limits and other controls we set, and stop when we ask it to stop;</li>
            <li>Use what it receives only to answer the request it was given, within the limits in Section 25 on what may not be built from Shop Nobi’s results.</li>
          </ul>
          <p>
            If you run, deploy or instruct an agent, everything it does under these Terms counts as
            something you did yourself, and you are responsible for it.
          </p>

          <h2 id="customer-data">5) Customer Content & Data</h2>
          <p>
            You retain all rights to content and data you submit to the Service (“<strong>Customer
            Content</strong>”). You grant {SHORT_NAME} a worldwide, non-exclusive, royalty-free license to host,
            process, transmit, and display Customer Content solely to provide and improve the Service
            and as otherwise permitted by our Privacy Policy or by you in writing.
          </p>
          <p>
            You represent and warrant that you have all necessary rights in Customer Content and that
            your use of the Service and Customer Content does not violate law or third-party rights.
          </p>
          <p>
            If you use the <code>addVisitorContext()</code> programmatic API to supply context about
            your site visitors, you represent and warrant that you have obtained any consent required
            under applicable law to collect and share that visitor data with {SHORT_NAME}, and that your
            own privacy policy adequately discloses this use of visitor data.
          </p>

          <h2 id="usage-data">6) Usage Data & Model Training</h2>
          <p>
            We record how the Service is used: the searches and messages sent to it, the products and
            pages shown and clicked, the requests agents make, device and connection details, and
            events describing what happened (“<strong>Usage Data</strong>”). Our Privacy Policy explains
            what we collect and how we handle personal data.
          </p>
          <p>
            Usage Data is ours. We may use it, and anything we derive from it, without limit and without
            payment to you, to run, secure, measure and improve the Service, and to develop, train,
            fine-tune, evaluate and benchmark machine learning and artificial intelligence models,
            systems and datasets, including the models behind our search, our ranking, our
            recommendations and the content we write. This covers everything we collect through Shop
            Nobi, including the searches shoppers type, the messages they send, the results they are
            shown and the links they follow.
          </p>
          <p>
            Customer Content is different: Section 5 governs it, and we use it to provide and improve
            the Service as that section describes. We may also use information about use of the Service
            that is aggregated or de-identified, and that does not identify you, a shopper or a store,
            for any purpose.
          </p>

          <h2 id="fees">7) Fees, Renewals, Trials & Taxes</h2>
          <p>
            If you purchase a subscription, you agree to pay the fees described at checkout or in an
            Order. Unless stated otherwise, fees are non-refundable and do not include taxes, which
            you are responsible for paying. Paid plans may include a 30-day free trial period. At the
            end of a trial, your subscription will automatically convert to a paid subscription unless
            cancelled before the trial ends. {SHORT_NAME} may also offer limited preview access to the
            Service for evaluation purposes; such access may be subject to usage limits and may be
            modified or discontinued at any time.
          </p>
          <p>
            A subscription renews by itself at the end of each billing period, for another period of the
            same length and at the price then in effect, unless you cancel it before that period ends.
            You may cancel at any time in your dashboard, under Settings and then Billing. Cancelling
            stops the next renewal; it does not refund the period you are already in. We may change the
            price for a renewal by telling you at least 30 days beforehand, and the new price takes
            effect at that renewal.
          </p>

          <h2 id="confidentiality">8) Confidentiality</h2>
          <p>
            “<strong>Confidential Information</strong>” means non-public information disclosed by one party
            (“Discloser”) to the other (“Recipient”), designated as confidential or that should
            reasonably be understood as confidential. Recipient will use Confidential Information only
            to exercise rights and perform obligations under these Terms, and protect it with
            reasonable care.
          </p>

          <h2 id="ip">9) Intellectual Property</h2>
          <p>
            {SHORT_NAME} and its licensors own all right, title, and interest in and to the Service,
            including software, models, algorithms, documentation, and logos. This includes Shop Nobi’s
            pages, results, rankings and written content, and the way they are put together. Except for
            the limited license above, no rights are granted to you by implication or otherwise.
          </p>

          <h2 id="marks">10) Our Name & Marks</h2>
          <p>
            “{SHORT_NAME}”, “Shop Nobi”, our logos and our other brand features belong to us. You may say
            truthfully that your product connects to Shop Nobi. You may not use our name, logos or brand
            features in your product’s name, your domain name or your marketing in a way that suggests
            we built, endorse, sponsor or are affiliated with what you offer, and you may not present
            Shop Nobi’s results as your own work. If we ask you to stop, you agree to stop.
          </p>

          <h2 id="feedback">11) Feedback</h2>
          <p>
            You may provide suggestions or ideas about the Service (“<strong>Feedback</strong>”). You grant
            {` `}{SHORT_NAME} a perpetual, irrevocable, royalty-free license to use the Feedback without
            restriction or compensation.
          </p>

          <h2 id="thirdparty">12) Third-Party Services</h2>
          <p>
            The Service may interoperate with third-party products or services (e.g., commerce
            platforms, analytics, model providers). Your use of third-party services is governed by
            their terms, not ours.
          </p>
          <p>
            The Service includes an optional remarketing feature that, when enabled by you, fires
            query events to third-party advertising pixels (such as Facebook/Meta Pixel or
            Google Tag Manager) that you have installed on your site. By enabling this feature, you
            acknowledge that queries entered by your site visitors will be shared with these
            third-party platforms through your existing pixel installations. You are responsible for
            ensuring that your privacy policy and cookie consent mechanisms adequately disclose this
            use of visitor data for retargeting purposes.
          </p>

          <h2 id="termination">13) Term, Termination & Enforcement</h2>
          <p>
            These Terms remain in effect while you use the Service. Either party may terminate for
            material breach if the breach is not cured within 30 days of written notice. Upon
            termination, your right to access the Service ends. Sections that by their nature should
            survive (e.g., confidentiality, IP, usage data, disclaimers, limitations) will survive.
          </p>
          <p>
            We may limit, slow, suspend or block your access to the Service, in whole or in part and
            with or without notice, if we believe you are breaking these Terms, putting the Service or
            anyone who uses it at risk, or reaching it in a way we have not permitted. Because Shop Nobi
            needs no account, this includes blocking a request, a client, an agent, an address or a
            network. We may investigate what happened and keep a record of it.
          </p>
          <p>
            You agree that money damages alone would not repair a breach of Section 4 (AI Agents &
            Automated Access), Section 10 (Our Name & Marks) or the limits in Section 25 on Shop Nobi’s
            results, and that we may ask a court for an injunction or other equitable relief for such a
            breach without posting a bond.
          </p>

          <h2 id="copyright">14) Copyright Complaints</h2>
          <p>
            If you believe material on our site infringes your copyright, email{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a> with: the work you say was
            copied; the address of the material on our site; how to reach you; a statement that you
            believe in good faith the use is not authorized by the owner or the law; a statement that
            the information in your notice is accurate and that you are the owner or are authorized to
            act for the owner; and your signature.
          </p>
          <p>
            We will look into every complete notice and remove or disable material where the law
            requires it. We may pass your notice to whoever supplied the material. If you believe your
            material was removed by mistake, write to the same address and tell us why.
          </p>

          <h2 id="disclaimers">15) Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY
            LAW, {SHORT_NAME} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES
            ARISING OUT OF COURSE OF DEALING OR USAGE.
          </p>

          <h2 id="limitation">16) Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, COVER, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
            REVENUE, DATA, OR GOODWILL. {SHORT_NAME}’S TOTAL LIABILITY FOR ALL CLAIMS IN THE AGGREGATE
            WILL NOT EXCEED THE AMOUNTS PAID BY YOU TO {SHORT_NAME} FOR THE SERVICE IN THE 12 MONTHS
            IMMEDIATELY PRECEDING THE CLAIM.
          </p>

          <h2 id="indemnity">17) Indemnification</h2>
          <p>
            You will defend, indemnify, and hold harmless {SHORT_NAME} from and against any claims,
            damages, liabilities, and expenses arising from your use of the Service, Customer
            Content, or violation of these Terms, including anything done by an agent you run, deploy
            or instruct.
          </p>

          <h2 id="export">18) Export Controls & Sanctions</h2>
          <p>
            You represent that you are not located in, and are not a national or resident of, a country
            or territory under a United States embargo, and that you are not on any United States
            government list of restricted or denied parties. You agree not to use or export the Service
            in breach of United States export control or sanctions law.
          </p>

          <h2 id="governing">19) Governing Law; Disputes</h2>
          <p>
            These Terms are governed by the laws of the State of Delaware, without regard to its
            conflicts of law rules. The exclusive jurisdiction and venue for any action relating to
            these Terms or the Service will be the state and federal courts located in Wilmington,
            Delaware. EACH PARTY WAIVES ANY RIGHT TO A JURY TRIAL.
          </p>
          <p>
            Each party may bring a claim only in its own name, and not as a plaintiff or class member in
            any class, collective, consolidated or representative action. Any claim relating to these
            Terms or the Service must be brought within one year after it arose, to the extent the law
            allows a limit of that length.
          </p>

          <h2 id="changes">20) Changes to the Service or Terms</h2>
          <p>
            We may update the Service and these Terms from time to time. If changes are material, we
            will provide reasonable notice (e.g., by posting to our site). Continued use after the
            effective date constitutes acceptance of the updated Terms.
          </p>

          <h2 id="notices">21) Notices</h2>
          <p>
            We may give you notice by email to the address on your account, by a message inside the
            Service, or by posting on our site. Because Shop Nobi has no accounts, posting on our site
            is how we give notice about it. You give us notice by email to{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>

          <h2 id="references">22) Customer References</h2>
          <p>
            While you are a paying customer, we may use your name and logo to say that you use
            {` `}{SHORT_NAME}, on our site and in our materials. Email{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a> to ask us to stop, and we
            will stop within a reasonable time.
          </p>

          <h2 id="force-majeure">23) Events Outside Our Control</h2>
          <p>
            Neither party is liable for a delay or failure caused by something outside its reasonable
            control, such as a natural disaster, war, civil unrest, labour action, epidemic, act of
            government, or the failure of the internet, a utility or a third-party service the Service
            depends on. This does not excuse your obligation to pay.
          </p>

          <h2 id="misc">24) Miscellaneous</h2>
          <p>
            You may not assign these Terms without our prior written consent; we may assign to an
            affiliate or in connection with a merger, acquisition, or sale of assets. If any provision
            is unenforceable, it will be modified to enforceable scope; the remainder stays in effect.
            These Terms (and any Order) are the entire agreement between the parties regarding the
            Service and supersede any prior or contemporaneous agreements.
          </p>

          <h2 id="shop-nobi">25) Shop Nobi</h2>
          <p>
            Shop Nobi, at nobi.ai/shop, is a free search engine that helps shoppers find products from
            independent online stores. You do not need an account to use Shop Nobi. Every section above
            applies to it; this section adds what is specific to it.
          </p>
          <p>
            Shop Nobi may be used by people who are at least 13 years old. The 18-year requirement in
            Section 2 applies to accounts for {SHORT_NAME}’s business products.
          </p>
          <h3>Purchases happen at the store</h3>
          <p>
            {SHORT_NAME} does not sell, ship or deliver products, and does not handle payments, returns,
            refunds or customer service for them. When you follow a link to a store, you leave our site.
            Any purchase you make is between you and that store, under the store’s own terms and privacy
            policy. {SHORT_NAME} is not responsible for the stores, their products or your purchases from
            them.
          </p>
          <h3>Product information</h3>
          <p>
            Product names, prices, availability, pictures and other details come from the stores. They
            may be wrong or out of date. The store’s own page is the final word on what it sells and at
            what price.
          </p>
          <h3>Content written with AI</h3>
          <p>
            Shop Nobi uses AI to write answers, page text, guides, and questions and answers. This content
            may contain mistakes. It is general information, not professional advice of any kind. Check
            important details with the store or a qualified professional before you rely on them.
          </p>
          <h3>How results are chosen</h3>
          <p>
            Some stores have business relationships with {SHORT_NAME}, such as using {SHORT_NAME}’s paid
            products, and those relationships can affect which products appear and in what order.
            {` `}{SHORT_NAME} may also earn a commission when a shopper buys after following a link.
          </p>
          <h3>Links to stores</h3>
          <p>
            Links from Shop Nobi to a store carry tags that tell the store the visit came from Shop Nobi.
          </p>
          <h3>What we do with what we collect</h3>
          <p>
            Section 6 applies to Shop Nobi in full: the searches you type, the messages you send, the
            results we show you and the links you follow are Usage Data, and we use them to run and
            improve Shop Nobi and to train and evaluate our own models. The Privacy Policy explains what
            we collect and the choices you have.
          </p>
          <h3>Acceptable use</h3>
          <p>
            You may use Shop Nobi for your own shopping. You may also point an AI assistant or agent at
            Shop Nobi through a connection we publish for that purpose, such as the Shop Nobi connector,
            to answer a shopper’s request while they are shopping, on the conditions in Section 4. Any
            other kind of access needs our prior written permission.
          </p>
          <p className="font-medium">You agree not to:</p>
          <ul>
            <li>Scrape, crawl, copy or extract Shop Nobi’s results or pages, whether by hand at scale, with automated tools, or with an AI agent;</li>
            <li>Send automated queries, or use bots, scripts, crawlers or similar tools with Shop Nobi, except through a connection we publish for that purpose and within the limits we set for it;</li>
            <li>Bypass or interfere with our robot check, our rate limits, our robots.txt file or any other security or access control feature;</li>
            <li>Remove, replace or redirect the tags on links from Shop Nobi to a store;</li>
            <li>Resell, republish, redistribute or make commercial use of Shop Nobi’s results.</li>
          </ul>
          <h3>What you may not build from Shop Nobi’s results</h3>
          <p>
            Shop Nobi’s results, pages, rankings, written content and the way they are put together
            belong to {SHORT_NAME}. You receive them to help a shopper decide what to buy, in the moment
            they ask. Showing them to the shopper who asked is what Shop Nobi is for. Keeping them, or
            feeding them into something else, is not. You agree not to:
          </p>
          <ul>
            <li>Store, cache, index or otherwise keep Shop Nobi’s results beyond what is needed to answer the request they came from;</li>
            <li>Build or add to a database, catalog, product feed, index or any other collection of data from Shop Nobi’s results;</li>
            <li>Use Shop Nobi’s results as material for another product, including to fill, power or improve a search engine, a shopping site or app, a price or product comparison service, a recommendation service, or an assistant’s or agent’s own index or knowledge base, whether or not it competes with {SHORT_NAME};</li>
            <li>Train, fine-tune, evaluate, benchmark or otherwise develop any machine learning or artificial intelligence model, system or dataset using Shop Nobi’s results, or add them to a training, evaluation or retrieval corpus;</li>
            <li>Carry out text or data mining on Shop Nobi, including for research. {SHORT_NAME} reserves its rights under Article 4(3) of Directive (EU) 2019/790 and any equivalent law.</li>
          </ul>
          <p>
            These restrictions bind anyone acting for you, including an AI agent you run or instruct, and
            they continue to apply after you stop using Shop Nobi. If you want to use Shop Nobi’s
            results in any of these ways, write to us at{" "}
            <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
          <h3>Disclaimers and limits</h3>
          <p>
            Section 15 (Disclaimers) and Section 16 (Limitation of Liability) apply to Shop Nobi in the
            same way they apply to the rest of the Service. Shop Nobi is provided “as is” and “as
            available.” For Shop Nobi, our total liability to you will not exceed one hundred US
            dollars (US$100).
          </p>

          <hr />
          <p className="text-sm text-black/60 dark:text-white/60">
            Contact: <a className="underline" href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </p>
        </section>
        </div>
      </div>
    </PageLayout>
  );
}

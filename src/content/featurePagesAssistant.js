// Page copy for the Support and Leads & engagement features. Every claim was checked against the Nobi code.
// theme names a color in PanelTheme. benefits is "why it matters"; subFeatures is "what's included"; worksFor shows industries.

export const ASSISTANT_FEATURE_PAGES = {
  "automated-support": {
    seoTitle: "AI Support Agent | Nobi",
    seoDescription: "Nobi is an AI support agent that answers from your content, looks up product details, compares products, and hands off to your team when it can't.",
    theme: "Navy",
    headline: "A support agent on every page",
    headlineMaxCh: 13,
    intro: "Nobi is more than a FAQ bot. It searches your catalog, looks up live product details, compares products, cites your policies, and hands off to your team, all in one conversation.",
    benefits: [
      { title: "Resolves, doesn't deflect", body: "Nobi looks things up and answers the real question, instead of pointing shoppers at a help page and hoping." },
      { title: "Answers that don't make things up", body: "Every answer comes from your content or a live product lookup, with the source, so it won't invent a policy you don't have." },
      { title: "Nothing falls through", body: "When Nobi can't resolve it, it collects the shopper's details with their consent and hands the question to your team." },
    ],
    subFeatures: [
      { title: "Looks up live product details", body: "Price, sizes, materials and availability come from a real lookup, so fit and stock answers are current, not guessed." },
      { title: "Compares products", body: "Ask it to compare two named products and it looks up each one, then lays out the differences in plain words." },
      { title: "Answers from your policies", body: "Returns, shipping and warranty questions are answered from your knowledge base, with the page it used." },
      { title: "Hands off with context", body: "When a human is needed, Nobi offers a follow-up, captures the contact, and passes along what the shopper asked." },
    ],
    steps: [
      { title: "Teach Nobi your business", body: "Add your pages and policies, then tell Nobi about your business and how you sell." },
      { title: "Visitors ask anything", body: "Nobi answers in plain words, looks up details, compares products, and shows its sources." },
      { title: "Your team takes the rest", body: "When Nobi can't help, it offers a follow-up and emails the question to your team." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“Does this run true to size?” is answered from the product's fit note and sizing chart, any hour of the day." },
      { vertical: "Auto dealers", body: "“Is the 2024 model still on the lot?” is answered, and a buyer who wants a test drive is handed to sales." },
    ],
    faq: [
      { question: "How is this different from a chatbot?", answer: "A typical bot matches keywords to canned replies. Nobi uses real tools: it searches your catalog, looks up a product's live details, compares named products, and reads your policies, then answers from what it found." },
      { question: "Can it make up an answer?", answer: "No. It answers only from your content and live lookups, and shows the source. When it can't answer, it says so and offers to pass the question to your team." },
      { question: "What happens when it can't help?", answer: "It offers a human follow-up, asks for the shopper's contact details with their consent, and sends the question and context to your team." },
    ],
  },
  "product-page-qa": {
    seoTitle: "Product Q&A | Nobi",
    seoDescription: "Nobi shows past shopper questions and answers on each product page, and lets shoppers search them before they ask.",
    theme: "Violet",
    headline: "Every question, answered on the page",
    headlineMaxCh: 13,
    intro: "Each product page shows the questions other shoppers asked about it, with answers. Shoppers search them before they ask their own, and the library grows on every product.",
    benefits: [
      { title: "Answers where the doubt is", body: "Shoppers get the detail that was holding them back right on the page, instead of leaving to find it." },
      { title: "Builds its own library", body: "Real shopper questions become a searchable Q&A that grows on every product over time." },
      { title: "Fewer pre-sale tickets", body: "The question a shopper was about to email is already answered on the page." },
    ],
    subFeatures: [
      { title: "Searchable on the page", body: "Shoppers type a question and see whether it has already been asked and answered for this exact product." },
      { title: "Built from real conversations", body: "Questions and answers are drawn from real chats about the product, so they cover what shoppers actually wonder." },
      { title: "Clean and on-brand", body: "Personal details are stripped out, and anything negative or off-topic is skipped, so the panel stays useful." },
    ],
    steps: [
      { title: "Our team sets it up", body: "We add the questions panel to your product pages." },
      { title: "Shoppers' questions are collected", body: "Questions about a product, and their answers, are kept with that product." },
      { title: "The next shopper finds the answer", body: "They search past questions right on the product page." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“Does it wrinkle?” sits on the product page, answered, for the next shopper who wonders." },
      { vertical: "Auto dealers", body: "“Does this trim have a tow package?” stays on the vehicle page for every shopper after." },
    ],
    faq: [
      { question: "Do I have to write the Q&A?", answer: "No. Nobi builds it from real conversations shoppers have about each product, so the answers reflect what people actually ask." },
      { question: "Is it safe to show publicly?", answer: "Yes. Personal details are removed, and anything negative or off-topic is left out, so only clean, helpful question and answer pairs appear." },
    ],
  },
  "lead-capture": {
    seoTitle: "AI Lead Capture | Nobi",
    seoDescription: "Nobi collects contact details during a conversation, tells sales requests from service requests, and emails each lead to the right team.",
    theme: "Magenta",
    headline: "Turn conversations into leads",
    headlineMaxCh: 13,
    intro: "Nobi asks for contact details at the right moment, tells sales requests from service requests, and emails each lead to the right team.",
    benefits: [
      { title: "Catch intent while it's hot", body: "When someone asks for a quote, a call back or a test drive, Nobi collects their details right then." },
      { title: "Right lead, right team", body: "Sales and service requests are told apart and emailed to their own inboxes, so nothing sits unseen." },
      { title: "Works after hours", body: "Leads keep coming in overnight and land in your team's inbox for the morning." },
    ],
    subFeatures: [
      { title: "The AI collects details in chat", body: "Nobi asks for name, email and phone in the flow of the conversation, so the shopper never fills out a separate form." },
      { title: "Or hands off to your form", body: "Prefer your own form or CRM flow? Nobi can send the shopper straight to it instead." },
      { title: "Sales and service, split", body: "Each request is tagged as sales or service and emailed to its own list, so the right team sees it first." },
      { title: "Every lead on one page", body: "Leads land in your dashboard with their type and what they asked, searchable and filterable." },
    ],
    steps: [
      { title: "Choose what to capture", body: "Turn on sales leads, service requests or both, and choose who gets each kind." },
      { title: "Nobi asks at the right moment", body: "When a visitor wants a call back, a quote or a test drive, Nobi collects their details in the chat." },
      { title: "Each lead goes to the right inbox", body: "Sales and service leads are emailed to their own teams, and every lead is saved on your Leads page." },
    ],
    worksFor: [
      { vertical: "Auto dealers", body: "A test-drive request goes to sales, a brake-check request goes to service, automatically." },
      { vertical: "B2B & services", body: "A “can you do a custom quote?” turns into a contact in your sales inbox before they leave." },
    ],
    faq: [
      { question: "Do leads go to my CRM?", answer: "Leads are saved on your Nobi dashboard and emailed to the lists you choose. If you'd rather use your own form or CRM, Nobi can hand the shopper off to it instead." },
      { question: "How does it tell sales from service?", answer: "Nobi reads what the visitor is asking about and tags each lead as sales or service, then emails it to that team's own address list." },
    ],
  },
  "proactive-prompts": {
    seoTitle: "Proactive Outreach | Nobi",
    seoDescription: "Nobi starts the conversation when a visitor is about to leave, stops scrolling, comes back, or arrives from a search engine.",
    theme: "Teal",
    headline: "Reach out at the right moment",
    headlineMaxCh: 13,
    intro: "Nobi can start the conversation on its own, based on what a visitor does: about to leave, stalling on a page, coming back for another look, or arriving from a search engine.",
    benefits: [
      { title: "Catch the exit", body: "A visitor about to leave gets one helpful nudge instead of a silent goodbye." },
      { title: "Help at the hesitation", body: "When someone stalls on a page, Nobi offers to compare, answer or find something similar." },
      { title: "You set the moment", body: "Pick the trigger, the page and the message, so the prompt fits where the visitor is." },
    ],
    subFeatures: [
      { title: "Behavior triggers", body: "Exit intent, idle time, scroll depth, time on page, a returning visitor, or arriving from a search engine or an AI assistant." },
      { title: "The style that fits", body: "Show it as a floating bar, a message card, a pill or a popup, and pick the pages it appears on." },
      { title: "Rules and limits", body: "Combine conditions, limit prompts to active hours, and set how long before a dismissed prompt comes back." },
    ],
    steps: [
      { title: "Pick a trigger", body: "Exit intent, idle time, scroll depth, time on page, page load, a returning visitor, or a visitor from a search engine." },
      { title: "Choose where it shows", body: "Pick the pages, and the style: a floating bar, a message card, a pill or a popup." },
      { title: "Nobi opens with a helpful line", body: "Visitors reply in one tap, and the conversation carries on from there." },
    ],
    worksFor: [
      { vertical: "Retail", body: "A shopper lingering on a product gets “want help with sizing, or something similar in stock?”" },
      { vertical: "Auto dealers", body: "A visitor about to leave a vehicle page is offered a test drive or a payment estimate." },
    ],
    faq: [
      { question: "Will this annoy visitors?", answer: "You control it. Pick the trigger, the pages and the message, set active hours, and choose how long a dismissed prompt stays gone. Exit intent fires on desktop only." },
      { question: "What can trigger a prompt?", answer: "Exit intent, idle time, scroll depth, time on page, page load, a returning visitor, or a visitor arriving from a search engine or an AI assistant." },
    ],
  },
  "custom-actions": {
    seoTitle: "Custom Actions | Nobi",
    seoDescription: "Developers can give Nobi actions to run on your site, like opening a booking form, so visitors get things done in the conversation.",
    theme: "Violet",
    headline: "Let Nobi act on your site",
    headlineMaxCh: 12,
    intro: "Your developers describe an action, like booking a test drive or opening a quote form, and Nobi runs it when a visitor asks for it.",
    benefits: [
      { title: "Get things done in the chat", body: "A visitor books, requests or submits without leaving the conversation and hunting for a form." },
      { title: "Use what you already have", body: "Actions call your own code, so they plug into the booking, quoting or ticketing you already run." },
      { title: "Beyond answering", body: "Nobi does more than talk: it can take the next step for the shopper." },
    ],
    subFeatures: [
      { title: "Your own actions", body: "Register an action with a name, a description and the details it needs, and Nobi offers it when a visitor's request matches." },
      { title: "Gathers what's missing", body: "If the action needs a date or an email that the visitor hasn't given, Nobi asks for it before it runs." },
      { title: "Runs in the browser", body: "Your code runs in the visitor's browser and returns a result, so Nobi can confirm it's done or answer from what came back." },
    ],
    steps: [
      { title: "Describe the action", body: "Add it to window.NobiTools with a name, a description and the details it needs." },
      { title: "A visitor asks for it", body: "Nobi recognizes the request and gathers the details the action needs." },
      { title: "Nobi runs it on your site", body: "Your code runs in the visitor's browser, and Nobi tells them it is done." },
    ],
    worksFor: [
      { vertical: "Auto dealers", body: "“Book me a test drive Saturday” opens your booking form with the date filled in." },
      { vertical: "Services", body: "“Start a quote for a kitchen remodel” opens your quote flow, pre-filled from the chat." },
    ],
    faq: [
      { question: "Do I need a developer?", answer: "Yes. Custom actions are added in your site's code through a small JavaScript API. Once they're registered, Nobi offers them on its own." },
      { question: "Does Nobi run actions without asking?", answer: "Nobi gathers any details the action needs from the conversation first. Your code decides what the action actually does and what it returns." },
    ],
  },
};

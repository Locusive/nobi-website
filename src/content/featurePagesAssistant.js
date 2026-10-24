// Page copy for the Support and Leads & engagement features. Every claim was checked against the Nobi code.
// theme names a color in PanelTheme. benefits is the "why it helps" story; worksFor shows it across industries.

export const ASSISTANT_FEATURE_PAGES = {
  "automated-support": {
    seoTitle: "Automated Customer Support | Nobi",
    seoDescription: "Nobi answers visitors' questions from your own pages and policies, with sources, and hands off to your team when it can't.",
    theme: "Navy",
    headline: "Answers customers on every page",
    headlineMaxCh: 13,
    intro: "Visitors ask about fit, shipping, returns or their order, and Nobi answers from your own pages and policies. When it can't answer, it passes the question to your team.",
    benefits: [
      { title: "Deflect the repeat questions", body: "The same fit, shipping and returns questions get answered instantly, so your team handles the ones that need a person." },
      { title: "Answers that don't make things up", body: "Nobi answers only from your content and shows the source, so it won't invent a policy you don't have." },
      { title: "Nothing falls through", body: "When Nobi can't resolve it, it collects the shopper's details and hands the question to your team." },
    ],
    steps: [
      { title: "Teach Nobi your business", body: "Add your pages and policies, then tell Nobi about your business and how you sell." },
      { title: "Visitors ask anything", body: "Nobi answers in plain words and shows where each answer came from." },
      { title: "Your team takes the rest", body: "When Nobi can't help, it offers a follow-up and emails the question to your team." },
    ],
    worksFor: [
      { vertical: "Retail", body: "“How do returns work?” is answered from your returns page, any hour of the day." },
      { vertical: "Auto dealers", body: "“Is the 2024 model still on the lot?” is answered, and a buyer who wants a test drive is handed to sales." },
    ],
  },
  "product-page-qa": {
    seoTitle: "Product Page Q&A | Nobi",
    seoDescription: "Nobi shows past shopper questions and answers on each product page, and lets shoppers search them.",
    theme: "Violet",
    headline: "Every question, answered on the page",
    headlineMaxCh: 13,
    intro: "Each product page shows the questions other shoppers asked about it, with answers. Shoppers can search them before they ask their own.",
    benefits: [
      { title: "Answers where the doubt is", body: "Shoppers get the detail that was holding them back right on the page, instead of leaving to find it." },
      { title: "Builds its own library", body: "Real shopper questions become a searchable Q&A that grows on every product over time." },
      { title: "Fewer pre-sale tickets", body: "The question a shopper was about to email is already answered on the page." },
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
    steps: [
      { title: "Choose what to capture", body: "Turn on sales leads, service requests or both, and choose who gets each kind." },
      { title: "Nobi asks at the right moment", body: "When a visitor wants a call back, a quote or a test drive, Nobi collects their details in the chat." },
      { title: "Each lead goes to the right inbox", body: "Sales and service leads are emailed to their own teams, and every lead is saved on your Leads page." },
    ],
    worksFor: [
      { vertical: "Auto dealers", body: "A test-drive request goes to sales, a brake-check request goes to service, automatically." },
      { vertical: "B2B & services", body: "A “can you do a custom quote?” turns into a contact in your sales inbox before they leave." },
    ],
  },
  "proactive-prompts": {
    seoTitle: "Proactive Chat Prompts | Nobi",
    seoDescription: "Nobi starts the conversation when a visitor is about to leave, stops scrolling, comes back, or arrives from a search engine.",
    theme: "Teal",
    headline: "Open the conversation",
    headlineMaxCh: 12,
    intro: "Nobi can reach out on its own: when a visitor is about to leave, stops scrolling, comes back for another look, or arrives from a search engine.",
    benefits: [
      { title: "Catch the exit", body: "A visitor about to leave gets one helpful nudge instead of a silent goodbye." },
      { title: "Help at the hesitation", body: "When someone stalls on a page, Nobi offers to compare, answer or find something similar." },
      { title: "You set the moment", body: "Pick the trigger, the page and the message, so the prompt fits where the visitor is." },
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
    steps: [
      { title: "Describe the action", body: "Add it to window.NobiTools with a name, a description and the details it needs." },
      { title: "A visitor asks for it", body: "Nobi recognizes the request and gathers the details the action needs." },
      { title: "Nobi runs it on your site", body: "Your code runs in the visitor's browser, and Nobi tells them it is done." },
    ],
    worksFor: [
      { vertical: "Auto dealers", body: "“Book me a test drive Saturday” opens your booking form with the date filled in." },
      { vertical: "Services", body: "“Start a quote for a kitchen remodel” opens your quote flow, pre-filled from the chat." },
    ],
  },
};

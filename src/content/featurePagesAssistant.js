// The page copy for the Assistant features. Every claim was checked against the Nobi code; check again before changing one.
// theme names a color in PanelTheme, and headlineMaxCh caps the headline's line length.

export const ASSISTANT_FEATURE_PAGES = {
  "automated-support": {
    seoTitle: "Automated Customer Support | Nobi",
    seoDescription: "Nobi answers visitors' questions from your own pages and policies, with sources, and offers a follow-up from your team when it can't answer.",
    theme: "Navy",
    headline: "Answers customers on every page",
    headlineMaxCh: 13,
    intro: "Visitors ask about fit, shipping, returns or their order, and Nobi answers from your own pages and policies. When it can't answer, it can pass the question to your team.",
    steps: [
      { title: "Teach Nobi your business", body: "Add your pages and policies, then tell Nobi about your business and how you sell." },
      { title: "Visitors ask anything", body: "Nobi answers in plain words and shows where each answer came from." },
      { title: "Your team takes the rest", body: "When Nobi can't help, it offers a follow-up and emails the request to your team." },
    ],
  },
  "lead-capture": {
    seoTitle: "AI Lead Capture | Nobi",
    seoDescription: "Nobi collects contact details during a conversation, tells sales requests from service requests, and emails each lead to the right team.",
    theme: "Magenta",
    headline: "Turn conversations into leads",
    headlineMaxCh: 13,
    intro: "Nobi asks for contact details at the right moment, tells sales requests from service requests, and emails each lead to the right team.",
    steps: [
      { title: "Choose what to capture", body: "Turn on sales leads, service requests or both, and choose who gets each kind." },
      { title: "Nobi asks at the right moment", body: "When a visitor wants a call back, a quote or a test drive, Nobi collects their details in the chat." },
      { title: "Each lead goes to the right inbox", body: "Sales and service leads are emailed to their own teams, and every lead is saved on your Leads page." },
    ],
  },
  "proactive-prompts": {
    seoTitle: "Proactive Chat Prompts | Nobi",
    seoDescription: "Nobi starts the conversation when a visitor is about to leave, stops scrolling, comes back, or arrives from a search engine.",
    theme: "Violet",
    headline: "Open the conversation",
    headlineMaxCh: 12,
    intro: "Nobi can reach out on its own: when a visitor is about to leave, stops scrolling, comes back for another look, or arrives from a search engine.",
    steps: [
      { title: "Pick a trigger", body: "Exit intent, idle time, scroll depth, time on page, page load, a returning visitor, or a visitor from a search engine." },
      { title: "Choose where it shows", body: "Pick the pages, and the style: a floating bar, a message card, a pill or a popup." },
      { title: "Nobi opens with a helpful line", body: "Visitors reply in one tap, and the conversation carries on from there." },
    ],
  },
  "custom-actions": {
    seoTitle: "Custom Actions | Nobi",
    seoDescription: "Developers can give Nobi actions to run on your site, like opening a booking form, so visitors get things done in the conversation.",
    theme: "Teal",
    headline: "Let Nobi act on your site",
    headlineMaxCh: 12,
    intro: "Your developers describe an action, like booking a test drive or opening a quote form, and Nobi runs it when a visitor asks for it.",
    steps: [
      { title: "Describe the action", body: "Add it to window.NobiTools with a name, a description and the details it needs." },
      { title: "A visitor asks for it", body: "Nobi recognizes the request and gathers the details the action needs." },
      { title: "Nobi runs it on your site", body: "Your code runs in the visitor's browser, and Nobi tells them it is done." },
    ],
  },
  "any-language": {
    seoTitle: "Multilingual AI Assistant | Nobi",
    seoDescription: "Nobi replies in the language each visitor writes in, with no setup and no separate assistant per language.",
    theme: "Amber",
    headline: "Speaks your visitors' language",
    headlineMaxCh: 12,
    intro: "Nobi replies in the language each visitor writes in. A question in Spanish gets an answer in Spanish, with no setup.",
    steps: [
      { title: "A visitor writes in their language", body: "Spanish, French, German or any other language." },
      { title: "Nobi answers in the same one", body: "Answers still come from your own pages and products." },
      { title: "Nothing to set up", body: "There is no separate assistant to build for each language." },
    ],
  },
};

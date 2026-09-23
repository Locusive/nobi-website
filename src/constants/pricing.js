// Standard plan facts shared by the page, estimator, FAQs, and static metadata.
export const STANDARD_PLAN = {
  monthlyCents: 2500,
  includedSearches: 2500,
  includedMessages: 250,
  searchCents: 1,
  messageCents: 10,
  trialDays: 30,
};

export const PRICING_DESCRIPTION = 'Nobi starts at $25/month with 2,500 searches and 250 assistant messages included. Additional searches cost $0.01 each; assistant messages cost $0.10 each.';

export const PRICING_MODES = [
  {
    id: 'search', title: 'Search only', description: 'Help visitors find items in your catalog.',
    hasSearch: true, hasMessages: false,
    exampleTitle: 'Find it. Browse it. Search again.',
    explanation: 'Visitors get search results without a conversational answer. Each new search counts as one search.',
    steps: [
      { request: '“Waterproof walking shoes”', response: 'Nobi returns matching items.', type: 'search' },
      { request: '“Lightweight rain jackets”', response: 'A new search returns a new set of results.', type: 'search' },
    ],
    summary: '2 searches', totalCents: 2,
  },
  {
    id: 'both', title: 'Search + assistant', description: 'Find items, then help visitors narrow them down.',
    hasSearch: true, hasMessages: true,
    exampleTitle: 'A search can become a conversation.',
    explanation: 'The initial search counts as a search. Each conversational follow-up counts as an assistant message.',
    steps: [
      { request: '“Waterproof walking shoes”', response: 'Nobi returns matching items.', type: 'search' },
      { request: '“Which are best for a long walk?”', response: 'The assistant helps compare the options.', type: 'message' },
      { request: '“Only show me ones under $100”', response: 'The assistant narrows the results.', type: 'message' },
    ],
    summary: '1 search + 2 assistant messages', totalCents: 21,
  },
  {
    id: 'assistant', title: 'Assistant only', description: 'Answer questions using your knowledge base.',
    hasSearch: false, hasMessages: true,
    exampleTitle: 'Start with a question. Keep asking.',
    explanation: 'When a visitor starts with the assistant, their first request and every follow-up count as assistant messages.',
    steps: [
      { request: '“How does your returns policy work?”', response: 'The assistant answers from your knowledge base.', type: 'message' },
      { request: '“What if I bought it on sale?”', response: 'The assistant answers the follow-up.', type: 'message' },
    ],
    summary: '2 assistant messages', totalCents: 20,
  },
];

export const PRICING_FAQS = [
  {
    q: 'Is it $0.10 to start a conversation, then $0.01 for each follow-up?',
    a: 'No. The rate depends on the type of request, not its position in a conversation. A simple search counts as one search. A conversational request counts as one assistant message, including the first request if it starts with the assistant. After your monthly allowances, searches are $0.01 each and assistant messages are $0.10 each.',
  },
  {
    q: 'What exactly counts as an assistant message?',
    a: 'One visitor request that asks the assistant to respond, answer a question, or conversationally refine results. Each follow-up is another assistant message. Nobi’s reply is included; you do not pay separately for the reply. A conversation can contain several billable messages.',
  },
  {
    q: 'Can I use Nobi just for search?',
    a: 'Yes. You can use Nobi for search without conversational assistance. Standard still starts at $25/month and includes 2,500 searches. Additional searches cost $0.01 each. The included assistant-message allowance does not convert into extra searches.',
  },
  {
    q: 'How do the included allowances work?',
    a: 'The $25 monthly base includes both 2,500 searches and 250 assistant messages. They are separate allowances, not a shared credit balance. Overage is calculated separately for each: 3,000 searches and 100 assistant messages would cost $30 for the month ($25 base + 500 additional searches at $0.01).',
  },
  {
    q: 'What happens if I go over my limit?',
    a: 'On the paid Standard plan, additional usage is billed automatically at $0.01 per search and $0.10 per assistant message. Each allowance is calculated separately. During a free trial, usage is limited to the trial allowances.',
  },
  {
    q: 'Can I try Nobi for free?',
    a: 'Yes. Every account gets 100 free messages every month to try Nobi in your dashboard, with no credit card needed. When you are ready to go live on your website, start a 30-day free trial.',
  },
  {
    q: 'Is this only for ecommerce websites?',
    a: 'No. Nobi can search other kinds of catalogs and searchable items, or answer questions from a knowledge base. The same distinction applies: simple searches count as searches; conversational requests count as assistant messages.',
  },
  {
    q: 'Do you offer volume or annual pricing?',
    a: 'Yes. Contact us for custom pricing for high-volume usage, larger catalogs, or annual commitments. We can help choose the right setup for your site.',
  },
];

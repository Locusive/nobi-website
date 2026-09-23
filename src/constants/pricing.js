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
    id: 'search', title: 'Search only', hasSearch: true, hasMessages: false,
    explanation: 'Each search returns results without a conversation.',
    steps: [
      { request: 'Getting started guides', type: 'search' },
      { request: 'Troubleshooting tips', type: 'search' },
    ],
  },
  {
    id: 'both', title: 'Search + assistant', hasSearch: true, hasMessages: true,
    explanation: 'A simple search counts as a search. Each conversational follow-up counts as a message.',
    steps: [
      { request: 'Getting started guides', type: 'search' },
      { request: 'Only show me the videos', type: 'message' },
    ],
  },
  {
    id: 'assistant', title: 'Assistant only', hasSearch: false, hasMessages: true,
    explanation: 'Each visitor request counts as a message, including the first. Nobi’s reply is included.',
    steps: [
      { request: 'How do I create an account?', type: 'message' },
      { request: 'Can I invite my team?', type: 'message' },
    ],
  },
];

export const PRICING_FAQS = [
  {
    q: 'What counts as a search or a message?',
    a: 'A search returns matching results without a conversation. An assistant message is one visitor request for an answer or conversational refinement. Each follow-up is another message; Nobi’s reply is included.',
  },
  {
    q: 'Is the first request always a 1¢ search?',
    a: 'No. The rate depends on the request, including the first request: a simple search is $0.01; a question to the assistant is $0.10. Conversational follow-ups are $0.10 each. These rates apply after the relevant monthly allowance.',
  },
  {
    q: 'What does the $25 base include?',
    a: 'Both 2,500 searches and 250 assistant messages per month. They are separate allowances, not a shared credit balance. For example, 3,000 searches and 100 messages cost $30: $25 base plus 500 extra searches at $0.01.',
  },
  {
    q: 'Can I use Nobi just for search?',
    a: 'Yes. Standard is still $25/month with 2,500 searches included, then $0.01 per additional search. Unused messages do not convert into searches.',
  },
  {
    q: 'What happens if I go over?',
    a: 'On paid Standard, additional usage is billed automatically: $0.01 per additional search and $0.10 per additional assistant message. During a free trial, usage is limited to the trial allowances.',
  },
  {
    q: 'Can I try it for free?',
    a: 'Yes. Get 100 free messages every month in your dashboard, with no credit card needed. When you’re ready to go live on your website, start a 30-day free trial.',
  },
];

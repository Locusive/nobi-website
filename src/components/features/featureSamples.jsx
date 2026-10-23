import { AiSearchSample, SearchAsYouTypeSample, ShopifySearchPageSample, SiteAnswersSample } from "./searchSamples";
import { MerchandisingSample, RemarketingSample, SearchAnalyticsSample } from "./searchControlSamples";
import { AnyLanguageSample, AutomatedSupportSample, CustomActionsSample, LeadCaptureSample, ProactivePromptsSample } from "./assistantSamples";
import { AskAiFiltersSample, CartAssistantSample, ProductPageQaSample, ProductRecommendationsSample, QuickAddSample } from "./ecommerceSamples";

/** The sample screen each feature page shows, by the feature's slug. */
export const FEATURE_SAMPLES = {
  "ai-search": AiSearchSample,
  "search-as-you-type": SearchAsYouTypeSample,
  "shopify-search-page": ShopifySearchPageSample,
  "site-answers": SiteAnswersSample,
  merchandising: MerchandisingSample,
  "search-analytics": SearchAnalyticsSample,
  remarketing: RemarketingSample,
  "automated-support": AutomatedSupportSample,
  "lead-capture": LeadCaptureSample,
  "proactive-prompts": ProactivePromptsSample,
  "custom-actions": CustomActionsSample,
  "any-language": AnyLanguageSample,
  "product-recommendations": ProductRecommendationsSample,
  "product-page-qa": ProductPageQaSample,
  "cart-assistant": CartAssistantSample,
  "ask-ai-filters": AskAiFiltersSample,
  "quick-add": QuickAddSample,
};

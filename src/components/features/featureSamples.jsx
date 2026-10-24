import { AiSearchSample, SearchAsYouTypeSample, ShopifySearchPageSample, SiteAnswersSample } from "./searchSamples";
import { InsightsSample, MerchandisingSample } from "./searchControlSamples";
import { AutomatedSupportSample, CustomActionsSample, LeadCaptureSample, ProactivePromptsSample } from "./assistantSamples";
import { CartAssistantSample, ProductPageQaSample, ProductRecommendationsSample } from "./ecommerceSamples";

/** The sample screen each feature page shows, by the feature's slug. */
export const FEATURE_SAMPLES = {
  "ai-search": AiSearchSample,
  "search-as-you-type": SearchAsYouTypeSample,
  "shopify-search-page": ShopifySearchPageSample,
  "site-answers": SiteAnswersSample,
  merchandising: MerchandisingSample,
  insights: InsightsSample,
  "automated-support": AutomatedSupportSample,
  "lead-capture": LeadCaptureSample,
  "proactive-prompts": ProactivePromptsSample,
  "custom-actions": CustomActionsSample,
  "product-recommendations": ProductRecommendationsSample,
  "product-page-qa": ProductPageQaSample,
  "cart-assistant": CartAssistantSample,
};

import { AiSearchSample, SearchAsYouTypeSample, SmartAnswersSample } from "./searchSamples";
import { InsightsSample, MerchandisingSample } from "./searchControlSamples";
import { AutomatedSupportSample, CustomActionsSample, LeadCaptureSample, ProactivePromptsSample } from "./assistantSamples";
import { CartAssistantSample, ProductPageQaSample, ProductRecommendationsSample } from "./ecommerceSamples";

/** The sample screen each feature page shows, by the feature's slug. */
export const FEATURE_SAMPLES = {
  "ai-search": AiSearchSample,
  "search-as-you-type": SearchAsYouTypeSample,
  "smart-answers": SmartAnswersSample,
  merchandising: MerchandisingSample,
  insights: InsightsSample,
  "automated-support": AutomatedSupportSample,
  "product-page-qa": ProductPageQaSample,
  "product-recommendations": ProductRecommendationsSample,
  "cart-assistant": CartAssistantSample,
  "lead-capture": LeadCaptureSample,
  "proactive-prompts": ProactivePromptsSample,
  "custom-actions": CustomActionsSample,
};

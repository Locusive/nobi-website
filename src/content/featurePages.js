import { SEARCH_FEATURE_PAGES } from "./featurePagesSearch.js";
import { ASSISTANT_FEATURE_PAGES } from "./featurePagesAssistant.js";
import { ECOMMERCE_FEATURE_PAGES } from "./featurePagesEcommerce.js";

/** The copy for every feature page, by the feature's slug. */
export const FEATURE_PAGES = { ...SEARCH_FEATURE_PAGES, ...ASSISTANT_FEATURE_PAGES, ...ECOMMERCE_FEATURE_PAGES };

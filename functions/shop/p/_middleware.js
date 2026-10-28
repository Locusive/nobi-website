import document from '../../../generated/bodum-document.js';
import { serveBodumDocument } from '../../../scripts/shop-nobi-product-response.js';

/** A single product page uses privately bundled offers; no merchant requests happen at the edge. */
export function onRequest(context) {
  return serveBodumDocument(context, document);
}

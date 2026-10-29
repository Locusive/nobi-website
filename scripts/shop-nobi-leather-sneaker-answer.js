const RetailerExampleLimit = 3;

/** Describes displayed model/retailer pairs in their existing order, without ranking or stock claims. */
function retailerExamples(page) {
  if (page.publicationFilteredProducts) return "";
  const examples = new Map();
  for (const product of page.products) {
    if (!product.name || !product.storeName || examples.has(product.storeName)) continue;
    examples.set(product.storeName, `${product.name} at ${product.storeName}`);
    if (examples.size === RetailerExampleLimit) break;
  }
  return examples.size ? `Displayed listings include ${[...examples.values()].join("; ")}. ` : "";
}

/** Answers the observed shopping question using only the page's retained product records. */
export function withLeatherSneakerShoppingAnswer(page) {
  const examples = retailerExamples(page);
  const shoppingAnswer = `${examples}Use the product cards to open the exact retailer listing, then check your size, selected color and current purchase details there.`;
  return {
    ...page,
    title: "Where to Find Leather Lifestyle Sneakers: Compare Models",
    description: "Find leather lifestyle sneaker listings by retailer and model. Compare size, upper materials, construction and care requirements before choosing a seller.",
    guide: [
      shoppingAnswer,
      "Start with the intended wearer, size system and exact model. Men's and women's models can use different size conventions; compare each listing's size chart rather than transferring a size between styles. Check width options, lining and closure details where provided, and read the retailer's return terms before choosing a size.",
      "Read the upper, lining and sole descriptions separately. Nappa, grain leather and contrast panels describe different material or design details, but appearance and a category name do not establish leather quality or durability. Check the selected model's stated construction and weather guidance instead of assuming that a rubber sole or leather upper is suitable for wet conditions.",
      "Enter your size, preferred upper, color and budget in Shop Nobi search to narrow the choices. Follow the exact finish's care instructions before using a conditioner or protective treatment. If future repair matters, ask the maker or a repairer about that model's sole construction; lace-up styling alone does not establish that it can be resoled.",
    ],
    faq: [
      { question: "Where can I find leather lifestyle sneakers?", answer: shoppingAnswer },
      { question: "How should I compare sizes between sneaker models?", answer: "Use the exact model's intended-wearer and size chart, including the size system and any width options. Compare lining and closure details where stated, and check the retailer's return terms instead of assuming the same labeled size fits alike across models." },
      { question: "Which leather and construction details should I check?", answer: "Read the upper, lining, sole and finish descriptions for the selected variant. A grain pattern, soft feel or material name alone does not authenticate leather quality, durability or wet-weather performance." },
      { question: "How can I check care requirements and repair options?", answer: "Follow the maker's instructions for the exact material and finish before applying a treatment. Ask about the model's sole construction and repair support rather than assuming that stitched, cemented or lace-up sneakers can all be resoled." },
    ],
  };
}

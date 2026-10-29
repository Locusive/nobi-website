/** Exact reviewed cosmetic copy; labels and category names do not establish formula performance. */
export const CosmeticFormulationRevision = "2026-10-29T04:17:57Z";

const ReviewedPages = [
  {
    "slug": "hand-creams",
    "title": "Best Hand Creams from Top Stores",
    "paragraphs": [
      {
        "paragraph": "For dry, cracked hands choose a cream with occlusive agents such as petrolatum or lanolin. If you prefer a quick-absorbing option, look for gel-based or hyaluronic-acid formulas.",
        "replacement": "Compare the maker's description of the texture and finish, then check the selected cream's ingredient list and application directions. A gel-like texture or a highlighted ingredient does not by itself establish how quickly the complete formula absorbs. Consider the pack size and dispenser alongside whether you prefer a lighter or richer-feeling product."
      },
      {
        "paragraph": "Fragrance-free or hypoallergenic versions are best for sensitive skin, while scented creams can add a pleasant aroma during use.",
        "replacement": "Compare scented and fragrance-free options using the exact ingredient list and the maker's description. If you avoid particular ingredients, check for them even when a cream is labeled hypoallergenic. Choose fragrance according to your preferences and known restrictions rather than treating either label as a guarantee of suitability."
      }
    ],
    "faq": [
      {
        "question": "What ingredients help heal cracked skin?",
        "answer": "Shea butter, lanolin, and ceramides provide deep moisture and barrier repair.",
        "expectedAnswer": "A highlighted ingredient or hand-cream label does not establish that the finished product heals cracked skin. Read the exact product's stated purpose, ingredient list and directions, and distinguish a general moisturizing cream from a product specifically labeled for the use you need."
      },
      {
        "question": "Can I use hand cream on my feet?",
        "answer": "Yes, richer creams can be used on feet, but a foot-specific product may work faster.",
        "expectedAnswer": "Check whether the exact product's directions permit use on feet. Do not infer suitability from a rich texture, or faster results from a foot-cream label; compare the stated use and instructions for the products you are considering."
      }
    ]
  },
  {
    "slug": "natural-personal-care",
    "title": "Best Natural Personal Care Products from Top Stores",
    "paragraphs": [
      {
        "paragraph": "Look for ingredients like Himalayan salt, rosewater, yuzu, bamboo, lemon-mint, and hyaluronic acid, which signal a focus on natural sourcing. Products labeled \"fragrance-free\" are ideal for sensitive skin, while those with essential oils add a subtle scent.",
        "replacement": "Read names such as Bamboo, Yuzu or Rosewater separately from the full ingredient list: a product name may describe a scent or range rather than establish ingredient sourcing. Check any natural-origin claim and fragrance description for the exact formula. If you avoid particular ingredients, verify them directly instead of treating natural, botanical or fragrance-free wording as a complete suitability check."
      }
    ],
    "faq": [
      {
        "question": "Are natural soaps better for the skin?",
        "answer": "Natural soaps often contain fewer synthetic detergents and can be gentler on sensitive skin.",
        "expectedAnswer": "A natural label alone does not establish that a soap is gentler or contains fewer synthetic ingredients. Compare the complete ingredient list, fragrance, intended use and directions for the exact soap, including any ingredients you need to avoid."
      },
      {
        "question": "Do natural shampoos lather as much as regular ones?",
        "answer": "They may produce less foam, but still clean effectively due to natural surfactants.",
        "expectedAnswer": "Compare the exact shampoo's formula and use directions rather than predicting lather from a natural label. Read the maker's description of the expected lather and the amount to use; the category name alone does not establish which surfactants are present or how the finished shampoo performs."
      }
    ]
  },
  {
    "slug": "toning-products",
    "title": "Best Toning Products from Top Stores",
    "paragraphs": [
      {
        "paragraph": "When choosing a toner look for a formula that matches your skin type, hydrating toners for dry skin, exfoliating BHA or AHA toners for oily or acne-prone skin, and soothing vitamin C or antioxidant blends for sensitive skin. Alcohol-free options are easier on the barrier.",
        "replacement": "Compare the exact formula's stated purpose, ingredients and use directions rather than choosing solely by a hydrating, exfoliating or antioxidant label. Check any listed acid or active concentration and the maker's usage limits. If you avoid particular ingredients, read the complete list; an alcohol-free claim alone does not describe how the whole formula will suit you."
      },
      {
        "paragraph": "Pay attention to texture and finish; watery drops absorb quickly, while lotion-like tonics can provide extra moisture. Check if the product is fragrance-free if you have sensitivities, and consider a pH around 5-6 for optimal balance.",
        "replacement": "Compare the stated texture, dispenser and application method, including whether the product is sprayed, applied by hand or used with a pad. Check fragrance and other ingredients against your preferences or restrictions. If pH is important to your comparison, use a value supplied for the exact formula rather than assuming one target range is best for every toner."
      }
    ],
    "faq": [
      {
        "question": "What does a toner do for my skin?",
        "answer": "A toner helps balance pH, remove residual impurities and prep the skin for serums and moisturizers.",
        "expectedAnswer": "Toners are sold with different stated purposes, so compare the exact formula's intended use and directions. A hydrating toner, a tonic lotion and a product labeled with a BHA concentration should not automatically be assigned the same pH-balancing, cleansing or preparation benefits."
      },
      {
        "question": "Should I use a toner every day?",
        "answer": "Most daily toners are safe for everyday use, but stronger exfoliating formulas may be limited to a few times a week.",
        "expectedAnswer": "Follow the frequency and amount specified for the exact product. A toner name or daily-use description is not a substitute for its full directions and restrictions; do not apply one routine to every hydrating or exfoliating formula."
      },
      {
        "question": "How can I tell if a toner is alcohol-free?",
        "answer": "Check the ingredient list for alcohol names like denatured alcohol or ethanol; if they’re absent it’s alcohol-free.",
        "expectedAnswer": "Read the complete ingredient list and the maker's explanation of its alcohol-free claim. Checking only for ethanol or denatured alcohol is not a complete verification; ask the maker if the wording or an ingredient is unclear."
      },
      {
        "question": "Can I apply a toner after cleansing with a brush?",
        "answer": "Yes, apply the toner with a cotton pad or hands after cleansing to help lock in moisture.",
        "expectedAnswer": "Check the toner and cleansing device instructions for any restrictions on combining them. Use the toner's stated timing, amount and application method; prior brush cleansing does not establish compatibility or an extra moisturizing benefit."
      },
      {
        "question": "Do I need to rinse off a toner?",
        "answer": "No, toners are leave-on products that are patted into the skin.",
        "expectedAnswer": "Read the exact product's directions for whether to leave it on or rinse it off, and for how to apply it. Do not decide from the toner category name alone."
      }
    ]
  }
];

/** Corrects only approved complete source paragraphs and FAQ pairs on their original page. */
export function withCosmeticFormulationGuidance(page) {
  if (!page.products?.length || page.publicationFilteredProducts === true || page.guideSources?.length) return page;
  const reviewed = ReviewedPages.find(entry => entry.slug === page.slug && entry.title === page.title);
  if (!reviewed) return page;
  let changed = false;
  const guide = page.guide.map(paragraph => {
    const match = reviewed.paragraphs.find(entry => entry.paragraph === paragraph);
    if (!match) return paragraph;
    changed = true;
    return match.replacement;
  });
  const faq = page.faq.map(entry => {
    const match = reviewed.faq.find(pair => pair.question === entry.question && pair.answer === entry.answer);
    if (!match) return entry;
    changed = true;
    return { ...entry, answer: match.expectedAnswer };
  });
  return changed ? { ...page, guide, faq } : page;
}

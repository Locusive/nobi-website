import { withExactGuidePassages } from "./shop-nobi-exact-guidance.js";

export const GarmentCareRevision = "2026-10-29T06:00:45Z";

const ReviewedPages = [
  {
    "slug": "beige-blazers",
    "title": "Best Beige Blazers From Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How do I care for a wool blazer?",
        "answer": "Dry-clean it or use a gentle wool-specific detergent and lay it flat to dry.",
        "expectedAnswer": "Check the exact blazer’s care label before choosing a cleaning method. Confirm instructions for the whole garment, including its lining, structure and trim; a wool label or wool detergent does not establish that it can be washed at home."
      }
    ]
  },
  {
    "slug": "green-blazers",
    "title": "Best Green Blazers from Top Stores",
    "paragraphs": [
      {
        "paragraph": "Look for a blazer with a quality lining that feels smooth against the skin and helps the garment keep its shape. Check the stitching on the lapels and cuffs; tight, even stitches indicate durability. If you plan to wear it often, a removable lining can make dry-cleaning easier.",
        "replacement": "Compare whether the selected blazer is lined, partially lined or unlined, and inspect the lapels, cuffs and pocket details. Check the care instructions for the whole garment before choosing a cleaning method. Do not assume a lining is removable; confirm any detachable component in the exact model’s specifications."
      }
    ],
    "faq": [
      {
        "question": "How can I care for a wool blazer?",
        "answer": "Dry-cleaning is safest for wool, but spot cleaning with a gentle detergent works for small stains.",
        "expectedAnswer": "Read the exact blazer’s cleaning instructions before treating a stain or arranging dry cleaning. Check the lining and trim as well as the outer fabric, and ask the retailer if the label is missing."
      }
    ]
  },
  {
    "slug": "cream-coats-jackets",
    "title": "Best Cream Coats & Jackets from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How should I care for a cream wool coat?",
        "answer": "Dry-clean or hand-wash gently, and store on a wide hanger to maintain shape.",
        "expectedAnswer": "Use the care label for the selected coat, including any trim, lining or removable components. Confirm the permitted cleaning and drying method before washing; the cream color and wool name do not provide those instructions."
      }
    ]
  },
  {
    "slug": "gray-coats",
    "title": "Best Gray Coats from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How can I care for a wool or cashmere gray coat?",
        "answer": "Dry clean or hand wash in cold water with a gentle detergent, then lay flat to dry to maintain shape.",
        "expectedAnswer": "Check the selected coat’s care label for its permitted cleaning and drying method. Read instructions for the lining, trim and any detachable parts too, rather than choosing hand washing from the wool or cashmere name."
      }
    ]
  },
  {
    "slug": "mens-outerwear",
    "title": "Best Men's Outerwear from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How should I care for a wool outerwear piece?",
        "answer": "Dry-clean or hand-wash on a gentle cycle with a wool-safe detergent, then lay flat to dry.",
        "expectedAnswer": "Check the care instructions for the exact outerwear model, including its lining, fill, trim and any removable components. Confirm whether washing is permitted and which drying method the maker specifies before choosing a detergent or cycle."
      }
    ]
  },
  {
    "slug": "stripe-coats-and-jackets",
    "title": "Best Stripe Coats and Jackets from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How should I care for a wool-linen stripe coat?",
        "answer": "Dry clean or hand wash gently in cold water, then lay flat to dry to maintain shape.",
        "expectedAnswer": "Follow the cleaning and drying instructions for the exact coat or jacket. A wool-linen blend name does not establish washability; check the garment’s lining, trim and construction details before choosing a care method."
      }
    ]
  },
  {
    "slug": "womens-blazers",
    "title": "Best Women's Blazers from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How can I care for a linen blazer?",
        "answer": "Dry clean or hand wash gently and line dry to avoid shrinking.",
        "expectedAnswer": "Read the exact blazer’s care label before washing or dry cleaning it. Check instructions for the lining and trim as well as the outer linen fabric, and confirm the drying method with the retailer if it is not stated."
      }
    ]
  },
  {
    "slug": "navy-dress-pants",
    "title": "Best Navy Dress Pants from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "How should I care for wool navy dress pants?",
        "answer": "Dry clean is safest, but some wool blends can be hand-washed on a gentle cycle and air-dried flat.",
        "expectedAnswer": "Use the care label for the selected trousers, including the stated cleaning and drying method. Check the waistband, lining and trim details rather than choosing a wash cycle from the wool or blend name alone."
      }
    ]
  },
  {
    "slug": "midnight-outerwear",
    "title": "Best Midnight Outerwear from Top Stores",
    "paragraphs": [],
    "faq": [
      {
        "question": "Can I machine wash a wool jacket?",
        "answer": "Many wool jackets can be hand-washed or machine-washed on a gentle cycle, but check the care label first.",
        "expectedAnswer": "Only use a machine wash if the exact jacket’s care label permits it. Check the specified cycle and drying method, including instructions for the lining, fill and trim; the wool name alone does not answer whether washing is allowed."
      }
    ]
  }
];

/** Replaces only reviewed whole garment-care passages, retaining model-specific care decisions. */
export function withGarmentCareGuidance(page) {
  return withExactGuidePassages(page, ReviewedPages);
}

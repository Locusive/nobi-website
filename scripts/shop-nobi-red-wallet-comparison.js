// Model organization reviewed October 28, 2026; exact retained listings gate each row.
const ReviewedModels = [
  {
    identity: { name: "Bosca Monfrini ITALIA Slim 8-Slot Men's Pocket Wallet", brand: "Bosca", productVariantId: "f64b74bc-c8a4-49c7-bd94-1bc12974204d", owningMerchantId: "e3f1dc6d-4334-431d-b1c2-2307efd9c944", url: "https://www.luggageonline.com/products/bosca-monfrini-italia-slim-8-slot-mens-pocket-wallet?variant=43020973408447" },
    model: "Bosca Monfrini Slim 8-Pocket Wallet",
    setup: "8 card pockets.",
    adjustment: "Divided bill compartment and 2 hidden pockets.",
    fit: "Fold-open pocket format. Sources describe the model family; confirm the selected color and variant with the retailer.",
    sources: [
      { label: "Bosca Monfrini: maker's model details", url: "https://www.bosca.com/products/monfrini-slim-8-pocket-wallet" },
      { label: "Bosca Monfrini: retailer's model details", url: "https://www.luggageonline.com/products/bosca-monfrini-italia-slim-8-slot-mens-pocket-wallet" },
    ],
  },
  {
    identity: { name: "Ermenegildo Zegna Printed Calfskin Leather Zip Around Wallet", brand: "Ermenegildo Zegna", productVariantId: "bdc9be0c-71a5-4175-b846-729e31dd53cd", owningMerchantId: "e3f1dc6d-4334-431d-b1c2-2307efd9c944", url: "https://www.luggageonline.com/products/ermenegildo-zegna-printed-calfskin-leather-zip-around-wallet?variant=39313387520191" },
    model: "Ermenegildo Zegna Printed Calfskin Zip Around Wallet",
    setup: "Multiple card slots; the source does not disclose a count.",
    adjustment: "Internal zip pocket and slip storage for notes or travel documents. Check the fit of your own documents.",
    fit: "Outer zip-around organizer. Source describes the model family; confirm the selected color and variant with the retailer.",
    sources: [{ label: "Ermenegildo Zegna: retailer's model details", url: "https://www.luggageonline.com/products/ermenegildo-zegna-printed-calfskin-leather-zip-around-wallet" }],
  },
  {
    identity: { name: "The Sak Iris Wallet", brand: "The Sak", productVariantId: "e3218dc4-c40d-4d62-9722-57b5eb9012ee", owningMerchantId: "e3f1dc6d-4334-431d-b1c2-2307efd9c944", url: "https://www.luggageonline.com/products/the-sak-iris-wallet?variant=41801802973375" },
    model: "The Sak Iris Wallet, Crimson",
    setup: "4 card pockets.",
    adjustment: "Additional internal zipper pocket.",
    fit: "Main zipper closure. The reviewed retailer variant is labeled Crimson; confirm the selection before ordering.",
    sources: [{ label: "The Sak Iris: retailer's Crimson variant details", url: "https://www.luggageonline.com/products/the-sak-iris-wallet?variant=41801802973375" }],
  },
];

/** Keeps model facts only while every reviewed identity field matches a retained product. */
function matchingModels(page) {
  if (page.publicationFilteredProducts) return [];
  return [...new Set(page.products.map(product => ReviewedModels.find(({ identity }) =>
    Object.entries(identity).every(([field, value]) => product[field] === value))).filter(Boolean))];
}

/** Compares sourced organization features without changing cards or retailer destinations. */
export function withRedWalletComparison(page) {
  const models = matchingModels(page);
  const { comparison, guideSources, ...rest } = page;
  return {
    ...rest,
    title: "Red Wallets: Compare Card Pockets, Cash Storage & Closures",
    description: "Compare wallet formats by card pockets, bill storage, coin compartments and closures. Check the selected red shade, dimensions and exact model before buying.",
    guide: [
      "Start with what you carry: cards, banknotes, coins or documents. Count the card pockets separately from hidden slip pockets and bill compartments. A card-pocket count describes the layout, not how many cards can be packed into each pocket or how slim the loaded wallet will remain.",
      "Choose the format and access you want. A fold-open pocket wallet, zip-around organizer and wristlet have different layouts; check which compartments have their own closures and whether a strap is included. Compare the wallet's stated dimensions with your pocket or bag and the items you need to carry.",
      "Check the selected color and material description on the retailer's page. Red, crimson and other shade names are not interchangeable, and a model page may open on a different color. Use the exact variant's written material details rather than judging leather authenticity by feel or photographs.",
      "Enter your preferred format, card-pocket count, cash or coin storage and budget in Shop Nobi search. The comparison summarizes sourced model layouts, not a ranking or hands-on test. Check the exact variant's features and purchase terms; an RFID label alone is not a guarantee against every form of card-data theft.",
    ],
    faq: [
      { question: "How should I compare card pockets and bill compartments?", answer: "Count the card pockets, then check cash storage separately: divided bill compartments, hidden slip pockets and zipped coin pockets serve different purposes. Confirm the layout of the exact model and avoid assuming multiple cards will fit in each pocket." },
      { question: "What should I check on a zip-around or wristlet wallet?", answer: "Check the outer closure, internal pocket closures, dimensions and whether a wrist strap is included. Compare document and phone measurements with any stated compartment dimensions instead of assuming they will fit." },
      { question: "How do I confirm the red shade and material?", answer: "Match the selected color or variant to the retailer's description and photos. A model page can default to another color; read its written material information rather than using appearance or feel as an authenticity test." },
      { question: "What does an RFID feature tell me when comparing wallets?", answer: "Read the maker's stated scope for the exact model and the cards it is intended to cover. A blocking label is not a guarantee against all card-data theft and does not replace comparing the wallet's fit and organization." },
    ],
    ...(models.length ? {
      comparison: {
        caption: "Wallet card-pocket and closure comparison",
        note: "Model details reviewed October 28, 2026. Bosca and Zegna sources describe model families, not a verified red variant. Confirm the selected color and exact features with the retailer.",
        columns: ["Model", "Card storage", "Cash & internal pockets", "Closure & selection"],
        rows: models.map(({ model, setup, adjustment, fit }) => ({ model, setup, adjustment, fit })),
      },
      guideSources: [...new Map(models.flatMap(model => model.sources).map(source => [source.url, source])).values()],
    } : {}),
  };
}

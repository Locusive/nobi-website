/** Corrects only approved complete source paragraphs and FAQ pairs on their original page. */
export function withExactGuidePassages(page, reviewedPages) {
  if (!page.products?.length || page.publicationFilteredProducts === true || page.guideSources?.length) return page;
  const reviewed = reviewedPages.find(entry => entry.slug === page.slug && entry.title === page.title);
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

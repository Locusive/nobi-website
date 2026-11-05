// Makes a short Web Story for each published, researched top-ten guide. The story
// is a discovery preview; the article retains the full selection and reasoning.

import { choosePosters } from "./shop-nobi-web-story-poster.js";
import { planWebStory } from "./shop-nobi-web-story-plan.js";

/** Only guides whose ten verified picks survived the current catalog build can get a story. */
export async function planEditorialGuideStories(guides, fetchImageSize) {
  const planned = guides.filter((guide) => guide.editorial && guide.products.length === 10)
    .map((guide) => {
      const page = {
        slug: `guide-${guide.slug}`,
        title: guide.title,
        description: guide.seoDescription,
        refreshedAt: guide.lastModifiedAt,
        guide: [guide.intro, ...guide.buyingGuide.slice(0, 1)],
        faq: [],
        products: guide.products,
      };
      return { page, guide, plan: planWebStory(page) };
    }).filter((story) => story.plan);
  const { stories } = await choosePosters(planned, planned.length, fetchImageSize);
  return stories.map((story) => ({ ...story, guide: planned.find((item) => item.page.slug === story.page.slug).guide }));
}

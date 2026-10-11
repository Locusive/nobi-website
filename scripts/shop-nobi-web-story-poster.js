// Picks each web story's poster: the first portrait cut that really is as large as Google asks. Shopify never
// enlarges a picture, so a small product picture gives a small cut, which is skipped.

import { PortraitPosterSize } from "../src/utils/previewImage.js";

// How many pages have their posters checked at the same time.
const PosterCheckBatchSize = 16;
const PosterAttemptLimit = 3;

/**
 * Gives the first planned stories, up to the limit, a poster of full size, checking a batch of pages at a time.
 * Stories without one are dropped.
 *
 * @param {{page: object, plan: object}[]} plannedStories The planned stories, in page order.
 * @param {number} storyLimit The most stories to keep.
 * @param {(imageUrl: string) => Promise<{width: number, height: number} | null>} fetchImageSize Reads a picture's size.
 * @returns {Promise<{stories: object[], checkedCount: number}>} The stories with posters, and how many were checked.
 */
export async function choosePosters(plannedStories, storyLimit, fetchImageSize) {
  const stories = [];
  let checkedCount = 0;
  while (stories.length < storyLimit && checkedCount < plannedStories.length) {
    const batchSize = Math.min(PosterCheckBatchSize, storyLimit - stories.length);
    const batch = plannedStories.slice(checkedCount, checkedCount + batchSize);
    checkedCount += batch.length;

    const posterUrls = await Promise.all(batch.map((story) => findFullSizePoster(story.plan.posterCandidates, fetchImageSize)));
    batch.forEach((story, index) => {
      if (posterUrls[index]) {
        stories.push({ page: story.page, plan: { posterUrl: posterUrls[index], pages: story.plan.pages } });
      }
    });
  }
  return { stories, checkedCount };
}

/** Returns the first of the first few candidates that is at least the poster size, or null when none is. */
async function findFullSizePoster(posterCandidates, fetchImageSize) {
  for (const posterUrl of posterCandidates.slice(0, PosterAttemptLimit)) {
    const size = await fetchImageSize(posterUrl);
    if (size && size.width >= PortraitPosterSize.width && size.height >= PortraitPosterSize.height) {
      return posterUrl;
    }
  }
  return null;
}

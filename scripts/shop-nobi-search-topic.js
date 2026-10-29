const GenericTitlePattern = /^Best (.+?)(?: from Top Stores)?$/;
const CapitalizedSuffixPattern = /^Best (.+?) From Top Stores$/;

/**
 * Reads the topic from the API's recognized generic title, or null for custom wording.
 * The capitalized suffix is stripped only after a real topic; whitespace-only prefixes keep the old parser's meaning.
 *
 * @param {string} title The existing page or link title.
 * @returns {string | null} The trimmed generic topic, including an empty topic when the original template contains only spaces.
 */
export function readGenericSearchTopic(title) {
  const capitalizedTopic = CapitalizedSuffixPattern.exec(title)?.[1]?.trim();
  return capitalizedTopic || (GenericTitlePattern.exec(title)?.[1]?.trim() ?? null);
}

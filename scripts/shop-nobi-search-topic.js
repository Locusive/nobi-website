const GenericTitlePattern = /^Best (.+?)(?: from Top Stores)?$/;

/**
 * Reads the topic from the API's recognized generic title, or null for custom wording.
 * The exact shared pattern keeps navigation labels consistent without treating every ranking word as a template.
 *
 * @param {string} title The existing page or link title.
 * @returns {string | null} The trimmed generic topic, including an empty topic when the source contains only spaces.
 */
export function readGenericSearchTopic(title) {
  return GenericTitlePattern.exec(title)?.[1]?.trim() ?? null;
}

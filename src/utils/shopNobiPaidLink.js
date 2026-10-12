// A paid store link sits in the page data in base64, so crawlers reading the page do not see it as a link.
// The build writes it this way and the click handler reads it back.

/**
 * Encodes a paid store link as base64 of its UTF-8 bytes.
 *
 * @param {string} link The finished store link.
 * @returns {string} The encoded link.
 */
export function encodePaidLink(link) {
  const bytes = new TextEncoder().encode(link);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

/**
 * Decodes a paid store link written by encodePaidLink.
 *
 * @param {string | undefined} encodedLink The encoded link, or undefined when the product has none.
 * @returns {string | null} The link, or null when there is none or it cannot be read.
 */
export function decodePaidLink(encodedLink) {
  if (!encodedLink) {
    return null;
  }

  try {
    const bytes = Uint8Array.from(atob(encodedLink), (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

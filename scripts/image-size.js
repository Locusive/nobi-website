// Reads a picture's width and height from the first bytes of its file, for JPEG, PNG, GIF and WebP pictures.
// The build uses it to check that a Web Story poster is really as large as Google asks.

const ImageFetchTimeoutMs = 20000;
// The size sits in the first few kilobytes; a picture whose size is not found by then counts as unreadable.
const HeaderByteLimit = 65536;
const PngSignature = [0x89, 0x50, 0x4e, 0x47];
const JpegStart = [0xff, 0xd8];
const GifSignature = [0x47, 0x49, 0x46, 0x38];
const RiffSignature = [0x52, 0x49, 0x46, 0x46];
const WebpSignature = [0x57, 0x45, 0x42, 0x50];
// JPEG frame markers that carry the size: C0 to CF, except C4 (tables), C8 (reserved) and CC (coding).
const JpegFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
const JpegMarkerPrefix = 0xff;

/**
 * Downloads the start of a picture and reads its size, stopping as soon as the size is known.
 *
 * @param {string} imageUrl The picture's address.
 * @returns {Promise<{width: number, height: number} | null>} The size, or null when the download fails or the
 *     size cannot be read.
 */
export async function fetchImageSize(imageUrl) {
  try {
    const response = await fetch(imageUrl, { signal: AbortSignal.timeout(ImageFetchTimeoutMs) });
    if (!response.ok || !response.body) {
      return null;
    }
    return await readSizeFromStream(response.body.getReader());
  } catch {
    return null;
  }
}

/**
 * Reads a picture's size from the first bytes of its file.
 *
 * @param {Uint8Array} bytes The start of the file.
 * @returns {{width: number, height: number} | null} The size, or null when the bytes do not hold it yet.
 */
export function readImageSize(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (startsWith(bytes, PngSignature, 0)) {
    return bytes.length >= 24 ? { width: view.getUint32(16), height: view.getUint32(20) } : null;
  }
  if (startsWith(bytes, GifSignature, 0)) {
    return bytes.length >= 10 ? { width: view.getUint16(6, true), height: view.getUint16(8, true) } : null;
  }
  if (startsWith(bytes, RiffSignature, 0) && startsWith(bytes, WebpSignature, 8)) {
    return readWebpSize(bytes, view);
  }
  if (startsWith(bytes, JpegStart, 0)) {
    return readJpegSize(bytes, view);
  }
  return null;
}

/** Reads chunks until the size is known or the byte limit is reached, then stops the download. */
async function readSizeFromStream(reader) {
  let bytes = new Uint8Array(0);
  while (bytes.length < HeaderByteLimit) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    bytes = joinBytes(bytes, value);
    const size = readImageSize(bytes);
    if (size) {
      await reader.cancel();
      return size;
    }
  }

  await reader.cancel();
  return null;
}

/** Walks the JPEG segments to the first frame header, which holds the height and then the width. */
function readJpegSize(bytes, view) {
  let offset = JpegStart.length;
  while (offset + 9 <= bytes.length) {
    if (bytes[offset] !== JpegMarkerPrefix) {
      return null;
    }

    const marker = bytes[offset + 1];
    if (JpegFrameMarkers.has(marker)) {
      return { width: view.getUint16(offset + 7), height: view.getUint16(offset + 5) };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

/** Reads the size from a WebP file's first chunk, which differs for lossy, lossless and extended files. */
function readWebpSize(bytes, view) {
  if (bytes.length < 30) {
    return null;
  }

  const chunkType = String.fromCharCode(...bytes.subarray(12, 16));
  if (chunkType === "VP8 ") {
    return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
  }
  if (chunkType === "VP8L") {
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunkType === "VP8X") {
    return { width: readUint24(bytes, 24) + 1, height: readUint24(bytes, 27) + 1 };
  }
  return null;
}

/** Reads a three-byte little-endian number. */
function readUint24(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16);
}

/** Returns whether the bytes hold the expected values at the offset. */
function startsWith(bytes, expected, offset) {
  return expected.every((value, index) => bytes[offset + index] === value);
}

/** Returns the two byte arrays joined into one. */
function joinBytes(first, second) {
  const joined = new Uint8Array(first.length + second.length);
  joined.set(first);
  joined.set(second, first.length);
  return joined;
}

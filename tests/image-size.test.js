import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { fetchImageSize, readImageSize } from "../scripts/image-size.js";

const HttpOk = 200;
const HttpNotFound = 404;

/** Builds the first 24 bytes of a PNG file of the given size. */
function makePngStart(width, height) {
  const bytes = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes);
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

/** Builds the start of a JPEG file: an APP0 segment, then a frame header of the given size. */
function makeJpegStart(width, height) {
  const app0 = Buffer.from([0xff, 0xe0, 0x00, 0x06, 0x4a, 0x46, 0x49, 0x46]);
  const frame = Buffer.alloc(11);
  Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08]).copy(frame);
  frame.writeUInt16BE(height, 5);
  frame.writeUInt16BE(width, 7);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, frame]);
}

/** Builds the first 30 bytes of an extended WebP file of the given size. */
function makeWebpStart(width, height) {
  const bytes = Buffer.alloc(30);
  bytes.write("RIFF", 0, "latin1");
  bytes.write("WEBPVP8X", 8, "latin1");
  bytes.writeUIntLE(width - 1, 24, 3);
  bytes.writeUIntLE(height - 1, 27, 3);
  return bytes;
}

test("the size is read from the start of PNG, JPEG, GIF and WebP files", () => {
  const gif = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x80, 0x02, 0x55, 0x03]);

  assert.deepEqual(readImageSize(makePngStart(640, 853)), { width: 640, height: 853 });
  assert.deepEqual(readImageSize(makeJpegStart(1200, 1600)), { width: 1200, height: 1600 });
  assert.deepEqual(readImageSize(gif), { width: 640, height: 853 });
  assert.deepEqual(readImageSize(makeWebpStart(640, 853)), { width: 640, height: 853 });
});

test("a file cut short or of another kind has no size", () => {
  assert.equal(readImageSize(makePngStart(640, 853).subarray(0, 20)), null);
  assert.equal(readImageSize(makeJpegStart(640, 853).subarray(0, 12)), null);
  assert.equal(readImageSize(Buffer.from("<!doctype html><html>")), null);
});

test("a picture's size is read over the network, and a missing picture has none", async () => {
  const server = createServer((request, response) => {
    const isPicture = request.url === "/poster.png";
    response.writeHead(isPicture ? HttpOk : HttpNotFound, { "content-type": "image/png" });
    response.end(isPicture ? Buffer.concat([makePngStart(640, 853), Buffer.alloc(100000)]) : "");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.deepEqual(await fetchImageSize(`${baseUrl}/poster.png`), { width: 640, height: 853 });
    assert.equal(await fetchImageSize(`${baseUrl}/missing.png`), null);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

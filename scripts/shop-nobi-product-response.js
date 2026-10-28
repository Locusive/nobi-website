import { BodumPath, hasCurrentProductOffers } from '../src/utils/shopNobiProductPage.js';

const ResponseHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'CDN-Cache-Control': 'no-store',
  'Cloudflare-CDN-Cache-Control': 'no-store',
};
const AliasPaths = [BodumPath + '/', BodumPath + '.html', BodumPath + '/index.html'];

/** Serves the private observation only while fresh; static assets always contain the no-price version. */
export async function serveBodumDocument(context, document, now = Date.now()) {
  const url = new URL(context.request.url);
  if (AliasPaths.includes(url.pathname)) {
    url.pathname = BodumPath;
    return new Response(null, { status: 308, headers: { ...ResponseHeaders, Location: url.href } });
  }
  if (url.pathname !== BodumPath) return context.next();
  if (!['GET', 'HEAD'].includes(context.request.method)) {
    return new Response(null, { status: 405, headers: { ...ResponseHeaders, Allow: 'GET, HEAD' } });
  }
  if (typeof document?.html === 'string' && hasCurrentProductOffers(document, now)) {
    return new Response(context.request.method === 'HEAD' ? null : document.html, { headers: ResponseHeaders });
  }
  // A new anonymous request cannot inherit conditional headers, cookies or a stale browser validator.
  const fallback = await context.env.ASSETS.fetch(new Request(url.href, { method: 'GET' }));
  return new Response(context.request.method === 'HEAD' ? null : fallback.body, {
    status: fallback.status, headers: ResponseHeaders,
  });
}

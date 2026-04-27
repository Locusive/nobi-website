/**
 * Cloudflare Pages Function that proxies a domain lookup to SimilarWeb's
 * unofficial public endpoint. The endpoint itself does not set CORS headers,
 * so calling it directly from a browser fails. This function runs on the same
 * origin as the site and forwards the request server-side.
 */
export async function onRequestGet({ request }) {
  const requestUrl = new URL(request.url);
  const rawDomain = (requestUrl.searchParams.get("domain") || "").trim().toLowerCase();
  if (!rawDomain) {
    return jsonResponse({ error: "missing domain" }, 400);
  }

  const domain = cleanDomain(rawDomain);
  if (!domain) {
    return jsonResponse({ error: "invalid domain" }, 400);
  }

  try {
    const upstream = await fetch(
      `https://data.similarweb.com/api/v1/data?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "application/json",
        },
        cf: { cacheTtl: 86400, cacheEverything: true },
      }
    );

    if (!upstream.ok) {
      return jsonResponse({ error: "lookup failed", domain, status: upstream.status }, 502);
    }

    const data = await upstream.json();
    const monthlyVisits = parseVisits(data);
    return jsonResponse({
      domain,
      monthlyVisits,
      siteName: data?.SiteName || domain,
    });
  } catch (e) {
    return jsonResponse({ error: e?.message || "unknown error", domain }, 500);
  }
}

function cleanDomain(input) {
  let d = input.replace(/^https?:\/\//, "").replace(/^www\./, "");
  d = d.split("/")[0].split("?")[0].trim();
  if (!d.includes(".")) return null;
  return d;
}

function parseVisits(data) {
  const v = data?.Engagments?.Visits;
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=86400",
    },
  });
}

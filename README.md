# Nobi Landing – Vercel/Netlify Starter

## Local dev (optional)
1) Install Node 18+
2) `npm install`
3) `npm run dev`

## Deploy to Cloudflare Pages
- Simply push your changes to the main branch and Cloudflare Pages will build and deploy automatically.

## Deploy to Vercel (deprecated)
- Push this folder to a GitHub repo.
- Import the repo in Vercel.
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Hit Deploy.

## Static assets
Put images/videos under `public/media` and reference them as `/media/filename.ext`.

## Static page content

`npm run build` renders the homepage, pricing, and product components into HTML
using React's Node renderer. It does not require Chromium. Browser JavaScript
still mounts the same components for the calculator, navigation, and forms.
Blog and glossary pages retain their existing content prerendering.

The homepage is served through an exact Cloudflare Pages rewrite so the empty
`index.html` shell remains available for other client-side routes. This avoids
serving homepage text as the content of unrelated pages.

Run `npm test` to build the site and check page content, pricing facts, URL forms,
asset references, and signup attribution. Register additional pages in both
`scripts/prerender-pages.js` and `scripts/render-pages.jsx`.

## Local pricing concepts

On branch `feat/pricing-explanation-concepts`, run `npm run preview:pricing`
with Node 18+ and open http://127.0.0.1:5174/pricing/ideas.
Use the comparison buttons to switch between the guided choice, animated example,
and side-by-side explanation. Direct links use `?view=guided`, `?view=example`,
and `?view=compare`. The original `/pricing` page stays available unchanged.

The concepts route is available only on loopback hosts, and is not prerendered
or included in the sitemap. Use the bundled preview for Chrome so ad blockers
do not block the development-only `eventTracker` module path. The traffic lookup
works in this preview as well as the dev server. Rebuild to see code edits.

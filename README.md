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

## Local pricing wizard

Run `npm run preview:pricing` with Node 18+ and open
http://127.0.0.1:5174/pricing. The plan overview shows the base price, included
usage, and search/message rates before the inline interview. Both panels can be
opened independently. Usage sliders show a live monthly estimate, with site traffic
available as a secondary option. Counts use comma separators, and the sliders
start with limits of 100,000 searches and 10,000 messages; entering larger counts
expands those limits. The previous `/pricing/ideas` preview URL
redirects to the pricing page on loopback hosts.

Use the bundled preview for Chrome so ad blockers do not block the
development-only `eventTracker` module path. The existing traffic lookup and
contact form remain available under the activity question. Rebuild to see edits.

`npm test` builds the prerendered pages and checks the pricing arithmetic,
allowances, usage modes, input validation, and existing page regressions.

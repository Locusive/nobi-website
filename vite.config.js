// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'

// Add rel="nofollow noopener noreferrer" to every external link in MDX
// content. Internal links (nobi.ai and relative paths) are left alone.
function rehypeNofollow() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return
      const href = node.properties?.href
      if (typeof href !== 'string') return
      if (!href.startsWith('http://') && !href.startsWith('https://')) return
      if (href.includes('nobi.ai')) return
      node.properties.rel = ['nofollow', 'noopener', 'noreferrer']
      node.properties.target = '_blank'
    })
  }
}

export default defineConfig({
  // macOS FSEvents can miss file-save events silently (especially when
  // `gh pr checkout` swaps in a new MDX file). Polling makes the file
  // watcher reliable — the CPU cost is trivial for a project this size.
  server: {
    port: 5173,
    // Fail loudly when 5173 is already taken instead of silently
    // bumping to 5174 — silent reassignment caused real confusion when
    // an unrelated app on this machine was already squatting on 5173
    // and the blog ended up at /5174, not where the URL expected. To
    // start on a different port: `npm run dev -- --port 5180`.
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  plugins: [
    react(),
    {
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeNofollow],
      }),
      enforce: 'pre',
    },
    // Full-reload when any file under src/content/posts/ changes so
    // `gh pr checkout` (which adds/removes MDX files) reflects on /blog
    // without restarting the dev server. mdxPostLoader uses
    // import.meta.glob with { eager: true } and Vite's default HMR
    // doesn't re-run the glob when files appear/disappear mid-session.
    {
      name: 'mdx-posts-full-reload',
      handleHotUpdate({ file, server }) {
        if (file.includes('/src/content/posts/')) {
          server.ws.send({ type: 'full-reload' })
          return []
        }
      },
      configureServer(server) {
        server.watcher.on('all', (event, path) => {
          if (path.includes('/src/content/posts/')) {
            server.ws.send({ type: 'full-reload' })
          }
        })
      },
    },
    // Mirror the production /api/traffic-lookup Cloudflare Pages Function
    // for local dev so the pricing calculator's URL lookup works against
    // the real SimilarWeb endpoint without CORS issues.
    {
      name: 'traffic-lookup-dev',
      configureServer(server) {
        server.middlewares.use('/api/traffic-lookup', async (req, res) => {
          try {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
            const raw = (url.searchParams.get('domain') || '').trim().toLowerCase()
            const domain = raw
              .replace(/^https?:\/\//, '')
              .replace(/^www\./, '')
              .split('/')[0]
              .split('?')[0]
            if (!domain || !domain.includes('.')) {
              res.statusCode = 400
              res.setHeader('content-type', 'application/json')
              return res.end(JSON.stringify({ error: 'invalid domain' }))
            }
            const upstream = await fetch(
              `https://data.similarweb.com/api/v1/data?domain=${encodeURIComponent(domain)}`,
              {
                headers: {
                  'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                  Accept: 'application/json',
                },
              }
            )
            if (!upstream.ok) {
              res.statusCode = 502
              res.setHeader('content-type', 'application/json')
              return res.end(JSON.stringify({ error: 'lookup failed', status: upstream.status }))
            }
            const data = await upstream.json()
            const visits = data?.Engagments?.Visits ? Number(data.Engagments.Visits) : null
            res.setHeader('content-type', 'application/json')
            res.end(
              JSON.stringify({
                domain,
                monthlyVisits: Number.isFinite(visits) ? visits : null,
                siteName: data?.SiteName || domain,
              })
            )
          } catch (e) {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: e?.message || 'unknown' }))
          }
        })
      },
    },
  ],
})

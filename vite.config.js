// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

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
        rehypePlugins: [rehypeSlug],
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
  ],
})

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  plugins: [
    react(),
    {
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
      enforce: 'pre',
    },
    // Full-reload whenever a file under src/content/posts/ changes so
    // `gh pr checkout` (which adds/removes MDX files) shows up in /blog
    // without restarting the dev server. mdxPostLoader uses
    // import.meta.glob with { eager: true } and Vite's default HMR
    // doesn't re-run the glob when files appear/disappear mid-session.
    {
      name: 'mdx-posts-full-reload',
      handleHotUpdate({ file, server }) {
        // Diagnostic: log every handleHotUpdate call so we can tell
        // whether Vite's watcher is seeing the save at all.
        console.log('[mdx-posts-full-reload] handleHotUpdate fired:', file)
        if (file.includes('/src/content/posts/')) {
          console.log('[mdx-posts-full-reload] MATCH — sending full-reload')
          server.ws.send({ type: 'full-reload' })
          return []
        }
      },
      // Some @mdx-js/rollup versions don't emit HMR events, in which
      // case handleHotUpdate never fires for .mdx files. Watch the
      // directory explicitly so `configureServer` can fall back to
      // a chokidar event.
      configureServer(server) {
        server.watcher.on('all', (event, path) => {
          if (path.includes('/src/content/posts/')) {
            console.log(`[mdx-posts-full-reload] watcher '${event}':`, path)
            server.ws.send({ type: 'full-reload' })
          }
        })
      },
    },
  ],
})

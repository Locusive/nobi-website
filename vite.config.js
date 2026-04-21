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
        if (file.includes('/src/content/posts/')) {
          server.ws.send({ type: 'full-reload' })
          return []
        }
      },
    },
  ],
})

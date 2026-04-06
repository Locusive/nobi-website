// vite.config.js
import { defineConfig } from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/@vitejs/plugin-react/dist/index.js";
import mdx from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/@mdx-js/rollup/index.js";
import remarkFrontmatter from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/remark-frontmatter/index.js";
import remarkGfm from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/remark-gfm/index.js";
import rehypeSlug from "file:///sessions/cool-busy-rubin/mnt/nobi-website/node_modules/rehype-slug/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkGfm],
        rehypePlugins: [rehypeSlug]
      }),
      enforce: "pre"
    }
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvY29vbC1idXN5LXJ1YmluL21udC9ub2JpLXdlYnNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9jb29sLWJ1c3ktcnViaW4vbW50L25vYmktd2Vic2l0ZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvY29vbC1idXN5LXJ1YmluL21udC9ub2JpLXdlYnNpdGUvdml0ZS5jb25maWcuanNcIjsvLyB2aXRlLmNvbmZpZy5qc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBtZHggZnJvbSAnQG1keC1qcy9yb2xsdXAnXG5pbXBvcnQgcmVtYXJrRnJvbnRtYXR0ZXIgZnJvbSAncmVtYXJrLWZyb250bWF0dGVyJ1xuaW1wb3J0IHJlbWFya0dmbSBmcm9tICdyZW1hcmstZ2ZtJ1xuaW1wb3J0IHJlaHlwZVNsdWcgZnJvbSAncmVoeXBlLXNsdWcnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHtcbiAgICAgIC4uLm1keCh7XG4gICAgICAgIHJlbWFya1BsdWdpbnM6IFtyZW1hcmtGcm9udG1hdHRlciwgcmVtYXJrR2ZtXSxcbiAgICAgICAgcmVoeXBlUGx1Z2luczogW3JlaHlwZVNsdWddLFxuICAgICAgfSksXG4gICAgICBlbmZvcmNlOiAncHJlJyxcbiAgICB9LFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sZUFBZTtBQUN0QixPQUFPLGdCQUFnQjtBQUV2QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTjtBQUFBLE1BQ0UsR0FBRyxJQUFJO0FBQUEsUUFDTCxlQUFlLENBQUMsbUJBQW1CLFNBQVM7QUFBQSxRQUM1QyxlQUFlLENBQUMsVUFBVTtBQUFBLE1BQzVCLENBQUM7QUFBQSxNQUNELFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

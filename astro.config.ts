import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypeImageBase } from './scripts/rehype-image-base';

const isPreview = process.env.DEPLOY_ENV === 'development';
const site =
  process.env.PUBLIC_SITE_URL ||
  (isPreview ? 'https://gamefoss.com.br/dev' : 'https://gamefoss.com.br');
const base = process.env.PUBLIC_BASE_PATH || (isPreview ? '/dev' : '/');

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',
  markdown: { rehypePlugins: [[rehypeImageBase, { base }]] },
  integrations: [mdx(), react(), sitemap({ filter: () => !isPreview })],
  // Tailwind supports Astro's bundled Vite version; the cast avoids duplicate
  // Vite type identities when npm keeps a second compatible Vite package.
  vite: { plugins: [tailwindcss() as never] },
});

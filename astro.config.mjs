import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  build: {
    format: 'file',
  },
  integrations: [
    mdx(),
    sitemap(),
    robotsTxt(),
    tailwind(),
  ],
});

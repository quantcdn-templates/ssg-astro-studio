import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  build: {
    format: 'file',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    routing: {
      prefixDefaultLocale: false,
      // Astro 6 flipped the default true → false. Set explicitly to lock behavior.
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap(),
    robotsTxt(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

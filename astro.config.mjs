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
    // Default-locale content sits flat at the collection root. Add a locale
    // here only when its content exists in src/content/<collection>/<locale>/.
    locales: ['en'],
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

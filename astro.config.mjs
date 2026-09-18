import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  // `directory` (Astro's default) writes `<slug>/index.html`, so every page's
  // public address is `/about`. Quant Studio publishes from the site's routes,
  // and the deploy action strips `index.html`, so both publish the same
  // address. `file` wrote `about.html`, which CI published as `/about.html`.
  build: {
    format: 'directory',
  },
  // The published address has no trailing slash, and every in-page link is
  // written without one. `never` makes the sitemap agree, so a crawler and a
  // click reach the same address and the CDN never has to redirect.
  trailingSlash: 'never',
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

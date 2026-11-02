# Astro Studio: Fieldwork

An editorial Astro starter for Quant Studio. Fieldwork is set like a journal printed in one ink: one colour on paper in light mode, reversed in dark mode, with the photographs as the only other colour. Posts and pages are typed content collections, and Quant Studio turns their schemas into its editing forms.

The sample content is a fictional journal called Fieldwork, with three essays, a few guide posts and an About page. Replace it with your own.

## Quick start

```bash
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). `npm run build` writes the static site to `dist/`.

## What's included

- **Home page** with a masthead, a lead story, an edition grid and a list of the rest
- **Journal index** at `/blog` and an **article layout** with a standfirst, a wide image, a drop cap and pull quotes
- **Pages** (`/about` and any page you add) at `/<slug>`
- **Markdown and MDX**, with a `Callout` component for notes set apart from the text
- **Light and dark themes** that follow the system setting, with a toggle; the choice is set before the first paint
- **Self-hosted fonts**: Fraunces for display and body text, Instrument Sans for the interface
- **Code blocks** highlighted in both themes (GitHub high-contrast light and dark)
- **RSS feed** at `/rss.xml`, **sitemap** at `/sitemap-index.xml` and **robots.txt**
- **OG images** rendered at build time for every page and post (satori and resvg), with the post photo when there is one
- **404 page**, draft posts, categories, reading time, a skip link, visible focus rings and reduced-motion support

## Content

Content lives in `src/content/` as Markdown and MDX with frontmatter. The schemas are in `src/content.config.ts`.

- **Posts** in `src/content/post/`, published at `/blog/<slug>`: title, description, date, updated, author, tags, draft, category, featured, readingTime, image
- **Pages** in `src/content/pages/`, published at `/<slug>`: title, description, image

Keep these two folders and their routes: Quant Studio's "Start from template" maps the `post` collection to `src/content/post` at `/blog/%slug%` and the `page` collection to `src/content/pages` at `/%slug%`.

### Site name and labels

`src/site.ts` holds the site name, tagline, description and locale, and the display labels for the `category` values (`news` shows as Dispatch, `guide` as Field guide, `tutorial` as How-to and `update` as Notes). Change the labels there; the schema values stay the same.

### Colours and type

The palette is two tokens, paper and ink, defined for each theme at the top of `src/styles/global.css`. Change those two values to recolour the whole site. The OG image colours are at the top of `src/pages/og/[...slug].png.ts`.

### Draft posts

Set `draft: true` to keep a post off the published site. A draft is left out of the listings, the RSS feed and the build, but you can still open and preview it in Quant Studio.

### MDX components

MDX posts can import Astro components. `Callout` takes a `type` (`info`, `tip`, `warning` or `note`) and an optional `title`. See `src/content/post/mdx-components.mdx`.

### Translations

The starter ships English only: `astro.config.mjs` sets `i18n.locales` to `['en']` with `prefixDefaultLocale: false`.

- **English content** sits flat at the collection root, for example `src/content/post/getting-started.md`, served at `/blog/getting-started`. Do not put it in an `en/` folder.
- **Another locale's content** goes in `src/content/<collection>/<locale>/`, for example `src/content/post/fr/getting-started.md`, served at `/fr/blog/getting-started`.
- **Add the locale** to `i18n.locales` in `astro.config.mjs`. That list is the one place to add a locale: `src/lib/i18n.ts` and Quant Studio both read it.

## OG images

`src/pages/og/[...slug].png.ts` renders a 1200 x 630 PNG for every page and post at build time, from static font files in `src/assets/og` (satori cannot read woff2). It reads files with `node:fs` rather than `node:fs/promises`, because Quant Studio's builder gives endpoints `node:fs` and `node:path` only. Keep it that way if you edit the route.

## Deploying to QuantCDN

1. Push this repository to GitHub.
2. Create a project in the [Quant dashboard](https://dashboard.quantcdn.io).
3. Add `QUANT_CUSTOMER` and `QUANT_PROJECT` as repository variables and `QUANT_TOKEN` as a secret.
4. Push to `main`. The GitHub Action builds the site and deploys it. Without the credentials it only verifies the build.

## Editing with Quant Studio

Connect the project to Quant Studio in the dashboard for a live preview with click-to-edit fields, schema-driven forms, MDX component previews, AI help with content and branch environments for drafts and review.

## Same design as the Quant Studio demo

This starter and the Quant Studio demo (`/studio/demo`, from `src/resources/studio-demo-template` in the portal) are one design with the same content. Change both together. The intended differences:

| | This starter | Studio demo |
|---|---|---|
| `build.format` | `directory` with `trailingSlash: 'never'`, so CI publishes clean addresses (`/about`) | `file` |
| RSS links | no trailing slash | trailing slash |
| Tooling | ESLint, Prettier, `quant.studio.json`, `quant/meta.json`, CI workflow, Dependabot | none (the portal copies the folder into each demo session) |

## Credits and licences

- Fonts: [Fraunces](https://github.com/undercasetype/Fraunces) and [Instrument Sans](https://github.com/Instrument/instrument-sans), SIL Open Font License 1.1. The licence texts are in `public/fonts/`. `src/assets/og` holds static instances of the same fonts for the OG images.
- Photographs in `public/images/` were generated for this starter. They show no people, text or brands.
- The writers named in the sample posts are fictional.

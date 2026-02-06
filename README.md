# Astro Studio Template

A content-driven Astro starter designed for Quant Studio. Blog posts and pages with typed schemas, Tailwind CSS, MDX support, dark mode, RSS feed, dynamic OG images, and more.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Features

- **Content collections** with typed Zod schemas (strings, dates, enums, booleans, numbers, arrays)
- **Markdown and MDX** support with custom components (Callout)
- **Tailwind CSS** with a clean, minimal theme and Inter font
- **Dark mode** with toggle and `prefers-color-scheme` detection
- **RSS feed** at `/rss.xml`
- **Dynamic OG images** generated at build time with Satori + Resvg
- **Automatic sitemap** and `robots.txt` generation
- **404 page** with navigation back to home
- **Draft posts** filtered from listings and feeds
- **Category badges** and reading time display on posts
- **SVG favicon** for crisp display at any size

## Content

Content lives in `src/data/` as markdown and MDX files with frontmatter:

- **Blog posts** in `src/data/post/` — title, description, date, author, tags, draft, category, featured, readingTime, image
- **Pages** in `src/data/pages/` — title, description

Schemas are defined in `src/content/config.ts` using Zod. Quant Studio reads these schemas to generate its visual editing interface.

### Categories

Posts support a `category` field with these options: `tutorial`, `news`, `guide`, `update`. Each displays as a coloured badge in listings and post headers.

### MDX components

MDX posts can import and use Astro components. The included `Callout` component supports four types: `info`, `tip`, `warning`, and `note`. See `src/data/post/mdx-components.mdx` for examples.

### Draft posts

Set `draft: true` in frontmatter to exclude a post from the blog listing and RSS feed. Draft posts are still built and can be previewed in Quant Studio.

## OG images

OG images are generated at build time for every page and post using Satori and Resvg. They use the site's accent colour palette with the post title rendered in Inter. No external image service needed.

## Deploying to QuantCDN

1. Push this repo to GitHub
2. Create a project in the [Quant dashboard](https://dashboard.quantcdn.io)
3. Add `QUANT_CUSTOMER`, `QUANT_PROJECT` as repository variables and `QUANT_TOKEN` as a secret
4. Push to `main` — the included GitHub Action builds and deploys automatically

## Editing with Quant Studio

Connect this project to Quant Studio in the dashboard to get:

- Visual preview with click-to-edit
- Schema-driven forms for frontmatter (dropdowns for enums, toggles for booleans, number inputs)
- MDX component rendering in preview
- AI content generation
- Branch environments for drafts and review

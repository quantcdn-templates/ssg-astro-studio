---
title: Getting started with Quant Studio
description: Set up your content workflow with Quant Studio and start publishing in minutes.
date: 2026-02-01
author: Team
tags:
  - getting-started
  - quant-studio
category: tutorial
featured: true
readingTime: 3
image: /images/placeholder.svg
---

Welcome to your new site powered by Quant Studio. This template gives you a clean starting point with blog posts and pages, all managed through a visual editor.

## What you get

- **Content collections** with typed schemas — every field is validated
- **Markdown and MDX** support for rich content
- **Tailwind CSS** with a clean, minimal theme
- **Dark mode** built in
- **Automatic sitemap** generation

## Writing content

Create new posts by adding markdown files to `src/data/post/`. Each post needs frontmatter with at least a `title`, `description`, and `date`.

```markdown
---
title: My new post
description: A short summary of the post.
date: 2026-02-07
tags:
  - example
---

Your content goes here.
```

Or use Quant Studio's visual editor to create and edit content directly in the browser — no code required.

## Deploying

Push to `main` and the included GitHub Action builds and deploys to QuantCDN automatically. Your site is live on a global CDN with automatic SSL.

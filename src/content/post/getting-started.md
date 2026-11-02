---
title: Start with one good page
description: How this journal is made, and how to make it yours. Edit a title, publish a post and put your site on a global CDN with Quant Studio.
date: 2026-10-30
author: The editors
tags:
  - getting-started
  - quant-studio
category: tutorial
readingTime: 3
image: /images/desk.jpg
---

Every publication worth reading started as one page that someone cared about. This starter gives you that page, and the structure around it: posts, pages, an RSS feed, social images and a theme that works in light and dark.

## What you get

- **Content collections** with typed schemas, so every field is checked when the site builds
- **Markdown and MDX** for rich content and reusable components
- **Tailwind CSS** with a typographic theme you can change in one file
- **Light and dark modes** that follow the reader's system setting
- **RSS, a sitemap and social images** made for every page

## Writing content

Open any post in Quant Studio and change it in the visual editor. The preview updates as you type. To add a post in code, put a Markdown file in `src/content/post/`. Each post needs at least a `title`, a `description` and a `date`.

```markdown
---
title: My new post
description: A short summary of the post.
date: 2026-11-01
tags:
  - example
---

Your content goes here.
```

## Making it yours

Change the name and tagline of the site in `src/site.ts`. The colours and fonts are in `src/styles/global.css`.

## Publishing

Publish from Quant Studio, or push to `main` and let the included workflow build and deploy the site to QuantCDN. Your pages go live on a global CDN with automatic SSL.

---
title: Why we chose Astro
description: Astro's content-first architecture makes it the ideal foundation for managed content sites.
date: 2026-01-20
author: Team
tags:
  - astro
  - architecture
category: guide
readingTime: 4
image: /images/blog-astro.jpeg
---

Astro is a web framework designed for content-driven websites. It ships zero JavaScript by default, generates static HTML at build time, and has first-class support for content collections with type-safe schemas.

## Content collections

Astro's content collections let you define schemas using Zod. Every piece of content is validated at build time — no surprises in production.

```typescript
const post = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});
```

This is exactly what Quant Studio reads to generate its editing interface. Your schema becomes the form.

## Static by default

Every page is pre-rendered to static HTML. No server to manage, no cold starts, no scaling concerns. Deploy to a CDN and you're done.

Combined with QuantCDN's global edge network, your site loads fast everywhere.

## MDX for rich content

When markdown isn't enough, MDX lets you embed components directly in your content. Interactive demos, custom callouts, data visualisations — all inline with your writing.

## The right trade-offs

Astro makes opinionated choices that align well with content sites:

- **Static first** — dynamic only when you need it
- **Framework agnostic** — use React, Vue, Svelte, or nothing
- **Content-native** — collections, schemas, and markdown are built in
- **Fast builds** — incremental where possible

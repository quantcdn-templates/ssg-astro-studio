---
title: Draft post example
description: This post is marked as draft and will not appear on the published site.
date: 2026-02-06
author: Team
tags:
  - example
category: update
draft: true
---

This post has `draft: true` in its frontmatter. It will not appear on the published site — no page is generated during the build, so nothing is deployed to QuantCDN.

You can still preview and edit this post in Quant Studio's visual editor, which renders content in the browser independently of the static build.

When you're ready to publish, change `draft` to `false` (or remove it entirely) and merge to main. The next build will generate and deploy the page.

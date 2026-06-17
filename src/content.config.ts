import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const post = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/post' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    author: z.string().default('Team'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    category: z.enum(['tutorial', 'news', 'guide', 'update']).optional(),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

const page = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
  }),
});

export const collections = { post, page };

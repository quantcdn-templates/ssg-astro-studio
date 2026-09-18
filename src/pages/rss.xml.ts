import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { slug, isDefaultLocale } from '../lib/i18n';

export async function GET(context: APIContext) {
  const posts = (await getCollection('post'))
    .filter((post) => !post.data.draft && isDefaultLocale(post))
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: 'Studio',
    description: 'A site built with Astro and Quant Studio.',
    site: context.site!,
    // The site's addresses carry no trailing slash (`trailingSlash: 'never'`),
    // so the feed must not add one.
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${slug(post.id)}`,
    })),
  });
}

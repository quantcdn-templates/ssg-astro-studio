import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { slug, isDefaultLocale } from '../lib/i18n';
import { site } from '../site';

// The feed is written here rather than with @astrojs/rss: Quant Studio's
// server-side builds do not load @astrojs/* packages from node_modules, so
// that helper produced no feed in a Studio publish. Links carry no trailing
// slash, like every address on this site (trailingSlash: 'never').

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const tag = (name: string, value: string) => `<${name}>${escapeXml(value)}</${name}>`;

export async function GET(context: APIContext) {
  const origin = context.site ?? new URL(context.url.origin);
  const posts = (await getCollection('post'))
    .filter((post) => !post.data.draft && isDefaultLocale(post))
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  const items = posts.map((post) => {
    const link = new URL(`/blog/${slug(post.id)}`, origin).href;
    return (
      '<item>' +
      tag('title', post.data.title) +
      tag('link', link) +
      `<guid isPermaLink="true">${escapeXml(link)}</guid>` +
      tag('description', post.data.description) +
      tag('pubDate', new Date(post.data.date).toUTCString()) +
      '</item>'
    );
  });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>' +
    tag('title', site.name) +
    tag('description', site.description) +
    tag('link', new URL('/', origin).href) +
    items.join('') +
    '</channel></rss>';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

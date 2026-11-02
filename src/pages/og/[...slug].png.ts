import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
// Plain node:fs, not node:fs/promises: Quant Studio's builder hands an endpoint
// node:fs and node:path (scoped to the project) and nothing else, so a
// node:fs/promises import left every OG image unrendered in a Studio publish.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { slug, entryLocale, isDefaultLocale, localePath } from '../../lib/i18n';
import { site, categoryLabel } from '../../site';

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = '#f5f6f2';
const INK = '#15306a';
const INK_SOFT = '#4a5f8c';

// Static font files for satori (it cannot read woff2). They sit in
// src/assets/og so the site does not serve them.
const FONT_DIR = join(process.cwd(), 'src/assets/og');

interface Props {
  title: string;
  kicker?: string;
  image?: string;
}

function loadFonts() {
  const [light, italic, sans] = ['fraunces-text.ttf', 'fraunces-italic.ttf', 'instrument-sans-medium.ttf'].map((file) =>
    readFileSync(join(FONT_DIR, file))
  );
  return [
    { name: 'Fraunces', data: light, weight: 300 as const, style: 'normal' as const },
    { name: 'Fraunces', data: italic, weight: 400 as const, style: 'italic' as const },
    { name: 'Instrument Sans', data: sans, weight: 500 as const, style: 'normal' as const },
  ];
}

/** A local /images/... path as a data URI, or undefined when there is no such file. */
function imageData(src?: string): string | undefined {
  if (!src || !src.startsWith('/')) return undefined;
  const file = join(process.cwd(), 'public', src);
  if (!existsSync(file)) return undefined;
  const type = src.endsWith('.png') ? 'image/png' : src.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  return `data:${type};base64,${readFileSync(file).toString('base64')}`;
}

function titleSize(title: string, narrow: boolean): number {
  const long = narrow ? 40 : 48;
  if (title.length > long * 1.5) return narrow ? 54 : 66;
  if (title.length > long) return narrow ? 62 : 80;
  return narrow ? 72 : 96;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('post');
  const pages = await getCollection('page');
  // Each other locale with a published post has a home and a blog page ([lang]/index, [lang]/blog).
  const otherLocales = [
    ...new Set(posts.filter((post) => !post.data.draft && !isDefaultLocale(post)).map((post) => entryLocale(post.id))),
  ];

  return [
    { params: { slug: 'home' }, props: { title: site.tagline, kicker: 'The journal' } },
    { params: { slug: 'blog' }, props: { title: 'The journal', kicker: 'Every story' } },
    { params: { slug: '404' }, props: { title: 'Page not found' } },
    ...otherLocales.flatMap((locale) => [
      { params: { slug: locale }, props: { title: site.tagline, kicker: 'The journal' } },
      { params: { slug: `${locale}/blog` }, props: { title: 'The journal', kicker: 'Every story' } },
    ]),
    // Match the path that Layout.astro requests: /og/<locale-prefixed path>.png
    ...posts.map((post) => ({
      params: { slug: localePath(`/blog/${slug(post.id)}`, entryLocale(post.id)).slice(1) },
      props: { title: post.data.title, kicker: categoryLabel(post.data.category), image: post.data.image },
    })),
    ...pages.map((page) => ({
      params: { slug: localePath(`/${slug(page.id)}`, entryLocale(page.id)).slice(1) },
      props: { title: page.data.title, image: page.data.image },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const { title, kicker, image } = props as Props;
  const fonts = loadFonts();
  const photo = imageData(image);
  const textWidth = photo ? 690 : WIDTH;

  const text = {
    type: 'div',
    props: {
      style: {
        // satori 0.34+ sizes boxes as a browser does (content-box by default),
        // so keep the padding inside this column's width and height.
        boxSizing: 'border-box',
        width: textWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px 60px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
            children: [
              { type: 'div', props: { style: { fontSize: 40, letterSpacing: -0.5 }, children: site.name } },
              kicker
                ? { type: 'div', props: { style: { fontSize: 30, fontStyle: 'italic', fontWeight: 400, color: INK_SOFT }, children: kicker } }
                : { type: 'div', props: { children: '' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { fontSize: titleSize(title, Boolean(photo)), lineHeight: 1.04, letterSpacing: -1, maxWidth: textWidth - 128 },
            children: title,
          },
        },
      ],
    },
  };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { width: '100%', height: '100%', display: 'flex', background: PAPER, color: INK, fontFamily: 'Fraunces', fontWeight: 300 },
        children: [
          text,
          photo
            ? { type: 'img', props: { src: photo, width: WIDTH - textWidth, height: HEIGHT, style: { objectFit: 'cover' } } }
            : { type: 'div', props: { children: '' } },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts }
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { slug, entryLocale, isDefaultLocale, localePath } from '../../lib/i18n';

const WIDTH = 1200;
const HEIGHT = 630;

async function loadFont(): Promise<ArrayBuffer> {
  // Fetch Inter font CSS with a browser UA to get woff2 URLs
  const response = await fetch(
    'https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
  );
  const css = await response.text();
  const fontUrl = css.match(/src: url\(([^)]+)\) format\('woff2'\)/)?.[1];
  if (!fontUrl) {
    // Fallback: fetch the truetype version
    const ttfResponse = await fetch(
      'https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap'
    );
    const ttfCss = await ttfResponse.text();
    const ttfUrl = ttfCss.match(/src: url\(([^)]+)\)/)?.[1];
    if (!ttfUrl) {
      throw new Error('Could not load Inter font');
    }
    const fontRes = await fetch(ttfUrl);
    return fontRes.arrayBuffer();
  }
  const fontResponse = await fetch(fontUrl);
  return fontResponse.arrayBuffer();
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('post');
  const pages = await getCollection('page');
  // Each other locale with a published post has a home and a blog page ([lang]/index, [lang]/blog).
  const otherLocales = [
    ...new Set(posts.filter((post) => !post.data.draft && !isDefaultLocale(post)).map((post) => entryLocale(post.id))),
  ];

  const paths = [
    { params: { slug: 'home' }, props: { title: 'Studio' } },
    { params: { slug: 'blog' }, props: { title: 'Blog' } },
    { params: { slug: '404' }, props: { title: 'Page not found' } },
    ...otherLocales.flatMap((locale) => [
      { params: { slug: locale }, props: { title: 'Studio' } },
      { params: { slug: `${locale}/blog` }, props: { title: 'Blog' } },
    ]),
    // Match the path that Layout.astro requests: /og/<locale-prefixed path>.png
    ...posts.map((post) => ({
      params: { slug: localePath(`/blog/${slug(post.id)}`, entryLocale(post.id)).slice(1) },
      props: { title: post.data.title },
    })),
    ...pages.map((page) => ({
      params: { slug: localePath(`/${slug(page.id)}`, entryLocale(page.id)).slice(1) },
      props: { title: page.data.title },
    })),
  ];

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { title } = props as { title: string };

  const fontData = await loadFont();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #4c6ef5 0%, #748ffc 50%, #91a7ff 100%)',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '40px',
                right: '60px',
                fontSize: '24px',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.7)',
              },
              children: 'Studio',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 40 ? '48px' : '64px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2,
                maxWidth: '900px',
              },
              children: title,
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal' as const,
        },
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: WIDTH },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

import type { APIRoute } from 'astro';

// robots.txt is a page route, not the astro-robots-txt integration: Quant Studio
// builds routes but does not run integration hooks, so an integration's
// robots.txt never reached a Studio publish. It also drops that package's zod 3.
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];
  if (site) lines.push(`Sitemap: ${new URL('sitemap-index.xml', site).href}`);
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

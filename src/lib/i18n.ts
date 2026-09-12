/**
 * i18n helpers for content collection routing.
 *
 * Default-locale content lives at the collection root (e.g.
 * src/content/post/getting-started.md), matching prefixDefaultLocale: false
 * in astro.config.mjs. Its entry IDs have no locale prefix, such as
 * "getting-started".
 *
 * Translations live in locale subdirectories, src/content/<collection>/<locale>/,
 * which produce entry IDs like "<locale>/getting-started".
 *
 * A subfolder is a locale ONLY when its name is in astro.config.mjs
 * i18n.locales. Every other subfolder is a nested section of the default
 * locale: src/content/pages/about/team.md builds at /about/team. The template
 * ships English only, so the [lang] routes build no pages until a configured
 * locale has a folder.
 */
import { i18n } from 'astro:config/client';

/** Default locale, read from astro.config.mjs i18n.defaultLocale. */
export const defaultLocale: string = i18n?.defaultLocale ?? 'en';

/** URL path segment of each configured locale (string or { path, codes }). */
const localeSegments = new Set<string>(
  (i18n?.locales ?? []).map((locale) => (typeof locale === 'string' ? locale : locale.path))
);

/** Return the first folder of an entry ID when it is a configured locale. */
function localePrefix(id: string): string | undefined {
  const first = id.split('/')[0];
  return id.includes('/') && localeSegments.has(first) ? first : undefined;
}

/** Strip the locale folder from a content collection entry ID. Sections stay. */
export function slug(id: string): string {
  const prefix = localePrefix(id);
  return prefix ? id.slice(prefix.length + 1) : id;
}

/** Extract the locale from a content collection entry ID. */
export function entryLocale(id: string): string {
  return localePrefix(id) ?? defaultLocale;
}

/** Keep only entries from the default locale (flat, nested sections, or en/). */
export function isDefaultLocale(entry: { id: string }): boolean {
  return entryLocale(entry.id) === defaultLocale;
}

/** Keep only entries matching a specific locale. */
export function isLocale(entry: { id: string }, locale: string): boolean {
  return entryLocale(entry.id) === locale;
}

/**
 * Prefix a path with a locale segment when it's not the default.
 *
 * localePath('/blog', 'en') → '/blog'
 * localePath('/blog', 'ja') → '/ja/blog'
 */
export function localePath(path: string, locale?: string | null): string {
  if (!locale || locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

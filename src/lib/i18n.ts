/**
 * i18n helpers for content collection routing.
 *
 * Default-locale content lives at the collection root (e.g.
 * src/content/post/getting-started.md), matching prefixDefaultLocale: false
 * in astro.config.mjs. Its entry IDs have no locale prefix, such as
 * "getting-started".
 *
 * Translations live in locale subdirectories, src/content/<collection>/<locale>/,
 * which produce entry IDs like "<locale>/getting-started". Each locale must
 * also be listed in astro.config.mjs i18n.locales. The template ships English
 * only, so the [lang] routes build no pages until a locale folder exists.
 * These helpers extract the slug and locale portions, and build locale-aware
 * URLs.
 */

/** Default locale — must match astro.config.mjs i18n.defaultLocale */
export const defaultLocale = 'en';

/** Strip the locale prefix from a content collection entry ID. */
export function slug(id: string): string {
  const i = id.indexOf('/');
  return i === -1 ? id : id.slice(i + 1);
}

/** Extract the locale from a content collection entry ID. */
export function entryLocale(id: string): string {
  const i = id.indexOf('/');
  return i === -1 ? defaultLocale : id.slice(0, i);
}

/** Keep only entries from the default locale (or flat/unlocalized entries). */
export function isDefaultLocale(entry: { id: string }): boolean {
  if (!entry.id.includes('/')) return true;
  return entry.id.startsWith(defaultLocale + '/');
}

/** Keep only entries matching a specific locale. */
export function isLocale(entry: { id: string }, locale: string): boolean {
  if (locale === defaultLocale) return isDefaultLocale(entry);
  return entry.id.startsWith(locale + '/');
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

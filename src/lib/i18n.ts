/**
 * i18n helpers for content collection routing.
 *
 * Content collections with locale subdirectories (e.g. src/content/post/en/)
 * produce entry IDs like "en/getting-started". These helpers extract the slug
 * and locale portions, and build locale-aware URLs.
 *
 * When content is flat (no locale subdirs), IDs have no prefix and are treated
 * as the default locale automatically.
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

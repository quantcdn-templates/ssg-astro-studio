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
 *
 * astro.config.mjs is the one place that lists the locales. This file reads
 * it as text (a `?raw` import), because the real Astro build and the Quant
 * Studio preview both load `?raw`, while the preview only stubs
 * `astro:config/client`. Studio reads and writes the same `locales: [...]`
 * list. The parser ignores comments, reads only the top-level `i18n` key of
 * the object passed to defineConfig(), and counts only string locales. When
 * it cannot read that block with certainty, the site is English only.
 */
import astroConfigSource from '../../astro.config.mjs?raw';

interface LocaleConfig {
  defaultLocale: string;
  locales: string[];
}

/** The safe result when the i18n block cannot be read with certainty. */
const ENGLISH_ONLY: LocaleConfig = { defaultLocale: 'en', locales: ['en'] };

/** A string literal (group 1) or a comment. Strings match first, so `//` in a URL stays. */
const STRING_OR_COMMENT = /("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
const STRING = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/g;
const OPEN = '{[(';
const CLOSE = '}])';

/** The source with each comment blanked to spaces. Every index stays the same. */
function blankComments(source: string): string {
  return source.replace(STRING_OR_COMMENT, (match, literal) => literal ?? match.replace(/[^\n]/g, ' '));
}

/** The text with the contents of each string blanked to "_". Quotes and indices stay. */
function blankStrings(text: string): string {
  return text.replace(STRING, (literal) => literal[0] + '_'.repeat(literal.length - 2) + literal[0]);
}

/** Index of the bracket that closes the bracket at `open`, or -1. */
function closeOf(masked: string, open: number): number {
  let depth = 0;
  for (let i = open; i < masked.length; i++) {
    if (OPEN.includes(masked[i])) depth++;
    else if (CLOSE.includes(masked[i]) && --depth === 0) return i;
  }
  return -1;
}

/** The body of the bracket at `open`, with nested bracket contents blanked. Indices stay. */
function topLevelOf(masked: string, open: number, close: number): string {
  let depth = 0;
  let out = ' '.repeat(open + 1);
  for (let i = open + 1; i < close; i++) {
    if (CLOSE.includes(masked[i])) depth--;
    out += depth > 0 ? ' ' : masked[i];
    if (OPEN.includes(masked[i])) depth++;
  }
  return out;
}

/** Index where the value of the top-level `key` starts, in the object at `open`, or -1. */
function valueIndex(masked: string, open: number, key: string): number {
  const close = masked[open] === '{' ? closeOf(masked, open) : -1;
  if (close < 0) return -1;
  const matches = [...topLevelOf(masked, open, close).matchAll(new RegExp(`[\\s,]${key}\\s*:\\s*`, 'g'))];
  const last = matches[matches.length - 1];
  return last ? last.index + last[0].length : -1;
}

/** The quoted string that starts at `index`, or null. */
function stringAt(text: string, masked: string, index: number): string | null {
  const quote = masked[index];
  const end = quote === "'" || quote === '"' ? masked.indexOf(quote, index + 1) : -1;
  return end < 0 ? null : text.slice(index + 1, end);
}

/** The top-level string entries of the array that starts at `index`, or null. */
function stringsAt(text: string, masked: string, index: number): string[] | null {
  const close = masked[index] === '[' ? closeOf(masked, index) : -1;
  if (close < 0) return null;
  return [...topLevelOf(masked, index, close).matchAll(/(["'])_*\1/g)].map((match) =>
    text.slice(match.index + 1, match.index + match[0].length - 1)
  );
}

/** Index of the `{` of `defineConfig({ i18n: { ... } })`, or -1. */
function i18nIndex(masked: string): number {
  const config = /\bdefineConfig\s*\(\s*\{/.exec(masked);
  if (!config) return -1;
  const at = valueIndex(masked, config.index + config[0].length - 1, 'i18n');
  return masked[at] === '{' ? at : -1;
}

/** Read the default locale and the string locales from astro.config.mjs source. */
function readLocaleConfig(source: string): LocaleConfig {
  const text = blankComments(source);
  const masked = blankStrings(text);
  const i18n = i18nIndex(masked);
  const defaultLocale = stringAt(text, masked, valueIndex(masked, i18n, 'defaultLocale'));
  const locales = stringsAt(text, masked, valueIndex(masked, i18n, 'locales'));
  if (!defaultLocale || !locales?.includes(defaultLocale)) return ENGLISH_ONLY;
  return { defaultLocale, locales };
}

const localeConfig = readLocaleConfig(astroConfigSource);

/** Default locale, read from astro.config.mjs i18n.defaultLocale. */
export const defaultLocale: string = localeConfig.defaultLocale;

/** Every locale listed in astro.config.mjs i18n.locales. */
export const locales: readonly string[] = localeConfig.locales;

const localeSegments = new Set<string>(locales);

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

/** The locale of a URL path ("/fr.html", "/fr/blog"): its first segment when that is a locale. */
export function pathLocale(pathname: string): string {
  const first = pathname.replace(/^\/+/, '').split('/')[0].replace(/\.html$/, '');
  return localeSegments.has(first) ? first : defaultLocale;
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

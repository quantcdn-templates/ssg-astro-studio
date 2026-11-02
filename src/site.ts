/**
 * Site-wide settings. Change these to make the starter your own.
 * The layout, RSS feed and OG images all read from here.
 */
export const site = {
  name: 'Fieldwork',
  tagline: 'A journal of places, craft and careful work',
  description:
    'Fieldwork is an independent journal about places, craft and the people who make things with care. Published with Astro and Quant Studio.',
  locale: 'en-AU',
};

/**
 * Display names for the post `category` field. The schema keeps its four
 * values (tutorial, news, guide, update); only the labels change here.
 */
export const categoryLabels: Record<string, string> = {
  news: 'Dispatch',
  guide: 'Field guide',
  tutorial: 'How-to',
  update: 'Notes',
};

export function categoryLabel(category?: string): string | undefined {
  return category ? categoryLabels[category] ?? category : undefined;
}

export function formatDate(date: Date | string, style: 'long' | 'short' = 'long'): string {
  return new Date(date).toLocaleDateString(site.locale, {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

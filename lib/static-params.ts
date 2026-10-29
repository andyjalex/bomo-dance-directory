/**
 * With cacheComponents enabled, Next.js requires generateStaticParams to
 * return at least one entry, or the build fails outright — not just for
 * that route, the whole build. Every dynamic route here already calls
 * notFound() when a slug doesn't match, so a placeholder that never matches
 * a real item safely 404s if a collection is ever empty (e.g. no confirmed
 * events booked in yet) instead of breaking the site.
 */
export const EMPTY_COLLECTION_PLACEHOLDER = "__none__";

export function withPlaceholder<K extends string>(
  key: K,
  params: Record<K, string>[]
): Record<K, string>[] {
  if (params.length > 0) return params;
  return [{ [key]: EMPTY_COLLECTION_PLACEHOLDER } as Record<K, string>];
}

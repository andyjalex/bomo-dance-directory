import rawListings from "@/data/listings.json";
import { DAY_ORDER, type DayName, type Listing, type StyleRef } from "./types";

export { DAY_ORDER };
export type { DayName, Listing, StyleRef };

const ALL_LISTINGS = rawListings as Listing[];

/**
 * The data layer is intentionally isolated here: swap the JSON import above
 * for a CMS/database call later and every page keeps working unchanged.
 */
export function getConfirmedListings(): Listing[] {
  return ALL_LISTINGS.filter((listing) => listing.status === "Confirmed");
}

export function getListingBySlug(slug: string): Listing | undefined {
  return getConfirmedListings().find((listing) => listing.slug === slug);
}

export function getListingsByStyleSlug(styleSlug: string): Listing[] {
  return getConfirmedListings().filter((listing) =>
    listing.styles.some((style) => style.slug === styleSlug)
  );
}

export function getListingsByVenueSlug(venueSlug: string): Listing[] {
  return getConfirmedListings().filter(
    (listing) => listing.venueSlug === venueSlug
  );
}

export function getListingsByProviderSlug(providerSlug: string): Listing[] {
  return getConfirmedListings().filter(
    (listing) => listing.providerSlug === providerSlug
  );
}

export interface VenueRef {
  name: string;
  slug: string;
  town: string;
}

export function getAllStyles(): StyleRef[] {
  const refs = new Map<string, StyleRef>();
  const counts = new Map<string, number>();
  for (const listing of getConfirmedListings()) {
    for (const style of listing.styles) {
      if (!refs.has(style.slug)) refs.set(style.slug, style);
      counts.set(style.slug, (counts.get(style.slug) ?? 0) + 1);
    }
  }
  // Most classes first, alphabetical as a tiebreaker.
  return [...refs.values()].sort((a, b) => {
    const byCount = (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0);
    return byCount !== 0 ? byCount : a.name.localeCompare(b.name);
  });
}

export function getStyleByStyleSlug(styleSlug: string): StyleRef | undefined {
  return getAllStyles().find((style) => style.slug === styleSlug);
}

export function getAllVenues(): VenueRef[] {
  const map = new Map<string, VenueRef>();
  for (const listing of getConfirmedListings()) {
    if (!listing.venue || !listing.venueSlug) continue;
    if (!map.has(listing.venueSlug)) {
      map.set(listing.venueSlug, {
        name: listing.venue,
        slug: listing.venueSlug,
        town: listing.town,
      });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getVenueBySlug(venueSlug: string): VenueRef | undefined {
  return getAllVenues().find((venue) => venue.slug === venueSlug);
}

export function getAllLevels(): string[] {
  const set = new Set<string>();
  for (const listing of getConfirmedListings()) {
    if (listing.level) set.add(listing.level);
  }
  return [...set].sort();
}

export function groupByDay(listings: Listing[]): Map<DayName, Listing[]> {
  const grouped = new Map<DayName, Listing[]>();
  for (const day of DAY_ORDER) grouped.set(day, []);
  for (const listing of listings) {
    if (!listing.day) continue;
    grouped.get(listing.day)?.push(listing);
  }
  for (const day of DAY_ORDER) {
    grouped.get(day)?.sort((a, b) => (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"));
  }
  return grouped;
}

export function normalizeWebsiteUrl(website: string): string {
  if (/^https?:\/\//i.test(website)) return website;
  return `https://${website}`;
}

/** Shorter display form for level values that read better as a card label. */
export function formatLevel(level: string): string {
  return level === "Social / freestyle" ? "Social" : level;
}

/** Joins card detail parts, dropping a venue that just repeats the provider name. */
export function joinCardDetails(
  provider: string,
  venue: string | null,
  ...rest: (string | null)[]
): string {
  const venuePart = venue && venue !== provider ? venue : null;
  return [provider, venuePart, ...rest].filter(Boolean).join(" · ");
}

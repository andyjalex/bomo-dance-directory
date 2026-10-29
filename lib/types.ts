export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayName = (typeof DAY_ORDER)[number];

// "Example" is a non-publishing status for template/demo rows — never
// shown on the site, same as "To verify" and "Inactive".
export type ListingStatus = "Confirmed" | "To verify" | "Inactive" | "Example";

export interface StyleRef {
  name: string;
  slug: string;
}

export interface Listing {
  id: string;
  slug: string;
  provider: string;
  providerSlug: string;
  className: string;
  styles: StyleRef[];
  day: DayName | null;
  startTime: string | null;
  venue: string | null;
  venueShort: string | null;
  venueSlug: string | null;
  town: string;
  level: string | null;
  price: string | null;
  website: string | null;
  status: ListingStatus;
  notes: string | null;
  /** Specific weekly occurrences (YYYY-MM-DD) where this class doesn't run. */
  cancelledDates: string[];
}

export interface EventListing {
  id: string;
  slug: string;
  title: string;
  provider: string;
  providerSlug: string;
  styles: StyleRef[];
  startDate: string; // YYYY-MM-DD, Europe/London
  startTime: string | null;
  endDate: string | null; // YYYY-MM-DD, defaults to startDate when absent
  endTime: string | null;
  venue: string | null;
  venueShort: string | null;
  venueSlug: string | null;
  town: string;
  price: string | null;
  ticketUrl: string | null;
  description: string | null;
  image: string | null;
  featured: boolean;
  status: ListingStatus;
}

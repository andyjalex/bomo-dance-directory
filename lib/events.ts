import rawEvents from "@/data/events.json";
import { formatMonthLabel } from "./dates";
import type { EventListing, StyleRef } from "./types";

export type { EventListing };

const ALL_EVENTS = rawEvents as EventListing[];

/**
 * data/events.json is already limited to events that hadn't finished as of
 * the last import run (see scripts/import-events.ts) — this only applies
 * the same "Confirmed" publishing gate the weekly classes use.
 */
export function getConfirmedEvents(): EventListing[] {
  return ALL_EVENTS.filter((event) => event.status === "Confirmed").sort(
    (a, b) => a.startDate.localeCompare(b.startDate)
  );
}

export function getEventBySlug(slug: string): EventListing | undefined {
  return getConfirmedEvents().find((event) => event.slug === slug);
}

export function getEventsByStyleSlug(styleSlug: string): EventListing[] {
  return getConfirmedEvents().filter((event) =>
    event.styles.some((style) => style.slug === styleSlug)
  );
}

export function getEventsByVenueSlug(venueSlug: string): EventListing[] {
  return getConfirmedEvents().filter((event) => event.venueSlug === venueSlug);
}

export function getEventsByProviderSlug(providerSlug: string): EventListing[] {
  return getConfirmedEvents().filter(
    (event) => event.providerSlug === providerSlug
  );
}

export function getAllEventStyles(): StyleRef[] {
  const refs = new Map<string, StyleRef>();
  const counts = new Map<string, number>();
  for (const event of getConfirmedEvents()) {
    for (const style of event.styles) {
      if (!refs.has(style.slug)) refs.set(style.slug, style);
      counts.set(style.slug, (counts.get(style.slug) ?? 0) + 1);
    }
  }
  return [...refs.values()].sort((a, b) => {
    const byCount = (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0);
    return byCount !== 0 ? byCount : a.name.localeCompare(b.name);
  });
}

/** Next `limit` events, featured ones first, then soonest first. */
export function getUpcomingEventsForHome(limit = 6): EventListing[] {
  return getConfirmedEvents()
    .slice()
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.startDate.localeCompare(b.startDate);
    })
    .slice(0, limit);
}

export function groupEventsByMonth(
  events: EventListing[]
): { label: string; events: EventListing[] }[] {
  const sorted = [...events].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const order: string[] = [];
  const groups = new Map<string, EventListing[]>();
  for (const event of sorted) {
    const label = formatMonthLabel(event.startDate);
    if (!groups.has(label)) {
      groups.set(label, []);
      order.push(label);
    }
    groups.get(label)?.push(event);
  }
  return order.map((label) => ({ label, events: groups.get(label) ?? [] }));
}

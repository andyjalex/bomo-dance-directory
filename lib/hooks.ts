"use client";

import { useEffect, useState } from "react";
import { getLondonTodayISO } from "./dates";
import type { EventListing } from "./types";

/**
 * Re-filters an already build-time-filtered event list against the
 * visitor's real clock, so an event that finished earlier today (between
 * the last rebuild and this page view) disappears without waiting for the
 * next build. Pre-hydration this just returns `events` unchanged, matching
 * the static HTML so there's no mismatch.
 */
export function useUpcomingEvents(events: EventListing[]): EventListing[] {
  const [todayISO, setTodayISO] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayISO(getLondonTodayISO());
  }, []);

  if (!todayISO) return events;
  return events.filter((event) => (event.endDate ?? event.startDate) >= todayISO);
}

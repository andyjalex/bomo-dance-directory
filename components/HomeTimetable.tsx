"use client";

import { useMemo, useState } from "react";
import FilterBar, { type Filters } from "./FilterBar";
import Timetable from "./Timetable";
import type { EventListing, Listing, StyleRef } from "@/lib/types";

export default function HomeTimetable({
  listings,
  events,
  styles,
  levels,
}: {
  listings: Listing[];
  events: EventListing[];
  styles: StyleRef[];
  levels: string[];
}) {
  const [filters, setFilters] = useState<Filters>({
    style: "all",
    level: "all",
    day: "all",
  });

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (
        filters.style !== "all" &&
        !listing.styles.some((s) => s.slug === filters.style)
      ) {
        return false;
      }
      if (filters.level !== "all" && listing.level !== filters.level) {
        return false;
      }
      if (filters.day !== "all" && listing.day !== filters.day) {
        return false;
      }
      return true;
    });
  }, [listings, filters]);

  const filteredEvents = useMemo(() => {
    if (filters.style === "all") return events;
    return events.filter((event) =>
      event.styles.some((s) => s.slug === filters.style)
    );
  }, [events, filters.style]);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <FilterBar
          styles={styles}
          levels={levels}
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <div className="mt-6">
        <Timetable listings={filteredListings} events={filteredEvents} />
      </div>
    </div>
  );
}

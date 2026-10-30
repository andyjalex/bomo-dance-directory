"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import { groupEventsByMonth } from "@/lib/events";
import { useUpcomingEvents } from "@/lib/hooks";
import { getStyleColor } from "@/lib/style-colors";
import type { EventListing, StyleRef } from "@/lib/types";

export default function EventsPageClient({
  events,
  styles,
}: {
  events: EventListing[];
  styles: StyleRef[];
}) {
  const [styleFilter, setStyleFilter] = useState("all");
  const upcoming = useUpcomingEvents(events);

  const filtered = useMemo(() => {
    if (styleFilter === "all") return upcoming;
    return upcoming.filter((event) =>
      event.styles.some((s) => s.slug === styleFilter)
    );
  }, [upcoming, styleFilter]);

  const months = useMemo(() => groupEventsByMonth(filtered), [filtered]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStyleFilter("all")}
          aria-pressed={styleFilter === "all"}
          className="rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors"
          style={
            styleFilter === "all"
              ? { backgroundColor: "var(--color-navy)", borderColor: "var(--color-navy)", color: "#fff" }
              : { borderColor: "var(--color-navy)", color: "var(--color-navy)" }
          }
        >
          All styles
        </button>
        {styles.map((style) => {
          const color = getStyleColor(style.slug);
          const active = styleFilter === style.slug;
          return (
            <button
              key={style.slug}
              type="button"
              onClick={() => setStyleFilter(style.slug)}
              aria-pressed={active}
              className="rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors"
              style={
                active
                  ? { backgroundColor: color, borderColor: color, color: "#fff" }
                  : { borderColor: color, color }
              }
            >
              {style.name}
            </button>
          );
        })}
      </div>

      {months.length === 0 ? (
        <p className="mt-8 text-muted">
          Nothing booked in yet — check back soon, or{" "}
          <Link href="/list-your-class" className="underline hover:text-sea">
            tell us about an event
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-10">
          {months.map((month) => (
            <section key={month.label}>
              <h2 className="font-display text-2xl font-semibold text-navy">
                {month.label}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {month.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

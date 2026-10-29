"use client";

import Link from "next/link";
import EventCard from "./EventCard";
import { useUpcomingEvents } from "@/lib/hooks";
import type { EventListing } from "@/lib/types";

export default function ComingUpEvents({ events }: { events: EventListing[] }) {
  const upcoming = useUpcomingEvents(events);

  if (upcoming.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-semibold text-navy">
          Coming up
        </h2>
        <Link href="/events" className="text-sm font-semibold text-sea hover:underline">
          See all events
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
        {upcoming.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

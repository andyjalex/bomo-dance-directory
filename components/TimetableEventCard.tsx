import Link from "next/link";
import StyleTag from "./StyleTag";
import { joinCardDetails } from "@/lib/listings";
import type { EventListing } from "@/lib/types";

export default function TimetableEventCard({ event }: { event: EventListing }) {
  const venue = event.venueShort ?? event.venue;
  const detailLine = joinCardDetails(event.provider, venue);

  return (
    <article className="rounded-xl bg-coral-tint p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-lg font-extrabold tabular-nums text-coral-text">
          {event.startTime ?? (
            <span className="text-sm font-semibold text-muted">Time TBC</span>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-coral-text px-2.5 py-0.5 text-xs font-bold leading-none text-white">
            Event
          </span>
          {event.styles.map((style) => (
            <StyleTag key={style.slug} style={style} />
          ))}
        </div>
      </div>

      <h3 className="mt-2 font-bold leading-snug text-navy">
        <Link href={`/events/${event.slug}`} className="hover:text-sea">
          {event.title}
        </Link>
      </h3>
      <p className="mt-0.5 text-sm text-muted">{detailLine}</p>
    </article>
  );
}

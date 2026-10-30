import Link from "next/link";
import FeaturedBadge from "./FeaturedBadge";
import StyleTag from "./StyleTag";
import { getDateBadgeParts } from "@/lib/dates";
import { joinCardDetails } from "@/lib/listings";
import type { EventListing } from "@/lib/types";

export default function EventCard({ event }: { event: EventListing }) {
  const venue = event.venueShort ?? event.venue;
  const detailLine = joinCardDetails(event.provider, venue, event.price);
  const badge = getDateBadgeParts(event.startDate, event.endDate);

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-coral-tint px-1 py-2 text-center">
        {badge.weekday ? (
          <span className="text-[11px] font-bold uppercase tracking-wide text-coral-text">
            {badge.weekday}
          </span>
        ) : null}
        <span className="font-display text-2xl font-bold leading-tight text-coral-text">
          {badge.dayLabel}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-coral-text">
          {badge.month}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {event.styles.map((style) => (
            <StyleTag key={style.slug} style={style} />
          ))}
          {event.featured ? <FeaturedBadge /> : null}
        </div>
        <h3 className="mt-1.5 font-bold leading-snug text-navy">
          <Link href={`/events/${event.slug}`} className="hover:text-sea">
            {event.title}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-muted">{detailLine}</p>
      </div>
    </article>
  );
}

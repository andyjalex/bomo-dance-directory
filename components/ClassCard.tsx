import Link from "next/link";
import StyleTag from "./StyleTag";
import { formatLevel, joinCardDetails } from "@/lib/listings";
import type { Listing } from "@/lib/types";

export default function ClassCard({ listing }: { listing: Listing }) {
  const isSocial = listing.level?.toLowerCase().includes("social") ?? false;
  const venue = listing.venueShort ?? listing.venue;
  const detailLine = joinCardDetails(
    listing.provider,
    venue,
    listing.level ? formatLevel(listing.level) : null
  );

  return (
    <article
      className={`rounded-xl p-4 ${isSocial ? "bg-coral-tint" : "bg-surface-muted"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`text-lg font-extrabold tabular-nums ${
            isSocial ? "text-coral-text" : "text-navy"
          }`}
        >
          {listing.startTime ?? (
            <span className="text-sm font-semibold text-muted">
              Time TBC
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          {listing.styles.map((style) => (
            <StyleTag key={style.slug} style={style} />
          ))}
        </div>
      </div>

      <h3 className="mt-2 font-bold leading-snug text-navy">
        <Link href={`/classes/${listing.slug}`} className="hover:text-sea">
          {listing.className}
        </Link>
      </h3>
      <p className="mt-0.5 text-sm text-muted">{detailLine}</p>
    </article>
  );
}

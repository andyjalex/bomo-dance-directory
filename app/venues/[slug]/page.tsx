import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Timetable from "@/components/Timetable";
import {
  getAllVenues,
  getListingsByVenueSlug,
  getVenueBySlug,
} from "@/lib/listings";
import { getEventsByVenueSlug } from "@/lib/events";
import { withPlaceholder } from "@/lib/static-params";

export function generateStaticParams() {
  return withPlaceholder(
    "slug",
    getAllVenues().map((venue) => ({ slug: venue.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) return {};

  return {
    title: `Dance Classes at ${venue.name}, ${venue.town}`,
    description: `See every weekly dance class running at ${venue.name} in ${venue.town} — days, times, styles and levels.`,
    alternates: { canonical: `/venues/${venue.slug}` },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const listings = getListingsByVenueSlug(venue.slug);
  const events = getEventsByVenueSlug(venue.slug);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: venue.name, path: `/venues/${venue.slug}` },
        ]}
      />
      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        {venue.name}
      </h1>
      <p className="mt-2 text-lg text-muted">{venue.town}</p>

      <div className="mt-8">
        <Timetable listings={listings} events={events} />
      </div>
    </div>
  );
}

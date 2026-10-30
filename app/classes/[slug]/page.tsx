import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClassCard from "@/components/ClassCard";
import JsonLd from "@/components/JsonLd";
import StyleTag from "@/components/StyleTag";
import LevelTag from "@/components/LevelTag";
import {
  getConfirmedListings,
  getListingBySlug,
  getListingsByProviderSlug,
  getListingsByVenueSlug,
  normalizeWebsiteUrl,
} from "@/lib/listings";
import { eventSeriesForListing } from "@/lib/structured-data";
import { withPlaceholder } from "@/lib/static-params";

export function generateStaticParams() {
  return withPlaceholder(
    "slug",
    getConfirmedListings().map((listing) => ({ slug: listing.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};

  const styleNames = listing.styles.map((s) => s.name).join(" & ");
  const title = `${listing.className} — ${styleNames} ${
    listing.day ? `on ${listing.day}s` : ""
  } in ${listing.town}`;
  const description = `${listing.className} with ${listing.provider}${
    listing.day ? `, ${listing.day}s` : ""
  }${listing.startTime ? ` at ${listing.startTime}` : ""}${
    listing.venue ? ` at ${listing.venue}` : ""
  }, ${listing.town}. ${listing.level ? `Level: ${listing.level}.` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: `/classes/${listing.slug}` },
  };
}

export default async function ClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListingBySlug(slug);
  if (!listing) notFound();

  const sameVenue = listing.venueSlug
    ? getListingsByVenueSlug(listing.venueSlug).filter(
        (l) => l.id !== listing.id
      )
    : [];
  const sameProvider = getListingsByProviderSlug(listing.providerSlug).filter(
    (l) => l.id !== listing.id
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <JsonLd data={eventSeriesForListing(listing)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: listing.styles[0]?.name ?? "Classes", path: `/${listing.styles[0]?.slug ?? ""}` },
          { name: listing.className, path: `/classes/${listing.slug}` },
        ]}
      />

      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        {listing.className}
      </h1>
      <p className="mt-2 text-lg text-muted">
        {listing.provider} · {listing.town}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {listing.styles.map((style) => (
          <StyleTag key={style.slug} style={style} />
        ))}
        {listing.level ? <LevelTag level={listing.level} /> : null}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-muted p-5 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Day</dt>
          <dd className="mt-0.5 font-semibold text-navy">{listing.day ?? "TBC"}</dd>
        </div>
        <div>
          <dt className="text-muted">Time</dt>
          <dd className="mt-0.5 font-semibold text-navy">
            {listing.startTime ?? "TBC"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Venue</dt>
          <dd className="mt-0.5 font-semibold text-navy">{listing.venue ?? "TBC"}</dd>
        </div>
        <div>
          <dt className="text-muted">Price</dt>
          <dd className="mt-0.5 font-semibold text-navy">{listing.price ?? "See website"}</dd>
        </div>
      </dl>

      {listing.notes ? (
        <p className="mt-6 text-sm text-muted">{listing.notes}</p>
      ) : null}

      {listing.website ? (
        <a
          href={normalizeWebsiteUrl(listing.website)}
          target="_blank"
          rel="noopener"
          className="mt-8 inline-flex items-center rounded-full bg-sea px-6 py-3 font-semibold text-white hover:bg-sea-dark"
        >
          Visit website
        </a>
      ) : null}

      {sameVenue.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-navy">
            Also at {listing.venue}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {sameVenue.map((l) => (
              <ClassCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      ) : null}

      {sameProvider.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-navy">
            More from {listing.provider}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {sameProvider.map((l) => (
              <ClassCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12 text-sm text-muted">
        Spotted something wrong?{" "}
        <Link href="/list-your-class" className="underline hover:text-sea">
          Let us know
        </Link>
        .
      </p>
    </div>
  );
}

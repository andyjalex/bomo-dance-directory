import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventCard from "@/components/EventCard";
import FeaturedBadge from "@/components/FeaturedBadge";
import JsonLd from "@/components/JsonLd";
import StyleTag from "@/components/StyleTag";
import {
  getConfirmedEvents,
  getEventBySlug,
  getEventsByProviderSlug,
} from "@/lib/events";
import { normalizeWebsiteUrl } from "@/lib/listings";
import { formatFullDate } from "@/lib/dates";
import { eventStructuredData } from "@/lib/structured-data";
import { googleMapsUrl } from "@/lib/site";
import { withPlaceholder } from "@/lib/static-params";

export function generateStaticParams() {
  return withPlaceholder(
    "slug",
    getConfirmedEvents().map((event) => ({ slug: event.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const styleNames = event.styles.map((s) => s.name).join(" & ");
  const dateLabel = formatFullDate(event.startDate);

  return {
    title: `${event.title} — ${styleNames} ${dateLabel} in ${event.town}`,
    description:
      event.description ??
      `${event.title} with ${event.provider} on ${dateLabel}${event.venue ? ` at ${event.venue}` : ""}, ${event.town}.`,
    alternates: { canonical: `/events/${event.slug}` },
  };
}

function dateRangeLabel(startDate: string, endDate: string | null): string {
  if (!endDate || endDate === startDate) return formatFullDate(startDate);
  return `${formatFullDate(startDate)} – ${formatFullDate(endDate)}`;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const otherEvents = getEventsByProviderSlug(event.providerSlug).filter(
    (e) => e.id !== event.id
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <JsonLd data={eventStructuredData(event)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          { name: event.title, path: `/events/${event.slug}` },
        ]}
      />

      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        {event.title}
      </h1>
      <p className="mt-2 text-lg text-muted">
        {event.provider} · {event.town}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {event.styles.map((style) => (
          <StyleTag key={style.slug} style={style} />
        ))}
        {event.featured ? <FeaturedBadge /> : null}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-muted p-5 text-sm sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-2">
          <dt className="text-muted">Date</dt>
          <dd className="mt-0.5 font-semibold text-navy">
            {dateRangeLabel(event.startDate, event.endDate)}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Time</dt>
          <dd className="mt-0.5 font-semibold text-navy">
            {event.startTime ?? "TBC"}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Price</dt>
          <dd className="mt-0.5 font-semibold text-navy">
            {event.price ?? "See tickets"}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-4">
          <dt className="text-muted">Venue</dt>
          <dd className="mt-0.5 font-semibold text-navy">
            {event.venue ?? "TBC"}
          </dd>
        </div>
      </dl>

      {event.description ? (
        <p className="mt-6 text-muted">{event.description}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {event.ticketUrl ? (
          <a
            href={normalizeWebsiteUrl(event.ticketUrl)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center rounded-full bg-sea px-6 py-3 font-semibold text-white hover:bg-sea-dark"
          >
            Get tickets
          </a>
        ) : null}
        {event.venue ? (
          <a
            href={googleMapsUrl(event.venue, event.town)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center rounded-full border-2 border-navy px-6 py-3 font-semibold text-navy hover:bg-navy hover:text-white"
          >
            View on map
          </a>
        ) : null}
      </div>

      {otherEvents.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-navy">
            More from {event.provider}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {otherEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

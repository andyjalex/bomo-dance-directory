import { absoluteUrl, SITE_NAME } from "./site";
import { normalizeWebsiteUrl, type Listing } from "./listings";
import type { EventListing } from "./types";

const SCHEMA_DAY: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function eventSeriesForListing(listing: Listing) {
  const location = listing.venue
    ? {
        "@type": "Place",
        name: listing.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: listing.town,
          addressCountry: "GB",
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: `${listing.className} (${listing.provider})`,
    eventSchedule: listing.day
      ? {
          "@type": "Schedule",
          byDay: SCHEMA_DAY[listing.day],
          startTime: listing.startTime ?? undefined,
          repeatFrequency: "P1W",
          scheduleTimezone: "Europe/London",
        }
      : undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    organizer: {
      "@type": "Organization",
      name: listing.provider,
      url: listing.website ? normalizeWebsiteUrl(listing.website) : undefined,
    },
    offers: listing.price
      ? {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        }
      : undefined,
    url: absoluteUrl(`/classes/${listing.slug}`),
    description: `${listing.className} — ${listing.styles
      .map((s) => s.name)
      .join(", ")} class${listing.day ? ` on ${listing.day}s` : ""} in ${
      listing.town
    }, run by ${listing.provider}.`,
  };
}

export function eventStructuredData(event: EventListing) {
  const startDateTime = event.startTime
    ? `${event.startDate}T${event.startTime}`
    : event.startDate;
  const endDateTime = event.endDate
    ? event.endTime
      ? `${event.endDate}T${event.endTime}`
      : event.endDate
    : event.endTime
      ? `${event.startDate}T${event.endTime}`
      : undefined;

  const location = event.venue
    ? {
        "@type": "Place",
        name: event.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: event.town,
          addressCountry: "GB",
        },
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: startDateTime,
    endDate: endDateTime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    image: event.image ?? undefined,
    description:
      event.description ??
      `${event.title} — ${event.styles.map((s) => s.name).join(", ")} event in ${event.town}, run by ${event.provider}.`,
    offers:
      event.price || event.ticketUrl
        ? {
            "@type": "Offer",
            price: event.price ?? undefined,
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
            url: event.ticketUrl ? normalizeWebsiteUrl(event.ticketUrl) : undefined,
          }
        : undefined,
    organizer: {
      "@type": "Organization",
      name: event.provider,
    },
    url: absoluteUrl(`/events/${event.slug}`),
  };
}

export function faqPageData(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function websiteData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  };
}

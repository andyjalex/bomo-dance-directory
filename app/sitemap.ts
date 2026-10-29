import type { MetadataRoute } from "next";
import {
  getAllStyles,
  getAllVenues,
  getConfirmedListings,
} from "@/lib/listings";
import { getConfirmedEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

// A fixed build-time date (rather than new Date()) keeps this route fully
// static — the actual date doesn't matter to search engines here, only
// that the URLs are listed.
const BUILD_DATE = new Date("2026-01-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/faq", "/list-your-class", "/events"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: BUILD_DATE,
    })
  );

  const styleRoutes = getAllStyles().map((style) => ({
    url: `${SITE_URL}/${style.slug}`,
    lastModified: BUILD_DATE,
  }));

  const venueRoutes = getAllVenues().map((venue) => ({
    url: `${SITE_URL}/venues/${venue.slug}`,
    lastModified: BUILD_DATE,
  }));

  const classRoutes = getConfirmedListings().map((listing) => ({
    url: `${SITE_URL}/classes/${listing.slug}`,
    lastModified: BUILD_DATE,
  }));

  const eventRoutes = getConfirmedEvents().map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified: BUILD_DATE,
  }));

  return [
    ...staticRoutes,
    ...styleRoutes,
    ...venueRoutes,
    ...classRoutes,
    ...eventRoutes,
  ];
}

/**
 * Converts data/events-source.csv into data/events.json.
 * Run via: npm run import-events
 *
 * Only "Confirmed" events ever reach the site (lib/events.ts filters on
 * status), but events whose effective end date has already passed — as of
 * whenever this script runs, in Europe/London time — are dropped here too,
 * so a daily rebuild keeps past events out of the sitemap. See the README
 * for wiring up a daily rebuild.
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import { clean, makeUniqueSlug, slugify, splitStyles, toBoolean, toStatus } from "./shared";
import { getLondonTodayISO } from "../lib/dates";
import type { EventListing } from "../lib/types";

const SOURCE_PATH = join(__dirname, "..", "data", "events-source.csv");
const OUTPUT_PATH = join(__dirname, "..", "data", "events.json");

interface SourceRow {
  id: string;
  title: string;
  provider: string;
  style: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  venueShort: string;
  town: string;
  price: string;
  ticketUrl: string;
  description: string;
  image: string;
  featured: string;
  status: string;
}

function main() {
  const csv = readFileSync(SOURCE_PATH, "utf-8");
  const rows: SourceRow[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  const usedSlugs = new Set<string>();
  const todayISO = getLondonTodayISO();

  const allEvents: EventListing[] = rows.map((row) => {
    const provider = row.provider.trim();
    const title = row.title.trim();
    const venue = clean(row.venue);
    const baseSlug = slugify(`${provider}-${title}`);

    const event: EventListing = {
      id: row.id.trim(),
      slug: makeUniqueSlug(baseSlug, usedSlugs, row.id),
      title,
      provider,
      providerSlug: slugify(provider),
      styles: splitStyles(row.style),
      startDate: row.startDate.trim(),
      startTime: clean(row.startTime),
      endDate: clean(row.endDate),
      endTime: clean(row.endTime),
      venue,
      venueShort: clean(row.venueShort) ?? venue,
      venueSlug: venue ? slugify(venue) : null,
      town: row.town.trim(),
      price: clean(row.price),
      ticketUrl: clean(row.ticketUrl),
      description: clean(row.description),
      image: clean(row.image),
      featured: toBoolean(row.featured),
      status: toStatus(row.status.trim()),
    };

    return event;
  });

  // Build-time exclusion: drop anything whose last day has already gone by.
  // Non-"Confirmed" rows (Example / To verify / Inactive) are kept in the
  // written JSON but never published — lib/events.ts filters on status at
  // runtime, so they still never render or get a page either way.
  const isPast = (event: EventListing) =>
    (event.endDate ?? event.startDate) < todayISO;

  const upcoming = allEvents.filter((event) => !isPast(event));
  const past = allEvents.filter(isPast);
  const published = upcoming.filter((event) => event.status === "Confirmed");
  const unpublished = upcoming.filter((event) => event.status !== "Confirmed");

  writeFileSync(OUTPUT_PATH, JSON.stringify(upcoming, null, 2) + "\n");

  if (past.length > 0) {
    console.warn(`\nExcluded ${past.length} past event(s) (by date):`);
    for (const event of past) {
      console.warn(`  - ${event.id} "${event.title}" (ended ${event.endDate ?? event.startDate})`);
    }
  }

  if (unpublished.length > 0) {
    console.warn(
      `\nExcluded ${unpublished.length} upcoming event(s) (status is not "Confirmed" — never published):`
    );
    for (const event of unpublished) {
      console.warn(`  - ${event.id} "${event.title}" (status: ${event.status})`);
    }
  }

  console.log(
    `\nWrote ${upcoming.length} upcoming events (${published.length} confirmed) to ${OUTPUT_PATH}`
  );
}

main();

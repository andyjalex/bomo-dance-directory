/**
 * Converts data/listings-source.csv into data/listings.json.
 * Run via: npm run import-listings
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import {
  clean,
  makeUniqueSlug,
  slugify,
  splitDates,
  splitStyles,
  toDayName,
  toStatus,
} from "./shared";
import type { Listing } from "../lib/types";

const SOURCE_PATH = join(__dirname, "..", "data", "listings-source.csv");
const OUTPUT_PATH = join(__dirname, "..", "data", "listings.json");

interface SourceRow {
  ID: string;
  Provider: string;
  "Class name / detail": string;
  Style: string;
  Day: string;
  "Start time": string;
  Venue: string;
  "Venue short": string;
  Town: string;
  Level: string;
  "Price (£)": string;
  "Website / contact": string;
  Source: string;
  Status: string;
  Notes: string;
  "Cancelled dates": string;
}

function main() {
  const csv = readFileSync(SOURCE_PATH, "utf-8");
  const rows: SourceRow[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  const usedSlugs = new Set<string>();

  const listings: Listing[] = rows.map((row) => {
    const provider = row.Provider.trim();
    const className = row["Class name / detail"].trim();
    const venue = clean(row.Venue);
    const baseSlug = slugify(`${provider}-${className}`);

    const listing: Listing = {
      id: row.ID.trim(),
      slug: makeUniqueSlug(baseSlug, usedSlugs, row.ID),
      provider,
      providerSlug: slugify(provider),
      className,
      styles: splitStyles(row.Style),
      day: toDayName(clean(row.Day)),
      startTime: clean(row["Start time"]),
      venue,
      venueShort: clean(row["Venue short"]) ?? venue,
      venueSlug: venue ? slugify(venue) : null,
      town: row.Town.trim(),
      level: clean(row.Level),
      price: clean(row["Price (£)"]),
      website: clean(row["Website / contact"]),
      status: toStatus(row.Status.trim()),
      notes: clean(row.Notes),
      cancelledDates: splitDates(row["Cancelled dates"]),
    };

    return listing;
  });

  writeFileSync(OUTPUT_PATH, JSON.stringify(listings, null, 2) + "\n");

  const confirmed = listings.filter((l) => l.status === "Confirmed").length;
  console.log(
    `Wrote ${listings.length} listings (${confirmed} confirmed) to ${OUTPUT_PATH}`
  );
}

main();

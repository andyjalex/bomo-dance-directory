/**
 * Shared helpers for the import scripts (import-listings.ts, import-events.ts).
 * Keeping CSV-parsing logic here so both scripts stay in sync.
 */
import { slugify } from "../lib/slug";
import { DAY_ORDER, type DayName, type ListingStatus, type StyleRef } from "../lib/types";

export { slugify };

export function clean(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toDayName(value: string | null): DayName | null {
  if (!value) return null;
  const match = DAY_ORDER.find(
    (day) => day.toLowerCase() === value.toLowerCase()
  );
  if (!match) {
    throw new Error(`Unrecognised day: "${value}"`);
  }
  return match;
}

export function toStatus(value: string | null): ListingStatus {
  if (
    value === "Confirmed" ||
    value === "To verify" ||
    value === "Inactive" ||
    value === "Example"
  ) {
    return value;
  }
  throw new Error(`Unrecognised status: "${value}"`);
}

export function splitStyles(value: string): StyleRef[] {
  return value
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({ name, slug: slugify(name) }));
}

export function splitDates(value: string | undefined): string[] {
  const trimmed = value?.trim();
  if (!trimmed) return [];
  return trimmed
    .split(",")
    .map((date) => date.trim())
    .filter(Boolean);
}

export function toBoolean(value: string | undefined): boolean {
  return (value ?? "").trim().toLowerCase() === "true";
}

export function makeUniqueSlug(base: string, used: Set<string>, id: string): string {
  let candidate = base;
  if (used.has(candidate)) {
    candidate = `${base}-${slugify(id)}`;
  }
  used.add(candidate);
  return candidate;
}

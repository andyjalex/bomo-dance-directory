import { DAY_ORDER, type DayName } from "./types";

export interface CalendarDay {
  day: DayName;
  /** YYYY-MM-DD, Europe/London. */
  date: string;
  /** e.g. "13 Oct". */
  dateLabel: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const ISO_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London",
});

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "long",
});

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
});

function toCalendarDay(date: Date): CalendarDay {
  return {
    day: WEEKDAY_FORMATTER.format(date) as DayName,
    date: ISO_FORMATTER.format(date),
    dateLabel: DATE_LABEL_FORMATTER.format(date),
  };
}

/** Today's date (YYYY-MM-DD) in Europe/London. Uses the real clock — safe in
 * plain Node scripts, and in client components inside an effect, but never
 * during Next.js page rendering (the build treats `new Date()` reached there
 * as an unstable value). */
export function getLondonTodayISO(): string {
  return ISO_FORMATTER.format(new Date());
}

/** The Monday–Sunday block `weekOffset` weeks from the current calendar week
 * (0 = this week, 1 = next week, …), in Europe/London. Uses the real clock —
 * client-only, call from an effect. */
export function getCalendarWeek(weekOffset: number): CalendarDay[] {
  const now = new Date();
  const todayIndex = DAY_ORDER.indexOf(WEEKDAY_FORMATTER.format(now) as DayName);
  const monday = new Date(now.getTime() + (weekOffset * 7 - todayIndex) * DAY_MS);
  return Array.from({ length: 7 }, (_, i) => toCalendarDay(new Date(monday.getTime() + i * DAY_MS)));
}

function shortWeekday(dateISO: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
  })
    .format(new Date(`${dateISO}T12:00:00Z`))
    .toUpperCase();
}

function dayNumber(dateISO: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
  }).format(new Date(`${dateISO}T12:00:00Z`));
}

function shortMonth(dateISO: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    month: "short",
  })
    .format(new Date(`${dateISO}T12:00:00Z`))
    .toUpperCase();
}

export interface DateBadgeParts {
  /** null for multi-day events — a single weekday wouldn't make sense. */
  weekday: string | null;
  /** "7" for a single day, "7–8" for a multi-day event. */
  dayLabel: string;
  month: string;
}

/** Calendar-block date badge parts (weekday / big day number / month).
 * Deterministic — safe to call during server rendering. */
export function getDateBadgeParts(
  startDate: string,
  endDate: string | null
): DateBadgeParts {
  if (endDate && endDate !== startDate) {
    return {
      weekday: null,
      dayLabel: `${dayNumber(startDate)}–${dayNumber(endDate)}`,
      month: shortMonth(startDate),
    };
  }
  return {
    weekday: shortWeekday(startDate),
    dayLabel: dayNumber(startDate),
    month: shortMonth(startDate),
  };
}

/** Formats a YYYY-MM-DD string as e.g. "Sat, 17 Oct". Deterministic — safe
 * to call during server rendering. */
export function formatShortDate(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

/** Formats a YYYY-MM-DD string as e.g. "7 November 2026". Deterministic —
 * safe to call during server rendering. */
export function formatFullDate(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Formats a YYYY-MM-DD string as e.g. "November 2026". Deterministic — safe
 * to call during server rendering. */
export function formatMonthLabel(dateISO: string): string {
  const date = new Date(`${dateISO}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    month: "long",
    year: "numeric",
  }).format(date);
}

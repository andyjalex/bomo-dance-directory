"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ClassCard from "./ClassCard";
import TimetableEventCard from "./TimetableEventCard";
import { groupByDay } from "@/lib/listings";
import { getCalendarWeek, getLondonTodayISO, type CalendarDay } from "@/lib/dates";
import { DAY_ORDER, type EventListing, type Listing } from "@/lib/types";

type WeekOffset = 0 | 1 | 2;

const WEEK_OPTIONS: { value: WeekOffset; label: string }[] = [
  { value: 0, label: "This week" },
  { value: 1, label: "Next week" },
  { value: 2, label: "Week after" },
];

// Column width (300px) + gap (gap-5 = 20px), used both for the CSS and for
// how far one arrow-button click scrolls.
const COLUMN_STEP_PX = 320;

function WeekSelector({
  value,
  onChange,
}: {
  value: WeekOffset;
  onChange: (value: WeekOffset) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {WEEK_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
            value === option.value
              ? "border-navy bg-navy text-white"
              : "border-navy/25 text-navy hover:border-navy"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

type DayItem =
  | { kind: "class"; key: string; sortKey: string; listing: Listing }
  | { kind: "event"; key: string; sortKey: string; event: EventListing };

export default function Timetable({
  listings,
  events = [],
}: {
  listings: Listing[];
  events?: EventListing[];
}) {
  const grouped = groupByDay(listings);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventListing[]>();
    for (const event of events) {
      const list = map.get(event.startDate) ?? [];
      list.push(event);
      map.set(event.startDate, list);
    }
    return map;
  }, [events]);

  const [weekOffset, setWeekOffset] = useState<WeekOffset>(0);

  // Real dates only exist client-side — null here matches the server-rendered
  // HTML (no dates, no "today" highlight) so hydration doesn't mismatch.
  const [week, setWeek] = useState<CalendarDay[] | null>(null);
  const [todayISO, setTodayISO] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeek(getCalendarWeek(weekOffset));
    setTodayISO(getLondonTodayISO());
  }, [weekOffset]);

  const days: CalendarDay[] =
    week ?? DAY_ORDER.map((day) => ({ day, date: "", dateLabel: "" }));

  const visibleDays = days
    .map((calendarDay) => {
      const classItems = (grouped.get(calendarDay.day) ?? []).filter(
        (listing) =>
          !calendarDay.date || !listing.cancelledDates.includes(calendarDay.date)
      );
      const eventItems = calendarDay.date
        ? eventsByDate.get(calendarDay.date) ?? []
        : [];

      const items: DayItem[] = [
        ...classItems.map((listing) => ({
          kind: "class" as const,
          key: listing.id,
          sortKey: listing.startTime ?? "99:99",
          listing,
        })),
        ...eventItems.map((event) => ({
          kind: "event" as const,
          key: event.id,
          sortKey: event.startTime ?? "99:99",
          event,
        })),
      ].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

      return {
        ...calendarDay,
        items,
        isToday: calendarDay.date !== "" && calendarDay.date === todayISO,
      };
    })
    .filter((day) => day.items.length > 0);

  const todayColumnRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ canLeft: false, canRight: false });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollState({
      canLeft: el.scrollLeft > 4,
      canRight: el.scrollLeft < el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  useEffect(() => {
    todayColumnRef.current?.scrollIntoView({ inline: "start", block: "nearest" });
    updateScrollState();
  }, [week, weekOffset, updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  function scrollByColumn(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * COLUMN_STEP_PX, behavior: "smooth" });
  }

  return (
    <div>
      <WeekSelector value={weekOffset} onChange={setWeekOffset} />

      {visibleDays.length === 0 ? (
        <p className="text-muted">
          Nothing matches right now — try a different filter, a different
          week, or check back soon.
        </p>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-5 lg:flex lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:pb-3"
          >
            {visibleDays.map((day) => (
              <section
                key={day.day}
                ref={day.isToday ? todayColumnRef : undefined}
                aria-label={day.day}
                className={`rounded-2xl bg-surface p-5 lg:w-[300px] lg:shrink-0 lg:snap-start ${
                  day.isToday ? "border-2 border-coral" : "border border-border"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-[26px] font-bold text-navy">
                    {day.day}
                    {day.dateLabel ? (
                      <span className="ml-2 font-body text-sm font-normal text-muted">
                        {day.dateLabel}
                      </span>
                    ) : null}
                  </h2>
                  {day.isToday ? (
                    <span className="shrink-0 rounded-full bg-coral-text px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                      Tonight
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  {day.items.map((item) =>
                    item.kind === "class" ? (
                      <ClassCard key={item.key} listing={item.listing} />
                    ) : (
                      <TimetableEventCard key={item.key} event={item.event} />
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {scrollState.canRight ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-linear-to-l from-background to-transparent lg:block"
            />
          ) : null}

          {scrollState.canLeft ? (
            <button
              type="button"
              onClick={() => scrollByColumn(-1)}
              aria-label="Scroll to earlier days"
              className="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full border border-border bg-surface p-2 text-navy shadow-md hover:bg-surface-muted lg:flex"
            >
              <ChevronIcon direction="left" />
            </button>
          ) : null}

          {scrollState.canRight ? (
            <button
              type="button"
              onClick={() => scrollByColumn(1)}
              aria-label="Scroll to later days"
              className="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full border border-border bg-surface p-2 text-navy shadow-md hover:bg-surface-muted lg:flex"
            >
              <ChevronIcon direction="right" />
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

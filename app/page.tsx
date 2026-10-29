import type { Metadata } from "next";
import ComingUpEvents from "@/components/ComingUpEvents";
import HomeTimetable from "@/components/HomeTimetable";
import {
  getAllLevels,
  getAllStyles,
  getConfirmedListings,
} from "@/lib/listings";
import { getConfirmedEvents } from "@/lib/events";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Salsa, Bachata & Dance Classes in Bournemouth`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const listings = getConfirmedListings();
  const events = getConfirmedEvents();
  const styles = getAllStyles();
  const levels = getAllLevels();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <section className="flex flex-col gap-8 rounded-[32px] bg-sea p-8 sm:p-12 lg:flex-row lg:items-center lg:gap-10">
        <div className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-coral-tint">
            Bournemouth · Poole · Christchurch
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
            Dance classes on the south coast, by night.
          </h1>
          <p className="mt-4 text-lg text-white">
            Salsa, bachata, kizomba and modern jive. See what&apos;s on this
            week and find a class that welcomes beginners.
          </p>
        </div>
        <div className="flex min-h-48 flex-1 items-center justify-center rounded-2xl border border-dashed border-white/40 bg-sea-dark p-6 text-center text-sm text-white/70 lg:min-h-64">
          [Photo: dancers at a seafront venue at sunset]
        </div>
      </section>

      <section className="mt-10">
        <h2 className="sr-only">This week&apos;s classes</h2>
        <HomeTimetable
          listings={listings}
          events={events}
          styles={styles}
          levels={levels}
        />
      </section>

      <ComingUpEvents events={events} />
    </div>
  );
}

import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventsPageClient from "@/components/EventsPageClient";
import { getAllEventStyles, getConfirmedEvents } from "@/lib/events";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dance Events & Workshops",
  description:
    "One-off salsa, bachata, kizomba and modern jive workshops, socials and congresses in Bournemouth, Poole and Christchurch.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const events = getConfirmedEvents();
  const styles = getAllEventStyles();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Events", path: "/events" }]} />

      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        Dance events & workshops
      </h1>
      <p className="mt-3 text-lg text-muted">
        One-off socials, workshops and congresses from {SITE_NAME}&apos;s
        listed providers — on top of their regular weekly classes.
      </p>

      <div className="mt-8">
        <EventsPageClient events={events} styles={styles} />
      </div>
    </div>
  );
}

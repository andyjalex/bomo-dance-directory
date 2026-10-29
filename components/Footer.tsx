import Link from "next/link";
import { getAllStyles, getAllVenues } from "@/lib/listings";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export default function Footer() {
  const styles = getAllStyles();
  const venues = getAllVenues();

  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3 sm:px-8">
        <div>
          <p className="font-display text-lg font-extrabold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-white/70">
            Weekly social dance classes across Bournemouth, Poole and
            Christchurch.
          </p>
        </div>

        <div id="styles">
          <p className="text-sm font-bold uppercase tracking-wide text-white/50">
            Styles
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {styles.map((style) => (
              <li key={style.slug}>
                <Link href={`/${style.slug}`} className="hover:text-coral-tint">
                  {style.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="venues">
          <p className="text-sm font-bold uppercase tracking-wide text-white/50">
            Venues
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm">
            {venues.map((venue) => (
              <li key={venue.slug}>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="hover:text-coral-tint"
                >
                  {venue.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/15 px-5 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Run a class we&apos;re missing?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-coral-tint">
            Get in touch
          </a>
          .
        </p>
        <p>&copy; {SITE_NAME}</p>
      </div>
    </footer>
  );
}

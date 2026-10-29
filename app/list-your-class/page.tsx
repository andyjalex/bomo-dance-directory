import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "List Your Class",
  description:
    "Run a salsa, bachata, kizomba or modern jive class in Bournemouth, Poole or Christchurch? Get listed on Bournemouth Dance for free.",
  alternates: { canonical: "/list-your-class" },
};

export default function ListYourClassPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "List your class", path: "/list-your-class" },
        ]}
      />

      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        List your class
      </h1>
      <p className="mt-4 text-lg text-muted">
        {SITE_NAME} is a free listings page for weekly social dance classes
        in Bournemouth, Poole and Christchurch. If you run a class — salsa,
        bachata, kizomba, modern jive or anything else people turn up to
        dance at — we&apos;d like to list it.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface-muted p-6">
        <h2 className="font-display text-xl font-semibold text-navy">
          Email us to get listed
        </h2>
        <p className="mt-2 text-muted">
          Send the class name, style, day and start time, venue and
          address, level (if it&apos;s beginner-specific), price, and a link
          to your website or booking page to:
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-4 inline-flex items-center rounded-full bg-sea px-6 py-3 font-semibold text-white hover:bg-sea-dark"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <p className="mt-8 text-sm text-muted">
        Already listed and something&apos;s changed — new venue, new time,
        class has stopped running? Use the same address and we&apos;ll
        update it.
      </p>
    </div>
  );
}

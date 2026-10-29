import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Timetable from "@/components/Timetable";
import {
  getAllStyles,
  getListingsByStyleSlug,
  getStyleByStyleSlug,
} from "@/lib/listings";
import { getEventsByStyleSlug } from "@/lib/events";
import { withPlaceholder } from "@/lib/static-params";

const STYLE_INTROS: Record<string, string> = {
  salsa:
    "Salsa is a partner dance built on fast footwork and a strong shared rhythm, danced to Latin and Afro-Cuban music. Most Bournemouth classes open with a beginner-friendly breakdown before moving into partnerwork, so you can turn up solo and still follow along.",
  bachata:
    "Bachata is a slower, close-connection partner dance from the Dominican Republic — easier to pick up in your first few classes than salsa, with more emphasis on timing and lead-follow connection than fast footwork.",
  kizomba:
    "Kizomba is a smooth, grounded partner dance from Angola, known for its close embrace and walking-based steps. Urban Kiz, often taught alongside it in the same class, adds sharper, more angular movement to the same connection.",
  "modern-jive":
    "Modern jive (often taught as Ceroc) is a beginner-friendly partner dance with no fixed step pattern to memorise — you learn a handful of moves and lead or follow through them, which makes it one of the easiest styles to start completely from scratch.",
  ceroc:
    "Ceroc is a branded style of modern jive — a beginner-friendly partner dance with no fixed step pattern to memorise, so you learn a handful of moves and lead or follow through them from your very first class.",
};

export function generateStaticParams() {
  return withPlaceholder(
    "style",
    getAllStyles().map((style) => ({ style: style.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style: styleSlug } = await params;
  const style = getStyleByStyleSlug(styleSlug);
  if (!style) return {};

  return {
    title: `${style.name} Classes in Bournemouth`,
    description: `Weekly ${style.name} classes in Bournemouth, Poole and Christchurch — days, times, venues and levels, kept up to date.`,
    alternates: { canonical: `/${style.slug}` },
  };
}

export default async function StylePage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style: styleSlug } = await params;
  const style = getStyleByStyleSlug(styleSlug);
  if (!style) notFound();

  const listings = getListingsByStyleSlug(style.slug);
  const events = getEventsByStyleSlug(style.slug);
  const intro =
    STYLE_INTROS[style.slug] ??
    `Weekly ${style.name} classes in Bournemouth, Poole and Christchurch.`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: style.name, path: `/${style.slug}` },
        ]}
      />
      <h1 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
        {style.name} Classes in Bournemouth
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{intro}</p>

      <div className="mt-8">
        <Timetable listings={listings} events={events} />
      </div>
    </div>
  );
}

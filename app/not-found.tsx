import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
      <h1 className="font-display text-3xl font-bold text-navy">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        That class or page doesn&apos;t exist — it may have moved or stopped
        running.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-sea-dark"
      >
        See this week&apos;s classes
      </Link>
    </div>
  );
}

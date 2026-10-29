import Link from "next/link";

function LogoMark() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2 19c2.5-5 5.5-5 8-0.5s5.5 4.5 8-0.5 5.5-5 8-0.5"
        stroke="var(--color-sea)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="7" r="3.5" fill="var(--color-coral)" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-lg font-extrabold leading-none text-navy sm:text-xl">
            Bournemouth Dance
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold text-navy sm:gap-6">
          <Link href="/events" className="hover:text-sea">
            Events
          </Link>
          <Link href="/#styles" className="hidden hover:text-sea sm:inline">
            Styles
          </Link>
          <Link href="/#venues" className="hidden hover:text-sea sm:inline">
            Venues
          </Link>
          <Link href="/faq" className="hidden hover:text-sea sm:inline">
            FAQ
          </Link>
          <Link
            href="/list-your-class"
            className="whitespace-nowrap rounded-full bg-navy px-3 py-1.5 text-xs text-white hover:bg-sea-dark sm:px-4 sm:py-2 sm:text-sm"
          >
            List your class
          </Link>
        </nav>
      </div>
    </header>
  );
}

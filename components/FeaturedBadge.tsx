export default function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-coral px-2.5 py-0.5 text-xs font-bold leading-none text-coral-text">
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6z" />
      </svg>
      Featured
    </span>
  );
}

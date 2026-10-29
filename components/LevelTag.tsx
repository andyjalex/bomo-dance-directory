import { formatLevel } from "@/lib/listings";

export default function LevelTag({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-sm font-semibold leading-none text-navy">
      {formatLevel(level)}
    </span>
  );
}

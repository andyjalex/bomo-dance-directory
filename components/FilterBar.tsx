"use client";

import { DAY_ORDER, type StyleRef } from "@/lib/types";
import { getStyleColor } from "@/lib/style-colors";
import { formatLevel } from "@/lib/listings";

export interface Filters {
  style: string;
  level: string;
  day: string;
}

function StyleChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors"
      style={
        active
          ? { backgroundColor: color, borderColor: color, color: "#fff" }
          : { backgroundColor: "transparent", borderColor: color, color }
      }
    >
      {label}
    </button>
  );
}

export default function FilterBar({
  styles,
  levels,
  filters,
  onChange,
}: {
  styles: StyleRef[];
  levels: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const selectClass =
    "rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-navy";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <StyleChip
          label="All styles"
          color="var(--color-navy)"
          active={filters.style === "all"}
          onClick={() => onChange({ ...filters, style: "all" })}
        />
        {styles.map((style) => (
          <StyleChip
            key={style.slug}
            label={style.name}
            color={getStyleColor(style.slug)}
            active={filters.style === style.slug}
            onClick={() => onChange({ ...filters, style: style.slug })}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-muted">
          Level
          <select
            className={selectClass}
            value={filters.level}
            onChange={(e) => onChange({ ...filters, level: e.target.value })}
          >
            <option value="all">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {formatLevel(level)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-semibold text-muted">
          Day
          <select
            className={selectClass}
            value={filters.day}
            onChange={(e) => onChange({ ...filters, day: e.target.value })}
          >
            <option value="all">Any day</option>
            {DAY_ORDER.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

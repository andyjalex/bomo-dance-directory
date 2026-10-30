const STYLE_COLOR_VARS: Record<string, string> = {
  salsa: "var(--color-salsa)",
  bachata: "var(--color-bachata)",
  kizomba: "var(--color-kizomba)",
  "modern-jive": "var(--color-modern-jive)",
  ceroc: "var(--color-modern-jive)",
  swing: "var(--color-swing)",
  tango: "var(--color-tango)",
};

const FALLBACK = "var(--color-navy)";

export function getStyleColor(slug: string): string {
  return STYLE_COLOR_VARS[slug] ?? FALLBACK;
}

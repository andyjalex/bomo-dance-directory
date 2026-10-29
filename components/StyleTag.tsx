import Link from "next/link";
import type { StyleRef } from "@/lib/types";
import { getStyleColor } from "@/lib/style-colors";

export default function StyleTag({
  style,
  as = "link",
}: {
  style: StyleRef;
  as?: "link" | "span";
}) {
  const color = getStyleColor(style.slug);
  const className =
    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold leading-none text-white transition-opacity hover:opacity-85";
  const styleAttr = { backgroundColor: color };

  if (as === "span") {
    return (
      <span className={className} style={styleAttr}>
        {style.name}
      </span>
    );
  }

  return (
    <Link href={`/${style.slug}`} className={className} style={styleAttr}>
      {style.name}
    </Link>
  );
}

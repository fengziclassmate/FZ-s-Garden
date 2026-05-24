import Link from "next/link";
import { contentHref, contentTypeLabels } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import type { GardenContent } from "@/lib/types";

export function TimelineList({ items }: { items: GardenContent[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={`${item.type}-${item.slug}`} className="grid gap-4 rounded-[1.25rem] border border-line bg-surface/72 p-4 md:grid-cols-[140px_1fr]">
          <div className="text-sm text-muted-ink">
            <p>{formatDate(item.date)}</p>
            <p className="mt-1 text-xs text-clay">{contentTypeLabels[item.type]}</p>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">
              <Link href={contentHref(item)}>{item.title}</Link>
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-ink">{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

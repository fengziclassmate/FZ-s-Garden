import Link from "next/link";
import { groupByTag } from "@/lib/archive";
import { contentHref } from "@/lib/content";
import type { GardenContent } from "@/lib/types";

export function ArchiveByTag({ items }: { items: GardenContent[] }) {
  const groups = groupByTag(items);
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {Object.entries(groups).map(([tag, tagItems]) => (
        <div key={tag} className="rounded-[1.4rem] border border-line bg-surface/78 p-5 shadow-[var(--shadow-note)]">
          <h2 className="font-display text-3xl font-semibold text-ink">#{tag}</h2>
          <div className="mt-4 space-y-2 text-sm text-muted-ink">
            {tagItems.map((item) => (
              <Link key={`${item.type}-${item.slug}`} href={contentHref(item)} className="block hover:text-ink">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

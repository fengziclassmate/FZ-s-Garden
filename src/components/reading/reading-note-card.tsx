import Link from "next/link";
import { TagList } from "@/components/content/tag-list";
import { contentHref } from "@/lib/content";
import type { GardenContent, ReadingContent } from "@/lib/types";

export function ReadingNoteCard({ item }: { item: GardenContent }) {
  const reading = item as ReadingContent;
  return (
    <article className="rounded-[1.5rem] border border-line bg-surface/86 p-5 shadow-[var(--shadow-note)] transition hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-ink">
        <span className="rounded-full bg-surface-soft px-3 py-1">{reading.itemType ?? "note"}</span>
        {reading.year ? <span>{reading.year}</span> : null}
        {reading.importance ? <span>· {reading.importance}</span> : null}
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">
        <Link href={contentHref(item)}>{item.title}</Link>
      </h2>
      {reading.authors?.length ? <p className="mt-2 text-sm text-muted-ink">{reading.authors.join(", ")}</p> : null}
      <p className="mt-4 rounded-2xl bg-surface-soft/65 p-4 font-note text-sm leading-7 text-ink">{reading.oneLine ?? item.summary}</p>
      <div className="mt-5"><TagList tags={item.tags} /></div>
    </article>
  );
}

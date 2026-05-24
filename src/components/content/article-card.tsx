import Link from "next/link";
import { ArticleMeta } from "@/components/content/article-meta";
import { TagList } from "@/components/content/tag-list";
import { contentHref } from "@/lib/content";
import type { GardenContent } from "@/lib/types";

export function ArticleCard({ item }: { item: GardenContent }) {
  return (
    <article className="group rounded-[1.4rem] border border-line bg-surface/86 p-5 shadow-[var(--shadow-note)] transition duration-200 hover:-translate-y-1 hover:border-clay/45">
      <ArticleMeta item={item} />
      <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-ink">
        <Link href={contentHref(item)}>{item.title}</Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-ink">{item.summary}</p>
      <div className="mt-5">
        <TagList tags={item.tags} />
      </div>
    </article>
  );
}

import Link from "next/link";
import { TagList } from "@/components/content/tag-list";
import { contentHref } from "@/lib/content";
import type { GardenContent, ProjectContent } from "@/lib/types";

export function ProjectCard({ item }: { item: GardenContent }) {
  const project = item as ProjectContent;
  return (
    <article className="rounded-[1.6rem] border border-line bg-surface/86 p-5 shadow-[var(--shadow-note)] transition hover:-translate-y-1">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-ink">
        <span className="rounded-full bg-sage/20 px-3 py-1">{project.status ?? "building"}</span>
        <span>{project.projectType ?? "project"}</span>
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">
        <Link href={contentHref(item)}>{item.title}</Link>
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted-ink">{item.summary}</p>
      <div className="mt-5"><TagList tags={item.tags} /></div>
    </article>
  );
}

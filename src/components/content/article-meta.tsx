import { contentTypeLabels } from "@/lib/content";
import { formatDate } from "@/lib/dates";
import type { GardenContent } from "@/lib/types";

export function ArticleMeta({ item }: { item: GardenContent }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-ink">
      <span className="rounded-full bg-surface-soft px-3 py-1">{contentTypeLabels[item.type]}</span>
      <span>{formatDate(item.date)}</span>
      <span>·</span>
      <span>{item.readingMinutes} 分钟阅读</span>
    </div>
  );
}

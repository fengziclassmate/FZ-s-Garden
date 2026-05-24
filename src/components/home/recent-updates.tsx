import { ArticleCard } from "@/components/content/article-card";
import { SectionHeading } from "@/components/layout/section-heading";
import type { GardenContent } from "@/lib/types";

export function RecentUpdates({ items }: { items: GardenContent[] }) {
  return (
    <section>
      <SectionHeading eyebrow="Recent" title="最近更新" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ArticleCard key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  );
}

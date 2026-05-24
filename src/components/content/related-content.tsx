import { ArticleCard } from "@/components/content/article-card";
import type { GardenContent } from "@/lib/types";

export function RelatedContent({ items }: { items: GardenContent[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold text-ink">关联笔记</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ArticleCard key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  );
}

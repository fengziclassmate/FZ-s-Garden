import { ArticleCard } from "@/components/content/article-card";
import { contentTypeName, groupByType } from "@/lib/archive";
import type { GardenContent } from "@/lib/types";

export function ArchiveByType({ items }: { items: GardenContent[] }) {
  const groups = groupByType(items);
  return (
    <section className="space-y-8">
      {Object.entries(groups).map(([type, typeItems]) => (
        <div key={type}>
          <h2 className="mb-4 font-display text-3xl font-semibold text-ink">{contentTypeName(type as GardenContent["type"])}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {typeItems.map((item) => (
              <ArticleCard key={`${item.type}-${item.slug}`} item={item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

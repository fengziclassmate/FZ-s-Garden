import { TimelineList } from "@/components/content/timeline-list";
import { groupByMonth } from "@/lib/archive";
import type { GardenContent } from "@/lib/types";

export function ArchiveByDate({ items }: { items: GardenContent[] }) {
  const groups = groupByMonth(items);
  return (
    <section className="space-y-8">
      {Object.entries(groups).map(([month, monthItems]) => (
        <div key={month}>
          <h2 className="mb-4 font-display text-3xl font-semibold text-ink">{month}</h2>
          <TimelineList items={monthItems} />
        </div>
      ))}
    </section>
  );
}

import { formatMonth } from "@/lib/dates";
import { contentTypeLabels } from "@/lib/content";
import type { ContentType, GardenContent } from "@/lib/types";

export function groupByMonth(items: GardenContent[]) {
  return items.reduce<Record<string, GardenContent[]>>((acc, item) => {
    const key = formatMonth(item.date);
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function groupByType(items: GardenContent[]) {
  return items.reduce<Record<ContentType, GardenContent[]>>((acc, item) => {
    acc[item.type] = acc[item.type] ?? [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<ContentType, GardenContent[]>);
}

export function groupByTag(items: GardenContent[]) {
  return items.reduce<Record<string, GardenContent[]>>((acc, item) => {
    item.tags.forEach((tag) => {
      acc[tag] = acc[tag] ?? [];
      acc[tag].push(item);
    });
    return acc;
  }, {});
}

export function contentTypeName(type: ContentType) {
  return contentTypeLabels[type];
}

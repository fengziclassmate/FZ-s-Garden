import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { markdownToHtml } from "@/lib/mdx";
import { sortByDateDesc } from "@/lib/dates";
import type { ContentType, GardenContent } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content");

export const contentTypeLabels: Record<ContentType, string> = {
  journal: "Journal",
  research: "Research",
  reading: "Reading",
  project: "Portfolio",
  behind: "Behind",
};

export const contentTypeFolders: Record<ContentType, string> = {
  journal: "journal",
  research: "research",
  reading: "reading",
  project: "projects",
  behind: "behind",
};

export const allContentTypes = Object.keys(contentTypeFolders) as ContentType[];

export function contentHref(item: Pick<GardenContent, "type" | "slug">) {
  if (item.type === "project") return `/portfolio/${item.slug}`;
  return `/${item.type}/${item.slug}`;
}

function getFilesByType(type: ContentType) {
  const folder = path.join(contentRoot, contentTypeFolders[type]);
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function normalizeTags(tags: unknown): string[] {
  return Array.isArray(tags) ? tags.map(String) : [];
}

export async function getContentByType(type: ContentType): Promise<GardenContent[]> {
  const items = await Promise.all(
    getFilesByType(type).map(async (file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fullPath = path.join(contentRoot, contentTypeFolders[type], file);
      const source = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(source);
      const html = await markdownToHtml(content);
      const item = {
        ...data,
        slug,
        type,
        title: String(data.title ?? slug),
        date: String(data.date ?? "1970-01-01"),
        summary: String(data.summary ?? ""),
        tags: normalizeTags(data.tags),
        pinned: Boolean(data.pinned),
        draft: Boolean(data.draft),
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        html,
      } as GardenContent;
      return item;
    }),
  );

  return sortByDateDesc(items.filter((item) => !item.draft));
}

export async function getAllContent(): Promise<GardenContent[]> {
  const groups = await Promise.all(allContentTypes.map((type) => getContentByType(type)));
  return sortByDateDesc(groups.flat());
}

export async function getContentBySlug(type: ContentType, slug: string) {
  const items = await getContentByType(type);
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getRecentContent(limit = 8) {
  const items = await getAllContent();
  return items.slice(0, limit);
}

export async function getPinnedContent(limit = 4) {
  const items = await getAllContent();
  return items.filter((item) => item.pinned).slice(0, limit);
}

export const blogContentTypes: ContentType[] = ["journal", "research", "reading"];

export async function getBlogContent(options?: { type?: ContentType; tag?: string }) {
  const groups = await Promise.all(blogContentTypes.map((type) => getContentByType(type)));
  let items = sortByDateDesc(groups.flat());
  if (options?.type) {
    items = items.filter((item) => item.type === options.type);
  }
  if (options?.tag) {
    items = items.filter((item) => item.tags.includes(options.tag!));
  }
  return items;
}

export async function getAllTags() {
  const items = await getAllContent();
  return Array.from(new Set(items.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

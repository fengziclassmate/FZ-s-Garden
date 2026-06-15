import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { markdownToHtml } from "@/lib/mdx";
import { sortByDateDesc } from "@/lib/dates";
import type { ContentType, GardenContent } from "@/lib/types";
import { getDbContentBySlug, getDbContentByType, type DbContentRow } from "@/lib/db";

const contentRoot = path.join(process.cwd(), "content");

export const contentTypeLabels: Record<ContentType, string> = {
  journal: "手账",
  research: "科研日志",
  reading: "阅读",
  project: "项目",
  behind: "幕后",
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

async function contentItemFromFile(type: ContentType, file: string): Promise<GardenContent> {
  const slug = file.replace(/\.mdx?$/, "");
  const fullPath = path.join(contentRoot, contentTypeFolders[type], file);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const html = await markdownToHtml(content);
  return {
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
}

async function contentItemFromDb(row: DbContentRow): Promise<GardenContent> {
  const html = await markdownToHtml(row.body);
  return {
    ...row.extra,
    slug: row.slug,
    type: row.type,
    title: row.title,
    date: row.date,
    summary: row.summary,
    tags: row.tags,
    pinned: row.pinned,
    draft: row.draft,
    readingMinutes: Math.max(1, Math.round(readingTime(row.body).minutes)),
    html,
  } as GardenContent;
}

async function getFileContentByType(type: ContentType): Promise<GardenContent[]> {
  return Promise.all(getFilesByType(type).map((file) => contentItemFromFile(type, file)));
}

async function getDatabaseContentByType(type: ContentType): Promise<GardenContent[]> {
  try {
    const rows = await getDbContentByType(type);
    return Promise.all(rows.map(contentItemFromDb));
  } catch (error) {
    console.warn("Database content unavailable; falling back to files.", error);
    return [];
  }
}

function mergeContentItems(fileItems: GardenContent[], databaseItems: GardenContent[]) {
  const merged = new Map<string, GardenContent>();
  for (const item of fileItems) merged.set(item.slug, item);
  for (const item of databaseItems) merged.set(item.slug, item);
  return sortByDateDesc(Array.from(merged.values()).filter((item) => !item.draft));
}

export async function getContentByType(type: ContentType): Promise<GardenContent[]> {
  const [fileItems, databaseItems] = await Promise.all([
    getFileContentByType(type),
    getDatabaseContentByType(type),
  ]);

  return mergeContentItems(fileItems, databaseItems);
}

export async function getAllContent(): Promise<GardenContent[]> {
  const groups = await Promise.all(allContentTypes.map((type) => getContentByType(type)));
  return sortByDateDesc(groups.flat());
}

export async function getContentBySlug(type: ContentType, slug: string) {
  try {
    const row = await getDbContentBySlug(type, slug);
    if (row && !row.draft) return contentItemFromDb(row);
  } catch (error) {
    console.warn("Database content lookup unavailable; falling back to files.", error);
  }

  const file = getFilesByType(type).find((item) => item.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;
  const item = await contentItemFromFile(type, file);
  return item.draft ? null : item;
}

export async function getEditableContentBySlug(type: ContentType, slug: string) {
  try {
    const row = await getDbContentBySlug(type, slug);
    if (row) {
      return {
        raw: row.body,
        slug: row.slug,
        type: row.type,
        title: row.title,
        summary: row.summary,
        tags: row.tags,
        extra: {
          ...row.extra,
          date: row.date,
          draft: row.draft,
          pinned: row.pinned,
        },
      };
    }
  } catch (error) {
    console.warn("Database content lookup unavailable; falling back to files.", error);
  }

  const file = getFilesByType(type).find((item) => item.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;

  const fullPath = path.join(contentRoot, contentTypeFolders[type], file);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data: frontmatter, content: raw } = matter(source);
  return {
    raw,
    slug,
    type,
    title: frontmatter.title || slug,
    summary: frontmatter.summary || "",
    tags: frontmatter.tags || [],
    extra: frontmatter,
  };
}

export async function getRecentContent(limit = 8) {
  const items = await getAllContent();
  return items.slice(0, limit);
}

export async function getPinnedContent(limit = 4) {
  const items = await getAllContent();
  return items.filter((item) => item.pinned).slice(0, limit);
}

/** blogs 页面聚合的类型（不含 project / behind） */
export const blogContentTypes: ContentType[] = ["journal", "research", "reading"];

/**
 * 获取 blogs 聚合内容，可选按 type 或 tag 筛选
 */
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

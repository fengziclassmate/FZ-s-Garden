export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { contentTypeFolders } from "@/lib/content";
import type { ContentType } from "@/lib/types";

const contentRoot = path.join(process.cwd(), "content");

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as ContentType | null;
  const slug = searchParams.get("slug");

  if (!type || !slug) {
    return NextResponse.json({ error: "missing type or slug" }, { status: 400 });
  }

  const folder = contentTypeFolders[type];
  if (!folder) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  const filePath = path.join(contentRoot, folder, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    // 本地没有，尝试从 GitHub 获取
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "fengziclassmate";
    const REPO = "FZ-s-Garden";

    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/content/${folder}/${slug}.mdx`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "file not found" }, { status: 404 });
    }

    const data = await res.json();
    const rawContent = Buffer.from(data.content, "base64").toString("utf8");
    const { data: frontmatter, content: raw } = matter(rawContent);

    return NextResponse.json({
      post: {
        raw,
        slug,
        type,
        title: frontmatter.title || slug,
        summary: frontmatter.summary || "",
        tags: frontmatter.tags || [],
        extra: frontmatter,
      },
    });
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content: raw } = matter(source);

  return NextResponse.json({
    post: {
      raw,
      slug,
      type,
      title: frontmatter.title || slug,
      summary: frontmatter.summary || "",
      tags: frontmatter.tags || [],
      extra: frontmatter,
    },
  });
}

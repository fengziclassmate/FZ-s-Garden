export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { deleteDbContent } from "@/lib/db";
import type { ContentType } from "@/lib/types";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "fengziclassmate";
const REPO = "FZ-s-Garden";

const folderMap: Record<string, string> = {
  journal: "journal",
  research: "research",
  reading: "reading",
  project: "projects",
  behind: "behind",
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, slug } = body;

  if (!type || !slug) {
    return NextResponse.json({ error: "missing type or slug" }, { status: 400 });
  }

  const folder = folderMap[type];
  if (!folder) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }

  try {
    const deleted = await deleteDbContent(type as ContentType, slug);
    if (deleted) {
      const urlType = type === "project" ? "portfolio" : type;
      revalidatePath(`/${urlType}`);
      revalidatePath(`/${urlType}/${slug}`);
      revalidatePath("/blogs");
      revalidatePath("/behind");
      return NextResponse.json({
        success: true,
        message: "文章已删除",
        storage: "database",
      });
    }
  } catch (error) {
    console.warn("Database delete unavailable; falling back to GitHub.", error);
  }

  const filePath = `content/${folder}/${slug}.mdx`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  // 先获取文件的 SHA
  const getRes = await fetch(apiUrl, { headers });
  if (!getRes.ok) {
    return NextResponse.json({ error: "file not found on GitHub" }, { status: 404 });
  }

  const existing = await getRes.json();
  const sha = existing.sha;

  // 删除文件
  const deleteRes = await fetch(apiUrl, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `delete: ${slug}`,
      sha,
    }),
  });

  const deleteData = await deleteRes.json();
  if (!deleteRes.ok) {
    return NextResponse.json(
      { error: "GitHub API failed", message: deleteData.message || "delete failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "文章已删除",
  });
}

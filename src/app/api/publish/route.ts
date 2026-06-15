export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import { upsertContent } from "@/lib/db"
import type { ContentType } from "@/lib/types"

const folderMap: Record<string, string> = {
  journal: "journal",
  research: "research",
  reading: "reading",
  project: "projects",
  behind: "behind",
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, type, summary, tags, content, extra } = body

  if (!title || !slug || !type || !summary || !content) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 })
  }

  const folder = folderMap[type]
  if (!folder) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 })
  }

  const date = new Date().toISOString().split("T")[0]
  const tagsArray = Array.isArray(tags) ? tags.filter(Boolean) : []
  const extraFields: Record<string, unknown> = {}
  if (type === "project" && extra) {
    extraFields.projectType = extra.projectType || "personal-tool"
    extraFields.status = extra.status || "building"
    extraFields.startDate = extra.startDate || date
    if (extra.linkDemo) extraFields.linkDemo = extra.linkDemo
    if (extra.linkGithub) extraFields.linkGithub = extra.linkGithub
  }

  await upsertContent({
    title: String(title).trim(),
    slug: String(slug).trim(),
    type: type as ContentType,
    date,
    summary: String(summary).trim(),
    tags: tagsArray.map(String),
    body: String(content),
    extra: extraFields,
    draft: false,
  })

  const urlType = type === "project" ? "portfolio" : type
  revalidatePath(`/${urlType}`)
  revalidatePath(`/${urlType}/${slug}`)
  revalidatePath("/blogs")
  revalidatePath("/behind")

  return NextResponse.json({
    success: true,
    message: "文章已保存",
    url: `https://fz-s-garden.vercel.app/${urlType}/${slug}`,
    storage: "database",
  })
}

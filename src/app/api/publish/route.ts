export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ""
const OWNER = "fengziclassmate"
const REPO = "FZ-s-Garden"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, slug, type, summary, tags, content } = body

  if (!title || !slug || !type || !summary || !content) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 })
  }

  const folderMap: Record<string, string> = {
    journal: "journal",
    research: "research",
    reading: "reading",
    behind: "behind",
  }

  const folder = folderMap[type]
  if (!folder) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 })
  }

  const date = new Date().toISOString().split("T")[0]
  const tagsArray = Array.isArray(tags) ? tags : [tags]
  const tagsStr = JSON.stringify(tagsArray)

  const mdxContent = `---
title: "${title}"
date: "${date}"
type: "${type}"
summary: "${summary}"
tags: ${tagsStr}
draft: false
---

${content}
`

  const filePath = `content/${folder}/${slug}.mdx`
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(filePath)}`
  const headers: Record<string, string> = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  }

  // 检查文件是否已存在，获取 SHA
  let sha: string | undefined
  const getRes = await fetch(apiUrl, { headers })
  if (getRes.ok) {
    const existing = await getRes.json()
    sha = existing.sha
  }

  // 提交文件到 GitHub
  const commitRes = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: sha ? `update: ${title}` : `feat: publish "${title}"`,
      content: Buffer.from(mdxContent, "utf8").toString("base64"),
      sha,
    }),
  })

  if (!commitRes.ok) {
    const err = await commitRes.json()
    return NextResponse.json({ error: "GitHub API failed", details: err }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: sha ? "文章已更新" : "文章已发布",
    url: `https://fz-s-garden.vercel.app/${folder}/${slug}`,
  })
}

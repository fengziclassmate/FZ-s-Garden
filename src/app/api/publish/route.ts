export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const OWNER = "fengziclassmate"
const REPO = "FZ-s-Garden"

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
  const tagsStr = JSON.stringify(tagsArray)

  let extraFields = ""
  if (type === "project" && extra) {
    const projectType = extra.projectType || "personal-tool"
    const status = extra.status || "building"
    const startDate = extra.startDate || date
    extraFields = `projectType: "${projectType}"
status: "${status}"
startDate: "${startDate}"
`
    if (extra.linkDemo) extraFields += `linkDemo: "${extra.linkDemo}"\n`
    if (extra.linkGithub) extraFields += `linkGithub: "${extra.linkGithub}"\n`
  }

  const mdxContent = `---
title: "${title}"
date: "${date}"
type: "${type}"
summary: "${summary}"
tags: ${tagsStr}
draft: false
${extraFields}---

${content}
`

  const filePath = `content/${folder}/${slug}.mdx`
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`
  const headers: Record<string, string> = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  }

  let sha: string | undefined
  const getRes = await fetch(apiUrl, { headers })
  if (getRes.ok) {
    const existing = await getRes.json()
    sha = existing.sha
  }

  const commitRes = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: sha ? `update: ${title}` : `feat: publish "${title}"`,
      content: Buffer.from(mdxContent, "utf8").toString("base64"),
      sha,
    }),
  })

  const commitData = await commitRes.json()
  if (!commitRes.ok) {
    return NextResponse.json(
      { error: "GitHub API failed", message: commitData.message || "unknown error" },
      { status: 500 },
    )
  }

  const urlType = type === "project" ? "portfolio" : type
  return NextResponse.json({
    success: true,
    message: sha ? "文章已更新" : "文章已发布",
    url: `https://fz-s-garden.vercel.app/${urlType}/${slug}`,
    commit: commitData.commit?.sha,
  })
}

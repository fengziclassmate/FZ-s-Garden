"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const ALLOWED_TYPES = [
  { value: "journal", label: "手账 (Journal)" },
  { value: "research", label: "科研日志 (Research)" },
  { value: "reading", label: "阅读 (Reading)" },
  { value: "behind", label: "幕后 (Behind)" },
]

export default function WriteEditor() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [type, setType] = useState("journal")
  const [summary, setSummary] = useState("")
  const [tags, setTags] = useState("")
  const [content, setContent] = useState("")
  const [preview, setPreview] = useState("")
  const [publishing, setPublishing] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // 根据标题自动生成 slug
  const updateTitle = useCallback((val: string) => {
    setTitle(val)
    setSlug(
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() || "",
    )
  }, [])

  // 实时预览
  useEffect(() => {
    if (!content.trim()) {
      setPreview('<p class="text-[#aba69c]">预览将显示在这里...</p>')
      return
    }

    // 简单的 Markdown 到 HTML 转换（内联，不用额外依赖）
    let html = content
      // 标题
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      // 粗体/斜体
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // 行内代码
      .replace(/`(.+?)`/g, "<code>$1</code>")
      // 链接
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="underline">$1</a>')
      // 无序列表
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      // 有序列表
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      // 图片
      .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="my-2 max-w-full rounded" />')
      // 段落（非空行，不是标题、列表、图片、代码块、HTML）
      .replace(/^(?!<[hHlLiIiIcC]|<img|```)(.+)$/gm, (match) => {
        if (match.trim()) return `<p>${match}</p>`
        return match
      })
      // 合并连续的 <li>
      .replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul class="list-disc pl-5 my-2">$1</ul>')
      // 空行
      .replace(/\n{2,}/g, "\n")

    setPreview(html)
  }, [content])

  // 发布
  const handlePublish = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setResult({ ok: false, msg: "请填写标题、slug 和正文" })
      return
    }

    setPublishing(true)
    setResult(null)

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          type,
          summary: summary.trim() || title.trim(),
          tags: tags
            .split(/[,，]/)
            .map((t) => t.trim())
            .filter(Boolean),
          content,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setResult({ ok: true, msg: `${data.message}！${data.url ? ` 查看: ${data.url}` : ""}` })
      } else {
        setResult({ ok: false, msg: data.error || "发布失败" })
      }
    } catch (e) {
      setResult({ ok: false, msg: "网络错误，请重试" })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-[#2d2a24]">写文章</h1>

      {/* 工具栏 */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-[#ece9e1] bg-white px-3 py-2 text-sm text-[#2d2a24]"
        >
          {ALLOWED_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="rounded-lg bg-[#2d2a24] px-5 py-2 text-sm text-white hover:bg-[#4a453c] disabled:opacity-50 transition-colors"
        >
          {publishing ? "发布中..." : "发布"}
        </button>

        {result && (
          <span className={`text-sm ${result.ok ? "text-green-600" : "text-red-500"}`}>
            {result.msg}
          </span>
        )}
      </div>

      {/* 双栏编辑区 */}
      <div className="flex gap-4">
        {/* 左侧：编辑器 */}
        <div className="flex-1 space-y-4">
          <input
            type="text"
            placeholder="文章标题"
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-full rounded-lg border border-[#ece9e1] bg-white px-4 py-3 text-lg text-[#2d2a24] outline-none focus:border-[#c4b999]"
          />

          <input
            type="text"
            placeholder="Slug (URL 标识，自动生成)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-[#ece9e1] bg-[#f8f6f2] px-4 py-2 text-sm text-[#7a756c] outline-none focus:border-[#c4b999]"
          />

          <input
            type="text"
            placeholder="摘要 (留空则使用标题)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-[#ece9e1] bg-white px-4 py-2 text-sm text-[#2d2a24] outline-none focus:border-[#c4b999]"
          />

          <input
            type="text"
            placeholder="标签 (用逗号分隔，如: 科研, 方法论)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-[#ece9e1] bg-white px-4 py-2 text-sm text-[#2d2a24] outline-none focus:border-[#c4b999]"
          />

          <textarea
            placeholder="用 Markdown 写文章..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] w-full resize-y rounded-lg border border-[#ece9e1] bg-white px-4 py-3 font-mono text-sm leading-relaxed text-[#2d2a24] outline-none focus:border-[#c4b999]"
          />
        </div>

        {/* 右侧：预览 */}
        <div className="flex-1">
          <div className="mb-2 text-xs text-[#aba69c] font-medium">预览</div>
          <div
            ref={previewRef}
            className="min-h-[400px] w-full overflow-auto rounded-lg border border-[#ece9e1] bg-white px-6 py-5 text-sm leading-relaxed text-[#2d2a24] [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_h3]:mb-1 [&_p]:mb-2 [&_code]:rounded [&_code]:bg-[#f0ede6] [&_code]:px-1 [&_code]:text-xs [&_li]:text-sm [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  )
}

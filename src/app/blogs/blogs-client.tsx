"use client";

import type { ContentType, GardenContent } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";

const contentTypeLabels: Record<string, string> = {
  journal: "手账",
  research: "科研日志",
  reading: "阅读笔记",
  project: "项目",
  behind: "幕后",
};

type Props = {
  sections: { key: string; label: string; emoji: string; posts: GardenContent[] }[];
};

// 模拟点赞数据（后续接入 API）
const likeCounts: Record<string, number> = {
  "journal/finding-rhythm": 17,
  "journal/2026-05-week-3": 8,
  "journal/2026-05-month-note": 12,
  "research/research-question-reset": 23,
  "research/meeting-2026-05-23": 5,
  "research/experiment-note-001": 14,
  "reading/smart-notes": 31,
  "reading/writing-science": 19,
  "reading/research-design-note": 9,
  "reading/digital-garden-note": 6,
};

export default function BlogsClient({ sections }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeType = (searchParams.get("type") as ContentType) || undefined;
  const activeSlug = searchParams.get("slug") || undefined;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocOpen, setTocOpen] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  let activePost: GardenContent | null = null;
  if (activeType && activeSlug) {
    const source = sections.find((s) => s.key === activeType);
    activePost = source?.posts.find((p) => p.slug === activeSlug) ?? null;
  }

  const postKey = activeType && activeSlug ? `${activeType}/${activeSlug}` : null;
  const likeCount = postKey ? (likeCounts[postKey] ?? 0) + (liked.has(postKey) ? 1 : 0) : 0;

  // 提取目录（仅在客户端执行）
  const tocItems = useMemo(() => {
    if (!activePost || typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(activePost.html, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");
    return Array.from(headings).map((h, i) => ({
      id: `toc-${i}`,
      text: h.textContent || "",
      level: parseInt(h.tagName[1], 10),
    }));
  }, [activePost]);

  const navigate = useCallback(
    (type?: string, slug?: string) => {
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (slug) params.set("slug", slug);
      const qs = params.toString();
      router.push(qs ? `/blogs?${qs}` : "/blogs");
    },
    [router],
  );

  return (
    <main className="flex min-h-[calc(100vh-4rem)] gap-6 px-8 py-8 lg:px-12">
      {/* 侧边栏展开按钮（收起时显示） */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-lg border border-l-0 border-[#ece9e1] bg-white px-1.5 py-6 text-xs text-[#7a756c] shadow-sm transition hover:bg-[#f5f2ec]"
          aria-label="展开侧边栏"
        >
          ▶
        </button>
      )}

      {/* ===== 左侧侧边栏 ===== */}
      <aside
        className={`shrink-0 overflow-hidden rounded-xl border border-[#ece9e1] bg-white/60 py-6 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-80" : "w-0 border-0"
        }`}
      >
        <div className="px-5">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#a6a097]">Blogs</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md px-2 py-1 text-xs text-[#7a756c] transition hover:bg-[#f0ede6]"
              aria-label="收起"
            >
              ✕
            </button>
          </div>
          <div className="space-y-0.5">
            {sections.map((sec) => {
              const isExpanded = activeType === sec.key;
              return (
                <div key={sec.key}>
                  <button
                    type="button"
                    onClick={() => navigate(isExpanded ? undefined : sec.key, undefined)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base transition ${
                      isExpanded
                        ? "bg-[#e9e6df] font-medium text-[#2d2a24]"
                        : "text-[#7a756c] hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{sec.emoji}</span>
                      <span>{sec.label}</span>
                    </span>
                    <span className="text-xs text-[#b0aba0]">{sec.posts.length}</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-[#e2dfd6] pl-3">
                      {sec.posts.map((post) => {
                        const isActive = activeSlug === post.slug;
                        return (
                          <button
                            key={post.slug}
                            type="button"
                            onClick={() => navigate(sec.key, post.slug)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-relaxed transition ${
                              isActive
                                ? "bg-[#e9e6df] font-medium text-[#2d2a24]"
                                : "text-[#7a756c] hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
                            }`}
                          >
                            {post.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ===== 右侧主区域 ===== */}
      {activePost ? (
        <div className="flex min-w-0 flex-1 gap-6">
          {/* 内容区 */}
          <div className="relative min-w-0 flex-1 rounded-xl border border-[#ece9e1] bg-white/60 p-8 md:p-10">
            {/* 右上角操作 */}
            <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-6 md:top-6">
              <button
                type="button"
                title="下载 Markdown"
                onClick={() => {
                  const mdContent = `# ${activePost.title}\n\n${activePost.summary ? activePost.summary + "\n\n" : ""}${activePost.html.replace(/<[^>]*>/g, "")}`;
                  const blob = new Blob([mdContent], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${activePost.slug}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-md border border-[#e2dfd6] bg-white/80 px-2.5 py-1 text-xs text-[#7a756c] transition hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
              >
                ↓MD
              </button>
              <button
                type="button"
                title="导出 PDF"
                onClick={() => window.print()}
                className="rounded-md border border-[#e2dfd6] bg-white/80 px-2.5 py-1 text-xs text-[#7a756c] transition hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
              >
                📄PDF
              </button>
              <button
                type="button"
                title="点赞"
                onClick={() => {
                  if (postKey) {
                    setLiked((prev) => {
                      const next = new Set(prev);
                      if (next.has(postKey)) next.delete(postKey);
                      else next.add(postKey);
                      return next;
                    });
                  }
                }}
                className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition ${
                  postKey && liked.has(postKey)
                    ? "border-[#e8b4b4] bg-[#fdf0f0] text-[#c44a4a]"
                    : "border-[#e2dfd6] bg-white/80 text-[#7a756c] hover:bg-[#f5f2ec]"
                }`}
              >
                <span>{postKey && liked.has(postKey) ? "❤️" : "🤍"}</span>
                <span>{likeCount}</span>
              </button>
            </div>

            {/* 文章内容 */}
            <article>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#a6a097]">
                <span>{sections.find((s) => s.key === activeType)?.emoji}</span>
                <span>{contentTypeLabels[activePost.type]}</span>
                <span>·</span>
                <time>{fmtDate(activePost.date)}</time>
                <span>·</span>
                <span>{activePost.readingMinutes} 分钟阅读</span>
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#2d2a24] md:text-3xl">
                {activePost.title}
              </h1>

              {activePost.summary && (
                <p className="mt-3 text-sm leading-relaxed text-[#7a756c]">{activePost.summary}</p>
              )}

              <div
                className="prose-garden mt-6 border-t border-[#ece9e1] pt-6"
                dangerouslySetInnerHTML={{ __html: activePost.html }}
              />
            </article>
          </div>

          {/* === 目录面板（浮动，可拖拽调节位置） === */}
          {tocItems.length > 0 && (
            <DraggableToc
              tocItems={tocItems}
              tocOpen={tocOpen}
              setTocOpen={setTocOpen}
            />
          )}
        </div>
      ) : (
        /* 欢迎页 */
        <div className="min-w-0 flex-1 rounded-xl border border-[#ece9e1] bg-white/60 p-8 md:p-10">
          <div className="mx-auto max-w-lg py-6">
            <div className="flex justify-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0ede6] text-2xl">📝</span>
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold text-[#2d2a24]">BytesNotes</h1>
            <p className="mt-2 text-center text-sm text-[#7a756c]">
              随心（水星）记 · 科研日志 · 阅读笔记
            </p>
            <div className="my-8 border-t border-[#ece9e1]" />
            <div className="space-y-4 text-sm leading-relaxed text-[#5a564e]">
              <p>我是 <strong className="text-[#2d2a24]">疯子同学</strong>，一名在博士旅程中学习长期阅读、稳定写作和持续研究的博士生。</p>
              <p>这里记录着我愿意公开分享的一切：生活里的随感与手账、科研中的思考与挣扎、阅读时记下的观点和方法。</p>
              <p>写作风格偏向随笔与札记——不求系统完整，但求真实坦诚。每一篇都是当下状态的切片。</p>
              <p>从左侧选择分类和文章开始阅读吧。</p>
            </div>
            <div className="mt-8 border-t border-[#ece9e1] pt-6 text-center text-xs text-[#a6a097]">
              ✦ 选择左侧分类开始探索 ✦
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function fmtDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

/* ===== 可拖拽浮动目录组件 ===== */
type TocItem = { id: string; text: string; level: number };

function DraggableToc({
  tocItems,
  tocOpen,
  setTocOpen,
}: {
  tocItems: TocItem[];
  tocOpen: boolean;
  setTocOpen: (v: boolean) => void;
}) {
  // 未拖拽时使用 right 定位（服务端+客户端一致），拖拽后切 left/top
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ clientX: 0, clientY: 0, posX: 0, posY: 0 });

  // mount 后计算初始像素位置（right 定位的值已经正确，这里只给拖拽做预备）
  useEffect(() => {
    const el = document.querySelector(".draggable-toc-inner") as HTMLElement | null;
    if (!el) return;
    const w = el.offsetWidth;
    const rect = el.getBoundingClientRect();
    setPos({ x: rect.left, y: rect.top });
    setMounted(true);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      posX: pos?.x ?? 0,
      posY: pos?.y ?? 0,
    };
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - dragStart.current.clientX;
      const dy = e.clientY - dragStart.current.clientY;
      setPos({
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]);

  // 未 mount 时用 right 定位（服务端+客户端一致，避免水合失败）
  // mount 后且拖拽过就用 left/top 像素值
  const hasDragged = pos !== null;

  return (
    <div
      className="fixed z-30 select-none"
      style={{
        top: hasDragged ? pos!.y : "20vh",
        left: hasDragged ? pos!.x : undefined,
        right: hasDragged ? undefined : "4rem",
      }}
    >
      <div className={`draggable-toc-inner rounded-xl border border-[#ece9e1] bg-white shadow-sm ${dragging ? "shadow-lg" : ""}`}>
        <div
          className={`flex items-center gap-2 px-4 py-2.5 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
        >
          <button
            type="button"
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2 text-xs font-medium text-[#7a756c] transition hover:text-[#2d2a24]"
          >
            <span>📑</span>
            <span>目录</span>
            <span className={`text-[10px] transition ${tocOpen ? "rotate-90" : ""}`}>▶</span>
          </button>
        </div>
        {tocOpen && (
          <div className="max-h-72 space-y-0.5 overflow-y-auto border-t border-[#ece9e1] px-2 pb-3 pt-2">
            {tocItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const article = document.querySelector(".prose-garden");
                  if (article) {
                    const headings = article.querySelectorAll("h1, h2, h3");
                    const idx = parseInt(item.id.replace("toc-", ""), 10);
                    const target = headings[idx];
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`block w-full rounded-md px-3 py-1.5 text-left text-xs leading-relaxed text-[#7a756c] transition hover:bg-[#f0ede6] hover:text-[#2d2a24] ${
                  item.level === 1
                    ? "font-medium"
                    : item.level === 2
                      ? "pl-6"
                      : "pl-8"
                }`}
              >
                {item.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

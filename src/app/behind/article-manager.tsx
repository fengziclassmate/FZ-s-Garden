"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  type: string;
  date: string;
};

export function ArticleManager({ items }: { items: Article[] }) {
  const [authed, setAuthed] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setAuthed(!!data?.user))
      .catch(() => setAuthed(false));
  }, []);

  const handleDelete = async (slug: string, type: string, title: string) => {
    if (!confirm(`确定删除「${title}」吗？此操作不可撤销。`)) return;

    setDeleting(slug);
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert("删除失败：" + (data.error || data.message || "未知错误"));
      }
    } catch (e) {
      alert("网络错误，请重试");
    } finally {
      setDeleting(null);
    }
  };

  if (!authed) return null;

  return (
    <div className="mb-8 rounded-xl border border-[#ece9e1] bg-white/80 p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-[#2d2a24]">📋 文章管理</p>
      <div className="divide-y divide-[#ece9e1]">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex items-center gap-3 py-2.5 text-sm"
          >
            <span className="flex-1 min-w-0 truncate text-[#2d2a24]">
              {item.title}
            </span>
            <span className="shrink-0 text-xs text-[#7a756c]">{item.date}</span>
            <Link
              href={`/behind/write?type=${item.type}&slug=${item.slug}`}
              className="shrink-0 rounded-md bg-[#e9e6df] px-2.5 py-1 text-xs text-[#2d2a24] hover:bg-[#ddd9d0] transition-colors"
            >
              编辑
            </Link>
            <button
              onClick={() => handleDelete(item.slug, item.type, item.title)}
              disabled={deleting === item.slug}
              className="shrink-0 rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              {deleting === item.slug ? "删除中..." : "删除"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

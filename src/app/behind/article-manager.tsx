"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { GardenContent } from "@/lib/types";

const typeLabels: Record<string, string> = {
  journal: "手账",
  research: "科研日志",
  reading: "阅读",
  project: "作品集",
  behind: "幕后",
};

export function ArticleManagerClient({ items }: { items: GardenContent[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const router = useRouter();

  const handleDelete = async (slug: string, type: string, title: string) => {
    if (!confirm(`确定删除「${title}」吗？此操作不可撤销。`)) return;

    const key = `${type}/${slug}`;
    setDeleting(key);
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

  const types = ["all", ...new Set(items.map((i) => i.type))];
  const filtered =
    selectedType === "all" ? items : items.filter((i) => i.type === selectedType);

  return (
    <div className="mb-8 rounded-xl border border-[#ece9e1] bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#2d2a24]">📋 文章管理（共 {items.length} 篇）</p>
        <div className="flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                selectedType === t
                  ? "bg-[#2d2a24] text-white"
                  : "bg-[#f0ede6] text-[#7a756c] hover:bg-[#e9e6df]"
              }`}
            >
              {t === "all" ? "全部" : typeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-[#ece9e1]">
        {filtered.map((item) => (
          <div
            key={`${item.type}/${item.slug}`}
            className="flex items-center gap-3 py-2.5 text-sm"
          >
            <span className="shrink-0 rounded bg-[#f0ede6] px-1.5 py-0.5 text-[10px] text-[#7a756c] font-mono">
              {typeLabels[item.type] || item.type}
            </span>
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
              disabled={deleting === `${item.type}/${item.slug}`}
              className="shrink-0 rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              {deleting === `${item.type}/${item.slug}` ? "删除中..." : "删除"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-[#7a756c]">
            这个分类暂无文章
          </p>
        )}
      </div>
    </div>
  );
}

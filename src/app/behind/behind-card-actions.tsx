"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BehindCardActions({
  type,
  slug,
  title,
}: {
  type: string;
  slug: string;
  title: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`确定删除「${title}」吗？此操作不可撤销。`)) return;

    setDeleting(true);
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
        alert("删除失败：" + (data.message || "未知错误"));
      }
    } catch (e) {
      alert("网络错误，请重试");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
    >
      {deleting ? "删除中..." : "删除"}
    </button>
  );
}

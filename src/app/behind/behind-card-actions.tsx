"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function BehindCardWithActions({
  type,
  slug,
  title,
}: {
  type: string;
  slug: string;
  title: string;
}) {
  const [authed, setAuthed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setAuthed(!!data?.user))
      .catch(() => setAuthed(false));
  }, []);

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

  if (!authed) return null;

  return (
    <div className="absolute right-3 top-3 z-10 flex gap-1.5">
      <Link
        href={`/behind/write?type=${type}&slug=${slug}`}
        className="rounded-md bg-[#e9e6df] px-2.5 py-1 text-xs text-[#2d2a24] hover:bg-[#ddd9d0] shadow-sm transition-colors"
      >
        编辑
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md bg-red-100 px-2.5 py-1 text-xs text-red-600 hover:bg-red-200 disabled:opacity-50 shadow-sm transition-colors"
      >
        {deleting ? "删除中..." : "删除"}
      </button>
    </div>
  );
}

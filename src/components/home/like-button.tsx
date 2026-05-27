"use client";

import { useEffect, useState, useCallback } from "react";

const likedStorageKey = "phd-garden-liked";

export function LikeButton() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadLikes = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5s 超时

      const res = await fetch("/api/likes", {
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Failed to load likes");
      const data = (await res.json()) as { count: number };
      setCount(typeof data.count === "number" ? data.count : 0);
    } catch {
      // 即使 DB 不可用，也把按钮放开
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    setLiked(window.localStorage.getItem(likedStorageKey) === "yes");
    void loadLikes();
  }, [loadLikes]);

  async function handleLike() {
    if (liked || isSaving) return;
    setIsSaving(true);
    setLiked(true);
    window.localStorage.setItem(likedStorageKey, "yes");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("/api/likes", {
        method: "POST",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Failed to save like");
      const data = (await res.json()) as { count: number };
      setCount(typeof data.count === "number" ? data.count : count + 1);
    } catch {
      // 乐观更新
      setCount((c) => c + 1);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={!isReady || liked || isSaving}
      aria-pressed={liked}
      aria-label={`${count} liked`}
      className="mt-4 flex items-center gap-1.5 rounded-full border border-[#e2dfd6] bg-white/60 px-4 py-1.5 text-sm text-[#7a756c] transition hover:border-[#d8b4b4] hover:bg-[#fdf0f0] hover:text-[#c44a4a] disabled:opacity-60"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span className="font-medium">{count}</span>
    </button>
  );
}

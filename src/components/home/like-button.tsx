"use client";

import { useEffect, useState } from "react";

const likedStorageKey = "phd-garden-liked";
const fallbackCountKey = "phd-garden-like-count";

type LikeResponse = {
  count: number;
};

function normalizeCount(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}

export function LikeButton() {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    setLiked(window.localStorage.getItem(likedStorageKey) === "yes");

    let cancelled = false;

    async function loadLikes() {
      try {
        const response = await fetch("/api/likes", { cache: "no-store" });
        if (!response.ok) throw new Error("Unable to load likes");
        const data = (await response.json()) as LikeResponse;
        if (!cancelled) setCount(normalizeCount(data.count));
      } catch {
        if (!cancelled) {
          setCount(normalizeCount(window.localStorage.getItem(fallbackCountKey)));
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void loadLikes();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLike() {
    if (liked || isSaving) return;

    const optimisticCount = count + 1;
    setLiked(true);
    setCount(optimisticCount);
    setIsSaving(true);
    setBurstKey(Date.now());
    window.localStorage.setItem(likedStorageKey, "yes");
    window.localStorage.setItem(fallbackCountKey, String(optimisticCount));

    try {
      const response = await fetch("/api/likes", { method: "POST" });
      if (!response.ok) throw new Error("Unable to save like");
      const data = (await response.json()) as LikeResponse;
      const savedCount = normalizeCount(data.count);
      setCount(savedCount);
      window.localStorage.setItem(fallbackCountKey, String(savedCount));
    } catch {
      setCount(optimisticCount);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="like-widget" aria-live="polite">
      <button
        type="button"
        className="like-button"
        onClick={handleLike}
        disabled={!isReady || liked || isSaving}
        aria-pressed={liked}
        aria-label={`${count} liked`}
      >
        <span className="like-button__heart" aria-hidden="true" />
        <strong>{count}</strong>
        <span>liked</span>
      </button>
      {burstKey ? (
        <span key={burstKey} className="like-burst" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      ) : null}
    </div>
  );
}

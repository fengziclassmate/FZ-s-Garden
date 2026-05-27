"use client";

import { useEffect, useRef } from "react";

type GiscusCommentsProps = {
  /** 例如 "fengziclassmate/FZ-s-Garden" */
  repo: string;
  /** GitHub 仓库的 repo-id */
  repoId: string;
  /** Discussion 分类名 */
  category?: string;
  /** Discussion 分类 ID */
  categoryId: string;
  /** 页面↔️discussion 映射方式 */
  mapping?: "pathname" | "url" | "title" | "og:title";
  /** 主题 */
  theme?: string;
  /** 语言 */
  lang?: string;
};

export default function GiscusComments({
  repo,
  repoId,
  category = "Announcements",
  categoryId,
  mapping = "pathname",
  theme = "preferred_color_scheme",
  lang = "zh-CN",
}: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // 每次 postKey（文章路径）变化时重建 Giscus
  const postKey = ref.current?.closest("article")?.querySelector(".giscus-post-key")?.textContent;

  useEffect(() => {
    // 清除旧容器内容
    if (ref.current) {
      ref.current.innerHTML = "";
    }
    initialized.current = false;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", lang);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current?.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, theme, lang, postKey]);

  return <div ref={ref} className="giscus mt-12" />;
}

"use client";

import GiscusComments from "@/components/content/giscus-comments";

export default function CommentsSection() {
  return (
    <div className="mt-16 border-t border-[#ece9e1] pt-8">
      <h3 className="mb-6 text-lg font-semibold text-[#2d2a24]">💬 评论区</h3>
      <GiscusComments
        repo="fengziclassmate/FZ-s-Garden"
        repoId="R_kgDOSmKp7Q"
        category="Announcements"
        categoryId="DIC_kwDOSmKp7c4C97yl"
        mapping="pathname"
        theme="preferred_color_scheme"
        lang="zh-CN"
      />
    </div>
  );
}

import { Suspense } from "react";
import type { GardenContent } from "@/lib/types";
import { getContentByType } from "@/lib/content";
import BlogsClient from "./blogs-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function BlogsContent() {
  const [journalAll, researchAll, readingAll] = await Promise.all([
    getContentByType("journal"),
    getContentByType("research"),
    getContentByType("reading"),
  ]);

  const sections: { key: string; label: string; emoji: string; posts: GardenContent[] }[] = [
    { key: "journal", label: "手账", emoji: "📓", posts: journalAll },
    { key: "research", label: "科研", emoji: "🔬", posts: researchAll },
    { key: "reading", label: "阅读", emoji: "📖", posts: readingAll },
  ];

  return <BlogsClient sections={sections} />;
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-[#a6a097]">加载中...</div>}>
      <BlogsContent />
    </Suspense>
  );
}

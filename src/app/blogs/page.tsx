import { Suspense } from "react";
import type { GardenContent } from "@/lib/types";
import { getContentByType } from "@/lib/content";
import BlogsClient from "./blogs-client";

async function BlogsContent() {
  const [journalAll, researchAll, readingAll] = await Promise.all([
    getContentByType("journal"),
    getContentByType("research"),
    getContentByType("reading"),
  ]);

  const sections: { key: string; label: string; emoji: string; posts: GardenContent[] }[] = [
    { key: "journal", label: "Journal", emoji: "J", posts: journalAll },
    { key: "research", label: "Research", emoji: "R", posts: researchAll },
    { key: "reading", label: "Reading", emoji: "N", posts: readingAll },
  ];

  return <BlogsClient sections={sections} />;
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-[#a6a097]">Loading...</div>}>
      <BlogsContent />
    </Suspense>
  );
}

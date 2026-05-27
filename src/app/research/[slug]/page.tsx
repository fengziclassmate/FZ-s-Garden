import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/content/article-layout";
import { getContentBySlug, getContentByType } from "@/lib/content";
import CommentsSection from "@/components/content/comments-section";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getContentByType("research");
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentBySlug("research", slug);
  return { title: item?.title ?? "科研日志" };
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getContentBySlug("research", slug);
  if (!item) notFound();

  return (
    <ArticleLayout item={item}>
      <div className="prose-garden" dangerouslySetInnerHTML={{ __html: item.html }} />
      <CommentsSection />
    </ArticleLayout>
  );
}

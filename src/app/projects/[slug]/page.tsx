import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/content/article-layout";
import { getContentBySlug, getContentByType } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getContentByType("project");
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentBySlug("project", slug);
  return { title: item?.title ?? "项目" };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getContentBySlug("project", slug);
  if (!item) notFound();

  return (
    <ArticleLayout item={item}>
      <div className="prose-garden" dangerouslySetInnerHTML={{ __html: item.html }} />
    </ArticleLayout>
  );
}

import { ArticleCard } from "@/components/content/article-card";
import { PageShell } from "@/components/layout/page-shell";
import { getContentByType } from "@/lib/content";

export default async function BehindPage() {
  const items = await getContentByType("behind");

  return (
    <PageShell eyebrow="Behind" title="幕后" description="记录这个网站的设计理念、技术栈、内容系统和更新日志。">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ArticleCard key={item.slug} item={item} />
        ))}
      </div>
    </PageShell>
  );
}

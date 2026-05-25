import { ArticleMeta } from "@/components/content/article-meta";
import { TagList } from "@/components/content/tag-list";
import type { GardenContent } from "@/lib/types";

type ArticleLayoutProps = {
  item: GardenContent;
  children: React.ReactNode;
};

export function ArticleLayout({ item, children }: ArticleLayoutProps) {
  return (
    <main className="mx-auto max-w-[820px] px-5 py-12 lg:px-8">
      <article className="rounded-[2rem] border border-line bg-surface/90 p-6 shadow-[var(--shadow-paper)] md:p-10">
        <ArticleMeta item={item} />
        <h1 className="mt-5 font-display text-5xl font-semibold leading-none tracking-tight text-ink md:text-6xl">
          {item.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-ink">{item.summary}</p>
        <div className="mt-6">
          <TagList tags={item.tags} />
        </div>
        <div className="mt-10 border-t border-line pt-8">{children}</div>
      </article>
    </main>
  );
}

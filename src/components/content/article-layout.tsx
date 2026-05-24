import Link from "next/link";
import { ArticleMeta } from "@/components/content/article-meta";
import { TagList } from "@/components/content/tag-list";
import type { GardenContent } from "@/lib/types";

type ArticleLayoutProps = {
  item: GardenContent;
  children: React.ReactNode;
};

export function ArticleLayout({ item, children }: ArticleLayoutProps) {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,760px)_300px] lg:px-8">
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
      <aside className="h-fit rounded-[1.5rem] border border-line bg-surface/76 p-5 shadow-[var(--shadow-note)] lg:sticky lg:top-28">
        <p className="font-display text-2xl font-semibold text-ink">索引卡</p>
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-clay">Summary</dt>
            <dd className="mt-1 leading-7 text-muted-ink">{item.summary}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.18em] text-clay">Tags</dt>
            <dd className="mt-2"><TagList tags={item.tags} /></dd>
          </div>
        </dl>
        <Link href="/archive" className="mt-6 inline-flex rounded-full border border-line px-4 py-2 text-sm text-muted-ink transition hover:bg-surface-soft hover:text-ink">
          查看归档
        </Link>
      </aside>
    </main>
  );
}

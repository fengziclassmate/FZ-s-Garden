import { ArticleCard } from "@/components/content/article-card";
import { PageShell } from "@/components/layout/page-shell";
import { getContentByType } from "@/lib/content";
import { auth } from "@/auth/auth";
import Link from "next/link";

export default async function BehindPage() {
  const items = await getContentByType("behind");
  const session = await auth();

  return (
    <PageShell eyebrow="Behind" title="幕后" description="记录这个网站的设计理念、技术栈、内容系统和更新日志。">
      {session ? (
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/behind/write"
            className="rounded-lg bg-[#2d2a24] px-4 py-2 text-sm text-white hover:bg-[#4a453c] transition-colors"
          >
            + 写文章
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-[#7a756c] hover:text-[#2d2a24] transition-colors"
            >
              退出 ({session.user?.name})
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6">
          <Link
            href="/behind/write"
            className="rounded-lg bg-[#2d2a24] px-4 py-2 text-sm text-white hover:bg-[#4a453c] transition-colors"
          >
            登录后写文章
          </Link>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ArticleCard key={item.slug} item={item} />
        ))}
      </div>
    </PageShell>
  );
}

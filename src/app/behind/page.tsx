export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { ArticleCard } from "@/components/content/article-card";
import { PageShell } from "@/components/layout/page-shell";
import { getContentByType } from "@/lib/content";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { BehindCardWithActions } from "./behind-card-actions";

export default async function BehindPage() {
  const items = await getContentByType("behind");
  const session = await getSession();

  return (
    <PageShell
      eyebrow="Behind"
      title="幕后"
      description="记录这个网站的设计理念、技术栈、内容系统和更新日志。"
    >
      {session ? (
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/behind/write"
            className="rounded-lg bg-[#e9e6df] px-4 py-2 text-sm text-[#2d2a24] hover:bg-[#ddd9d0] transition-colors"
          >
            + 写文章
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-[#7a756c] hover:text-[#2d2a24] transition-colors"
            >
              退出({session.name})
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6">
          <a
            href="/api/auth/github"
            className="inline-block rounded-lg bg-[#e9e6df] px-4 py-2 text-sm text-[#2d2a24] hover:bg-[#ddd9d0] transition-colors"
          >
            GitHub 登录 → 写文章
          </a>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.slug} className="group relative">
            <ArticleCard item={item} />
            <BehindCardWithActions
              type={item.type}
              slug={item.slug}
              title={item.title}
            />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

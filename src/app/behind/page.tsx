export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { PageShell } from "@/components/layout/page-shell";
import { getAllContent } from "@/lib/content";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { ArticleManagerClient } from "./article-manager";

export default async function BehindPage() {
  const allItems = await getAllContent();
  const session = await getSession();

  return (
    <PageShell
      eyebrow="Behind"
      title="幕后"
      description="管理所有文章：编辑、删除、撰写。"
    >
      {session ? (
        <>
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
          <ArticleManagerClient items={allItems} />
        </>
      ) : (
        <div className="mb-6">
          <a
            href="/api/auth/github"
            className="inline-block rounded-lg bg-[#e9e6df] px-4 py-2 text-sm text-[#2d2a24] hover:bg-[#ddd9d0] transition-colors"
          >
            GitHub 登录 → 管理文章
          </a>
        </div>
      )}
    </PageShell>
  );
}

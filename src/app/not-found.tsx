import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export default function NotFound() {
  return (
    <PageShell eyebrow="404" title="这页笔记暂时找不到">
      <p className="max-w-2xl text-muted-ink">
        可能是链接移动了，也可能这页还在草稿本里。可以回到首页继续浏览。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full border border-line bg-surface px-5 py-2 text-sm text-ink shadow-[var(--shadow-note)] transition hover:-translate-y-0.5"
      >
        返回首页
      </Link>
    </PageShell>
  );
}

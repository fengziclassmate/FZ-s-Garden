import Link from "next/link";
import { nowStatus } from "@/data/now";

export function NowCard() {
  return (
    <section className="rounded-[1.75rem] border border-line bg-surface/82 p-6 shadow-[var(--shadow-note)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-clay">Now</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink">最近在做什么</h2>
        </div>
        <Link href="/now" className="rounded-full border border-line px-4 py-2 text-sm text-muted-ink transition hover:bg-surface-soft hover:text-ink">
          详情
        </Link>
      </div>
      <p className="mt-5 text-lg leading-8 text-muted-ink">{nowStatus.focus}</p>
    </section>
  );
}

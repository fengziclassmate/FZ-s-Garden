import Link from "next/link";
import { whispers } from "@/data/journal-modules";
import { formatDate } from "@/lib/dates";

export default function WhispersPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <Link href="/journal" className="text-sm font-semibold text-muted-ink transition hover:text-ink">
        Back to Journal
      </Link>
      <section className="mt-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Whispers</p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">Whispers</h1>
        <p className="mt-5 text-lg leading-8 text-muted-ink">
          不需要标题的小想法、碎片句子和一闪而过的感受会放在这里。
        </p>
      </section>

      <section className="mt-10">
        {whispers.length > 0 ? (
          <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {whispers.map((whisper) => (
              <article
                key={whisper.id}
                className="mb-4 break-inside-avoid rounded-2xl border border-white/70 bg-white/58 p-5 shadow-[var(--shadow-note)] backdrop-blur"
              >
                <p className="text-base leading-8 text-ink">{whisper.text}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-ink">
                  <time>{formatDate(whisper.date)}</time>
                  {whisper.tone ? <span>{whisper.tone}</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white/42 p-10 text-center">
            <p className="font-display text-2xl font-bold text-ink">Whispers 还没有公开内容</p>
            <p className="mt-3 text-sm text-muted-ink">先留白，等一句刚好出现的话。</p>
          </div>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import { moments } from "@/data/journal-modules";
import { formatDate } from "@/lib/dates";

export default function MomentPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <Link href="/journal" className="text-sm font-semibold text-muted-ink transition hover:text-ink">
        Back to Journal
      </Link>
      <section className="mt-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Moment</p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">Moment</h1>
        <p className="mt-5 text-lg leading-8 text-muted-ink">
          日常片段、照片、地点和小高光会在这里排成一条轻量时间流。
        </p>
      </section>

      <section className="mt-10">
        {moments.length > 0 ? (
          <div className="space-y-5">
            {moments.map((moment) => (
              <article key={moment.id} className="rounded-2xl border border-white/70 bg-white/58 p-5 shadow-[var(--shadow-note)] backdrop-blur">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-ink">
                  <time>{formatDate(moment.date)}</time>
                  {moment.location ? <span>{moment.location}</span> : null}
                  {moment.mood ? <span>{moment.mood}</span> : null}
                </div>
                <p className="mt-4 text-base leading-8 text-ink">{moment.text}</p>
                {moment.images?.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {moment.images.map((src) => (
                      <img key={src} src={src} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white/42 p-10 text-center">
            <p className="font-display text-2xl font-bold text-ink">Moment 还没有公开内容</p>
            <p className="mt-3 text-sm text-muted-ink">等下一次值得留下来的日常。</p>
          </div>
        )}
      </section>
    </main>
  );
}

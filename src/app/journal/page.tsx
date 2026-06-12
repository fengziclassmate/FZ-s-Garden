import Link from "next/link";
import { journalModules } from "@/data/journal-modules";
import { getContentByType } from "@/lib/content";
import { formatDate } from "@/lib/dates";

export default async function JournalPage() {
  const posts = await getContentByType("journal");

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <section className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Journal</p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">
          Pick a way to keep today
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-ink">
          Journal 现在分成三种入口：Moment 放日常图文，Whisper 放短句碎念，Blogs 放完整长记录。
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {journalModules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group rounded-2xl border border-white/70 bg-white/58 p-6 shadow-[var(--shadow-note)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/76"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">{module.eyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-ink">{module.label}</h2>
              </div>
              <span className="grid size-12 place-items-center rounded-full bg-sage/12 font-display text-xl font-bold text-sage transition group-hover:rotate-6 group-hover:bg-clay/12 group-hover:text-clay">
                {module.mark}
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-ink">{module.description}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">Blogs</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">Long Journal Notes</h2>
          </div>
          <Link href="/blogs?type=journal" className="text-sm font-semibold text-muted-ink transition hover:text-ink">
            View all
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-3">
            {posts.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="grid gap-3 rounded-xl border border-white/70 bg-white/50 p-4 transition hover:bg-white/72 md:grid-cols-[120px_1fr]"
              >
                <time className="text-sm text-muted-ink">{formatDate(post.date)}</time>
                <span>
                  <span className="block font-semibold text-ink">{post.title}</span>
                  {post.summary ? <span className="mt-1 block text-sm leading-6 text-muted-ink">{post.summary}</span> : null}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white/42 p-8 text-center text-muted-ink">
            还没有公开的长篇 Journal。
          </div>
        )}
      </section>
    </main>
  );
}

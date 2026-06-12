import Link from "next/link";
import { whispers, type WhisperEntry } from "@/data/journal-modules";
import { formatDate } from "@/lib/dates";

const previewWhispers: WhisperEntry[] = [
  {
    id: "preview-1",
    date: "2026-06-12",
    text: "这里适合放一句没有标题的小想法。",
    tone: "note",
  },
  {
    id: "preview-2",
    date: "2026-06-12",
    text: "也可以是一段很短的情绪、灵感或自言自语。",
    tone: "whisper",
  },
  {
    id: "preview-3",
    date: "2026-06-12",
    text: "不需要变成文章，只要被温柔地收起来。",
    tone: "soft",
  },
];

export default function WhisperPage() {
  const list = whispers.length > 0 ? whispers : previewWhispers;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <Link href="/journal" className="text-sm font-semibold text-muted-ink transition hover:text-ink">
        Back to Journal
      </Link>
      <section className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Whisper</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">Whisper</h1>
          <p className="mt-5 text-lg leading-8 text-muted-ink">
            不需要标题的小想法、碎片句子和一闪而过的感受会放在这里，像一组轻轻贴上的便签。
          </p>
        </div>
        {whispers.length === 0 ? (
          <span className="rounded-full border border-dashed border-line bg-white/48 px-4 py-2 text-sm text-muted-ink">
            当前显示样式预览
          </span>
        ) : null}
      </section>

      <section className="mt-10 columns-1 gap-4 md:columns-2 xl:columns-3">
        {list.map((whisper, index) => (
          <article
            key={whisper.id}
            className={`mb-4 break-inside-avoid rounded-[1.3rem] border border-white/70 p-5 shadow-[var(--shadow-note)] backdrop-blur ${
              index % 3 === 0
                ? "bg-washi-yellow/42"
                : index % 3 === 1
                  ? "bg-washi-green/42"
                  : "bg-washi-pink/36"
            }`}
          >
            <p className="text-base leading-8 text-ink">{whisper.text}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-ink">
              <time>{formatDate(whisper.date)}</time>
              {whisper.tone ? <span>{whisper.tone}</span> : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

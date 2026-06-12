import Link from "next/link";
import { moments, type MomentEntry } from "@/data/journal-modules";
import { formatDate } from "@/lib/dates";

const avatarSrc = "/home/fengzi-avatar.jpg";

const previewMoment: MomentEntry = {
  id: "preview",
  date: "2026-06-12",
  text: "这里会显示一段像朋友圈一样的日常记录。以后你可以放照片、地点、当天心情，也可以加几条评论。",
  location: "Somewhere",
  mood: "soft day",
  images: ["/home/fengzi-avatar.jpg", "/home/pressed-leaves.svg", "/home/study-desk.svg"],
  comments: [
    { name: "FengZi", text: "这一块后续会替换成你的真实内容。" },
    { name: "Journal", text: "支持文字、图片和评论式补充。" },
  ],
};

function MomentCard({ moment, preview = false }: { moment: MomentEntry; preview?: boolean }) {
  return (
    <article className="rounded-[1.4rem] border border-white/70 bg-white/64 p-5 shadow-[0_18px_48px_rgba(100,115,90,0.10)] backdrop-blur">
      <div className="grid grid-cols-[52px_1fr] gap-4">
        <img src={avatarSrc} alt="" className="size-12 rounded-xl border-4 border-white object-cover object-[78%_42%]" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold leading-none text-ink">FengZi</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-ink/70">
                <time>{formatDate(moment.date)}</time>
                {moment.location ? <span>{moment.location}</span> : null}
                {moment.mood ? <span>{moment.mood}</span> : null}
              </div>
            </div>
            {preview ? (
              <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage">Preview</span>
            ) : null}
          </div>

          <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-8 text-ink/90">{moment.text}</p>

          {moment.images?.length ? (
            <div className={`mt-4 grid gap-2 ${moment.images.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
              {moment.images.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`${moment.images?.length === 1 ? "aspect-[4/3]" : "aspect-square"} w-full rounded-lg border border-white/70 bg-surface/70 object-cover`}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-4 border-t border-line/55 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-ink/70">
            <span>Like</span>
            <span>Comment</span>
            <span>Share</span>
          </div>

          {moment.comments?.length ? (
            <div className="mt-3 rounded-xl bg-surface-soft/55 p-3 text-sm leading-7 text-muted-ink">
              {moment.comments.map((comment) => (
                <p key={`${comment.name}-${comment.text}`}>
                  <span className="font-semibold text-ink/80">{comment.name}: </span>
                  {comment.text}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function MomentPage() {
  const list = moments.length > 0 ? moments : [previewMoment];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <Link href="/journal" className="text-sm font-semibold text-muted-ink transition hover:text-ink">
        Back to Journal
      </Link>
      <section className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-clay">Moment</p>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">Moment</h1>
          <p className="mt-5 text-lg leading-8 text-muted-ink">
            像朋友圈一样记录当天的小片段。图片、文字、地点和评论会排成一条轻量时间流。
          </p>
        </div>
        {moments.length === 0 ? (
          <span className="rounded-full border border-dashed border-line bg-white/48 px-4 py-2 text-sm text-muted-ink">
            当前显示样式预览
          </span>
        ) : null}
      </section>

      <section className="mt-10 space-y-5">
        {list.map((moment) => (
          <MomentCard key={moment.id} moment={moment} preview={moments.length === 0} />
        ))}
      </section>
    </main>
  );
}

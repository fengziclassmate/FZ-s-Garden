import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { NowBoard } from "@/components/now/now-board";
import { site } from "@/data/site";

export default function MePage() {
  return (
    <PageShell eyebrow="Me" title="关于我" description="自我介绍、当前状态和日常碎片。">
      {/* ── 头像 + 一句话介绍 ── */}
      <section className="mb-10 flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-8">
        {/* 头像占位 - 放你自己的照片后替换 src 和 alt */}
        <div className="shrink-0">
          <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-line bg-[var(--color-washi-yellow)]/40 flex items-center justify-center overflow-hidden shadow-md">
            <span className="text-4xl opacity-40">📷</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <p className="font-display text-2xl font-semibold text-ink">你叫什么名字呢? 👋</p>
          <p className="mt-3 max-w-lg text-base leading-7 text-muted-ink">
            这里写一句你的自我介绍或签名。可以是一句话描述你是谁、在研究什么、做这个网站的初衷。后续可以在这里补 full description。
          </p>
          <p className="mt-2 text-sm text-muted-ink/70">
            <a href={`mailto:${site.email}`} className="underline decoration-clay/40 underline-offset-2 hover:decoration-clay">{site.email}</a>
          </p>
        </div>
      </section>

      {/* ── 便利贴卡片区：写你关心的事情 ── */}
      <section className="mb-14">
        <SectionHeading title="最近关心" eyebrow="Things I Care About" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              bg: "bg-[var(--color-washi-yellow)]/70",
              rotate: "-rotate-1",
              title: "🔬  研究",
              text: "这里写你当前的研究方向、课题、正在探索的问题。后续可以补充具体内容。",
            },
            {
              bg: "bg-[var(--color-soft-rose)]/60",
              rotate: "rotate-1",
              title: "📖  阅读",
              text: "最近在读什么书、什么论文。可以写你的阅读习惯、关注领域、推荐的读物。",
            },
            {
              bg: "bg-[var(--color-mist-blue)]/55",
              rotate: "-rotate-[1.5deg]",
              title: "✍️  写作",
              text: "关于写博客/日记的习惯，写作如何帮助思考。你想通过这个网站分享什么。",
            },
            {
              bg: "bg-[var(--color-washi-green)]/70",
              rotate: "rotate-[0.5deg]",
              title: "🌱  生活",
              text: "博士生活之外的事。爱好、日常节奏、让你保持清醒的小习惯。",
            },
            {
              bg: "bg-[var(--color-sage)]/30",
              rotate: "-rotate-[0.8deg]",
              title: "🎯  目标",
              text: "短期的里程碑和长期的方向。比如毕业计划、技能目标、想完成的项目。",
            },
            {
              bg: "bg-[var(--color-washi-pink)]/55",
              rotate: "rotate-[1.2deg]",
              title: "💭  想法",
              text: "一些碎片思考、灵感、或者只是想记录下来的句子。",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} ${card.rotate} rounded-2xl border border-line/60 p-5 shadow-[var(--shadow-note)] backdrop-blur-sm transition hover:shadow-md hover:-translate-y-0.5`}
            >
              <p className="font-display text-lg font-semibold text-ink">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted-ink">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 拍立得相册区 ── */}
      <section className="mb-14">
        <SectionHeading title="生活碎片" eyebrow="Snapshots" />
        <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
          {[
            { rotate: "-rotate-3", caption: "照片 1" },
            { rotate: "rotate-2", caption: "照片 2" },
            { rotate: "-rotate-1", caption: "照片 3" },
            { rotate: "rotate-3", caption: "照片 4" },
            { rotate: "-rotate-2", caption: "照片 5" },
          ].map((pic, i) => (
            <div
              key={i}
              className={`${pic.rotate} w-36 shrink-0 rounded-xl border border-line bg-white p-2 pb-8 shadow-[var(--shadow-note)] transition hover:scale-105 hover:shadow-md`}
            >
              <div className="aspect-square w-full rounded-lg bg-[var(--color-surface-soft)] flex items-center justify-center">
                <span className="text-2xl opacity-30">🖼️</span>
              </div>
              <p className="mt-1.5 text-center text-xs text-muted-ink">{pic.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quotes 引用区 ── */}
      <section className="mb-14">
        <SectionHeading title="最近在想的句子" eyebrow="Quotes" />
        <div className="space-y-4">
          {[
            { quote: "这里放一句你喜欢的引用或者自己写的句子。后续可以替换成真实内容。", tag: "#placeholder" },
            { quote: "也可以放你正在看的论文里击中你的一句话。", tag: "#reading" },
          ].map((q, i) => (
            <blockquote
              key={i}
              className="relative rounded-2xl border border-line bg-surface/70 p-5 pl-7 shadow-[var(--shadow-note)]"
            >
              <span className="absolute left-3 top-3 text-2xl text-clay/30 leading-none">&ldquo;</span>
              <p className="text-base leading-8 text-ink italic">{q.quote}</p>
              <p className="mt-2 text-xs text-muted-ink/60">{q.tag}</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── Now 当前状态 ── */}
      <section className="mb-10">
        <NowBoard />
      </section>
    </PageShell>
  );
}

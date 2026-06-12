import Link from "next/link";

const entries = [
  { href: "/blogs", mark: "📝", title: "Blogs", label: "随心（水星）记" },
  { href: "/portfolio", mark: "🛠", title: "Portfolio", label: "AI鼎力相助" },
  { href: "/me", mark: "🌿", title: "Me", label: "疯子同学自传" },
  { href: "/behind", mark: "⚙️", title: "Behind", label: "舞台幕后" },
];

export function GardenEntryGrid() {
  return (
    <section className="relative z-10 mt-10 grid w-full max-w-xs grid-cols-2 gap-4">
      {entries.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          className="group relative flex flex-col items-center gap-2 rounded-xl border border-white/65 bg-white/45 px-4 py-5 shadow-[0_8px_24px_rgba(100,115,90,0.06)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/85 hover:bg-white/65 hover:shadow-[0_12px_30px_rgba(100,115,90,0.1)]"
        >
          {/* 图标 */}
          <span className="text-xl transition duration-200 group-hover:scale-110 group-hover:-rotate-3">
            {entry.mark}
          </span>
          {/* 标题 */}
          <span className="text-center">
            <span className="block text-sm font-semibold text-ink">{entry.title}</span>
            <span className="mt-0.5 block text-[0.7rem] text-muted-ink/60">{entry.label}</span>
          </span>
          {/* hover 箭头提示 */}
          <span className="absolute right-2.5 top-2.5 text-[0.55rem] text-muted-ink/25 transition group-hover:text-sage/50 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      ))}
    </section>
  );
}

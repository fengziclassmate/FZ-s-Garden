import Link from "next/link";

const entries = [
  { href: "/journal", mark: "J", title: "Journal", label: "Moment / Whisper / Blogs" },
  { href: "/portfolio", mark: "P", title: "Portfolio", label: "Projects and works" },
  { href: "/me", mark: "M", title: "Me", label: "About FengZi" },
  { href: "/behind", mark: "B", title: "Behind", label: "Site notes" },
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
          <span className="grid size-9 place-items-center rounded-full bg-sage/10 font-display text-base font-bold text-sage transition duration-200 group-hover:-rotate-3 group-hover:scale-110 group-hover:bg-clay/10 group-hover:text-clay">
            {entry.mark}
          </span>
          <span className="text-center">
            <span className="block text-sm font-semibold text-ink">{entry.title}</span>
            <span className="mt-0.5 block text-[0.7rem] leading-4 text-muted-ink/60">{entry.label}</span>
          </span>
          <span className="absolute right-2.5 top-2.5 text-[0.65rem] text-muted-ink/25 transition group-hover:translate-x-0.5 group-hover:text-sage/50">
            -&gt;
          </span>
        </Link>
      ))}
    </section>
  );
}

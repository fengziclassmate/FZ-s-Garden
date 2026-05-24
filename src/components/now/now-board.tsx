import { nowStatus } from "@/data/now";

const groups = [
  ["Reading", "最近在读", nowStatus.reading],
  ["Writing", "最近在写", nowStatus.writing],
  ["Research", "最近在研究", nowStatus.researching],
  ["Thinking", "最近在想", nowStatus.thinking],
  ["Life", "最近生活", nowStatus.life],
] as const;

export function NowBoard() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-[1.75rem] border border-line bg-surface/88 p-6 shadow-[var(--shadow-note)] lg:col-span-2">
        <p className="text-xs uppercase tracking-[0.28em] text-clay">Updated {nowStatus.updatedAt}</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-ink">当前主线</h2>
        <p className="mt-4 text-xl leading-9 text-muted-ink">{nowStatus.focus}</p>
      </section>
      {groups.map(([key, title, items]) => (
        <section key={key} className="rounded-[1.5rem] border border-line bg-surface/78 p-5 shadow-[var(--shadow-note)]">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">{key}</p>
          <h3 className="mt-2 font-display text-3xl font-semibold text-ink">{title}</h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-ink">
            {items.map((item) => (
              <li key={item} className="border-l-2 border-line pl-3">{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

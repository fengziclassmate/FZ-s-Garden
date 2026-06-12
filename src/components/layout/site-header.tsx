import Link from "next/link";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="flex w-full items-center justify-between px-8 py-3">
        {/* Logo — 严格靠左 */}
        <Link href="/" className="inline-flex shrink-0 items-center gap-2.5 group">
          <span className="grid size-10 place-items-center rounded-lg border border-white/70 bg-white/50 text-sm font-display font-semibold text-sage shadow-[0_3px_10px_rgba(100,115,90,0.06)] transition group-hover:shadow-[0_6px_18px_rgba(100,115,90,0.08)]">
            🌱
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink/85">
            {site.name}
          </span>
        </Link>

        {/* Navigation — 严格靠右 */}
        <nav className="flex items-center gap-1 text-muted-ink">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-4 py-2 text-base whitespace-nowrap transition-colors hover:bg-white/45 hover:text-ink"
            >
              {item.emoji && <span className="mr-1">{item.emoji}</span>}{item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

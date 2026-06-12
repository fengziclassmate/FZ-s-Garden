import Link from "next/link";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="flex w-full items-center justify-between px-8 py-3">
        <Link href="/" className="group inline-flex shrink-0 items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-lg border border-white/70 bg-white/50 font-display text-sm font-semibold text-sage shadow-[0_3px_10px_rgba(100,115,90,0.06)] transition group-hover:shadow-[0_6px_18px_rgba(100,115,90,0.08)]">
            G
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink/85">{site.name}</span>
        </Link>

        <nav className="flex items-center gap-1 text-muted-ink">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="inline-flex shrink-0 items-center rounded-lg px-4 py-2 text-base transition-colors hover:bg-white/45 hover:text-ink"
              >
                {item.label}
                {item.children?.length ? <span className="ml-1 text-xs text-muted-ink/70">v</span> : null}
              </Link>
              {item.children?.length ? (
                <div className="invisible absolute right-0 top-full z-40 mt-2 min-w-40 rounded-xl border border-white/70 bg-white/82 p-2 opacity-0 shadow-[0_18px_42px_rgba(100,115,90,0.12)] backdrop-blur transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted-ink transition hover:bg-surface-soft/70 hover:text-ink"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* 主行 */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="site-footer__title">{site.title}</p>
            <p className="site-footer__description">{site.description}</p>
          </div>
          <div className="site-footer__links">
            <Link href="/me">About</Link>
            <Link href="/blogs">Blogs</Link>
            <Link href="/behind">Behind</Link>
          </div>
        </div>
        {/* 脚注 */}
        <div className="mt-4 flex items-center gap-2 text-[0.65rem] text-muted-ink/50 md:mt-6">
          <span>🌱</span>
          <span>crafted with curiosity</span>
        </div>
      </div>
    </footer>
  );
}

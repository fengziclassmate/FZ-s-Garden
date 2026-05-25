import { PageShell } from "@/components/layout/page-shell";
import { getContentByType } from "@/lib/content";
import type { ProjectContent } from "@/lib/types";
import Link from "next/link";

const statusOrder = ["building", "finished", "paused", "idea"];

const statusLabels: Record<string, string> = {
  building: "建设中",
  finished: "已完成",
  paused: "暂停",
  idea: "想法中",

};

const projectTypeEmoji: Record<string, string> = {
  research: "🔬",
  code: "💻",
  "personal-tool": "🔧",
  writing: "📖",
  website: "🌐",
};

export default async function PortfolioPage() {
  const items = (await getContentByType("project")) as ProjectContent[];

  // 按 status 分组
  const grouped: Record<string, ProjectContent[]> = {};
  for (const item of items) {
    const s = item.status || "building";
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(item);
  }

  const sortedGroups = statusOrder.filter((s) => grouped[s]);

  return (
    <PageShell
      eyebrow="Portfolio"
      title="作品集"
      description="科研项目、代码项目和个人小工具。这里展示的是过程、状态和下一步，而不只是成果。"
    >
      <div className="space-y-10">
        {sortedGroups.map((statusKey) => (
          <section key={statusKey}>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-[#a6a097] uppercase tracking-wider">
                {statusLabels[statusKey] || statusKey}
              </span>
              <span className="rounded-full bg-[#f0ede6] px-2 py-0.5 text-xs text-[#7a756c]">
                {grouped[statusKey].length}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {grouped[statusKey].map((item) => (
                <article
                  key={item.slug}
                  className="group relative flex flex-col rounded-2xl border border-[#ece9e1] bg-white/70 p-6 transition hover:-translate-y-0.5 hover:shadow-sm hover:border-[#d8d3c8]"
                >
                  {/* 顶部状态标签 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {projectTypeEmoji[item.projectType || ""] || "📦"}
                      </span>
                      <span className="rounded-md bg-[#f5f2ec] px-2 py-0.5 text-[11px] text-[#7a756c]">
                        {item.projectType || "project"}
                      </span>
                    </div>
                  </div>

                  {/* 标题 */}
                  <h2 className="mt-4 text-lg font-semibold leading-snug text-[#2d2a24]">
                    <Link href={`/portfolio/${item.slug}`} className="after:absolute after:inset-0">
                      {item.title}
                    </Link>
                  </h2>

                  {/* 摘要 */}
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#7a756c]">
                    {item.summary}
                  </p>

                  {/* 标签 */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[#f0ede6] px-2 py-0.5 text-[11px] text-[#7a756c]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 底部按钮 */}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    {(item as any).linkGithub && (
                      <a
                        href={(item as any).linkGithub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 rounded-lg border border-[#e2dfd6] bg-white px-3 py-1.5 text-xs text-[#7a756c] transition hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {(item as any).linkDemo && (
                      <a
                        href={(item as any).linkDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 rounded-lg border border-[#e2dfd6] bg-white px-3 py-1.5 text-xs text-[#7a756c] transition hover:bg-[#f5f2ec] hover:text-[#2d2a24]"
                      >
                        Demo ↗
                      </a>
                    )}
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="relative z-10 ml-auto rounded-lg bg-[#2d2a24] px-3 py-1.5 text-xs !text-white transition hover:bg-[#4a453c]"
                    >
                      详情 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

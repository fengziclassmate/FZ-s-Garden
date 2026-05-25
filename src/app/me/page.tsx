import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/layout/section-heading";
import { NowBoard } from "@/components/now/now-board";
import { site } from "@/data/site";

export default async function MePage() {
  return (
    <PageShell eyebrow="Me" title="关于我" description="自我介绍和当前状态。">
      {/* 自我介绍 */}
      <section className="mb-12 grid gap-5 lg:grid-cols-[1fr_320px]">
        <article className="rounded-[2rem] border border-line bg-surface/88 p-7 shadow-[var(--shadow-paper)]">
          <div className="prose-garden">
            <h2>我是谁</h2>
            <p>
              我是一名正在训练自己长期阅读、稳定写作和持续研究的博士生。这个网站记录我公开愿意分享的博士生活、科研过程和阅读积累。
            </p>
            <h2>我关心什么</h2>
            <p>
              我关心研究问题如何形成，文献如何真正进入写作，项目如何从模糊想法长成可复盘的结构，也关心博士生活中那些缓慢但重要的节奏。
            </p>
            <h2>联系方式</h2>
            <p>
              可以通过 <a href={`mailto:${site.email}`}>{site.email}</a> 联系我。
            </p>
          </div>
        </article>
        <aside className="rounded-[1.5rem] border border-line bg-surface/76 p-6 shadow-[var(--shadow-note)]">
          <p className="font-note text-lg text-ink">这个网站的边界</p>
          <p className="mt-4 text-sm leading-7 text-muted-ink">
            这里记录公开版本的成长轨迹，不直接展示私人日程、敏感数据、未公开论文核心内容或他人隐私。
          </p>
        </aside>
      </section>

      {/* 当前状态 Now */}
      <section className="mb-14">
        <SectionHeading title="当前状态" />
        <NowBoard />
      </section>
    </PageShell>
  );
}

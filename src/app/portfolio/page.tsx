import { PageShell } from "@/components/layout/page-shell";
import { ProjectCard } from "@/components/projects/project-card";
import { getContentByType } from "@/lib/content";

export default async function PortfolioPage() {
  const items = await getContentByType("project");

  return (
    <PageShell eyebrow="Portfolio" title="作品集" description="科研项目、代码项目和个人小工具。这里展示的是过程、状态和下一步，而不只是成果。">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ProjectCard key={item.slug} item={item} />
        ))}
      </div>
    </PageShell>
  );
}

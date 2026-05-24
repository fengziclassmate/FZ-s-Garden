import { GardenEntryGrid } from "@/components/home/garden-entry-grid";
import { HomeDecor } from "@/components/home/home-decor";
import { HomeHero } from "@/components/home/home-hero";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <main className="home-canvas relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center overflow-hidden px-5 py-6 lg:px-8">
      <HomeDecor />
      <div className="relative z-10 flex w-full flex-col items-center">
        <HomeHero />
        <GardenEntryGrid />
      </div>
      <SiteFooter />
    </main>
  );
}

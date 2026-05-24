import { AnimatedWelcome } from "@/components/home/animated-welcome";
import { LikeButton } from "@/components/home/like-button";

export function HomeHero() {
  return (
    <section className="relative z-10 flex max-w-3xl flex-col items-center text-center">
      {/* 头像 — 绝对定位，固定 92x92 正方形 + overflow hidden，圆角永不塌陷 */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '-4rem',
          width: 92,
          height: 92,
          borderRadius: 9999,
          overflow: 'hidden',
          border: '5px solid rgba(255, 253, 245, 0.85)',
          boxShadow: '0 6px 24px rgba(100, 115, 90, 0.06)',
        }}
      >
        <img
          src="/home/fengzi-avatar.jpg"
          alt="FengZi avatar"
          width={92}
          height={92}
          className="home-avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '78% 42%' }}
        />
      </div>

      {/* 标题 — padding-top 给头像让出空间 */}
      <h1 className="pt-14 font-display text-3xl font-bold text-ink sm:text-5xl sm:pt-16 md:text-6xl xl:text-7xl">
        <AnimatedWelcome />
      </h1>

      <LikeButton />

      {/* 署名 */}
      <p className="mt-5 font-note text-sm text-muted-ink/70 md:text-base">
        <span className="mr-1.5 opacity-40">✎</span>
        Hi, this is FengZi.
      </p>
    </section>
  );
}

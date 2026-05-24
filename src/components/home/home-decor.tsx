import type { CSSProperties } from "react";

type DecorItem = {
  src: string;
  alt: string;
  style: CSSProperties;
};

const decorItems: DecorItem[] = [
  {
    src: "/home/washi-tape.svg",
    alt: "Washi tape and leaves",
    style: {
      left: "clamp(-2rem, 4vw, 3rem)",
      top: "clamp(0.5rem, 3vh, 2rem)",
      width: "clamp(120px, 18vw, 200px)",
      transform: "rotate(-4deg)",
    },
  },
  {
    src: "/home/tea-sticker.svg",
    alt: "Tea cup and flowers",
    style: {
      right: "clamp(-1rem, 5vw, 4rem)",
      bottom: "clamp(1rem, 5vh, 3rem)",
      width: "clamp(130px, 18vw, 220px)",
      transform: "rotate(5deg)",
    },
  },
];

export function HomeDecor() {
  return (
    <div className="home-decor" aria-hidden="true">
      {decorItems.map((item) => (
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          className="home-decor__image"
          style={item.style}
        />
      ))}
    </div>
  );
}

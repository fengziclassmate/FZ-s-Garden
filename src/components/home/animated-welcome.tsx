"use client";

import { useEffect, useState } from "react";

const welcomeText = "Welcome to My Garden";
const displayedWelcomeText = "Welcome\u00a0to\u00a0My\u00a0Garden";
const trailingSpace = "\u00a0\u00a0\u00a0\u00a0";
const animatedText = `${displayedWelcomeText}${trailingSpace}`;

type MotionPhase = "typing" | "holding" | "deleting" | "resting";

export function AnimatedWelcome() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<MotionPhase>("typing");

  useEffect(() => {
    const delayByPhase: Record<MotionPhase, number> = {
      typing: 120,
      holding: 1900,
      deleting: 82,
      resting: 520,
    };

    const timer = window.setTimeout(() => {
      if (phase === "typing") {
        if (visibleCount < animatedText.length) {
          setVisibleCount((count) => count + 1);
          return;
        }

        setPhase("holding");
        return;
      }

      if (phase === "holding") {
        setPhase("deleting");
        return;
      }

      if (phase === "deleting") {
        if (visibleCount > 0) {
          setVisibleCount((count) => count - 1);
          return;
        }

        setPhase("resting");
        return;
      }

      setPhase("typing");
    }, delayByPhase[phase]);

    return () => window.clearTimeout(timer);
  }, [phase, visibleCount]);

  return (
    <span className="animated-welcome" aria-label={welcomeText}>
      <span aria-hidden="true">{animatedText.slice(0, visibleCount) || "\u00a0"}</span>
      <span className="animated-welcome__caret" aria-hidden="true" />
    </span>
  );
}

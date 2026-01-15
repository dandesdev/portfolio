import type { RefObject } from "react";
import { useLenis } from "lenis/react";

export const useScrollBlur = (ref: RefObject<HTMLElement | null>) => {
  useLenis(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate progress: 1 when at or below bottom, 0 when higher up
    // Start blurring when element is near bottom (e.g. 90% down)
    // Full blur at bottom (100% down)
    // No blur when it reaches say 80% down

    const startFade = viewportHeight;
    const endFade = viewportHeight * 0.8;

    // progress goes from 1 (at startFade) to 0 (at endFade)
    const rawProgress = (rect.top - endFade) / (startFade - endFade);
    const progress = Math.max(0, Math.min(1, rawProgress));

    const maxBlur = 6;
    const blurAmount = maxBlur * progress;

    if (progress > 0) {
      ref.current.style.filter = `blur(${blurAmount}px)`;
      // Using a glow effect with the primary color
      const shadowBlur = blurAmount * 3;
      ref.current.style.textShadow = `0 0 ${shadowBlur}px rgb(var(--primary) / ${0.5 * progress})`;
    } else {
      ref.current.style.filter = "none";
      ref.current.style.textShadow = "none";
    }
  });
};

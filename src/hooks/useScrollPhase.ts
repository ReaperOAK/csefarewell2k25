'use client';

import { useEffect, useRef, useCallback } from 'react';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function opacityWindow(
  progress: number,
  fadeInStart: number,
  fullInAt: number,
  fadeOutStart: number,
  goneAt: number
): number {
  return Math.min(
    clamp((progress - fadeInStart) / Math.max(0.001, fullInAt - fadeInStart), 0, 1),
    clamp((goneAt - progress) / Math.max(0.001, goneAt - fadeOutStart), 0, 1)
  );
}

export function useScrollPhase(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onPhaseChange?: (phase: number, lastPhase: number) => void
) {
  const lastPhaseRef = useRef(0);
  const rafRef = useRef(0);
  const pendingRef = useRef(false);
  const framesRef = useRef<Element[]>([]);

  const flushScrollState = useCallback(() => {
    pendingRef.current = false;
    const container = containerRef.current;
    if (!container) return;

    // Cache transition frames on first run
    if (framesRef.current.length === 0) {
      framesRef.current = Array.from(container.querySelectorAll('.transition-frame'));
    }

    const maxScroll = Math.max(1, container.scrollHeight - window.innerHeight);
    const progress = clamp(window.scrollY / maxScroll, 0, 1);
    const light = clamp(Math.sin(progress * Math.PI) * 1.18, 0, 1);
    const quiet = clamp((progress - 0.72) / 0.22, 0, 1);
    const phase = Math.min(6, Math.floor(progress * 7));
    const transitionProgress = clamp((progress - 0.16) / 0.78, 0, 1);
    const transitionFadeIn = clamp((progress - 0.12) / 0.1, 0, 1);
    const transitionFadeOut = clamp((0.985 - progress) / 0.035, 0, 1);
    const transitionOpacity = Math.min(transitionFadeIn, transitionFadeOut) * 0.86;

    const root = document.documentElement;
    const s = root.style;
    s.setProperty('--scroll', progress.toFixed(4));
    s.setProperty('--phase-light', light.toFixed(4));
    s.setProperty('--phase-quiet', quiet.toFixed(4));
    s.setProperty('--transition-opacity', transitionOpacity.toFixed(4));
    s.setProperty('--transition-zoom', transitionProgress.toFixed(4));
    s.setProperty('--transition-tilt', ((transitionProgress - 0.5) * 2).toFixed(4));
    s.setProperty('--hero-opacity', opacityWindow(progress, -0.02, 0, 0.1, 0.17).toFixed(4));
    s.setProperty('--hero-bg-opacity', opacityWindow(progress, -0.02, 0, 0.14, 0.24).toFixed(4));
    s.setProperty('--beat-one', opacityWindow(progress, 0.18, 0.23, 0.29, 0.35).toFixed(4));
    s.setProperty('--beat-two', opacityWindow(progress, 0.37, 0.42, 0.48, 0.54).toFixed(4));
    s.setProperty('--beat-three', opacityWindow(progress, 0.56, 0.61, 0.67, 0.73).toFixed(4));
    s.setProperty('--beat-four', opacityWindow(progress, 0.75, 0.8, 0.86, 0.9).toFixed(4));
    s.setProperty('--fragment-opacity', Math.max(
      opacityWindow(progress, 0.18, 0.23, 0.29, 0.35) * 0.38,
      opacityWindow(progress, 0.37, 0.42, 0.48, 0.54) * 0.82,
      opacityWindow(progress, 0.56, 0.61, 0.67, 0.73) * 0.42
    ).toFixed(4));
    s.setProperty('--intimate-opacity', opacityWindow(progress, 0.91, 0.925, 0.94, 0.955).toFixed(4));
    s.setProperty('--rsvp-opacity', clamp((progress - 0.965) / 0.035, 0, 1).toFixed(4));

    // Batch rsvp-quiet class
    document.body.classList.toggle('rsvp-quiet', progress > 0.9);

    // Update cached transition frames
    const frames = framesRef.current;
    if (frames.length > 0) {
      const transitionPosition = transitionProgress * (frames.length - 1);
      const transitionIndex = Math.floor(transitionPosition);
      const transitionMix = transitionPosition - transitionIndex;

      for (let i = 0, len = frames.length; i < len; i++) {
        const isCurrent = i === transitionIndex;
        const isNext = i === transitionIndex + 1;
        const currentOpacity = isCurrent ? 1 - transitionMix * 0.52 : 0;
        const nextOpacity = isNext ? transitionMix * 0.92 : 0;
        const frameOpacity = transitionOpacity > 0 ? Math.max(currentOpacity, nextOpacity) : 0;
        const frame = frames[i] as HTMLElement;
        frame.style.opacity = frameOpacity.toFixed(4);
        frame.classList.toggle('is-live', frameOpacity > 0.08);
      }
    }

    // Phase change callback
    if (phase !== lastPhaseRef.current) {
      onPhaseChange?.(phase, lastPhaseRef.current);
      lastPhaseRef.current = phase;
    }
  }, [containerRef, onPhaseChange]);

  // RAF-throttled scroll handler
  const scheduleUpdate = useCallback(() => {
    if (!pendingRef.current) {
      pendingRef.current = true;
      rafRef.current = requestAnimationFrame(flushScrollState);
    }
  }, [flushScrollState]);

  useEffect(() => {
    flushScrollState();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      cancelAnimationFrame(rafRef.current);
    };
  }, [flushScrollState, scheduleUpdate]);

  return { phaseNames: ['Silence', 'Emergence', 'Euphoria', 'Fragmentation', 'Intimacy', 'Afterglow', 'Disappearance'] };
}
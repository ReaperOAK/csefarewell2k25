'use client';

import { useEffect, useRef, useCallback } from 'react';

export interface ScrollState {
  progress: number;
  light: number;
  quiet: number;
  phase: number;
  heroOpacity: number;
  heroBgOpacity: number;
  beatOne: number;
  beatTwo: number;
  beatThree: number;
  beatFour: number;
  intimateOpacity: number;
  rsvpOpacity: number;
  fragmentOpacity: number;
  transitionOpacity: number;
  transitionProgress: number;
  transitionZoom: number;
  transitionTilt: number;
}

const phaseNames = [
  'Silence',
  'Emergence',
  'Euphoria',
  'Fragmentation',
  'Intimacy',
  'Afterglow',
  'Disappearance',
];

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

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = Math.max(1, container.scrollHeight - window.innerHeight);
    const progress = clamp(window.scrollY / maxScroll, 0, 1);
    const light = clamp(Math.sin(progress * Math.PI) * 1.18, 0, 1);
    const quiet = clamp((progress - 0.72) / 0.22, 0, 1);
    const phase = Math.min(phaseNames.length - 1, Math.floor(progress * phaseNames.length));
    const transitionProgress = clamp((progress - 0.16) / 0.78, 0, 1);
    const transitionFadeIn = clamp((progress - 0.12) / 0.1, 0, 1);
    const transitionFadeOut = clamp((0.985 - progress) / 0.035, 0, 1);
    const transitionOpacity = Math.min(transitionFadeIn, transitionFadeOut) * 0.86;

    const state: ScrollState = {
      progress,
      light,
      quiet,
      phase,
      heroOpacity: opacityWindow(progress, -0.02, 0, 0.1, 0.17),
      heroBgOpacity: opacityWindow(progress, -0.02, 0, 0.14, 0.24),
      beatOne: opacityWindow(progress, 0.18, 0.23, 0.29, 0.35),
      beatTwo: opacityWindow(progress, 0.37, 0.42, 0.48, 0.54),
      beatThree: opacityWindow(progress, 0.56, 0.61, 0.67, 0.73),
      beatFour: opacityWindow(progress, 0.75, 0.8, 0.86, 0.9),
      intimateOpacity: opacityWindow(progress, 0.91, 0.925, 0.94, 0.955),
      rsvpOpacity: clamp((progress - 0.965) / 0.035, 0, 1),
      fragmentOpacity: Math.max(
        opacityWindow(progress, 0.18, 0.23, 0.29, 0.35) * 0.38,
        opacityWindow(progress, 0.37, 0.42, 0.48, 0.54) * 0.82,
        opacityWindow(progress, 0.56, 0.61, 0.67, 0.73) * 0.42
      ),
      transitionOpacity,
      transitionProgress,
      transitionZoom: transitionProgress,
      transitionTilt: (transitionProgress - 0.5) * 2,
    };

    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty('--scroll', state.progress.toFixed(4));
    root.style.setProperty('--phase-light', state.light.toFixed(4));
    root.style.setProperty('--phase-quiet', state.quiet.toFixed(4));
    root.style.setProperty('--transition-opacity', state.transitionOpacity.toFixed(4));
    root.style.setProperty('--transition-zoom', state.transitionZoom.toFixed(4));
    root.style.setProperty('--transition-tilt', state.transitionTilt.toFixed(4));
    root.style.setProperty('--hero-opacity', state.heroOpacity.toFixed(4));
    root.style.setProperty('--hero-bg-opacity', state.heroBgOpacity.toFixed(4));
    root.style.setProperty('--beat-one', state.beatOne.toFixed(4));
    root.style.setProperty('--beat-two', state.beatTwo.toFixed(4));
    root.style.setProperty('--beat-three', state.beatThree.toFixed(4));
    root.style.setProperty('--beat-four', state.beatFour.toFixed(4));
    root.style.setProperty('--fragment-opacity', state.fragmentOpacity.toFixed(4));
    root.style.setProperty('--intimate-opacity', state.intimateOpacity.toFixed(4));
    root.style.setProperty('--rsvp-opacity', state.rsvpOpacity.toFixed(4));

    // Toggle quiet class
    document.body.classList.toggle('rsvp-quiet', progress > 0.9);

    // Phase change callback
    if (phase !== lastPhaseRef.current) {
      onPhaseChange?.(phase, lastPhaseRef.current);
      lastPhaseRef.current = phase;
    }

    return state;
  }, [containerRef, onPhaseChange]);

  useEffect(() => {
    // Initial update
    updateScrollState();

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  return { updateScrollState, phaseNames };
}
'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor with dot + aura and fragment magnetism.
 * Uses cached DOM references and RAF-batched updates for performance.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const auraPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const fragmentsRef = useRef<Element[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Touch / no-cursor devices: the dot+aura are hidden via CSS and there's no
    // pointer to track. Bailing out here stops a perpetual RAF loop that would
    // otherwise call getBoundingClientRect() on every fragment each frame —
    // the single biggest source of scroll jitter on mobile.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches
    ) {
      return;
    }

    const root = document.documentElement;

    // Initialize mouse position once
    if (!initializedRef.current) {
      const initX = window.innerWidth / 2;
      const initY = window.innerHeight / 2;
      mouseRef.current = { x: initX, y: initY };
      auraPosRef.current = { x: initX, y: initY };
      root.style.setProperty('--cursor-x', `${initX}px`);
      root.style.setProperty('--cursor-y', `${initY}px`);
      initializedRef.current = true;
    }

    // Cache fragment elements once (use MutationObserver for late-mounted elements)
    const cacheFragments = () => {
      fragmentsRef.current = Array.from(document.querySelectorAll('.projection-image'));
    };
    cacheFragments();

    const observer = new MutationObserver(cacheFragments);
    observer.observe(document.body, { childList: true, subtree: true });

    // Idle control: the loop reads getBoundingClientRect() on every fragment
    // each frame, so we stop it once the aura has settled and the pointer has
    // been still for a moment, and wake it again on the next mouse move. This
    // eliminates continuous per-frame layout reads while the user isn't moving.
    let running = false;
    let lastMoveAt = 0;
    const ensureRunning = () => {
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(render);
      }
    };

    // Mouse move handler — updates CSS vars for halation gradient
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMoveAt = performance.now();
      root.style.setProperty('--cursor-x', `${e.clientX}px`);
      root.style.setProperty('--cursor-y', `${e.clientY}px`);
      ensureRunning();
    };

    // RAF render loop — positions cursor elements and updates fragment magnetism
    const render = () => {
      const dot = dotRef.current;
      const aura = auraRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Lerp aura position
      auraPosRef.current.x += (mx - auraPosRef.current.x) * 0.07;
      auraPosRef.current.y += (my - auraPosRef.current.y) * 0.07;

      if (dot) {
        dot.style.left = `${mx}px`;
        dot.style.top = `${my}px`;
      }
      if (aura) {
        aura.style.left = `${auraPosRef.current.x}px`;
        aura.style.top = `${auraPosRef.current.y}px`;
      }

      // Fragment magnetism — uses cached references
      const ax = auraPosRef.current.x;
      const ay = auraPosRef.current.y;
      const fragments = fragmentsRef.current;
      for (let i = 0, len = fragments.length; i < len; i++) {
        const el = fragments[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        const dx = ax - cx;
        const dy = ay - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > 600) continue; // Skip elements far from cursor
        const pull = Math.max(0, 1 - dist / 520);
        const dir = (i & 1) === 0 ? 1 : -1;
        el.style.setProperty('--mx', (dx * pull * 0.028 * dir).toFixed(2));
        el.style.setProperty('--my', (dy * pull * 0.022).toFixed(2));
        el.style.setProperty('--s', (1 + pull * 0.018).toFixed(3));
      }

      // Stop once the aura has caught up to the pointer and movement has been
      // idle for >700ms — the next mouse move restarts the loop.
      const settled =
        Math.abs(mx - ax) < 0.5 && Math.abs(my - ay) < 0.5;
      if (settled && performance.now() - lastMoveAt > 700) {
        running = false;
        return;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // Event delegation for interactable hover effects
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('.interactable');
      if (target && dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(3)';
        dotRef.current.style.background = 'transparent';
        dotRef.current.style.border = '1px solid rgba(232,106,36,0.82)';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('.interactable');
      if (target && dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        dotRef.current.style.background = '#f8f3eb';
        dotRef.current.style.border = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    ensureRunning();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={auraRef}
        className="cursor-aura"
        style={{
          position: 'fixed',
          left: '50vw',
          top: '50vh',
          zIndex: 83,
          width: '44vw',
          height: '44vw',
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(248, 243, 235, 0.055), rgba(232, 106, 36, 0.025) 30%, transparent 62%)',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
          filter: 'blur(6px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          left: '50vw',
          top: '50vh',
          zIndex: 100,
          width: '8px',
          height: '8px',
          borderRadius: '999px',
          background: '#f8f3eb',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          transition: 'transform 200ms ease, background 200ms ease, border 200ms ease',
        }}
        aria-hidden="true"
      />
    </>
  );
}
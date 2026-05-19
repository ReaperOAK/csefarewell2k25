'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export function CustomCursor({ isActive }: { isActive: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const auraPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const initialisedRef = useRef(false);

  const setCursor = useCallback((x: number, y: number) => {
    document.documentElement.style.setProperty('--cursor-x', `${x}px`);
    document.documentElement.style.setProperty('--cursor-y', `${y}px`);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Initialize mouse position on mount (client-side only)
    if (!initialisedRef.current) {
      const initX = window.innerWidth / 2;
      const initY = window.innerHeight / 2;
      mouseRef.current = { x: initX, y: initY };
      auraPosRef.current = { x: initX, y: initY };
      setCursor(initX, initY);
      initialisedRef.current = true;
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      setCursor(event.clientX, event.clientY);
    };

    const render = () => {
      const dot = dotRef.current;
      const aura = auraRef.current;
      if (!dot || !aura) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      auraPosRef.current.x += (mx - auraPosRef.current.x) * 0.07;
      auraPosRef.current.y += (my - auraPosRef.current.y) * 0.07;

      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
      aura.style.left = `${auraPosRef.current.x}px`;
      aura.style.top = `${auraPosRef.current.y}px`;

      // Update fragment magnetism
      const fragments = document.querySelectorAll('.projection-image');
      fragments.forEach((fragment, index) => {
        const rect = fragment.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const distance = Math.hypot(dx, dy);
        const pull = Math.max(0, Math.min(1, 1 - distance / 520));
        const direction = index % 2 === 0 ? 1 : -1;
        (fragment as HTMLElement).style.setProperty('--mx', (dx * pull * 0.028 * direction).toFixed(2));
        (fragment as HTMLElement).style.setProperty('--my', (dy * pull * 0.022).toFixed(2));
        (fragment as HTMLElement).style.setProperty('--s', (1 + pull * 0.018).toFixed(3));
      });

      rafRef.current = requestAnimationFrame(render);
    };

    // Interactive elements hover effects
    const handleMouseEnter = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(3)';
        dotRef.current.style.background = 'transparent';
        dotRef.current.style.border = '1px solid rgba(232,106,36,0.82)';
      }
    };

    const handleMouseLeave = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        dotRef.current.style.background = '#f8f3eb';
        dotRef.current.style.border = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.querySelectorAll('.interactable').forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('.interactable').forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, setCursor]);

  if (!isActive) return null;

  return (
    <>
      <div
        ref={auraRef}
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
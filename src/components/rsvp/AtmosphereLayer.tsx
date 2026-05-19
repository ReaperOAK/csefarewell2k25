'use client';

import React from 'react';

const styles = {
  grain: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 90,
    opacity: 0.11,
    mixBlendMode: 'screen' as const,
    pointerEvents: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  },
  halation: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 84,
    opacity: 'var(--halation-opacity, 0.34)' as any,
    mixBlendMode: 'screen' as const,
    pointerEvents: 'none' as const,
    background: `
      radial-gradient(circle at var(--cursor-x, 50vw) var(--cursor-y, 50vh), rgba(248, 243, 235, 0.08), transparent 28vw),
      radial-gradient(ellipse at 8% 24%, rgba(42, 104, 114, 0.16), transparent 38vw),
      radial-gradient(ellipse at 82% 68%, rgba(232, 106, 36, 0.12), transparent 34vw)
    `.trim(),
    filter: 'blur(1px)',
  },
  vignette: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 88,
    pointerEvents: 'none' as const,
    background: `
      linear-gradient(90deg, rgba(0, 0, 0, 0.72), transparent 18%, transparent 82%, rgba(0, 0, 0, 0.72)),
      radial-gradient(ellipse at center, transparent 18%, rgba(0, 0, 0, 0.28) 58%, rgba(0, 0, 0, 0.88) 100%)
    `.trim(),
  },
  projectedCrowd: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 1,
    opacity: 'var(--crowd-opacity, 0.18)' as any,
    pointerEvents: 'none' as const,
    backgroundImage: 'url(/assets/hero.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(22px) saturate(0.86) contrast(1.2) brightness(0.62)',
    transform: 'scale(1.14)',
    mixBlendMode: 'screen' as const,
    WebkitMaskImage: `
      radial-gradient(ellipse at 46% 44%, black 0 34%, rgba(0, 0, 0, 0.58) 52%, transparent 76%),
      linear-gradient(180deg, transparent 0%, black 18%, black 74%, transparent 100%)
    `.trim(),
    maskImage: `
      radial-gradient(ellipse at 46% 44%, black 0 34%, rgba(0, 0, 0, 0.58) 52%, transparent 76%),
      linear-gradient(180deg, transparent 0%, black 18%, black 74%, transparent 100%)
    `.trim(),
  },
  airTexture: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 2,
    opacity: 'var(--air-opacity, 0.1)' as any,
    pointerEvents: 'none' as const,
    backgroundImage: 'url(/assets/urban nightscape through blurred glass.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(18px) saturate(1.25)',
    transform: 'scale(1.18)',
    mixBlendMode: 'color-dodge' as const,
    WebkitMaskImage: 'radial-gradient(ellipse at 52% 52%, black 0 46%, transparent 78%)',
    maskImage: 'radial-gradient(ellipse at 52% 52%, black 0 46%, transparent 78%)',
  },
  lightEngine: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 4,
    overflow: 'hidden' as const,
    opacity: 'var(--engine-opacity, 0.62)' as any,
    mixBlendMode: 'screen' as const,
    pointerEvents: 'none' as const,
  },
  depthFog: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 12,
    overflow: 'hidden' as const,
    mixBlendMode: 'screen' as const,
    pointerEvents: 'none' as const,
  },
  filmBurn: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 82,
    opacity: 0,
    mixBlendMode: 'screen' as const,
    pointerEvents: 'none' as const,
    background: `
      linear-gradient(90deg, transparent, rgba(255, 242, 212, 0.88) 48%, rgba(232, 106, 36, 0.58) 58%, transparent 72%),
      radial-gradient(circle at 8% 50%, rgba(232, 106, 36, 0.74), transparent 38%)
    `.trim(),
    filter: 'blur(12px)',
    transform: 'translateX(-120%) scaleX(1.2)',
    transition: 'none',
  } as React.CSSProperties,
  filmGap: { position: 'fixed' as const, inset: 0, zIndex: 82.5 as any, pointerEvents: 'none' as const },
};

export function AtmosphereLayer({ filmBurnRef }: { filmBurnRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div className="projected-crowd" style={styles.projectedCrowd} aria-hidden="true" />
      <div className="air-texture" style={styles.airTexture} aria-hidden="true" />

      <div className="light-engine" style={styles.lightEngine} aria-hidden="true">
        <div className="projection shore" style={{
          position: 'absolute',
          left: '-22vw',
          bottom: '-10vh',
          width: '82vw',
          height: '34vh',
          borderRadius: '50%',
          filter: 'blur(42px)',
          opacity: 0.42,
          background: 'linear-gradient(90deg, transparent, rgba(232, 106, 36, 0.38), rgba(42, 104, 114, 0.18), transparent)',
        }} />
        <div className="projection sodium" style={{
          position: 'absolute',
          right: '-18vw',
          top: '7vh',
          width: '56vw',
          height: '42vh',
          borderRadius: '50%',
          filter: 'blur(42px)',
          opacity: 0.42,
          background: 'radial-gradient(circle, rgba(232, 106, 36, 0.62), transparent 64%)',
        }} />
        <div className="projection indigo" style={{
          position: 'absolute',
          left: '12vw',
          top: '34vh',
          width: '54vw',
          height: '54vh',
          borderRadius: '50%',
          filter: 'blur(42px)',
          opacity: 0.42,
          background: 'radial-gradient(circle, rgba(68, 35, 121, 0.36), transparent 66%)',
        }} />
        <div className="practical-lights" style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--lights-opacity, 0.18)',
          background: `
            radial-gradient(circle at 18% 30%, rgba(248, 243, 235, 0.85) 0 1px, transparent 3px),
            radial-gradient(circle at 61% 18%, rgba(232, 106, 36, 0.82) 0 1px, transparent 4px),
            radial-gradient(circle at 80% 54%, rgba(42, 104, 114, 0.7) 0 1px, transparent 5px),
            radial-gradient(circle at 40% 74%, rgba(248, 243, 235, 0.5) 0 1px, transparent 3px)
          `.trim(),
        }} />
        <div className="lens-streak" style={{
          position: 'absolute',
          left: '-20vw',
          top: '26vh',
          width: '150vw',
          height: '2px',
          opacity: 'var(--streak-opacity, 0.08)',
          background: 'linear-gradient(90deg, transparent, rgba(248, 243, 235, 0.18), rgba(232, 106, 36, 0.28), transparent)',
          filter: 'blur(1px)',
          transform: 'rotate(-6deg)',
        }} />
      </div>

      <div className="depth-fog" style={styles.depthFog} aria-hidden="true">
        <div className="fog distant" style={{
          position: 'absolute',
          inset: '-30vh -30vw',
          opacity: 'var(--fog-distant-opacity, 0.28)',
          filter: 'blur(80px)',
          background: 'radial-gradient(ellipse at 35% 34%, rgba(42, 104, 114, 0.23), transparent 54%), radial-gradient(ellipse at 68% 56%, rgba(232, 106, 36, 0.12), transparent 58%)',
        }} />
        <div className="fog ambient" style={{
          position: 'absolute',
          inset: '-30vh -30vw',
          opacity: 'var(--fog-ambient-opacity, 0.22)',
          filter: 'blur(58px)',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(90, 52, 118, 0.2), transparent 60%)',
        }} />
        <div className="fog humidity" style={{
          position: 'absolute',
          inset: '-30vh -30vw',
          opacity: 'var(--fog-humidity-opacity, 0.2)',
          filter: 'blur(28px)',
          background: 'linear-gradient(116deg, transparent 0%, rgba(248, 243, 235, 0.06) 36%, transparent 58%), radial-gradient(ellipse at 80% 20%, rgba(42, 104, 114, 0.16), transparent 48%)',
        }} />
        <div className="fog foreground" style={{
          position: 'absolute',
          inset: '-30vh -30vw',
          opacity: 'var(--fog-foreground-opacity, 0.12)',
          filter: 'blur(18px)',
          background: 'radial-gradient(ellipse at 10% 88%, rgba(248, 243, 235, 0.1), transparent 38%), radial-gradient(ellipse at 92% 78%, rgba(232, 106, 36, 0.1), transparent 42%)',
        }} />
      </div>

      <div style={styles.halation} aria-hidden="true" />
      <div ref={filmBurnRef} className="film-burn" style={styles.filmBurn} id="filmBurn" aria-hidden="true" />
      <div style={styles.vignette} aria-hidden="true" />
      <div className="grain" style={styles.grain} aria-hidden="true" />
    </>
  );
}
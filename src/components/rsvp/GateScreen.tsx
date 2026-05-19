'use client';

import React, { useRef, useEffect } from 'react';

interface GateScreenProps {
  onEnter: () => void;
  isLeaving: boolean;
}

export function GateScreen({ onEnter, isLeaving }: GateScreenProps) {
  return (
    <div
      id="gate"
      className={isLeaving ? 'leaving' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'grid',
        placeItems: 'center',
        padding: '8vw',
        overflow: 'hidden',
        isolation: 'isolate',
        background: `
          radial-gradient(ellipse at 52% 50%, rgba(42, 104, 114, 0.08), transparent 38%),
          #010102
        `.trim(),
        transition: 'opacity 1100ms cubic-bezier(.16, 1, .3, 1), filter 1100ms cubic-bezier(.16, 1, .3, 1)',
      }}
    >
      {/* Screen flash overlay (introFlash) — test.html #gate::after */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          opacity: 0,
          background: 'radial-gradient(circle at 50% 48%, rgba(255, 250, 230, 0.92), transparent 18%), linear-gradient(90deg, transparent, rgba(255, 248, 230, 0.78), transparent)',
          mixBlendMode: 'screen',
          animation: 'introFlash 1300ms steps(1) infinite',
        }}
        aria-hidden="true"
      />

      {/* Dark overlay — test.html #gate::before */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 46%, rgba(1, 1, 2, 0.74), transparent 31%),
            linear-gradient(90deg, rgba(1, 1, 2, 0.72), transparent 28%, transparent 72%, rgba(1, 1, 2, 0.72)),
            radial-gradient(ellipse at center, transparent 18%, rgba(1, 1, 2, 0.42) 64%, rgba(1, 1, 2, 0.82))
          `.trim(),
        }}
      />

      {/* Mosaic background */}
      <div
        className="intro-mosaic"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-2px',
          zIndex: 0,
          opacity: 0.68,
          filter: 'saturate(0.96) contrast(1.22) brightness(0.66)',
          perspective: '900px',
        }}
      >
        {[
          { x: '0%', y: '0%', delay: '0ms' },
          { x: '50%', y: '0%', delay: '-180ms' },
          { x: '100%', y: '0%', delay: '-360ms' },
          { x: '0%', y: '50%', delay: '-540ms' },
          { x: '50%', y: '50%', delay: '-720ms' },
          { x: '100%', y: '50%', delay: '-900ms' },
          { x: '0%', y: '100%', delay: '-1080ms' },
          { x: '50%', y: '100%', delay: '-1260ms' },
          { x: '100%', y: '100%', delay: '-1440ms' },
        ].map((pos, i) => (
          <span
            key={i}
            className="intro-tile"
            style={{
              position: 'absolute',
              inset: '-4vh -4vw',
              overflow: 'hidden',
              backgroundImage: 'url(/assets/memory fragments.png)',
              backgroundSize: '300% 300%',
              backgroundPosition: `${pos.x} ${pos.y}`,
              transformOrigin: 'center',
              opacity: 0,
              '--delay': pos.delay,
              animation: 'singlePhotoCut 1620ms steps(1) infinite, tileSpin 1620ms steps(1) infinite, tileExposure 1620ms steps(1) infinite',
              animationDelay: pos.delay,
              willChange: 'transform, filter, opacity, background-position',
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="gate-inner"
        style={{
          position: 'relative',
          zIndex: 4,
          width: 'min(720px, 92vw)',
          textAlign: 'center',
          transform: 'translateZ(0)',
        }}
      >
        <p
          className="ritual-text"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.25rem, 4vw, 3rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.05,
            color: 'rgba(248, 243, 235, 0.9)',
            textShadow: '0 0 2px rgba(1, 1, 2, 1), 0 0 16px rgba(1, 1, 2, 0.98), 0 0 34px rgba(1, 1, 2, 0.95), 0 0 52px rgba(248, 243, 235, 0.24)',
          }}
        >
          Some nights do not end. They keep projecting.
        </p>
        <button
          className="trigger-btn interactable"
          type="button"
          onClick={onEnter}
          disabled={isLeaving}
          style={{
            position: 'relative',
            minWidth: '210px',
            minHeight: '48px',
            marginTop: '2.8rem',
            border: 0,
            background: 'transparent',
            color: 'rgba(248, 243, 235, 0.72)',
            fontSize: '0.69rem',
            fontWeight: 300,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            cursor: 'none',
            fontFamily: 'Inter, sans-serif',
            opacity: isLeaving ? 0 : undefined,
          }}
        >
          Open the archive
        </button>
      </div>
    </div>
  );
}
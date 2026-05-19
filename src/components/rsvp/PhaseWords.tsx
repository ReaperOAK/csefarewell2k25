'use client';

import React from 'react';

const phaseNames = ['Silence', 'Emergence', 'Euphoria', 'Fragmentation', 'Intimacy', 'Afterglow', 'Disappearance'];

export function PhaseWords({ currentPhase }: { currentPhase: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        right: '5vw',
        bottom: '9vh',
        zIndex: 6,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {phaseNames.map((name, index) => (
        <p
          key={name}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            color: 'rgba(248, 243, 235, 0.12)',
            fontFamily: "'Oswald', sans-serif",
            fontSize: 'clamp(3rem, 10vw, 9rem)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: index === currentPhase ? 1 : 0,
            filter: index === currentPhase ? 'blur(2px)' : 'blur(9px)',
            transform: index === currentPhase ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1400ms ease, filter 1400ms ease, transform 1400ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </p>
      ))}
    </div>
  );
}
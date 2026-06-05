'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AtmosphereLayer } from './AtmosphereLayer';
import { CustomCursor } from './CustomCursor';
import { GateScreen } from './GateScreen';
import { MemoryStory } from './MemoryStory';
import { PhaseWords } from './PhaseWords';
import { RSVPSection } from './RSVPSection';
import { useScrollPhase } from '../../hooks/useScrollPhase';

export function RSVPGateExperience() {
  const [gateOpen, setGateOpen] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const filmBurnRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerFilmBurn = useCallback(() => {
    const el = filmBurnRef.current;
    if (!el) return;
    el.classList.remove('bleed');
    void el.offsetWidth;
    el.classList.add('bleed');
  }, []);

  const onPhaseChange = useCallback((phase: number, lastPhase: number) => {
    setCurrentPhase(phase);
    triggerFilmBurn();
  }, [triggerFilmBurn]);

  const { phaseNames } = useScrollPhase(containerRef, onPhaseChange);

  const handleEnter = () => {
    triggerFilmBurn();
    setTimeout(() => {
      setGateOpen(true);
      setCursorActive(true);
    }, 780);
  };

  useEffect(() => {
    // Initial state: body is locked
    if (!gateOpen) {
      document.body.classList.add('locked');
    }
    return () => {
      document.body.classList.remove('live', 'locked', 'rsvp-quiet');
    };
  }, [gateOpen]);

  return (
    <>
      <style>
        {`
          @keyframes grainShift {
            0% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(-1.5%, 1%, 0); }
            100% { transform: translate3d(1%, -1%, 0); }
          }
          @keyframes crowdBreath {
            from { transform: scale(1.14) translate3d(-1vw, -1vh, 0); }
            to { transform: scale(1.22) translate3d(1.5vw, 1vh, 0); }
          }
          @keyframes airProjection {
            from { transform: scale(1.18) rotate(-1deg); }
            to { transform: scale(1.28) rotate(1.2deg); }
          }
          @keyframes shoreSweep {
            from { transform: translate3d(-8vw, 2vh, 0) rotate(-5deg); opacity: 0.24; }
            to { transform: translate3d(18vw, -2vh, 0) rotate(2deg); opacity: 0.48; }
          }
          @keyframes sodiumDrift {
            from { transform: translate3d(0, 0, 0) scale(0.9); }
            to { transform: translate3d(-24vw, 18vh, 0) scale(1.18); }
          }
          @keyframes indigoPulse {
            from { transform: translate3d(-8vw, 8vh, 0) scale(0.96); opacity: 0.18; }
            to { transform: translate3d(8vw, -8vh, 0) scale(1.12); opacity: 0.42; }
          }
          @keyframes practicalFlicker {
            0%, 12%, 23%, 54%, 100% { filter: brightness(0.8); }
            13%, 24%, 55% { filter: brightness(2.4); }
          }
          @keyframes streakFloat {
            from { transform: translateY(-5vh) rotate(-6deg); }
            to { transform: translateY(8vh) rotate(-4deg); }
          }
          @keyframes fogDistant {
            from { transform: translate3d(-4vw, -2vh, 0) scale(1); }
            to { transform: translate3d(6vw, 3vh, 0) scale(1.08); }
          }
          @keyframes fogAmbient {
            from { transform: translate3d(3vw, 4vh, 0) rotate(-2deg); }
            to { transform: translate3d(-5vw, -3vh, 0) rotate(2deg); }
          }
          @keyframes fogHumidity {
            from { transform: translate3d(-7vw, 0, 0) skewX(-5deg); }
            to { transform: translate3d(7vw, 3vh, 0) skewX(4deg); }
          }
          @keyframes fogForeground {
            from { transform: translate3d(0, 2vh, 0) scale(1.04); }
            to { transform: translate3d(-9vw, -1vh, 0) scale(1.13); }
          }
          @keyframes memoryDrift {
            from { translate: -1vw -1vh; }
            to { translate: 1.5vw 1vh; }
          }
          @keyframes burnWipe {
            0% { opacity: 0; transform: translateX(-120%) scaleX(1.3); }
            24% { opacity: 0.9; }
            100% { opacity: 0; transform: translateX(120%) scaleX(1.1); }
          }
          @keyframes gateText {
            from { opacity: 0; transform: translateY(16px); filter: blur(12px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes singlePhotoCut {
            0%, 10.6% { opacity: 0.9; }
            10.7%, 100% { opacity: 0; }
          }
          @keyframes tileSpin {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.08); }
            4% { transform: rotateX(7deg) rotateY(-9deg) rotateZ(-1deg) scale(1.12); }
            8% { transform: rotateX(-6deg) rotateY(10deg) rotateZ(1.4deg) scale(1.1); }
            100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.08); }
          }
          @keyframes tileExposure {
            0%, 10.6% { filter: brightness(0.78) saturate(0.98) contrast(1.14); }
            1.3%, 7.6% { filter: brightness(3.1) saturate(0.72) contrast(1.46); }
            3.2%, 9% { filter: brightness(0.52) saturate(1.12) contrast(1.32); }
            100% { filter: brightness(0.78) saturate(0.98) contrast(1.14); }
          }
          @keyframes introFlash {
            0%, 21%, 66%, 100% { opacity: 0; }
            18% { opacity: 0.46; }
            64% { opacity: 0.34; }
          }

          .projected-crowd { animation: crowdBreath 24s ease-in-out infinite alternate; }
          .air-texture { animation: airProjection 32s ease-in-out infinite alternate; }
          .grain { animation: grainShift 900ms steps(2) infinite; }
          .projection.shore { animation: shoreSweep 18s ease-in-out infinite alternate; }
          .projection.sodium { animation: sodiumDrift 15s ease-in-out infinite alternate; }
          .projection.indigo { animation: indigoPulse 21s ease-in-out infinite alternate; }
          .practical-lights { animation: practicalFlicker 7s steps(1) infinite; }
          .lens-streak { animation: streakFloat 12s ease-in-out infinite alternate; }
          .fog.distant { animation: fogDistant 44s linear infinite alternate; }
          .fog.ambient { animation: fogAmbient 32s ease-in-out infinite alternate; }
          .fog.humidity { animation: fogHumidity 23s ease-in-out infinite alternate; }
          .fog.foreground { animation: fogForeground 17s ease-in-out infinite alternate; }
          .projection-image { animation: memoryDrift var(--d, 18s) ease-in-out infinite alternate; }
          #gate.leaving { opacity: 0; filter: blur(16px) brightness(2.4); }
          .film-burn.bleed { animation: burnWipe 1600ms cubic-bezier(.16, 1, .3, 1); }
          .ritual-text { animation: gateText 1500ms cubic-bezier(.16, 1, .3, 1) both 250ms; }
          .trigger-btn { animation: gateText 4s cubic-bezier(.16, 1, .3, 1) both 2100ms; }

          @media (max-width: 780px) {
            body, button { cursor: auto !important; }
            .cursor-dot, .cursor-aura { display: none !important; }
            #memory-space { min-height: 1380vh; }
            .hero-copy { top: 14vh; left: 1.1rem; }
            .hero-title { font-size: clamp(5rem, 28vw, 9rem) !important; transform: scaleY(1) !important; }
            .hero-sub { margin-top: 1rem !important; margin-left: 0 !important; }
            .crowd-wash { left: -25vw !important; width: 120vw !important; height: 42vh !important; top: 26vh !important; }
            .texture-wash { right: -34vw !important; width: 110vw !important; }
            .fragment.one { left: 7vw !important; top: 34vh !important; width: 86vw !important; height: 38vh !important; }
            .fragment.two { right: 3vw !important; top: 72vh !important; width: 86vw !important; height: 38vh !important; }
            .fragment.three { left: 8vw !important; top: 112vh !important; width: 86vw !important; height: 38vh !important; }
            .fragment.four { right: 6vw !important; top: 148vh !important; width: 86vw !important; height: 38vh !important; }
            .chaos-type { left: 9vw !important; top: 42vh !important; transform: none !important; }
            .beat-frame { inset: -4vh -8vw !important; opacity: 0.3 !important; }
            .beat-copy { width: min(80vw, 360px) !important; }
            .beat-copy .whisper-type { font-size: clamp(1.85rem, 10vw, 3.55rem) !important; }
            .memory-beat.one .beat-copy, .memory-beat.three .beat-copy { right: 1.2rem !important; left: auto !important; top: 44vh !important; }
            .memory-beat.two .beat-copy, .memory-beat.four .beat-copy { left: 1.2rem !important; right: auto !important; top: 42vh !important; }
            .intimate-line { left: 1.3rem !important; top: 17vh !important; }
            .polaroid-memory { width: 86vw !important; height: 46vh !important; }
            .rsvp-plane { padding: 1.2rem !important; }
            .phase-word { left: 1rem !important; right: auto !important; bottom: 5vh !important; }
            #gate { padding: 1.4rem !important; }
            .intro-mosaic { opacity: 0.6 !important; }
          }
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 1ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: 1ms !important;
            }
            .intro-tile { transform: none !important; }
          }
        `}
      </style>

      <AtmosphereLayer filmBurnRef={filmBurnRef} />
      <CustomCursor isActive={cursorActive} />

      {!gateOpen && <GateScreen onEnter={handleEnter} />}

      <div
        ref={containerRef}
        id="memory-space"
        aria-label="IBIZA farewell memory experience"
        style={{
          position: 'relative',
          zIndex: 20,
          minHeight: '1320vh',
          opacity: gateOpen ? 1 : 0,
          visibility: gateOpen ? 'visible' : 'hidden',
          transition: 'opacity 1400ms cubic-bezier(.16, 1, .3, 1)',
        }}
      >
        <div
          className="sticky-stage"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            isolation: 'isolate',
          }}
        >
          <MemoryStory />
          <RSVPSection filmBurnRef={filmBurnRef} />
          <PhaseWords currentPhase={currentPhase} />
        </div>
      </div>
    </>
  );
}
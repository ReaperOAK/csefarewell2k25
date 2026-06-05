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
  const [isLeaving, setIsLeaving] = useState(false);
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

  const onPhaseChange = useCallback((_phase: number, _lastPhase: number) => {
    triggerFilmBurn();
  }, [triggerFilmBurn]);

  const { phaseNames } = useScrollPhase(containerRef, onPhaseChange);

  const handleEnter = useCallback(() => {
    setIsLeaving(true);
    triggerFilmBurn();
    setTimeout(() => {
      setGateOpen(true);
    }, 780);
  }, [triggerFilmBurn]);

  useEffect(() => {
    if (!gateOpen) {
      document.body.classList.add('locked');
    } else {
      document.body.classList.remove('locked');
      document.body.classList.add('live');
    }
    return () => {
      document.body.classList.remove('live', 'locked', 'rsvp-quiet');
    };
  }, [gateOpen]);

  return (
    <>
      <AtmosphereLayer filmBurnRef={filmBurnRef} />
      <CustomCursor />

      {!gateOpen && <GateScreen onEnter={handleEnter} isLeaving={isLeaving} />}

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
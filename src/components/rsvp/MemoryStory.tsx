'use client';

import React from 'react';

const planeBase: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
};

const projectionImageBase: React.CSSProperties = {
  position: 'absolute',
  overflow: 'hidden',
  willChange: 'transform, opacity, filter',
  filter: 'saturate(0.86) contrast(1.18) brightness(0.7) blur(2px)',
  mixBlendMode: 'screen',
  transform: 'translate3d(calc(var(--mx, 0) * 1px), calc(var(--my, 0) * 1px), 0) rotate(var(--r, 0deg)) scale(var(--s, 1))',
};

const beatCopyBase: React.CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  width: 'min(520px, 42vw)',
  color: 'rgba(248, 243, 235, 0.62)',
  textShadow: '0 0 16px rgba(1, 1, 2, 0.92), 0 0 42px rgba(1, 1, 2, 0.72)',
};

const beatFrameStyle: React.CSSProperties = {
  position: 'absolute',
  inset: '-7vh -7vw',
  zIndex: 0,
  overflow: 'hidden',
  opacity: 0.34,
  filter: 'saturate(1.06) contrast(1.16) brightness(0.68) blur(0.2px)',
  mixBlendMode: 'color-dodge',
  transform: 'scale(1.06)',
};

const beatCopyLabel: React.CSSProperties = {
  fontSize: '0.68rem',
  fontWeight: 300,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  fontFamily: 'Inter, sans-serif',
  marginBottom: '1rem',
  color: 'rgba(232, 106, 36, 0.44)',
};

const beatCopyText: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontStyle: 'italic',
  fontWeight: 400,
  lineHeight: 1.08,
  fontSize: 'clamp(2.35rem, 4.8vw, 5.1rem)',
};

export function MemoryStory() {
  return (
    <>
      {/* Memory Plane */}
      <div
        className="memory-plane"
        style={{ ...planeBase, zIndex: 3 }}
        aria-hidden="true"
      >
        <div
          style={{
            position: 'absolute',
            inset: '-5vh -5vw',
            backgroundImage: 'linear-gradient(180deg, rgba(1, 1, 2, 0.18), rgba(1, 1, 2, 0.62) 72%, rgba(1, 1, 2, 0.9)), radial-gradient(ellipse at 50% 44%, transparent 0 42%, rgba(1, 1, 2, 0.58) 84%), url(/assets/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 'var(--hero-bg-opacity, 0.94)',
            filter: 'saturate(1.08) contrast(1.08) brightness(0.78)',
            transform: 'scale(calc(1.03 + var(--scroll) * 0.08))',
            transformOrigin: 'center',
            willChange: 'opacity, transform',
          }}
        />
        <div className="projection-image crowd-wash feather-soft" style={{ ...projectionImageBase, left: '-12vw', top: '22vh', width: '72vw', height: '48vh', opacity: 'clamp(0.02, calc(var(--scroll) * 0.24), 0.24)', filter: 'blur(18px) saturate(0.86) contrast(1.2) brightness(0.48)', '--d': '28s' } as any} />
        <div className="projection-image texture-wash feather-burn" style={{ ...projectionImageBase, right: '-10vw', top: '6vh', width: '58vw', height: '54vh', opacity: 'clamp(0.04, calc((var(--scroll) - 0.08) * 0.55), 0.34)', filter: 'blur(10px) saturate(1.25) brightness(0.7)', '--d': '24s' } as any} />
      </div>

      {/* Transition Plane */}
      <div
        className="transition-plane"
        style={{
          ...planeBase,
          zIndex: 5,
          overflow: 'hidden',
          opacity: 'var(--transition-opacity, 0)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const positions = [
            { x: '0%', y: '0%' },
            { x: '50%', y: '0%' },
            { x: '100%', y: '0%' },
            { x: '0%', y: '50%' },
            { x: '50%', y: '50%' },
            { x: '100%', y: '50%' },
            { x: '0%', y: '100%' },
            { x: '50%', y: '100%' },
            { x: '100%', y: '100%' },
          ];
          return (
            <span
              key={i}
              className="transition-frame"
              style={{
                position: 'absolute',
                inset: '-5vh -5vw',
                zIndex: 1,
                opacity: 0,
                backgroundImage: 'url(/assets/urban nightscape through blurred glass.png)',
                backgroundSize: '300% 300%',
                backgroundPosition: `${positions[i].x} ${positions[i].y}`,
                filter: 'saturate(1.18) contrast(1.18) brightness(0.72) blur(0.4px)',
                transform: 'scale(calc(1.06 + var(--transition-zoom, 0) * 0.06)) rotate(calc(var(--transition-tilt, 0) * 1deg))',
                transformOrigin: 'center',
                transition: 'opacity 360ms ease, filter 360ms ease, transform 360ms ease',
                willChange: 'opacity, filter, transform',
              }}
            />
          );
        })}
        {/* After overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'radial-gradient(circle at 52% 48%, rgba(248, 243, 235, 0.09), transparent 28%), linear-gradient(180deg, rgba(1, 1, 2, 0.1), rgba(1, 1, 2, 0.42) 78%, rgba(1, 1, 2, 0.72)), radial-gradient(ellipse at center, transparent 0 45%, rgba(1, 1, 2, 0.64) 92%)',
            mixBlendMode: 'normal',
          }}
        />
      </div>

      {/* Copy Plane */}
      <div
        className="copy-plane"
        style={{ ...planeBase, zIndex: 14, pointerEvents: 'none' }}
      >
        <section
          className="hero-copy"
          style={{
            position: 'absolute',
            left: 'clamp(1.25rem, 6vw, 5rem)',
            top: '12vh',
            width: 'min(92vw, 980px)',
            opacity: 'var(--hero-opacity, 1)',
            transform: 'translate3d(0, calc(var(--scroll) * -22vh), 0)',
            willChange: 'opacity, transform',
          }}
          aria-labelledby="ibiza-title"
        >
          <p className="meta hero-kicker" style={{
            marginBottom: 'clamp(1.25rem, 3vw, 2.2rem)',
            color: 'rgba(42, 190, 202, 0.48)',
            textShadow: '0 0 28px rgba(42, 104, 114, 0.36)',
            opacity: 'calc(0.95 - var(--scroll) * 1.1)',
            fontSize: '0.68rem',
            fontWeight: 300,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}>
            02:17 AM // Final summer signal
          </p>
          <h1
            id="ibiza-title"
            className="mass-type hero-title"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              lineHeight: 0.78,
              textTransform: 'uppercase',
              fontSize: 'clamp(6rem, 26vw, 23rem)',
              color: 'rgba(248, 243, 235, 0.9)',
              textShadow: '0 0 34px rgba(248, 243, 235, 0.12), 0 0 80px rgba(232, 106, 36, 0.18)',
              transform: 'scaleY(1.12)',
              mixBlendMode: 'screen',
              opacity: 'calc(1 - var(--scroll) * 0.72)',
              filter: 'blur(calc(var(--scroll) * 7px))',
            }}
          >
            IBIZA
          </h1>
          <p className="whisper-type hero-sub" style={{
            maxWidth: '620px',
            marginTop: 'clamp(-2.8rem, -3vw, -1rem)',
            marginLeft: 'clamp(0rem, 16vw, 12rem)',
            color: 'rgba(232, 106, 36, 0.82)',
            fontSize: 'clamp(2rem, 7vw, 5.6rem)',
            textShadow: '0 0 48px rgba(232, 106, 36, 0.32)',
            opacity: 'calc(0.82 - var(--scroll) * 0.7)',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.08,
          }}>
            Before we disappear entirely.
          </p>
        </section>

        <p className="projected-note note-a" style={{
          position: 'absolute',
          width: 'min(420px, 78vw)',
          color: 'rgba(248, 243, 235, 0.38)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.15rem, 2.6vw, 2.2rem)',
          fontStyle: 'italic',
          lineHeight: 1.2,
          textShadow: '0 0 22px rgba(248, 243, 235, 0.08)',
          filter: 'blur(0.2px)',
          mixBlendMode: 'screen',
          right: '8vw',
          top: '18vh',
          opacity: 'calc(var(--beat-one, 0) * 0.65)',
          transform: 'translateY(calc((var(--scroll) - 0.15) * -14vh)) rotate(-2deg)',
        }}>
          the shoreline was louder than our futures
        </p>
        <p className="projected-note note-b" style={{
          position: 'absolute',
          width: 'min(420px, 78vw)',
          color: 'rgba(248, 243, 235, 0.38)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.15rem, 2.6vw, 2.2rem)',
          fontStyle: 'italic',
          lineHeight: 1.2,
          textShadow: '0 0 22px rgba(248, 243, 235, 0.08)',
          filter: 'blur(0.2px)',
          mixBlendMode: 'screen',
          left: '12vw',
          bottom: '16vh',
          opacity: 'calc(var(--beat-three, 0) * 0.56)',
          transform: 'translateY(calc((var(--scroll) - 0.5) * -9vh)) rotate(2deg)',
        }}>
          we kept laughing because leaving had already started
        </p>
      </div>

      {/* Fragment Field */}
      <div
        className="fragment-field"
        style={{
          ...planeBase,
          zIndex: 9,
          opacity: 'var(--fragment-opacity, 0)',
          transform: 'translate3d(0, calc((var(--scroll) - 0.24) * -32vh), 0)',
        }}
        aria-hidden="true"
      >
        <div className="projection-image fragment one feather-torn" style={{ ...projectionImageBase, left: '7vw', top: '38vh', width: 'min(520px, 54vw)', height: '45vh', opacity: 'clamp(0.04, calc((var(--scroll) - 0.16) * 1.3), 0.48)', filter: 'blur(5px) grayscale(0.55) contrast(1.25) brightness(0.5)', '--d': '18s' } as any} />
        <div className="projection-image fragment two feather-soft" style={{ ...projectionImageBase, right: '5vw', top: '26vh', width: 'min(610px, 60vw)', height: '42vh', opacity: 'clamp(0.02, calc((var(--scroll) - 0.26) * 1.4), 0.5)', filter: 'blur(7px) saturate(1.1) brightness(0.46)', '--d': '18s', mixBlendMode: 'lighten' as any } as any} />
        <div className="projection-image fragment three feather-torn" style={{ ...projectionImageBase, left: '32vw', top: '76vh', width: 'min(560px, 56vw)', height: '40vh', opacity: 'clamp(0.02, calc((var(--scroll) - 0.34) * 1.7), 0.54)', filter: 'blur(5px) saturate(0.9) brightness(0.48)', '--d': '18s' } as any} />
        <div className="projection-image fragment four feather-burn" style={{ ...projectionImageBase, right: '22vw', top: '104vh', width: 'min(470px, 52vw)', height: '38vh', opacity: 'clamp(0.02, calc((var(--scroll) - 0.45) * 1.6), 0.46)', filter: 'blur(8px) saturate(1.4) brightness(0.52)', '--d': '18s' } as any} />
      </div>

      {/* Chaos Type */}
      <div
        className="chaos-type"
        style={{
          position: 'absolute',
          left: '36vw',
          top: '49vh',
          width: 'min(760px, 74vw)',
          color: 'rgba(248, 243, 235, 0.62)',
          opacity: 'calc(var(--beat-two, 0) * 0.82)',
          filter: 'blur(calc(max(0, 0.55 - var(--scroll)) * 12px))',
          transform: 'translate(-18%, -50%) rotate(-2deg)',
          mixBlendMode: 'overlay',
          zIndex: 6,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <p className="mass-type" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, lineHeight: 0.78, textTransform: 'uppercase', fontSize: 'clamp(4.6rem, 15vw, 14rem)' }}>
          MEMORIES
        </p>
        <p className="whisper-type" style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: 1.08,
          marginLeft: 'clamp(2rem, 12vw, 10rem)',
          marginTop: '-0.5rem',
          color: 'rgba(232, 106, 36, 0.6)',
          fontSize: 'clamp(2rem, 6vw, 5rem)',
        }}>
          Are just noise now
        </p>
      </div>

      {/* Story Plane (Memory Beats) */}
      <div
        className="story-plane"
        style={{ ...planeBase, zIndex: 16, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {/* Beat 1 */}
        <div className="memory-beat one" style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--beat-one, 0)',
          transform: 'translate3d(0, calc((1 - var(--beat-one, 0)) * 4vh), 0)',
          willChange: 'opacity, transform',
        }}>
          <div className="beat-frame" style={{ ...beatFrameStyle, backgroundImage: 'url(/assets/nightlife leaks.png)', backgroundSize: '200% 200%', backgroundPosition: '0% 0%', transform: 'rotate(-2deg) scale(1.06)' }} />
          <div className="beat-copy" style={{ ...beatCopyBase, right: '9vw', top: '34vh', textAlign: 'right' }}>
            <p className="meta" style={beatCopyLabel}>02:41 AM // Proof</p>
            <p className="whisper-type" style={beatCopyText}>The proof stayed brighter than the night itself.</p>
          </div>
        </div>

        {/* Beat 2 */}
        <div className="memory-beat two alt" style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--beat-two, 0)',
          transform: 'translate3d(0, calc((1 - var(--beat-two, 0)) * 4vh), 0)',
          willChange: 'opacity, transform',
        }}>
          <div className="beat-copy" style={{ ...beatCopyBase, left: '8vw', top: '42vh', textAlign: 'left' }}>
            <p className="meta" style={beatCopyLabel}>03:03 AM // Noise</p>
            <p className="whisper-type" style={beatCopyText}>The night kept making new versions of us.</p>
          </div>
          <div className="beat-frame" style={{ ...beatFrameStyle, backgroundImage: 'url(/assets/urban nightscape through blurred glass.png)', backgroundSize: '200% 200%', backgroundPosition: '100% 0%', transform: 'rotate(2.4deg) scale(1.06)' }} />
        </div>

        {/* Beat 3 */}
        <div className="memory-beat three" style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--beat-three, 0)',
          transform: 'translate3d(0, calc((1 - var(--beat-three, 0)) * 4vh), 0)',
          willChange: 'opacity, transform',
        }}>
          <div className="beat-frame" style={{ ...beatFrameStyle, backgroundImage: 'url(/assets/memory fragments.png)', backgroundSize: '200% 200%', backgroundPosition: '0% 100%', transform: 'rotate(-1.4deg) scale(1.06)' }} />
          <div className="beat-copy" style={{ ...beatCopyBase, right: '8vw', top: '23vh', textAlign: 'right' }}>
            <p className="meta" style={beatCopyLabel}>03:27 AM // Shoreline</p>
            <p className="whisper-type" style={beatCopyText}>We stayed because leaving was already happening.</p>
          </div>
        </div>

        {/* Beat 4 */}
        <div className="memory-beat four alt" style={{
          position: 'absolute',
          inset: 0,
          opacity: 'var(--beat-four, 0)',
          transform: 'translate3d(0, calc((1 - var(--beat-four, 0)) * 4vh), 0)',
          willChange: 'opacity, transform',
        }}>
          <div className="beat-copy" style={{ ...beatCopyBase, left: '8vw', top: '28vh', textAlign: 'left' }}>
            <p className="meta" style={beatCopyLabel}>04:12 AM // Trace</p>
            <p className="whisper-type" style={beatCopyText}>Some faces become light before they become memory.</p>
          </div>
          <div className="beat-frame" style={{ ...beatFrameStyle, backgroundImage: 'url(/assets/ibiza memories.png)', backgroundSize: '200% 200%', backgroundPosition: '100% 100%', transform: 'rotate(2deg) scale(1.06)' }} />
        </div>
      </div>

      {/* Intimate Plane */}
      <div
        className="intimate-plane"
        style={{
          ...planeBase,
          zIndex: 12,
          opacity: 'var(--intimate-opacity, 0)',
          transform: 'translateY(calc((var(--scroll) - 0.64) * -22vh))',
        }}
        aria-hidden="true"
      >
        <div className="intimate-line" style={{
          position: 'absolute',
          left: '10vw',
          top: '20vh',
          width: 'min(560px, 78vw)',
          color: 'rgba(248, 243, 235, 0.68)',
          opacity: 'clamp(0, calc((var(--scroll) - 0.61) * 2), 0.72)',
          filter: 'blur(calc(max(0, 0.82 - var(--scroll)) * 7px))',
          textShadow: '0 0 42px rgba(248, 243, 235, 0.13)',
        }}>
          <p className="meta" style={{ fontSize: '0.68rem', fontWeight: 300, letterSpacing: '0.32em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: '1rem', color: 'rgba(232, 106, 36, 0.44)' }}>03:46 AM // Intimacy</p>
          <p className="whisper-type" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, lineHeight: 1.08, fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}>A photograph only hurts after everyone goes home.</p>
        </div>
        <div className="projection-image polaroid-memory feather-soft" style={{
          ...projectionImageBase,
          left: '50%',
          top: '47vh',
          width: 'min(560px, 82vw)',
          height: 'min(460px, 62vh)',
          opacity: 'clamp(0, calc((var(--scroll) - 0.58) * 2.6), 0.82)',
          filter: 'blur(2px) saturate(0.72) brightness(0.7) contrast(1.08)',
          transform: 'translate3d(calc(-50% + var(--mx, 0) * 0.7px), calc(-50% + var(--my, 0) * 0.7px), 0) rotate(-3deg) scale(1)',
          mixBlendMode: 'screen',
          '--d': '22s',
        } as any} />
      </div>

      {/* Afterglow */}
      <div
        className="afterglow"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 13,
          opacity: 'calc(var(--rsvp-opacity, 0) * 0.7)',
          background: 'radial-gradient(ellipse at 50% 80%, rgba(232, 106, 36, 0.18), transparent 46%), linear-gradient(180deg, transparent, rgba(1, 1, 2, 0.55))',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </>
  );
}
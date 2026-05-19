'use client';

import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface RSVPSectionProps {
  filmBurnRef: React.RefObject<HTMLDivElement | null>;
}

export function RSVPSection({ filmBurnRef }: RSVPSectionProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerFilmBurn = () => {
    const el = filmBurnRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateX(-120%) scaleX(1.2)';
    void el.offsetWidth;
    el.style.transition = 'opacity 1600ms cubic-bezier(.16, 1, .3, 1), transform 1600ms cubic-bezier(.16, 1, .3, 1)';
    el.style.opacity = '0.9';
    el.style.transform = 'translateX(120%) scaleX(1.1)';
    setTimeout(() => {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateX(-120%) scaleX(1.2)';
    }, 1600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    triggerFilmBurn();

    try {
      if (db) {
        await addDoc(collection(db, 'general-rsvp'), {
          name,
          studentId,
          timestamp: Date.now(),
        });
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setName('');
      setStudentId('');
    } catch (err) {
      console.error('RSVP submit error:', err);
      setError('Memory could not be sealed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="rsvp-plane"
      aria-labelledby="rsvp-title"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'grid',
        placeItems: 'center',
        padding: '7vw',
        overflow: 'hidden',
        isolation: 'isolate',
        opacity: 'var(--rsvp-opacity, 0)',
        transform: 'translateY(calc((1 - var(--rsvp-opacity, 0)) * 20vh))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(180deg, rgba(1, 1, 2, 0.18), rgba(1, 1, 2, 0.42) 48%, rgba(1, 1, 2, 0.74)), radial-gradient(ellipse at 50% 52%, transparent 0 38%, rgba(1, 1, 2, 0.62) 86%), url(/assets/ibiza memories.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0.94) contrast(1.08) brightness(0.7)',
          transform: 'scale(1.04)',
          transformOrigin: 'center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 48% 42%, rgba(232, 106, 36, 0.16), transparent 32%), linear-gradient(90deg, rgba(1, 1, 2, 0.68), transparent 28%, transparent 72%, rgba(1, 1, 2, 0.68))',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(620px, 100%)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            marginBottom: '1.6rem',
            color: 'rgba(232, 106, 36, 0.7)',
            textShadow: '0 0 24px rgba(232, 106, 36, 0.24)',
            fontSize: '0.68rem',
            fontWeight: 300,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          The final trace
        </p>
        <h2
          id="rsvp-title"
          style={{
            color: 'rgba(248, 243, 235, 0.78)',
            fontSize: 'clamp(2.5rem, 7vw, 5.8rem)',
            textShadow: '0 0 42px rgba(248, 243, 235, 0.1)',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            lineHeight: 1.08,
          }}
        >
          Confirm your presence. Leave a little light behind.
        </h2>

        {submitted ? (
          <p
            style={{
              marginTop: 'clamp(2.8rem, 8vh, 5rem)',
              color: 'rgba(248, 243, 235, 0.8)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              fontStyle: 'italic',
            }}
          >
            Memory sealed.
          </p>
        ) : (
          <form
            className="memory-form interactable"
            onSubmit={handleSubmit}
            style={{ marginTop: 'clamp(2.8rem, 8vh, 5rem)' }}
          >
            <div
              className="field interactable"
              style={{
                position: 'relative',
                marginBottom: 'clamp(2rem, 7vh, 4.5rem)',
              }}
            >
              <label htmlFor="guestName" className="sr-only" style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}>
                Your name
              </label>
              <input
                className="memory-input interactable"
                id="guestName"
                name="guestName"
                type="text"
                placeholder="Your Name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => document.body.classList.add('rsvp-quiet')}
                onBlur={() => document.body.classList.remove('rsvp-quiet')}
                style={{
                  width: '100%',
                  minHeight: '74px',
                  border: 0,
                  borderBottom: '1px solid rgba(248, 243, 235, 0.18)',
                  background: 'transparent',
                  color: '#f8f3eb',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 4.2rem)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  outline: 'none',
                  opacity: 0.54,
                  transition: 'color 900ms ease, opacity 900ms ease, border-color 900ms ease, text-shadow 900ms ease',
                }}
              />
            </div>

            <div
              className="field interactable"
              style={{
                position: 'relative',
                marginBottom: 'clamp(2rem, 7vh, 4.5rem)',
              }}
            >
              <label htmlFor="studentId" className="sr-only" style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}>
                Student ID
              </label>
              <input
                className="memory-input interactable"
                id="studentId"
                name="studentId"
                type="text"
                placeholder="Student ID"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onFocus={() => document.body.classList.add('rsvp-quiet')}
                onBlur={() => document.body.classList.remove('rsvp-quiet')}
                style={{
                  width: '100%',
                  minHeight: '74px',
                  border: 0,
                  borderBottom: '1px solid rgba(248, 243, 235, 0.18)',
                  background: 'transparent',
                  color: '#f8f3eb',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(2rem, 5vw, 4.2rem)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  outline: 'none',
                  opacity: 0.54,
                  transition: 'color 900ms ease, opacity 900ms ease, border-color 900ms ease, text-shadow 900ms ease',
                }}
              />
            </div>

            {error && (
              <p style={{ color: 'rgba(232, 106, 36, 0.8)', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                {error}
              </p>
            )}

            <button
              className="memory-submit interactable"
              type="submit"
              disabled={submitting}
              style={{
                position: 'relative',
                width: 'min(420px, 100%)',
                minHeight: '64px',
                border: '1px solid rgba(248, 243, 235, 0.2)',
                background: 'transparent',
                color: submitting ? 'rgba(248, 243, 235, 0.3)' : 'rgba(248, 243, 235, 0.62)',
                fontSize: '0.72rem',
                letterSpacing: '0.34em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                cursor: 'none',
                fontFamily: 'Inter, sans-serif',
                transition: 'border-color 700ms ease, color 700ms ease',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  mixBlendMode: 'difference',
                }}
              >
                {submitting ? 'Sealing...' : 'Seal the Memory'}
              </span>
            </button>
          </form>
        )}

        <p
          style={{
            marginTop: 'clamp(4rem, 12vh, 8rem)',
            color: 'rgba(248, 243, 235, 0.25)',
            lineHeight: 1.8,
            fontSize: '0.68rem',
            fontWeight: 300,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Nothing lasts forever.<br />That is why it glows.
        </p>
      </div>
    </section>
  );
}
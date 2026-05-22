'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import '../app/invite.css';

export default function Invitation() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [invitee, setInvitee] = useState<Invitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attending, setAttending] = useState<boolean | null>(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchInviteeData = async () => {
      try {
        setLoading(true);
        if (!id) {
          setLoading(false);
          return;
        }

        const inviteeDoc = await getDoc(doc(db, 'invitees', id));
        if (inviteeDoc.exists()) {
          const inviteeData = { id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee;
          setInvitee(inviteeData);
          if (inviteeData.attending !== null) {
            setAttending(inviteeData.attending);
            setResponse(inviteeData.response || '');
            setSubmitted(true);
          }
        } else {
          setError('Invitation not found in records.');
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Connection lost. Could not retrieve invitation.');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteeData();
  }, [id]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const cursorDot = document.getElementById('cursorDotInvite');
    const cursorAura = document.getElementById('cursorAuraInvite');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      root.style.setProperty('--cursor-x', `${mouseX}px`);
      root.style.setProperty('--cursor-y', `${mouseY}px`);
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      root.style.setProperty('--scroll', progress.toFixed(4));
    };

    const render = () => {
      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
      if (cursorAura) {
        cursorAura.style.left = `${auraX}px`;
        cursorAura.style.top = `${auraY}px`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(render);

    // Apply interactive hover animations to buttons/cards
    const interactables = document.querySelectorAll('.interactable-invite');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorAura) {
          cursorAura.style.transform = 'translate(-50%, -50%) scale(1.4)';
          cursorAura.style.borderColor = 'rgba(232, 106, 36, 0.74)';
          cursorAura.style.background = 'rgba(232, 106, 36, 0.04)';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (cursorAura) {
          cursorAura.style.transform = 'translate(-50%, -50%) scale(1)';
          cursorAura.style.borderColor = 'rgba(232, 106, 36, 0.34)';
          cursorAura.style.background = 'transparent';
        }
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      body.classList.remove('rsvp-attending', 'rsvp-away');
    };
  }, [loading]);

  // Handle class changes on body depending on selected state
  useEffect(() => {
    if (attending === true) {
      document.body.classList.add('rsvp-attending');
      document.body.classList.remove('rsvp-away');
    } else if (attending === false) {
      document.body.classList.add('rsvp-away');
      document.body.classList.remove('rsvp-attending');
    } else {
      document.body.classList.remove('rsvp-attending', 'rsvp-away');
    }
  }, [attending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null || !id) return;

    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'invitees', id), {
        attending,
        response,
        timestamp: Date.now(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      alert('Memory could not be sealed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const defaultPhoto = '/fp/skull.png';
  const displayPhoto = invitee?.photoUrl || defaultPhoto;
  const displayName = invitee ? invitee.name : 'Archisman';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#010102',
        color: '#f8f3eb',
        fontFamily: "'Playfair Display', serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(248, 243, 235, 0.1)',
            borderTopColor: '#e86a24',
            borderRadius: '50%',
            animation: 'practicalFlicker 1.5s linear infinite',
            margin: '0 auto 1.5rem'
          }} />
          <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.6 }}>Summoning the memory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#010102',
        color: '#f8f3eb',
        fontFamily: "'Playfair Display', serif",
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>{error}</h2>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '0.8rem 1.6rem',
              background: 'transparent',
              border: '1px solid rgba(248, 243, 235, 0.2)',
              color: '#f8f3eb',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              cursor: 'pointer'
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="air-texture" aria-hidden="true">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="air-frame" />
        ))}
      </div>
      <div className="ambient-lights" aria-hidden="true">
        <span className="shore-glow" />
        <span className="sodium-glow" />
        <span className="violet-glow" />
      </div>
      <div className="cursor-dot-invite" id="cursorDotInvite" aria-hidden="true" />
      <div className="cursor-aura-invite" id="cursorAuraInvite" aria-hidden="true" />

      <main className="page-shell">
        <section className="hero" aria-label="Personal Farewell Invitation">
          <div className="hero-copy">
            <p className="eyebrow">Personal Farewell Invitation</p>
            <div className="event-title">
              <h1 className="invite-name">{displayName}</h1>
              <p className="hero-line">A farewell by the shore, after dark.</p>
            </div>
            <p className="hero-note">
              We started in the quiet labs and we finish under the shoreline neon. This is your personal invitation to step through the gate one last time before the signal drops.
            </p>
          </div>

          <div className="portrait-wrap">
            <div className="portrait-frame">
              <img
                className="invitee-photo"
                src={displayPhoto}
                alt={displayName}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultPhoto;
                }}
              />
              <div className="portrait-caption">
                <p className="eyebrow" style={{ color: '#e86a24', marginBottom: '0.2rem' }}>Invitee Portrait</p>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>Archived Code: {id ? id.substring(0, 8) : '00000000'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section" aria-labelledby="details-title">
          <div className="event-details">
            <div>
              <p className="section-kicker">The Ritual</p>
              <h2 className="section-title" id="details-title">A night designed to be remembered.</h2>
              <p className="event-intro" style={{ marginTop: '2rem' }}>
                Dress in code, speak in memories, and let the beach club bass wash over everything we left behind. Some nights stay projected forever.
              </p>
            </div>
            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-label">The Signal</span>
                <span className="detail-value">CSE Farewell 2K25</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">The Date</span>
                <span className="detail-value">Friday, 30 May</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">The Arena</span>
                <span className="detail-value">Ibiza Beach Club</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">The Time</span>
                <span className="detail-value">7:30 PM onwards</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dress Protocol</span>
                <span className="detail-value">Black, linen, shimmer</span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section rsvp-section" aria-labelledby="rsvp-title">
          <div className="rsvp-header">
            <div>
              <p className="section-kicker">Seal the response</p>
              <h2 className="section-title" id="rsvp-title">Are you stepping through the gate?</h2>
            </div>
            <p className="rsvp-note">
              Select your path. Your response will seal the light trace left in the final yearbook.
            </p>
          </div>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <div className="choice-group">
              <button
                type="button"
                className={`choice-card interactable-invite${attending === true ? ' is-selected' : ''}`}
                data-attendance="yes"
                onClick={() => setAttending(true)}
              >
                <span className="choice-meta">Step In</span>
                <span className="choice-title">Yes, I will be there.</span>
                <span className="choice-copy">I will carry my neon and confirm my space in the final yearbook.</span>
              </button>

              <button
                type="button"
                className={`choice-card interactable-invite${attending === false ? ' is-selected' : ''}`}
                data-attendance="no"
                onClick={() => setAttending(false)}
              >
                <span className="choice-meta">Fade Out</span>
                <span className="choice-title">No, I will miss it.</span>
                <span className="choice-copy">I will project my memory from afar but cannot seal it in person.</span>
              </button>
            </div>

            <div className={`message-panel${attending !== null ? ' is-open' : ''}`}>
              <div className="message-inner">
                <label className="eyebrow message-label" htmlFor="guestMessage">Write a final trace (optional)</label>
                <textarea
                  id="guestMessage"
                  className="message-field"
                  placeholder="Leave a message for the yearbook..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </div>
            </div>

            <div className="submit-row">
              <button
                type="submit"
                className="submit-invite interactable-invite"
                disabled={attending === null || submitting}
              >
                {submitting ? 'Sealing...' : submitted ? 'Update Response' : 'Seal response'}
              </button>
              <p className="status-line" id="statusMessage">
                {submitted ? '✦ RESPONSE RECORDED IN ARCHIVE' : '✧ AWAITING DECK COMMANDS'}
              </p>
            </div>
          </form>

          <div className={`confirmation${submitted ? ' is-visible' : ''}`} id="confirmationBox" style={{ marginTop: '4rem' }}>
            <h3 className="confirmation-title">
              {attending ? 'Your projection is confirmed.' : 'Your signal has faded.'}
            </h3>
            <p className="confirmation-copy">
              {attending
                ? 'Your slot in the digital archive and the real beach club beachside tables has been officially written. See you in the lights.'
                : 'Your response has been logged. We will remember you in the noise. May your signals remain clear.'}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
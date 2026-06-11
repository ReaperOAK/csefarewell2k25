'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import { encodeImageUrl } from '../utils/imageUtils';
import {
  Shell,
  AirTexture,
  AirFrame,
  AmbientLights,
  ShoreGlow,
  SodiumGlow,
  VioletGlow,
  CursorDot,
  CursorAura,
  PageShell,
  Hero,
  HeroCopy,
  Eyebrow,
  InviteName,
  HeroLine,
  HeroNote,
  PortraitWrap,
  PortraitFrame,
  InviteePhoto,
  PortraitCaption,
  ContentSection,
  SectionKicker,
  SectionTitle,
  EventDetailsGrid,
  EventIntro,
  DetailList,
  DetailRow,
  DetailLabel,
  DetailValue,
  RSVPHeader,
  RSVPNote,
  RSVPForm,
  ChoiceGroup,
  ChoiceCard,
  ChoiceMeta,
  ChoiceTitle,
  ChoiceCopy,
  MessagePanel,
  MessageInner,
  MessageLabel,
  MessageField,
  SubmitRow,
  SubmitInvite,
  StatusLine,
  Confirmation,
  ConfirmationTitle,
  ConfirmationCopy,
  SRColor
} from '../styles/InvitationPortedStyles';

const Invitation: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [invitee, setInvitee] = useState<Invitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attending, setAttending] = useState<boolean | null>(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Mouse & scroll state
  const [isHovering, setIsHovering] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const auraPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

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
            if (inviteeData.attending !== null) setShowThankYou(true);
          }
        } else {
          setError('Invitation not found');
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteeData();
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      auraPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }, []);

  useEffect(() => {
    // rAF-throttle the scroll/resize work: reading scrollHeight on every scroll
    // event forces a synchronous layout (jank). Batching to one read per frame
    // keeps scrolling smooth.
    let scrollPending = false;

    const flushScroll = () => {
      scrollPending = false;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scroll = (window.scrollY / maxScroll).toFixed(4);
      if (shellRef.current) {
        shellRef.current.style.setProperty('--scroll', scroll);
      }
    };

    const scheduleScroll = () => {
      if (!scrollPending) {
        scrollPending = true;
        requestAnimationFrame(flushScroll);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (shellRef.current) {
        shellRef.current.style.setProperty('--cursor-x', `${e.clientX}px`);
        shellRef.current.style.setProperty('--cursor-y', `${e.clientY}px`);
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    flushScroll();

    return () => {
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // The custom cursor is hidden on touch devices (CSS @media max-width:860px /
    // no pointer), so skip its RAF loop there entirely — no reason to run a
    // per-frame animation for an invisible element on phones.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches
    ) {
      return;
    }

    const renderCursor = () => {
      auraPos.current.x += (mousePos.current.x - auraPos.current.x) * 0.14;
      auraPos.current.y += (mousePos.current.y - auraPos.current.y) * 0.14;

      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.left = `${auraPos.current.x}px`;
        cursorAuraRef.current.style.top = `${auraPos.current.y}px`;
      }

      requestRef.current = requestAnimationFrame(renderCursor);
    };
    requestRef.current = requestAnimationFrame(renderCursor);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attending === null) return;

    try {
      setSubmitting(true);

      if (id) {
        await updateDoc(doc(db, 'invitees', id), {
          attending,
          response,
          timestamp: Date.now()
        });

        if (invitee) {
          setInvitee({
            ...invitee,
            attending,
            response
          });
        }
      }

      setShowThankYou(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      alert('Failed to submit your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#010102', color: '#e86a24' }}>
        <p>Summoning your invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#010102', color: '#e86a24' }}>
        <h2>{error}</h2>
        <button onClick={() => router.push('/')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #e86a24', color: '#e86a24', cursor: 'pointer' }}>
          Return Home
        </button>
      </div>
    );
  }

  const defaultPhoto = '/fp/skull.webp';
  const encodedPhotoUrl = encodeImageUrl(invitee?.photoUrl || defaultPhoto);
  const name = invitee ? invitee.name : 'Distinguished Guest';

  const cursorScaleDot = isHovering ? 0.25 : 1;
  const cursorOpacityDot = isHovering ? 0.35 : 1;
  const cursorScaleAura = isHovering ? 1.35 : 1;
  const cursorBorderAura = isHovering ? 'rgba(232, 106, 36, 0.76)' : 'rgba(232, 106, 36, 0.34)';
  const cursorBgAura = isHovering ? 'rgba(232, 106, 36, 0.06)' : 'transparent';

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <Shell ref={shellRef} $attending={attending}>
      <AirTexture aria-hidden="true">
        <AirFrame $x="0%" $y="0%" $delay="0s" />
        <AirFrame $x="50%" $y="0%" $delay="4s" />
        <AirFrame $x="100%" $y="0%" $delay="8s" />
        <AirFrame $x="0%" $y="50%" $delay="12s" />
        <AirFrame $x="50%" $y="50%" $delay="16s" />
        <AirFrame $x="100%" $y="50%" $delay="20s" />
        <AirFrame $x="0%" $y="100%" $delay="24s" />
        <AirFrame $x="50%" $y="100%" $delay="28s" />
        <AirFrame $x="100%" $y="100%" $delay="32s" />
      </AirTexture>

      <AmbientLights aria-hidden="true">
        <ShoreGlow />
        <SodiumGlow />
        <VioletGlow />
      </AmbientLights>

      <CursorAura ref={cursorAuraRef} $scale={cursorScaleAura} $borderColor={cursorBorderAura} $background={cursorBgAura} aria-hidden="true" />
      <CursorDot ref={cursorDotRef} $scale={cursorScaleDot} $opacity={cursorOpacityDot} aria-hidden="true" />

      <PageShell>
        <Hero aria-labelledby="invitee-name">
          <HeroCopy>
            <Eyebrow>Personal Farewell Invitation</Eyebrow>
            <Eyebrow className="event-title">Ibiza // The Final Memory</Eyebrow>
            <InviteName id="invitee-name" $len={name.length}>{name}</InviteName>
            <HeroLine>One last tide, one last song, one last night with your name in it.</HeroLine>
            <HeroNote>
              A warm beach-rave farewell for the people who made the noise feel like home.
              This one is saved for you.
            </HeroNote>
          </HeroCopy>

          <PortraitWrap>
            <PortraitFrame>
              <InviteePhoto
                src={encodedPhotoUrl}
                alt={`Portrait of ${name} for the farewell invitation`}
              />
              <PortraitCaption>
                <Eyebrow>Reserved for {name}</Eyebrow>
              </PortraitCaption>
            </PortraitFrame>
          </PortraitWrap>
        </Hero>

        <ContentSection aria-labelledby="event-info-title">
          <EventDetailsGrid>
            <div>
              <SectionKicker>Event Information</SectionKicker>
              <SectionTitle id="event-info-title">A farewell by the shore, after dark.</SectionTitle>
              <EventIntro>
                Come dressed for salt air, amber lights, familiar faces, and the kind of goodbye
                that does not need to be loud to stay with you.
              </EventIntro>
            </div>

            <DetailList>
              <DetailRow>
                <DetailLabel>Farewell</DetailLabel>
                <DetailValue>CSE Farewell 2K26</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>16th June 2026</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Venue</DetailLabel>
                <DetailValue>STCET</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Time</DetailLabel>
                <DetailValue>2:00 PM onwards</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Theme</DetailLabel>
                <DetailValue>Beach Rave Party</DetailValue>
              </DetailRow>
            </DetailList>
          </EventDetailsGrid>
        </ContentSection>

        <ContentSection className="rsvp-section" aria-labelledby="rsvp-title">
          <RSVPHeader>
            <div>
              <SectionKicker>RSVP</SectionKicker>
              <SectionTitle id="rsvp-title">Tell us where to keep you in the night.</SectionTitle>
            </div>
            <RSVPNote>
              Choose your attendance first. A final message field will open after that, so the archive
              remembers the right version of your goodbye.
            </RSVPNote>
          </RSVPHeader>

          <RSVPForm onSubmit={handleSubmit}>
            <ChoiceGroup aria-describedby="rsvpStatus">
              <SRColor as="legend">Attendance choice</SRColor>
              <ChoiceCard
                type="button"
                $attendance="yes"
                $selected={attending === true}
                aria-pressed={attending === true}
                onClick={() => setAttending(true)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ChoiceMeta>Attending</ChoiceMeta>
                <ChoiceTitle>One last night.</ChoiceTitle>
                <ChoiceCopy>I will be there for the shore, the music, and the goodbye.</ChoiceCopy>
              </ChoiceCard>
              <ChoiceCard
                type="button"
                $attendance="no"
                $selected={attending === false}
                aria-pressed={attending === false}
                onClick={() => setAttending(false)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <ChoiceMeta>Not attending</ChoiceMeta>
                <ChoiceTitle>Remember me from afar.</ChoiceTitle>
                <ChoiceCopy>I cannot make it, but keep my place in the noise.</ChoiceCopy>
              </ChoiceCard>
            </ChoiceGroup>

            <MessagePanel
              initial={false}
              animate={attending !== null && !showThankYou ? "open" : "closed"}
              variants={{
                open: { opacity: 1, gridTemplateRows: '1fr', transform: 'translateY(0)' },
                closed: { opacity: 0, gridTemplateRows: '0fr', transform: 'translateY(10px)' }
              }}
              transition={{ duration: 0.42, ease: "easeInOut" }}
            >
              <MessageInner>
                <MessageLabel as="label" htmlFor="farewellMessage">One final message</MessageLabel>
                <MessageField
                  id="farewellMessage"
                  name="message"
                  rows={4}
                  placeholder="Leave something behind..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </MessageInner>
            </MessagePanel>

            {!showThankYou && (
              <SubmitRow>
                <SubmitInvite
                  type="submit"
                  disabled={attending === null || submitting}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {submitting ? 'Sending...' : 'Send RSVP'}
                </SubmitInvite>
                <StatusLine id="rsvpStatus" aria-live="polite">
                  {attending === null ? 'Choose your RSVP.' : attending ? 'Marked: attending.' : 'Marked: remembering from afar.'}
                </StatusLine>
              </SubmitRow>
            )}

            {showThankYou && (
              <Confirmation
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="status"
                aria-live="polite"
              >
                <ConfirmationTitle>
                  {attending ? 'Your place is saved.' : 'Your trace is saved.'}
                </ConfirmationTitle>
                <ConfirmationCopy>
                  {attending
                    ? `We will see you under the amber lights, ${name}. One last night is waiting.`
                    : `You will still be part of the night, ${name}. Your message stays with the farewell.`}
                </ConfirmationCopy>
                <button
                  type="button"
                  onClick={() => setShowThankYou(false)}
                  style={{
                    marginTop: '1.5rem',
                    background: 'transparent',
                    border: '1px solid var(--sodium)',
                    color: 'var(--sodium)',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '999px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.22em',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Update Response
                </button>
              </Confirmation>
            )}
          </RSVPForm>
        </ContentSection>
      </PageShell>
    </Shell>
  );
};

export default Invitation;
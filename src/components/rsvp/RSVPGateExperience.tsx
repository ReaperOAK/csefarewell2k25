'use client';

import React, { useEffect, useRef, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import '../../app/rsvp.css';


export function RSVPGateExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const filmBurn = document.getElementById('filmBurn');
    if (filmBurn) { filmBurn.classList.remove('bleed'); void filmBurn.offsetWidth; filmBurn.classList.add('bleed'); }
    try {
      if (db) await addDoc(collection(db, 'general-rsvp'), { name, studentId, timestamp: Date.now() });
      setSubmitted(true);
      setName(''); setStudentId('');
    } catch (err) { setError('Memory could not be sealed. Try again.'); }
    finally { setSubmitting(false); }
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const gate = document.getElementById('gate');
    const openMemory = document.getElementById('openMemory');
    const filmBurn = document.getElementById('filmBurn');
    const cursorDot = document.getElementById('cursorDot');
    const cursorAura = document.getElementById('cursorAura');
    const fragments = Array.from(document.querySelectorAll('.projection-image'));
    const transitionFrames = Array.from(document.querySelectorAll('.transition-frame'));
    const phaseWords = Array.from(document.querySelectorAll('.phase-word'));
    const phaseNames = ['Silence','Emergence','Euphoria','Fragmentation','Intimacy','Afterglow','Disappearance'];

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let auraX = mouseX, auraY = mouseY, lastPhase = 0;
    let rafId: number;

    function clamp(v: number, mn: number, mx: number) { return Math.max(mn, Math.min(mx, v)); }
    function opacityWindow(p: number, a: number, b: number, c: number, d: number) {
      return Math.min(clamp((p-a)/Math.max(0.001,b-a),0,1), clamp((d-p)/Math.max(0.001,d-c),0,1));
    }
    function setCursor(x: number, y: number) {
      root.style.setProperty('--cursor-x', `${x}px`);
      root.style.setProperty('--cursor-y', `${y}px`);
    }

    function updateScrollState() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(window.scrollY / maxScroll, 0, 1);
      const light = clamp(Math.sin(progress * Math.PI) * 1.18, 0, 1);
      const quiet = clamp((progress - 0.72) / 0.22, 0, 1);
      const phase = Math.min(phaseNames.length - 1, Math.floor(progress * phaseNames.length));
      const tP = clamp((progress - 0.16) / 0.78, 0, 1);
      const tFI = clamp((progress - 0.12) / 0.1, 0, 1);
      const tFO = clamp((0.985 - progress) / 0.035, 0, 1);
      const tO = Math.min(tFI, tFO) * 0.86;
      const tPos = tP * Math.max(transitionFrames.length - 1, 1);
      const tIdx = Math.min(transitionFrames.length - 1, Math.floor(tPos));
      const tMix = tPos - tIdx;

      root.style.setProperty('--scroll', progress.toFixed(4));
      root.style.setProperty('--phase-light', light.toFixed(4));
      root.style.setProperty('--phase-quiet', quiet.toFixed(4));
      root.style.setProperty('--transition-opacity', tO.toFixed(4));
      root.style.setProperty('--transition-zoom', tP.toFixed(4));
      root.style.setProperty('--transition-tilt', ((tP - 0.5) * 2).toFixed(4));
      root.style.setProperty('--hero-opacity', opacityWindow(progress,-0.02,0,0.1,0.17).toFixed(4));
      root.style.setProperty('--hero-bg-opacity', opacityWindow(progress,-0.02,0,0.14,0.24).toFixed(4));
      root.style.setProperty('--beat-one', opacityWindow(progress,0.18,0.23,0.29,0.35).toFixed(4));
      root.style.setProperty('--beat-two', opacityWindow(progress,0.37,0.42,0.48,0.54).toFixed(4));
      root.style.setProperty('--beat-three', opacityWindow(progress,0.56,0.61,0.67,0.73).toFixed(4));
      root.style.setProperty('--beat-four', opacityWindow(progress,0.75,0.8,0.86,0.9).toFixed(4));
      root.style.setProperty('--fragment-opacity', Math.max(opacityWindow(progress,0.18,0.23,0.29,0.35)*0.38, opacityWindow(progress,0.37,0.42,0.48,0.54)*0.82, opacityWindow(progress,0.56,0.61,0.67,0.73)*0.42).toFixed(4));
      root.style.setProperty('--intimate-opacity', opacityWindow(progress,0.91,0.925,0.94,0.955).toFixed(4));
      root.style.setProperty('--rsvp-opacity', clamp((progress-0.965)/0.035,0,1).toFixed(4));
      body.classList.toggle('rsvp-quiet', progress > 0.9);

      transitionFrames.forEach((frame, i) => {
        const el = frame as HTMLElement;
        const isCur = i === tIdx, isNxt = i === tIdx + 1;
        const op = tO > 0 ? Math.max(isCur ? 1 - tMix * 0.52 : 0, isNxt ? tMix * 0.92 : 0) : 0;
        el.style.opacity = op.toFixed(4);
        el.classList.toggle('is-live', op > 0.08);
      });

      if (phase !== lastPhase) {
        lastPhase = phase;
        phaseWords.forEach((w, i) => w.classList.toggle('active', i === phase));
        if (filmBurn) { filmBurn.classList.remove('bleed'); void (filmBurn as HTMLElement).offsetWidth; filmBurn.classList.add('bleed'); }
      }
    }

    function updateFragments() {
      fragments.forEach((f, i) => {
        const el = f as HTMLElement;
        const r = el.getBoundingClientRect();
        const dx = mouseX - (r.left + r.width/2), dy = mouseY - (r.top + r.height/2);
        const pull = clamp(1 - Math.hypot(dx,dy)/520, 0, 1);
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.setProperty('--mx', (dx*pull*0.028*dir).toFixed(2));
        el.style.setProperty('--my', (dy*pull*0.022).toFixed(2));
        el.style.setProperty('--s', (1+pull*0.018).toFixed(3));
      });
    }

    function render() {
      auraX += (mouseX - auraX) * 0.07; auraY += (mouseY - auraY) * 0.07;
      if (cursorDot) { (cursorDot as HTMLElement).style.left = `${mouseX}px`; (cursorDot as HTMLElement).style.top = `${mouseY}px`; }
      if (cursorAura) { (cursorAura as HTMLElement).style.left = `${auraX}px`; (cursorAura as HTMLElement).style.top = `${auraY}px`; }
      updateFragments();
      rafId = requestAnimationFrame(render);
    }

    function igniteMemory() {
      if (!gate) return;
      gate.classList.add('leaving');
      if (filmBurn) { filmBurn.classList.remove('bleed'); void (filmBurn as HTMLElement).offsetWidth; filmBurn.classList.add('bleed'); }
      setTimeout(() => {
        if (gate) (gate as HTMLElement).style.display = 'none';
        body.classList.remove('locked'); body.classList.add('live');
        updateScrollState();
      }, 780);
    }

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; setCursor(mouseX, mouseY); };
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    openMemory?.addEventListener('click', igniteMemory);

    document.querySelectorAll('.interactable').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorDot) { (cursorDot as HTMLElement).style.transform='translate(-50%,-50%) scale(3)'; (cursorDot as HTMLElement).style.background='transparent'; (cursorDot as HTMLElement).style.border='1px solid rgba(232,106,36,0.82)'; }
      });
      el.addEventListener('mouseleave', () => {
        if (cursorDot) { (cursorDot as HTMLElement).style.transform='translate(-50%,-50%) scale(1)'; (cursorDot as HTMLElement).style.background='var(--white)'; (cursorDot as HTMLElement).style.border='0'; }
      });
    });

    body.classList.add('locked');
    setCursor(mouseX, mouseY);
    updateScrollState();
    rafId = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      cancelAnimationFrame(rafId);
      body.classList.remove('locked','live','rsvp-quiet');
    };
  }, []);

  return (
    <>
      <div className="projected-crowd" aria-hidden="true" />
      <div className="air-texture" aria-hidden="true" />
      <div className="light-engine" aria-hidden="true">
        <div className="projection shore" />
        <div className="projection sodium" />
        <div className="projection indigo" />
        <div className="practical-lights" />
        <div className="lens-streak" />
      </div>
      <div className="depth-fog" aria-hidden="true">
        <div className="fog distant" />
        <div className="fog ambient" />
        <div className="fog humidity" />
        <div className="fog foreground" />
      </div>
      <div className="halation" aria-hidden="true" />
      <div className="film-burn" id="filmBurn" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="cursor-aura" id="cursorAura" aria-hidden="true" />
      <div className="cursor-dot" id="cursorDot" aria-hidden="true" />

      <div id="gate" ref={containerRef}>
        <div className="intro-mosaic" aria-hidden="true">
          {[...Array(9)].map((_,i) => <span key={i} className="intro-tile" />)}
        </div>
        <div className="gate-inner">
          <p className="ritual-text">Some nights do not end. They keep projecting.</p>
          <button className="trigger-btn interactable" type="button" id="openMemory">Open the archive</button>
        </div>
      </div>

      <main id="memory-space" aria-label="IBIZA farewell memory experience">
        <div className="sticky-stage">
          <div className="memory-plane" aria-hidden="true">
            <div className="projection-image crowd-wash feather-soft" />
            <div className="projection-image texture-wash feather-burn" />
          </div>
          <div className="transition-plane" aria-hidden="true">
            {[...Array(9)].map((_,i) => <span key={i} className="transition-frame" />)}
          </div>
          <div className="copy-plane">
            <section className="hero-copy" aria-labelledby="ibiza-title">
              <p className="meta hero-kicker">02:17 AM // Final summer signal</p>
              <h1 className="mass-type hero-title" id="ibiza-title">IBIZA</h1>
              <p className="whisper-type hero-sub">Before we disappear entirely.</p>
            </section>
            <p className="projected-note note-a">the shoreline was louder than our futures</p>
            <p className="projected-note note-b">we kept laughing because leaving had already started</p>
          </div>
          <div className="fragment-field" aria-hidden="true">
            <div className="projection-image fragment one feather-torn" />
            <div className="projection-image fragment two feather-soft" />
            <div className="projection-image fragment three feather-torn" />
            <div className="projection-image fragment four feather-burn" />
          </div>
          <div className="story-plane" aria-hidden="true">
            <div className="memory-beat one">
              <div className="beat-frame" />
              <div className="beat-copy"><p className="meta">02:41 AM // Proof</p><p className="whisper-type">The proof stayed brighter than the night itself.</p></div>
            </div>
            <div className="memory-beat two alt">
              <div className="beat-copy"><p className="meta">03:03 AM // Noise</p><p className="whisper-type">The night kept making new versions of us.</p></div>
              <div className="beat-frame" />
            </div>
            <div className="memory-beat three">
              <div className="beat-frame" />
              <div className="beat-copy"><p className="meta">03:27 AM // Shoreline</p><p className="whisper-type">We stayed because leaving was already happening.</p></div>
            </div>
            <div className="memory-beat four alt">
              <div className="beat-copy"><p className="meta">04:12 AM // Trace</p><p className="whisper-type">Some faces become light before they become memory.</p></div>
              <div className="beat-frame" />
            </div>
          </div>
          <div className="intimate-plane" aria-hidden="true">
            <div className="intimate-line">
              <p className="meta">03:46 AM // Intimacy</p>
              <p className="whisper-type">A photograph only hurts after everyone goes home.</p>
            </div>
            <div className="projection-image polaroid-memory feather-soft" />
          </div>
          <div className="afterglow" aria-hidden="true" />
          <section className="rsvp-plane" aria-labelledby="rsvp-title">
            <div className="rsvp-inner">
              <p className="meta">The final trace</p>
              <h2 className="whisper-type rsvp-title" id="rsvp-title">Confirm your presence. Leave a little light behind.</h2>
              {submitted ? (
                <p style={{marginTop:'clamp(2.8rem,8vh,5rem)',color:'rgba(248,243,235,0.8)',fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.5rem,4vw,3rem)',fontStyle:'italic'}}>Memory sealed.</p>
              ) : (
                <form className="memory-form" id="rsvpForm" onSubmit={handleSubmit}>
                  <div className="field interactable">
                    <label className="sr-only" htmlFor="guestName">Your name</label>
                    <input className="memory-input interactable" id="guestName" type="text" placeholder="Your Name" autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} onFocus={()=>document.body.classList.add('rsvp-quiet')} onBlur={()=>document.body.classList.remove('rsvp-quiet')} />
                  </div>
                  <div className="field interactable">
                    <label className="sr-only" htmlFor="studentId">Student ID</label>
                    <input className="memory-input interactable" id="studentId" type="text" placeholder="Student ID" required value={studentId} onChange={e=>setStudentId(e.target.value)} onFocus={()=>document.body.classList.add('rsvp-quiet')} onBlur={()=>document.body.classList.remove('rsvp-quiet')} />
                  </div>
                  {error && <p style={{color:'rgba(232,106,36,0.8)',marginBottom:'1rem',fontSize:'0.8rem'}}>{error}</p>}
                  <button className="memory-submit interactable" type="submit" disabled={submitting}><span>{submitting?'Sealing...':'Seal the Memory'}</span></button>
                </form>
              )}
              <p className="meta closing-line">Nothing lasts forever.<br/>That is why it glows.</p>
            </div>
          </section>
          <div className="phase-words" aria-hidden="true">
            {['Silence','Emergence','Euphoria','Fragmentation','Intimacy','Afterglow','Disappearance'].map((w,i)=>(
              <p key={w} className={`phase-word${i===0?' active':''}`}>{w}</p>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

export const grainShift = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(-1%, 1%); }
  100% { transform: translate(1%, -1%); }
`;

export const airFrameDissolve = keyframes`
  0% {
    opacity: 0.34;
    filter: blur(10px) saturate(1.3) contrast(1.18) brightness(0.86);
  }
  4% {
    opacity: 0.34;
    filter: blur(10px) saturate(1.3) contrast(1.18) brightness(0.86);
  }
  10% {
    opacity: 0.34;
  }
  15% {
    opacity: 0;
    filter: blur(20px) saturate(1.12) contrast(1.1) brightness(0.62);
  }
  100% {
    opacity: 0;
  }
`;

export const airFrameDrift = keyframes`
  from { transform: scale(1.1) rotate(-0.8deg) translate3d(-1vw, -0.6vh, 0); }
  to { transform: scale(1.2) rotate(0.9deg) translate3d(1vw, 0.8vh, 0); }
`;

export const shoreSweep = keyframes`
  from { transform: translate3d(-5vw, 0, 0) rotate(-2deg); }
  to { transform: translate3d(14vw, -2vh, 0) rotate(3deg); }
`;

export const sodiumDrift = keyframes`
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(-6vw, 5vh, 0) scale(1.1); }
`;

export const violetPulse = keyframes`
  from { opacity: 0.26; transform: scale(0.96); }
  to { opacity: 0.48; transform: scale(1.08); }
`;

export const portraitFloat = keyframes`
  from { transform: translate3d(0, -8px, 0); }
  to { transform: translate3d(0, 10px, 0); }
`;

export const portraitLightSweep = keyframes`
  0%, 72% {
    opacity: 0;
    transform: rotate(9deg) translateX(-40%);
  }
  80% {
    opacity: calc(0.62 * var(--mood-bloom, 1));
  }
  92%, 100% {
    opacity: 0;
    transform: rotate(9deg) translateX(420%);
  }
`;

export const Shell = styled.div<{ $attending: boolean | null }>`
  --ink: #010102;
  --night: #050611;
  --deep-violet: #160b2b;
  --sodium: #e86a24;
  --sodium-soft: rgba(232, 106, 36, 0.32);
  --cyan-haze: rgba(42, 104, 114, 0.28);
  --cream: #f8f3eb;
  --cream-muted: rgba(248, 243, 235, 0.64);
  --cream-low: rgba(248, 243, 235, 0.18);
  --line: rgba(248, 243, 235, 0.18);
  --panel: rgba(5, 6, 17, 0.6);
  --shadow: rgba(0, 0, 0, 0.42);
  
  --mood-amber: ${props => props.$attending === true ? 1.28 : props.$attending === false ? 0.78 : 1};
  --mood-violet: ${props => props.$attending === true ? 0.88 : props.$attending === false ? 1.25 : 1};
  --mood-bloom: ${props => props.$attending === true ? 1.22 : props.$attending === false ? 0.82 : 1};
  --mood-cool: ${props => props.$attending === false ? 1 : 0};

  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 72% 8%, rgba(232, 106, 36, calc(0.1 * var(--mood-amber))), transparent 32rem),
    radial-gradient(circle at 12% 34%, rgba(42, 104, 114, calc(0.16 + var(--mood-cool) * 0.08)), transparent 30rem),
    linear-gradient(180deg, var(--ink) 0%, var(--night) 45%, var(--ink) 100%);
  color: var(--cream);
  font-family: Inter, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transition: background 1200ms ease;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  &::before {
    z-index: 0;
    opacity: 0.58;
    background:
      radial-gradient(ellipse at 50% 104%, rgba(232, 106, 36, calc(0.2 * var(--mood-amber))), transparent 34%),
      linear-gradient(112deg, transparent 12%, rgba(248, 243, 235, 0.045) 36%, transparent 56%),
      radial-gradient(ellipse at 82% 70%, rgba(46, 26, 94, calc(0.38 * var(--mood-violet))), transparent 44%);
    filter: blur(16px);
    transform: translateY(calc(var(--scroll) * -22px));
    transition: opacity 1200ms ease, background 1200ms ease;
  }

  &::after {
    z-index: 80;
    opacity: 0.1;
    mix-blend-mode: screen;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: ${grainShift} 900ms steps(2) infinite;

    @media (hover: none), (pointer: coarse) {
      animation: none;
    }
  }
`;

export const AirTexture = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.58;
  overflow: hidden;
  pointer-events: none;
  mask-image:
    radial-gradient(ellipse at 52% 50%, black 0 42%, rgba(0, 0, 0, 0.56) 56%, transparent 78%),
    linear-gradient(180deg, transparent 0%, black 16%, black 78%, transparent 100%);
  -webkit-mask-image:
    radial-gradient(ellipse at 52% 50%, black 0 42%, rgba(0, 0, 0, 0.56) 56%, transparent 78%),
    linear-gradient(180deg, transparent 0%, black 16%, black 78%, transparent 100%);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      radial-gradient(circle at 52% 45%, rgba(248, 243, 235, 0.07), transparent 30%),
      radial-gradient(ellipse at center, transparent 0 46%, rgba(1, 1, 2, 0.38) 84%),
      linear-gradient(180deg, rgba(1, 1, 2, 0.08), rgba(1, 1, 2, 0.58));
  }
`;

export const AirFrame = styled.span<{ $x: string, $y: string, $delay: string }>`
  position: absolute;
  inset: -5vh -5vw;
  opacity: 0;
  background-image: url("/assets/urban nightscape through blurred glass.webp");
  background-size: 300% 300%;
  background-position: ${props => props.$x} ${props => props.$y};
  filter: blur(10px) saturate(1.28) contrast(1.16) brightness(0.82);
  mix-blend-mode: color-dodge;
  transform: scale(1.1);
  animation:
    ${airFrameDissolve} 36s ease-in-out infinite,
    ${airFrameDrift} 18s ease-in-out infinite alternate;
  animation-delay: ${props => props.$delay}, ${props => props.$delay};
  will-change: transform;

  /* Freeze these blurred color-dodge layers on touch devices — they recomposite
     every frame and tax phone GPUs for little visible gain. */
  @media (hover: none), (pointer: coarse) {
    animation: none;
    opacity: 0.16;
  }
`;

export const AmbientLights = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  mix-blend-mode: screen;
  pointer-events: none;

  span {
    position: absolute;
    border-radius: 999px;
    filter: blur(42px);
    opacity: 0.42;
    transform: translate3d(0, 0, 0);
    will-change: transform, opacity;
  }

  /* Stop the large blur(42px) glows from animating on touch devices, and
     release the compositor layer so phones don't pay the GPU memory. */
  @media (hover: none), (pointer: coarse) {
    span {
      animation: none !important;
      will-change: auto;
    }
  }
`;

export const ShoreGlow = styled.span`
  left: -18vw;
  bottom: -7vh;
  width: 76vw;
  height: 26vh;
  background: linear-gradient(90deg, transparent, var(--sodium-soft), var(--cyan-haze), transparent);
  animation: ${shoreSweep} 18s ease-in-out infinite alternate;
  opacity: calc(0.34 * var(--mood-bloom));
`;

export const SodiumGlow = styled.span`
  right: -12vw;
  top: 6vh;
  width: 44vw;
  height: 34vh;
  background: radial-gradient(circle, rgba(232, 106, 36, 0.56), transparent 66%);
  animation: ${sodiumDrift} 16s ease-in-out infinite alternate;
  opacity: calc(0.4 * var(--mood-amber));
`;

export const VioletGlow = styled.span`
  left: 12vw;
  top: 36vh;
  width: 48vw;
  height: 44vh;
  background: radial-gradient(circle, rgba(88, 52, 140, 0.34), transparent 68%);
  animation: ${violetPulse} 22s ease-in-out infinite alternate;
  opacity: calc(0.36 * var(--mood-violet));
`;

export const CursorDot = styled.div.attrs<{ $scale: number, $opacity: number }>(props => ({
  style: {
    transform: `translate(-50%, -50%) scale(${props.$scale})`,
    opacity: props.$opacity,
  },
}))`
  position: fixed;
  z-index: 100;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--sodium);
  pointer-events: none;
  transition: transform 180ms ease, opacity 180ms ease;

  @media (max-width: 860px) {
    display: none;
  }
`;

export const CursorAura = styled.div.attrs<{ $scale: number, $borderColor: string, $background: string }>(props => ({
  style: {
    transform: `translate(-50%, -50%) scale(${props.$scale})`,
    borderColor: props.$borderColor,
    background: props.$background,
  },
}))`
  position: fixed;
  z-index: 99;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(232, 106, 36, 0.34);
  border-radius: 999px;
  pointer-events: none;
  transition: border-color 220ms ease, background 220ms ease, transform 220ms ease;

  @media (max-width: 860px) {
    display: none;
  }
`;

export const PageShell = styled.main`
  position: relative;
  z-index: 5;
`;

export const Hero = styled.section`
  min-height: 100svh;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(320px, 0.72fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 6rem);
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding: clamp(2rem, 7vw, 5.5rem) 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    min-height: auto;
    gap: 2.4rem;
    padding-top: 2rem;
  }
`;

export const HeroCopy = styled.div`
  max-width: 620px;
`;

export const Eyebrow = styled.p`
  font-family: Inter, sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  line-height: 1.4;
  text-transform: uppercase;
  color: var(--sodium);
  margin-bottom: 1.1rem;

  &.event-title {
    margin-bottom: 2.8rem;
    @media (max-width: 860px) {
      margin-bottom: 2rem;
    }
  }
`;

/* Name scales down by length so long / multi-word names stay balanced, and
   wraps (never overflows) thanks to overflow-wrap + the grid cell's min-width:0.
   $len is the character count of the rendered name. */
const inviteNameSize = (len: number) => {
  if (len <= 8) return css`font-size: clamp(4.2rem, 13vw, 11rem);`;
  if (len <= 12) return css`font-size: clamp(3.4rem, 10.5vw, 8.6rem);`;
  if (len <= 18) return css`font-size: clamp(2.7rem, 8vw, 6.2rem);`;
  if (len <= 26) return css`font-size: clamp(2.2rem, 6.4vw, 4.8rem);`;
  return css`font-size: clamp(1.85rem, 5.2vw, 3.8rem);`;
};

const inviteNameSizeMobile = (len: number) => {
  if (len <= 8) return css`font-size: clamp(3.6rem, 22vw, 6.6rem);`;
  if (len <= 12) return css`font-size: clamp(3rem, 17vw, 5.4rem);`;
  if (len <= 18) return css`font-size: clamp(2.3rem, 13vw, 4.2rem);`;
  if (len <= 26) return css`font-size: clamp(1.95rem, 10.5vw, 3.4rem);`;
  return css`font-size: clamp(1.7rem, 8.8vw, 2.8rem);`;
};

export const InviteName = styled.h1<{ $len: number }>`
  font-family: Oswald, sans-serif;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 0.86;
  text-transform: uppercase;
  text-shadow: 0 0 42px rgba(232, 106, 36, 0.14);
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  ${props => inviteNameSize(props.$len)}

  @media (max-width: 560px) {
    ${props => inviteNameSizeMobile(props.$len)}
  }
`;

export const HeroLine = styled.p`
  max-width: 560px;
  margin-top: 2rem;
  color: var(--cream);
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 4.6vw, 4.9rem);
  font-style: italic;
  font-weight: 400;
  line-height: 1.02;
`;

export const HeroNote = styled.p`
  max-width: 460px;
  margin-top: 1.5rem;
  color: var(--cream-muted);
  font-size: clamp(0.98rem, 1.4vw, 1.08rem);
  font-weight: 300;
  line-height: 1.8;
`;

export const PortraitWrap = styled.div`
  position: relative;
  align-self: stretch;
  min-height: min(72svh, 720px);
  display: flex;
  align-items: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
  }

  &::before {
    inset: 9% -8% 6% -16%;
    z-index: -1;
    opacity: calc(0.52 * var(--mood-bloom));
    background:
        radial-gradient(ellipse at 58% 46%, rgba(232, 106, 36, 0.26), transparent 48%),
        radial-gradient(ellipse at 34% 72%, rgba(42, 104, 114, 0.2), transparent 46%);
    filter: blur(30px);
    transform: translate3d(0, 0, 0);
    transition: opacity 1200ms ease;
  }

  &::after {
    top: 11%;
    left: -48%;
    z-index: 4;
    width: 34%;
    height: 78%;
    opacity: 0;
    background: linear-gradient(104deg, transparent, rgba(255, 196, 126, 0.2) 42%, rgba(248, 243, 235, 0.1) 50%, transparent 62%);
    filter: blur(10px);
    mix-blend-mode: screen;
    transform: rotate(9deg) translateX(-40%);
    animation: ${portraitLightSweep} 28s ease-in-out infinite;
    @media (max-width: 860px) {
      left: -58%;
      width: 42%;
    }
  }

  @media (max-width: 860px) {
    min-height: auto;
  }
`;

export const PortraitFrame = styled.figure`
  position: relative;
  width: min(100%, 460px);
  margin-left: auto;
  aspect-ratio: 4 / 5.4;
  overflow: hidden;
  border: 1px solid rgba(248, 243, 235, 0.12);
  border-radius: 1.2rem;
  background:
      radial-gradient(circle at 72% 20%, rgba(232, 106, 36, 0.08), transparent 32%),
      var(--panel);
  box-shadow:
      0 34px 90px var(--shadow),
      0 0 calc(76px * var(--mood-bloom)) rgba(232, 106, 36, 0.14),
      -28px 20px 70px rgba(42, 104, 114, 0.08);
  isolation: isolate;
  animation: ${portraitFloat} 10s ease-in-out infinite alternate;
  transform: translateZ(0);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    background:
        radial-gradient(circle at 62% 18%, rgba(248, 243, 235, 0.16), transparent 24%),
        radial-gradient(ellipse at 9% 78%, rgba(232, 106, 36, 0.18), transparent 42%),
        linear-gradient(180deg, transparent 38%, rgba(1, 1, 2, 0.62) 100%),
        linear-gradient(115deg, rgba(232, 106, 36, 0.2), transparent 30%, rgba(42, 104, 114, 0.14) 74%, transparent);
    mix-blend-mode: screen;
  }

  &::after {
    border: 1px solid rgba(248, 243, 235, 0.14);
    border-radius: inherit;
    box-shadow:
        inset 0 0 34px rgba(1, 1, 2, 0.5),
        inset 0 0 2px rgba(248, 243, 235, 0.28);
    background:
        linear-gradient(90deg, rgba(248, 243, 235, 0.08), transparent 18%, transparent 82%, rgba(232, 106, 36, 0.06)),
        radial-gradient(ellipse at center, transparent 0 58%, rgba(1, 1, 2, 0.4) 100%);
    mix-blend-mode: screen;
  }

  @media (max-width: 860px) {
    width: min(100%, 430px);
    margin: 0 auto;
    aspect-ratio: 4 / 5;
  }
`;

export const InviteePhoto = styled.img.attrs({
  loading: 'eager' as const,
  decoding: 'async' as const,
  fetchPriority: 'high' as const,
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 34%;
  filter: sepia(0.07) saturate(0.92) contrast(1.08) brightness(0.84);
  transform: scale(1.024);
`;

export const PortraitCaption = styled.figcaption`
  position: absolute;
  z-index: 3;
  right: 1.2rem;
  bottom: 1.1rem;
  left: 1.2rem;
  color: rgba(248, 243, 235, 0.78);
  text-align: right;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const ContentSection = styled.section`
  width: min(1040px, calc(100% - 2rem));
  margin: 0 auto;
  padding: clamp(4.5rem, 10vw, 8rem) 0;

  @media (max-width: 560px) {
    width: min(100% - 1.25rem, 1040px);
  }

  &.rsvp-section {
    padding-bottom: clamp(5rem, 10vw, 8rem);
  }
`;

export const SectionKicker = styled(Eyebrow)`
  color: var(--sodium);
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  max-width: 740px;
  font-family: "Playfair Display", serif;
  font-size: clamp(2.2rem, 5vw, 5rem);
  font-style: italic;
  font-weight: 400;
  line-height: 1.04;
`;

export const EventDetailsGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(340px, 1.22fr);
  gap: clamp(3rem, 8vw, 7rem);
  align-items: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: clamp(2.4rem, 6vw, 4.8rem) 0;

  &::before {
    content: "IBIZA";
    position: absolute;
    top: 50%;
    right: -0.08em;
    z-index: -1;
    color: rgba(248, 243, 235, 0.032);
    font-family: Oswald, sans-serif;
    font-size: clamp(6rem, 17vw, 15rem);
    font-weight: 600;
    line-height: 0.8;
    text-transform: uppercase;
    transform: translateY(-50%);
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const EventIntro = styled.p`
  color: var(--cream-muted);
  font-size: clamp(1rem, 1.4vw, 1.14rem);
  font-weight: 300;
  line-height: 1.8;
`;

export const DetailList = styled.dl`
  display: grid;
  gap: 1.05rem;
`;

export const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 1.4rem;
  align-items: baseline;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(248, 243, 235, 0.12);

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
`;

export const DetailLabel = styled.dt`
  color: var(--cream-muted);
  font-family: Inter, sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
`;

export const DetailValue = styled.dd`
  color: var(--cream);
  font-family: Oswald, sans-serif;
  font-size: clamp(1.32rem, 2.2vw, 2.15rem);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.08;
  text-transform: uppercase;
`;

export const RSVPHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.7fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: end;
  margin-bottom: clamp(2.4rem, 5vw, 4rem);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const RSVPNote = styled.p`
  color: var(--cream-muted);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.8;
`;

export const RSVPForm = styled.form`
  display: grid;
  gap: 2.2rem;
`;

export const ChoiceGroup = styled.fieldset`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  border: 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const ChoiceCard = styled.button<{ $selected: boolean, $attendance: 'yes' | 'no' }>`
  position: relative;
  min-height: 150px;
  padding: 1.35rem;
  border: 1px solid var(--line);
  border-radius: 1rem;
  background: rgba(248, 243, 235, 0.035);
  color: var(--cream);
  text-align: left;
  overflow: hidden;
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
  cursor: none;

  @media (max-width: 860px) {
    cursor: pointer;
    min-height: 132px;
  }

  &::before {
    content: "";
    position: absolute;
    inset: auto 1.35rem 1.2rem 1.35rem;
    height: 1px;
    background: linear-gradient(90deg, var(--sodium), transparent);
    opacity: ${props => props.$selected ? 1 : 0};
    transition: opacity 220ms ease;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-3px);
    border-color: rgba(232, 106, 36, 0.64);
    background: rgba(232, 106, 36, 0.065);
    box-shadow: 0 22px 64px rgba(0, 0, 0, 0.24), 0 0 44px rgba(232, 106, 36, 0.08);
    outline: none;
  }

  ${props => props.$selected && props.$attendance === 'yes' && css`
    background: rgba(232, 106, 36, 0.08);
    border-color: rgba(232, 106, 36, 0.68);
  `}

  ${props => props.$selected && props.$attendance === 'no' && css`
    background: rgba(88, 52, 140, 0.1);
    border-color: rgba(160, 132, 210, 0.38);
  `}
`;

export const ChoiceMeta = styled.span`
  display: block;
  margin-bottom: 1.3rem;
  color: var(--sodium);
  font-family: Inter, sans-serif;
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
`;

export const ChoiceTitle = styled.span`
  display: block;
  margin-bottom: 0.75rem;
  font-family: "Playfair Display", serif;
  font-size: clamp(1.65rem, 3vw, 2.8rem);
  font-style: italic;
  line-height: 1.02;
`;

export const ChoiceCopy = styled.span`
  display: block;
  max-width: 24rem;
  color: var(--cream-muted);
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.6;
`;

export const MessagePanel = styled(motion.div)`
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transform: translateY(10px);
  overflow: hidden;
`;

export const MessageInner = styled.div`
  min-height: 0;
`;

export const MessageLabel = styled(Eyebrow)`
  display: block;
  margin-bottom: 0.85rem;
  color: var(--cream-muted);
`;

export const MessageField = styled.textarea`
  width: 100%;
  min-height: 9rem;
  resize: vertical;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  outline: none;
  background: transparent;
  color: var(--cream);
  font-family: "Playfair Display", serif;
  font-size: clamp(1.55rem, 3vw, 2.8rem);
  font-style: italic;
  line-height: 1.28;
  padding: 0.8rem 0 1.1rem;
  transition: border-color 220ms ease, color 220ms ease;

  &::placeholder {
    color: rgba(248, 243, 235, 0.24);
  }

  &:focus {
    border-color: var(--sodium);
    color: var(--cream);
  }
`;

export const SubmitRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.4rem;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.6rem;

  @media (max-width: 560px) {
    align-items: stretch;
  }
`;

export const SubmitInvite = styled.button`
  min-width: 13rem;
  min-height: 3.35rem;
  border: 1px solid rgba(232, 106, 36, 0.72);
  border-radius: 999px;
  background: rgba(232, 106, 36, 0.12);
  color: var(--cream);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transition: transform 220ms ease, background 220ms ease, box-shadow 220ms ease, opacity 220ms ease;
  cursor: none;

  @media (max-width: 860px) {
    cursor: pointer;
  }

  @media (max-width: 560px) {
    width: 100%;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-2px);
    background: rgba(232, 106, 36, 0.22);
    box-shadow: 0 0 38px rgba(232, 106, 36, 0.16);
    outline: none;
  }

  &:disabled {
    opacity: 0.46;
    transform: none;
    box-shadow: none;
  }
`;

export const StatusLine = styled(Eyebrow)`
  min-height: 1rem;
  color: var(--cream-muted);
  letter-spacing: 0.18em;
  margin-bottom: 0;

  @media (max-width: 560px) {
    width: 100%;
    text-align: center;
  }
`;

export const Confirmation = styled(motion.div)`
  border-top: 1px solid var(--line);
  padding-top: 2rem;
  margin-top: 2rem;
`;

export const ConfirmationTitle = styled.h3`
  color: var(--sodium);
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 4vw, 4rem);
  font-style: italic;
  font-weight: 400;
  line-height: 1.08;
`;

export const ConfirmationCopy = styled.p`
  max-width: 540px;
  margin-top: 1rem;
  color: var(--cream-muted);
  font-weight: 300;
  line-height: 1.8;
`;

export const SRColor = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

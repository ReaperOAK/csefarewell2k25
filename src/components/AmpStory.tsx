import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import { encodeImageUrl } from '../utils/imageUtils';

// Helper to detect mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || (window.innerWidth <= 768);
};

// Styled components with Framer Motion
const StoryContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: static !important;
  min-height: 100vh;
  height: auto;
  touch-action: pan-y;
`;

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1e1e1e 0%, #0a0a0a 100%);
  z-index: 1;
`;

const CathedralOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0.15;
  background-image: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 20px,
    rgba(255, 255, 255, 0.03) 20px,
    rgba(255, 255, 255, 0.03) 25px
  ),
  repeating-linear-gradient(
    180deg,
    transparent,
    transparent 20px,
    rgba(255, 255, 255, 0.03) 20px,
    rgba(255, 255, 255, 0.03) 25px
  );
`;

const StainedGlassEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.3;
  background: 
    radial-gradient(circle at 30% 20%, rgba(128, 0, 0, 0.3) 0%, transparent 30%),
    radial-gradient(circle at 70% 20%, rgba(0, 0, 128, 0.3) 0%, transparent 30%),
    radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.2) 0%, transparent 50%);
`;

const CobwebsLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  opacity: 0.15;
  background-image: 
    linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%);
  background-size: 30px 30px;
`;

const VignetteOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: radial-gradient(
    circle at center,
    transparent 30%,
    rgba(0, 0, 0, 0.7) 100%
  );
  pointer-events: none;
`;

const ContentContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 3rem 1rem 5rem;
  box-sizing: border-box;
  margin-top: 40px;
  margin-bottom: 40px;
  
  @media (min-width: 768px) {
    height: 100%;
    padding: 4rem 2rem;
    justify-content: center;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const NavigationButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  z-index: 100;
  cursor: pointer;
  
  @media (min-width: 768px) {
    top: 20px;
    left: 20px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
  
  &:hover {
    background-color: rgba(10, 10, 10, 0.8);
  }
`;

const PortraitFrame = styled(motion.div)`
  position: relative;
  width: 160px;
  height: 160px;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
  
  @media (min-width: 992px) {
    width: 250px;
    height: 250px;
  }
`;

const HexagonFrame = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  background: linear-gradient(45deg, #d4af37, #a38a28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
`;

const InnerHexagon = styled(motion.div)`
  width: 95%;
  height: 95%;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoContainer = styled(motion.div)<{ photoUrl: string }>`
  width: 90%;
  height: 90%;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  z-index: 12;
`;

const HexagonFrameGlow = styled(motion.div)`
  position: absolute;
  top: -5px;
  left: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.5);
  filter: blur(5px);
  z-index: 10;
`;

const MaskOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 13;
  opacity: 0.4;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 60%;
    height: 40%;
    top: 30%;
    border-radius: 50%;
    border: 1px solid rgba(212, 175, 55, 0.5);
  }
  
  &:before {
    left: 10%;
  }
  
  &:after {
    right: 10%;
  }
`;

const WaxSeal = styled(motion.div)`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 5px 0 15px;
  
  @media (min-width: 768px) {
    width: 120px;
    height: 120px;
    margin: 10px 0 20px;
  }
`;

const SealCircle = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at center, #8b0000 0%, #600 100%);
  border: 2px solid #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 1px dashed rgba(212, 175, 55, 0.7);
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background: 
      repeating-conic-gradient(
        rgba(212, 175, 55, 0.3) 0deg 10deg,
        transparent 10deg 20deg
      );
  }
`;

const NameText = styled(motion.h2)`
  font-family: 'Cinzel Decorative', 'Times New Roman', serif;
  font-size: 1.1rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
  letter-spacing: 0.1em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  z-index: 14;
  
  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ScrollContainer = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 400px;
  margin-top: 15px;
  background-color: rgba(20, 20, 20, 0.7);
  border-top: 1px solid #d4af37;
  border-bottom: 1px solid #d4af37;
  padding: 1.5rem 0.8rem;
  
  @media (min-width: 768px) {
    margin-top: 20px;
    padding: 2rem 1rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #1a1a1a;
    border: 1px solid #d4af37;
    border-radius: 50%;
  }
  
  &:before {
    top: -10px;
    left: calc(50% - 10px);
  }
  
  &:after {
    bottom: -10px;
    left: calc(50% - 10px);
  }
`;

const ScrollContent = styled(motion.div)`
  text-align: center;
`;

const ScrollHeading = styled(motion.h3)`
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 0.8rem;
  color: #8B0000;
  letter-spacing: 0.2em;
  margin-bottom: 10px;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ScrollTitle = styled(motion.h1)`
  font-family: 'Cinzel Decorative', 'Times New Roman', serif;
  font-size: 2.2rem;
  background: linear-gradient(to right, #d4af37 0%, #f5e7a3 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 10px 0;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const ScrollSubtitle = styled(motion.h3)`
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1.1rem;
  color: #f5f5f5;
  margin-top: 10px;
  letter-spacing: 0.1em;
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
`;

const RSVPButton = styled(motion.button)`
  background: linear-gradient(to bottom, #3d3113 0%, #1a1507 100%);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.8rem 1.5rem;
  margin: 1.5rem auto 0;
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 0.9rem;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:hover {
    background: linear-gradient(to bottom, #524119 0%, #2a220c 100%);
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #d4af37;
    opacity: 0.7;
  }
  
  &:before {
    top: -4px;
    left: -4px;
  }
  
  &:after {
    bottom: -4px;
    right: -4px;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    padding: 1rem 2rem;
  }
`;

const AudioControl = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #d4af37;
  color: #d4af37;
  font-size: 1rem;
  z-index: 100;
  cursor: pointer;
  
  @media (min-width: 768px) {
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ThankYouOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  text-align: center;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const ThankYouText = styled(motion.h2)`
  font-family: 'Cinzel Decorative', 'Times New Roman', serif;
  font-size: 1.8rem;
  color: #d4af37;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SocialIcons = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    gap: 30px;
    margin-top: 30px;
  }
`;

const SocialIcon = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  text-decoration: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #d4af37;
    border-color: #d4af37;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }
`;

const ParticleContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 5;
  pointer-events: none;
`;

const Particle = styled(motion.div)`
  position: absolute;
  background-color: transparent;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  border: 1px solid rgba(212, 175, 55, 0.3);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #d4af37;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: #d4af37;
  margin-bottom: 1rem;
`;

const LoadingText = styled(motion.p)`
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-size: 1.2rem;
`;

// Ember particles component
const EmberParticles: React.FC = () => {
  return (
    <ParticleContainer>
      {Array.from({ length: 20 }).map((_, i) => {
        const startX = 20 + Math.random() * 60;
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;
        const size = 5 + Math.random() * 8;
        
        return (
          <Particle
            key={i}
            style={{
              bottom: `${Math.random() * 20}%`,
              left: `${startX}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.5 + Math.random() * 0.3
            }}
            animate={{
              y: [0, -200 - Math.random() * 300],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0.8, 0],
              scale: [1, 0.2],
              rotate: [0, 360]
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        );
      })}
    </ParticleContainer>
  );
};

// Main component
const AmpStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invitee, setInvitee] = useState<Invitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Parallax effect values
  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [10, -10]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [10, -10]);
  const midgroundX = useTransform(mouseX, [0, window.innerWidth], [20, -20]);
  const midgroundY = useTransform(mouseY, [0, window.innerHeight], [20, -20]);
  const foregroundX = useTransform(mouseX, [0, window.innerWidth], [30, -30]);
  const foregroundY = useTransform(mouseY, [0, window.innerHeight], [30, -30]);
  
  // Animation controls
  const frameControls = useAnimation();
  const photoControls = useAnimation();
  const maskControls = useAnimation();
  const sealControls = useAnimation();
  const nameControls = useAnimation();
  const scrollControls = useAnimation();
  const scrollContentControls = useAnimation();
  const buttonControls = useAnimation();
  
  // Audio ref
  const soundRef = useRef<Howl | null>(null);
  
  // Handle mouse movement for parallax - but only on desktop
  const handleMouseMove = (e: React.MouseEvent) => {
    // Skip parallax on mobile devices for better scrolling
    if (!isMobile()) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };
  
  // Initialize sound
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['https://freesound.org/data/previews/463/463088_7874600-lq.mp3'], // Gothic ambience from freesound.org
      loop: true,
      volume: 0,
      autoplay: true
    });
    
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, []);
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (soundRef.current) {
      if (isMuted) {
        soundRef.current.volume(0.3);
      } else {
        soundRef.current.volume(0);
      }
    }
  };
  
  // Animation sequence
  useEffect(() => {
    const animationSequence = async () => {
      // Frame reveal
      await frameControls.start({
        scale: [0, 1],
        opacity: [0, 1],
        transition: { duration: 1, ease: "easeOut" }
      });
      
      // Photo reveal
      await photoControls.start({
        opacity: [0, 1],
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      // Mask overlay
      await maskControls.start({
        opacity: [0, 0.4],
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      // Seal drop
      await sealControls.start({
        y: ["-50px", "0px"],
        scale: [1.5, 1],
        opacity: [0, 1],
        transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 15 }
      });
      
      // Name reveal
      await nameControls.start({
        opacity: 1,
        transition: { duration: 0.5 }
      });
      
      // Scroll unroll
      await scrollControls.start({
        scaleY: [0, 1],
        opacity: [0, 1],
        transition: { duration: 1.2, ease: "easeOut" }
      });
      
      // Scroll content
      await scrollContentControls.start({
        opacity: [0, 1],
        y: [20, 0],
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      // Button reveal
      setTimeout(() => {
        buttonControls.start({
          opacity: [0, 1],
          scale: [0.9, 1],
          transition: { duration: 0.5, ease: "easeOut" }
        });
        
        // Button pulse animation
        buttonControls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        });
      }, 4000);
    };
    
    if (!loading && !error) {
      animationSequence();
    }
  }, [
    loading, 
    error, 
    frameControls, 
    photoControls, 
    maskControls, 
    sealControls, 
    nameControls, 
    scrollControls, 
    scrollContentControls, 
    buttonControls
  ]);
  
  // Fetch invitee data
  useEffect(() => {
    const fetchInviteeData = async () => {
      try {
        // If there's no ID or it's 'generic', show the generic story
        if (!id || id === 'generic') {
          setLoading(false);
          return;
        }

        const inviteeDoc = await getDoc(doc(db, 'invitees', id));
        
        if (inviteeDoc.exists()) {
          setInvitee({ id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee);
        } else {
          setError('Invitation not found');
        }
      } catch (err) {
        setError('Error loading invitation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteeData();
  }, [id]);
  
  // Accept invitation
  const acceptInvitation = () => {
    setShowThankYou(true);
  };
  
  // Close thank you overlay and navigate to RSVP
  const closeThankYou = () => {
    setShowThankYou(false);
    
    // Navigate to RSVP form
    if (id) {
      navigate(`/invitation/${id}#rsvp`);
    } else {
      navigate('/invitation#rsvp');
    }
  };
  
  // Go back to invitation
  const goBack = () => {
    if (id) {
      navigate(`/invitation/${id}`);
    } else {
      navigate('/invitation');
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          Summoning your invitation...
        </LoadingText>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <StoryContainer>
        <ContentContainer>
          <motion.h1>{error}</motion.h1>
          <RSVPButton onClick={goBack}>Return</RSVPButton>
        </ContentContainer>
      </StoryContainer>
    );
  }
  
  const defaultPhoto = '/fp/skull.png';
  const encodedDefaultPhoto = encodeImageUrl(defaultPhoto);
  
  return (
    <StoryContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
    >
      {/* Background layers for parallax effect */}
      <BackgroundLayer style={{ x: backgroundX, y: backgroundY }} />
      <CathedralOverlay style={{ x: midgroundX, y: midgroundY }} />
      <StainedGlassEffect style={{ x: foregroundX, y: foregroundY }} />
      <CobwebsLayer style={{ x: midgroundX, y: midgroundY }} />
      <VignetteOverlay />
      
      {/* Audio control */}
      <AudioControl 
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? '🔇' : '🔊'}
      </AudioControl>
      
      {/* Navigation */}
      <NavigationButton 
        onClick={goBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </NavigationButton>
      
      {/* Main content */}
      <ContentContainer>
        {/* Portrait frame */}
        <PortraitFrame>
          <HexagonFrameGlow 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "easeInOut" 
            }}
          />
          
          <HexagonFrame
            initial={{ opacity: 0, scale: 0 }}
            animate={frameControls}
          >
            <InnerHexagon>
              <PhotoContainer
                photoUrl={encodeImageUrl(invitee?.photoUrl || defaultPhoto)}
                initial={{ opacity: 0 }}
                animate={photoControls}
                onError={(e: React.SyntheticEvent<HTMLDivElement>) => {
                  const target = e.target as HTMLDivElement;
                  target.style.backgroundImage = `url(${encodedDefaultPhoto})`;
                }}
              />
            </InnerHexagon>
          </HexagonFrame>
          
          <MaskOverlay
            initial={{ opacity: 0 }}
            animate={maskControls}
          />
        </PortraitFrame>
        
        {/* Wax seal with name */}
        <WaxSeal>
          <SealCircle
            initial={{ y: -50, opacity: 0, scale: 1.5 }}
            animate={sealControls}
          />
          
          <NameText
            initial={{ opacity: 0 }}
            animate={nameControls}
          >
            {invitee?.name?.toUpperCase() || "DISTINGUISHED GUEST"}
          </NameText>
        </WaxSeal>
        
        {/* Invitation scroll */}
        <ScrollContainer
          initial={{ scaleY: 0, opacity: 0, originY: 0 }}
          animate={scrollControls}
        >
          <ScrollContent
            initial={{ opacity: 0, y: 20 }}
            animate={scrollContentControls}
          >
            <ScrollHeading>YOU ARE SUMMONED TO</ScrollHeading>
            <ScrollTitle>OBLIVION</ScrollTitle>
            <ScrollSubtitle>CSE FAREWELL 2025</ScrollSubtitle>
          </ScrollContent>
        </ScrollContainer>
        
        {/* RSVP Button */}
        <RSVPButton
          initial={{ opacity: 0 }}
          animate={buttonControls}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={acceptInvitation}
        >
          Accept Your Fate
        </RSVPButton>
        
        {/* Ember particles effect */}
        <EmberParticles />
      </ContentContainer>
      
      {/* Thank you overlay */}
      <AnimatePresence>
        {showThankYou && (
          <ThankYouOverlay
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
          >
            <ThankYouText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your presence is etched in legend.
            </ThankYouText>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ color: '#f5f5f5' }}
            >
              Share your summons with others
            </motion.p>
            
            <SocialIcons
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.2 }}
              >
                📱
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.2 }}
              >
                ✉️
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.2 }}
              >
                📸
              </SocialIcon>
            </SocialIcons>
            
            <RSVPButton
              onClick={closeThankYou}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ marginTop: "40px" }}
            >
              Continue
            </RSVPButton>
          </ThankYouOverlay>
        )}
      </AnimatePresence>
    </StoryContainer>
  );
};

export default AmpStory;
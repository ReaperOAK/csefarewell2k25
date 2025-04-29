import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Invitee } from '../types';

// Styled components with Framer Motion
const StoryContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const BackgroundLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/resources/background.png');
  background-size: cover;
  background-position: center;
  z-index: 1;
`;

const ForegroundLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;

const CobwebsLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: 0.3;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMTAiIHkyPSIwIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybl8wKSIvPjwvc3ZnPg==');
`;

const ContentContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PortraitFrame = styled(motion.div)`
  position: relative;
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
`;

const FrameImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 12;
`;

const PhotoContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 65%;
  height: 65%;
  border-radius: 50%;
  overflow: hidden;
  z-index: 11;
`;

const Photo = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MaskOverlay = styled(motion.img)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  z-index: 13;
  opacity: 0.4;
`;

const WaxSeal = styled(motion.div)`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 10px 0;
`;

const SealImage = styled(motion.img)`
  width: 100%;
  height: 100%;
`;

const NameText = styled(motion.h2)`
  font-family: 'Cinzel Decorative', serif;
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-color);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
  letter-spacing: 0.1em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  z-index: 14;
`;

const ScrollContainer = styled(motion.div)`
  position: relative;
  width: 80%;
  max-width: 500px;
  margin-top: 20px;
`;

const ScrollImage = styled(motion.img)`
  width: 100%;
`;

const ScrollContent = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
`;

const ScrollHeading = styled(motion.h3)`
  font-family: 'Cinzel Decorative', serif;
  font-size: 16px;
  color: #8B0000;
  letter-spacing: 0.2em;
  margin-bottom: 10px;
`;

const ScrollTitle = styled(motion.h1)`
  font-family: 'Cinzel Decorative', serif;
  font-size: 36px;
  color: var(--accent-color);
  margin: 10px 0;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
`;

const ScrollSubtitle = styled(motion.h3)`
  font-family: 'Cinzel Decorative', serif;
  font-size: 18px;
  color: var(--text-color);
  margin-top: 10px;
`;

const RSVPButton = styled(motion.button)`
  background-color: transparent;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  font-family: 'Cinzel Decorative', serif;
  font-size: 16px;
  padding: 12px 25px;
  margin-top: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  &:hover {
    background-color: rgba(212, 175, 55, 0.2);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
  }
`;

const AudioControl = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  color: var(--accent-color);
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ThankYouOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
`;

const ThankYouText = styled(motion.h2)`
  font-family: 'Cinzel Decorative', serif;
  font-size: 32px;
  color: var(--accent-color);
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.7);
`;

const SocialIcons = styled(motion.div)`
  display: flex;
  gap: 20px;
  margin-top: 30px;
`;

const SocialIcon = styled(motion.a)`
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  text-decoration: none;
  
  &:hover {
    color: var(--accent-color);
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
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--accent-color);
  box-shadow: 0 0 5px var(--accent-color);
`;

// Ember particles component
const EmberParticles: React.FC = () => {
  return (
    <ParticleContainer>
      {Array.from({ length: 30 }).map((_, i) => {
        const startX = 20 + Math.random() * 60;
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;
        const size = 2 + Math.random() * 3;
        
        return (
          <Particle
            key={i}
            style={{
              bottom: `${Math.random() * 20}%`,
              left: `${startX}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.7 + Math.random() * 0.3
            }}
            animate={{
              y: [0, -200 - Math.random() * 300],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [1, 0],
              scale: [1, 0.2]
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
  const [muted, setMuted] = useState(false);
  
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
  
  // Handle mouse movement for parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  
  // Initialize sound
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/resources/music.mp3'],
      loop: true,
      volume: 0.5,
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
    setMuted(!muted);
    if (soundRef.current) {
      if (muted) {
        soundRef.current.volume(0.5);
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
        scale: [0.8, 1],
        opacity: [0, 1],
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      // Mask overlay
      await maskControls.start({
        opacity: [0, 0.4],
        rotate: [-5, 0],
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      // Seal drop
      await sealControls.start({
        y: ["-50px", "0px"],
        scale: [1.5, 1],
        opacity: [0, 1],
        transition: { duration: 0.5, type: "spring", stiffness: 300, damping: 15 }
      });
      
      // Name reveal letter by letter
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
      <StoryContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ContentContainer>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            Summoning your invitation...
          </motion.h1>
        </ContentContainer>
      </StoryContainer>
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
  
  return (
    <StoryContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
    >
      {/* Background layers for parallax effect */}
      <BackgroundLayer style={{ x: backgroundX, y: backgroundY }} />
      <ForegroundLayer style={{ x: foregroundX, y: foregroundY }} />
      <CobwebsLayer style={{ x: midgroundX, y: midgroundY }} />
      
      {/* Audio control */}
      <AudioControl 
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {muted ? '🔇' : '🔊'}
      </AudioControl>
      
      {/* Main content */}
      <ContentContainer>
        {/* Portrait frame */}
        <PortraitFrame>
          <FrameImage 
            src="/resources/frame.png" 
            alt="Ornate frame"
            initial={{ opacity: 0, scale: 0 }}
            animate={frameControls}
          />
          
          <PhotoContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={photoControls}
          >
            <Photo 
              src={invitee?.photoUrl || "/face pic/skull.png"} 
              alt={invitee?.name || "Guest"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/face pic/skull.png"; // Default to skull if image fails
              }}
            />
          </PhotoContainer>
          
          <MaskOverlay
            src="/resources/mask.png"
            alt="Mask overlay"
            initial={{ opacity: 0, rotate: -5 }}
            animate={maskControls}
          />
        </PortraitFrame>
        
        {/* Wax seal with name */}
        <WaxSeal>
          <SealImage
            src="/resources/seal.png"
            alt="Wax seal"
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
          <ScrollImage src="/resources/scroll.png" alt="Scroll" />
          
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
          whileHover={{ 
            backgroundColor: "rgba(212, 175, 55, 0.2)", 
            boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
            color: "#8B0000"
          }}
          onClick={acceptInvitation}
        >
          ACCEPT YOUR FATE
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
                whileHover={{ scale: 1.2, color: "#d4af37" }}
              >
                📱
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.2, color: "#d4af37" }}
              >
                ✉️
              </SocialIcon>
              <SocialIcon 
                href="#" 
                target="_blank"
                whileHover={{ scale: 1.2, color: "#d4af37" }}
              >
                📸
              </SocialIcon>
            </SocialIcons>
            
            <RSVPButton
              onClick={closeThankYou}
              whileHover={{ 
                backgroundColor: "rgba(212, 175, 55, 0.2)", 
                boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)" 
              }}
              style={{ marginTop: "40px" }}
            >
              CONTINUE
            </RSVPButton>
          </ThankYouOverlay>
        )}
      </AnimatePresence>
    </StoryContainer>
  );
};

export default AmpStory;
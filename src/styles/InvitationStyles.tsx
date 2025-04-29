import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';

// Main containers
export const InvitationContainer = styled(Container)`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #d4af37; // Gold
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

export const GradientOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
  z-index: 1;
  pointer-events: none;
`;

// Card components
export const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 500px;
  z-index: 5;
  margin: 0 auto;
`;

export const GothicFrame = styled(motion.div)`
  position: relative;
  border: 2px solid #d4af37;
  background-color: rgba(10, 10, 10, 0.8);
  padding: 2rem 1.5rem;
  border-radius: 0;
  box-shadow: 
    0 0 0 1px #d4af37,
    0 0 20px rgba(212, 175, 55, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.8);
`;

// Diamond decorations
export const DiamondShape = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: 2px solid #d4af37;
  transform: rotate(45deg);
  z-index: 2;
`;

export const TopLeftDiamond = styled(DiamondShape)`
  top: -20px;
  left: -20px;
`;

export const TopRightDiamond = styled(DiamondShape)`
  top: -20px;
  right: -20px;
`;

export const BottomLeftDiamond = styled(DiamondShape)`
  bottom: -20px;
  left: -20px;
`;

export const BottomRightDiamond = styled(DiamondShape)`
  bottom: -20px;
  right: -20px;
`;

// Portrait components
export const PortraitContainer = styled(motion.div)`
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  
  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

export const HexagonMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  background: linear-gradient(45deg, #d4af37, #a38a28);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.03);
`;

export const Portrait = styled(motion.div)<{ photoUrl: string }>`
  position: relative;
  width: 94%;
  height: 94%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
  z-index: 2;
`;

// Text and content styling
export const GeometricDivider = styled(motion.div)`
  position: relative;
  height: 1px;
  width: 80%;
  background-color: #d4af37;
  margin: 1.5rem auto;
  overflow: visible;
  
  &:before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #d4af37;
    transform: rotate(45deg);
    top: -4.5px;
    left: calc(50% - 5px);
  }
`;

export const Title = styled(motion.h1)`
  font-family: 'Cinzel Decorative', 'Times New Roman', serif;
  font-size: 2.5rem;
  text-align: center;
  letter-spacing: 3px;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #d4af37 0%, #f5e7a3 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (min-width: 768px) {
    font-size: 3.2rem;
  }
`;

export const InviteeName = styled(motion.h2)`
  font-family: 'Cinzel', 'Times New Roman', serif;
  text-align: center;
  font-size: 1.5rem;
  margin: 1rem 0;
  letter-spacing: 1px;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const ScrollContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  margin: 0.5rem 0 1.5rem;
  padding: 1rem;
  background: rgba(10, 10, 10, 0.5);
  border-left: 1px solid #d4af37;
  border-right: 1px solid #d4af37;
`;

export const Message = styled(motion.p)`
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 1rem;
  line-height: 1.6;
  margin: 1rem 0;
  text-align: center;
  color: #f5f5f5;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const EventDetails = styled(motion.div)`
  position: relative;
  padding: 1.5rem 1rem;
  margin: 1.5rem 0;
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background-color: rgba(0, 0, 0, 0.3);
`;

export const EventDate = styled(motion.h3)`
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #f5f5f5;
`;

export const EventLocation = styled(motion.p)`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: #d4af37;
`;

export const Signature = styled(motion.p)`
  font-family: 'Tangerine', 'Brush Script MT', cursive;
  font-size: 1.8rem;
  color: #d4af37;
  text-align: right;
  margin-top: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

// Buttons
export const CTA = styled(motion.button)`
  background: linear-gradient(to bottom, #3d3113 0%, #1a1507 100%);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.8rem 1.5rem;
  margin: 1.5rem auto;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  display: block;
  width: 100%;
  max-width: 250px;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(to bottom, #524119 0%, #2a220c 100%);
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    max-width: 280px;
  }
`;

export const NavButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  z-index: 100;
  cursor: pointer;
`;

export const AudioButton = styled(motion.button)`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #d4af37;
  color: #d4af37;
  font-size: 1.2rem;
  z-index: 100;
  cursor: pointer;
`;

// Particles effect
export const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

export const Particle = styled.div<{ size: number, delay: number, duration: number, x: number }>`
  position: absolute;
  top: -${props => props.size}px;
  left: ${props => props.x}%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: rgba(212, 175, 55, 0.3);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  opacity: 0;
  animation: floatParticle ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes floatParticle {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(${window.innerHeight}px) rotate(360deg);
      opacity: 0;
    }
  }
`;

// Loading and error states
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #d4af37;
`;

export const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  border-top-color: #d4af37;
  margin-bottom: 1rem;
`;

export const LoadingText = styled(motion.p)`
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #c93545;
  text-align: center;
  padding: 1rem;
`;
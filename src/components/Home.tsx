import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import ShapeCanvas from './common/ShapeCanvas';
import RSVPModal from './modals/RSVPModal';

// Styled components for the home page
const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: var(--bg);
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled(motion.div)`
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 3rem;
  background: rgba(10, 10, 10, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    opacity: 0.3;
    z-index: -1;
  }
  
  &::before {
    top: -50px;
    left: -50px;
    background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
    animation: pulse 5s infinite alternate;
  }
  
  &::after {
    bottom: -50px;
    right: -50px;
    background: radial-gradient(circle, var(--gold) 0%, transparent 70%);
    animation: pulse 7s infinite alternate-reverse;
  }
  
  @keyframes pulse {
    0% { opacity: 0.1; transform: scale(1); }
    100% { opacity: 0.3; transform: scale(1.5); }
  }
`;

const HeaderDecoration = styled(motion.div)`
  width: 200px;
  height: 2px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
  margin: 0 auto 20px;
`;

const Title = styled(motion.h1)`
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: bold;
  color: var(--gold);
  letter-spacing: 4px;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  color: var(--text);
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.6;
  position: relative;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const DateDisplay = styled(motion.div)`
  font-family: 'Cinzel', serif;
  font-size: 20px;
  color: var(--gold);
  margin: 2rem 0;
  letter-spacing: 2px;
  
  span {
    display: inline-block;
    margin: 0 15px;
    position: relative;
    
    &::before, &::after {
      content: '•';
      position: absolute;
      color: rgba(212, 175, 55, 0.5);
    }
    
    &::before {
      left: -15px;
    }
    
    &::after {
      right: -15px;
    }
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2.5rem;
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(212, 175, 55, 0.2), 
      transparent
    );
    z-index: -1;
    transition: left 0.7s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(212, 175, 55, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

const FloatingSymbol = styled(motion.div)`
  font-size: 24px;
  color: var(--gold);
  position: absolute;
  opacity: 0.6;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const EventLogo = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 92%;
    height: 92%;
    border-radius: 50%;
    border: 1px dashed rgba(212, 175, 55, 0.5);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 84%;
    height: 84%;
    border-radius: 50%;
    background: repeating-conic-gradient(
        rgba(212, 175, 55, 0.3) 0deg 10deg,
        transparent 10deg 20deg
    );
  }
`;

const LogoText = styled.div`
  font-family: 'Cinzel Decorative', serif;
  font-size: 20px;
  color: var(--gold);
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
  z-index: 1;
`;

const FloatingParticles = () => {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: `${startY}%`,
              left: `${startX}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: 'var(--gold)',
              opacity: 0.2 + Math.random() * 0.3,
            }}
            animate={{
              y: [0, -(Math.random() * 100 + 50)],
              x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40],
              opacity: [0.2 + Math.random() * 0.3, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        );
      })}
    </>
  );
};

const Home: React.FC = () => {
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [floatingSymbols, setFloatingSymbols] = useState<Array<{id: number, x: number, y: number, symbol: string}>>([]);

  useEffect(() => {
    // Create floating symbols
    const symbols = [];
    for (let i = 0; i < 15; i++) {
      symbols.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        symbol: ['✧', '✦', '⚜', '❖', '✵'][Math.floor(Math.random() * 5)]
      });
    }
    setFloatingSymbols(symbols);
  }, []);

  const openRSVPModal = () => {
    setShowRSVPModal(true);
  };

  const closeRSVPModal = () => {
    setShowRSVPModal(false);
  };

  const handleRSVPSubmit = (data: any) => {
    console.log('RSVP Data:', data);
    setShowRSVPModal(false);
    // Add logic to save the RSVP data to Firebase
  };

  return (
    <HomeContainer>
      {/* Background 3D Shapes */}
      <ShapeCanvas shapeCount={15} />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Floating symbols */}
      {floatingSymbols.map((item) => (
        <FloatingSymbol
          key={item.id}
          style={{ top: `${item.y}%`, left: `${item.x}%` }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3],
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        >
          {item.symbol}
        </FloatingSymbol>
      ))}
      
      {/* Main Content */}
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <EventLogo
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <LogoText>CSE</LogoText>
        </EventLogo>
        
        <HeaderDecoration 
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        <Title
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          OBLIVION
        </Title>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <DateDisplay>
            <span>MAY 17, 2025</span>
          </DateDisplay>
        </motion.div>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          The masquerade of shadows beckons as the CSE Farewell draws near. For invited guests, please use your unique link. Otherwise, join us in spirit as we venture into the unknown.
        </Subtitle>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ delay: 1.2, duration: 3, repeat: Infinity, repeatType: "reverse" }}
          style={{
            width: '200px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
            margin: '20px auto 30px'
          }}
        />
        
        <Button
          onClick={openRSVPModal}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          GENERAL RSVP
        </Button>
      </ContentWrapper>
      
      {/* RSVP Modal */}
      <AnimatePresence>
        {showRSVPModal && (
          <RSVPModal
            onClose={closeRSVPModal}
            onSubmit={handleRSVPSubmit}
          />
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Home;
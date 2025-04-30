import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ButtonContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const ScrollButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--gold);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(212, 175, 55, 0.2);
  }
`;

const ScrollHelper: React.FC = () => {
  const [showHelper, setShowHelper] = useState(false);
  const location = useLocation();

  // Only show on invitation pages
  useEffect(() => {
    setShowHelper(location.pathname.includes('/invitation'));
  }, [location]);

  // Scroll to RSVP section
  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top 
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showHelper) return null;

  return (
    <ButtonContainer>
      <ScrollButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </ScrollButton>
      <ScrollButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToRSVP}
        aria-label="Scroll to RSVP section"
      >
        ↓
      </ScrollButton>
    </ButtonContainer>
  );
};

export default ScrollHelper;
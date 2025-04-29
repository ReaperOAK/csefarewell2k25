import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ShapeCanvas from './common/ShapeCanvas';
import AudioPlayer from './common/AudioPlayer';
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
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-family: 'Unbounded', sans-serif;
  font-size: 48px;
  font-weight: bold;
  color: var(--gold);
  letter-spacing: 4px;
  margin-bottom: 1.5rem;

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

  @media (max-width: 480px) {
    font-size: 16px;
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
`;

const Home: React.FC = () => {
  const [showRSVPModal, setShowRSVPModal] = useState(false);

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
      
      {/* Main Content */}
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          OBLIVION: Final Masquerade Awaits
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          For invited guests, please use your unique link. Otherwise, join us in spirit.
        </Subtitle>
        
        <Button
          onClick={openRSVPModal}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          General RSVP
        </Button>
      </ContentWrapper>
      
      {/* Audio Player */}
      <AudioPlayer src="/music.mp3" />
      
      {/* RSVP Modal */}
      {showRSVPModal && (
        <RSVPModal
          onClose={closeRSVPModal}
          onSubmit={handleRSVPSubmit}
        />
      )}
    </HomeContainer>
  );
};

export default Home;
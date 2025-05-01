import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';

const AudioControlContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(20, 20, 20, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  border: 1px solid var(--gold);
  cursor: pointer;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const AudioControl: React.FC = () => {
  const { isPlaying, togglePlay } = useAudio();
  
  return (
    <AudioControlContainer
      onClick={togglePlay}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      {isPlaying ? '🔊' : '🔇'}
    </AudioControlContainer>
  );
};

export default AudioControl;
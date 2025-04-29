import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components
const PlayerContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const PlayerButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--gold);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
`;

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src,
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Set up audio on mount
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    // Set up audio properties
    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    // Auto-play if enabled and browser allows
    if (autoPlay) {
      const playPromise = audioElement.play();
      
      // Handle the promise to avoid uncaught promise errors
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // Auto-play was prevented by the browser
            // This is expected in many browsers without user interaction
            console.info('Auto-play was prevented by browser:', error);
            setIsPlaying(false);
          });
      }
    }
    
    // Clean up
    return () => {
      audioElement.pause();
    };
  }, [autoPlay]);
  
  // Toggle play/pause
  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      // Try to play, handle if browser blocks
      const playPromise = audioElement.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    }
    
    setIsPlaying(!isPlaying);
  };
  
  return (
    <PlayerContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <PlayerButton
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isPlaying ? 'Mute' : 'Play Music'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </PlayerButton>
      
      <audio ref={audioRef} src={src} preload="auto" />
    </PlayerContainer>
  );
};

export default AudioPlayer;
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';

// This component helps ensure audio continues playing during route changes
const AudioContinuity: React.FC = () => {
  const location = useLocation();
  const { isPlaying, togglePlay } = useAudio();
  
  // When route changes, make sure audio keeps playing if it was playing before
  useEffect(() => {
    // Check if user has interacted with document (using the global variable from AudioContext)
    const audioElement = document.querySelector('audio');
    const hasUserInteracted = (window as any).hasUserInteracted || 
                             (audioElement?.played && audioElement.played.length > 0);
    
    if (hasUserInteracted && !isPlaying) {
      // If user interacted but audio isn't playing, try to restart it
      togglePlay();
    }
  }, [location.pathname, isPlaying, togglePlay]);
  
  return null; // This component doesn't render anything
};

export default AudioContinuity;
import React, { useRef, useEffect } from 'react';
import { 
  NavButton
} from '../../styles/InvitationStyles';

interface NavigationControlsProps {
  onGoBack: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ onGoBack }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set up audio to always play when component mounts
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    // Set up audio properties
    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    // Try to play the audio immediately
    const playPromise = audioElement.play();
    
    // Handle the promise to avoid uncaught promise errors
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented by browser, try again with user interaction
        console.info('Auto-play was prevented by browser:', error);
        
        // Setup event listeners to try playing on user interaction
        const playAudioOnUserAction = () => {
          audioElement.play().catch(e => console.error("Audio play failed:", e));
          // Remove the event listeners after successful play
          document.removeEventListener('click', playAudioOnUserAction);
          document.removeEventListener('touchstart', playAudioOnUserAction);
          document.removeEventListener('keydown', playAudioOnUserAction);
        };
        
        document.addEventListener('click', playAudioOnUserAction, { once: true });
        document.addEventListener('touchstart', playAudioOnUserAction, { once: true });
        document.addEventListener('keydown', playAudioOnUserAction, { once: true });
      });
    }
    
    return () => {
      audioElement.pause();
    };
  }, []);

  return (
    <>
      <audio 
        ref={audioRef} 
        loop 
        preload="auto" 
        src="https://freesound.org/data/previews/463/463088_7874600-lq.mp3" // Gothic ambience from freesound.org
      />
      
      <NavButton 
        onClick={onGoBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </NavButton>
    </>
  );
};

export default NavigationControls;
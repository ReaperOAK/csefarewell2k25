import React, { useRef, useState } from 'react';
import { 
  NavButton,
  AudioButton
} from '../../styles/InvitationStyles';

interface NavigationControlsProps {
  onGoBack: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({ onGoBack }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        loop 
        preload="none" 
        src="https://freesound.org/data/previews/463/463088_7874600-lq.mp3" // Gothic ambience from freesound.org
      />
      
      <NavButton 
        onClick={onGoBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </NavButton>
      
      <AudioButton 
        onClick={toggleAudio}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? '🔇' : '🔊'}
      </AudioButton>
    </>
  );
};

export default NavigationControls;
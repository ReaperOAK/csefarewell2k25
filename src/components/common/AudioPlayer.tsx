import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src,
  autoPlay = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Set up audio on mount and ensure it always plays
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    // Set up audio properties
    audioElement.loop = true;
    audioElement.volume = 0.5;
    
    // Try to play the audio immediately
    const attemptPlay = () => {
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
            cleanup();
          };
          
          const cleanup = () => {
            document.removeEventListener('click', playAudioOnUserAction);
            document.removeEventListener('touchstart', playAudioOnUserAction);
            document.removeEventListener('keydown', playAudioOnUserAction);
          };
          
          document.addEventListener('click', playAudioOnUserAction, { once: true });
          document.addEventListener('touchstart', playAudioOnUserAction, { once: true });
          document.addEventListener('keydown', playAudioOnUserAction, { once: true });
        });
      }
    };
    
    // Initial play attempt
    if (autoPlay) {
      attemptPlay();
    }
    
    // Handle page visibility changes to ensure music continues to play
    const handleVisibilityChange = () => {
      if (!document.hidden && audioElement.paused) {
        audioElement.play().catch(e => console.error("Audio play failed on visibility change:", e));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audioElement.pause();
    };
  }, [autoPlay, src]);
  
  // No visible UI - just the hidden audio element
  return <audio ref={audioRef} src={src} preload="auto" />;
};

export default AudioPlayer;
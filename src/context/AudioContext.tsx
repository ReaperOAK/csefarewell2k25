import React, { createContext, useContext, useEffect, useRef } from 'react';

// Create context for audio state
interface AudioContextType {
  isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType>({ isPlaying: false });

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music.mp3');
    audioRef.current = audio;
    
    // Set up audio properties
    audio.loop = true;
    audio.volume = 0.5;
    audio.autoplay = true;
    
    // Auto-play with user interaction handling
    const attemptPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            // Autoplay was prevented, set up listeners for user interaction
            console.info('Autoplay prevented:', error);
            
            const playOnUserAction = () => {
              audio.play()
                .then(() => {
                  setIsPlaying(true);
                  cleanup();
                })
                .catch(e => console.error("Audio play failed:", e));
            };
            
            const cleanup = () => {
              document.removeEventListener('click', playOnUserAction);
              document.removeEventListener('touchstart', playOnUserAction);
              document.removeEventListener('keydown', playOnUserAction);
            };
            
            document.addEventListener('click', playOnUserAction, { once: true });
            document.addEventListener('touchstart', playOnUserAction, { once: true });
            document.addEventListener('keydown', playOnUserAction, { once: true });
          });
      }
    };
    
    attemptPlay();
    
    // Resume audio when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && audioRef.current?.paused) {
        audioRef.current.play().catch(e => console.error("Audio resume failed:", e));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  return (
    <AudioContext.Provider value={{ isPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};
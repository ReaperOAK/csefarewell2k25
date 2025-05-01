import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Create context for audio state
interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
}

const AudioContext = createContext<AudioContextType>({ 
  isPlaying: false, 
  togglePlay: () => {} 
});

export const useAudio = () => useContext(AudioContext);

// Keep track of if user has interacted with the document globally
if (typeof window !== 'undefined') {
  window.hasUserInteracted = false;
  
  const markInteraction = () => {
    window.hasUserInteracted = true;
  };
  
  document.addEventListener('click', markInteraction, { once: true });
  document.addEventListener('touchstart', markInteraction, { once: true });
  document.addEventListener('keydown', markInteraction, { once: true });
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio('/music.mp3');
      audioRef.current = audio;
      
      // Set up audio properties
      audio.loop = true;
      audio.volume = 0.5;
      
      // Set an ID that we can find later
      audio.id = 'background-music';
      
      // Store audio instance on window for cross-route access
      if (typeof window !== 'undefined') {
        window.backgroundAudio = audio;
      }
    }
    
    const audio = audioRef.current;
    
    // Try to autoplay only once when component mounts
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      
      const attemptPlay = () => {
        if (!audio) return;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              // Autoplay was prevented, we'll try again after user interaction
              console.info('Autoplay prevented:', error);
              
              if (window.hasUserInteracted) {
                // If user has already interacted, try playing immediately
                audio.play()
                  .then(() => setIsPlaying(true))
                  .catch(e => console.error("Audio play failed:", e));
              }
            });
        }
      };
      
      // Try to play immediately
      attemptPlay();
      
      // Setup document-wide event listeners for first user interaction
      const playOnUserAction = () => {
        if (audio && audio.paused) {
          audio.play()
            .then(() => {
              setIsPlaying(true);
              window.hasUserInteracted = true;
            })
            .catch(e => console.error("Audio play failed:", e));
        }
      };
      
      // Add these listeners regardless of autoplay success
      document.addEventListener('click', playOnUserAction, { once: true });
      document.addEventListener('touchstart', playOnUserAction, { once: true });
      document.addEventListener('keydown', playOnUserAction, { once: true });
    }
    
    // Resume audio when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && audioRef.current?.paused && isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio resume failed:", e));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Note: We don't clean up the audio element itself because we want it to persist
    };
  }, [isPlaying]);

  // Function to toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          window.hasUserInteracted = true;
        })
        .catch(e => console.error("Toggle play failed:", e));
    }
  };
  
  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay }}>
      {children}
    </AudioContext.Provider>
  );
};
import { useState, useEffect } from 'react';

interface ParallaxValues {
  mousePosX: number;
  mousePosY: number;
}

/**
 * A hook that tracks mouse or touch position for parallax effects
 * 
 * @param sensitivity - How sensitive the parallax effect should be (0-1)
 * @returns Object containing mousePosX and mousePosY (offset from center)
 */
const useParallax = (sensitivity: number = 0.1): ParallaxValues => {
  const [mousePosX, setMousePosX] = useState(0);
  const [mousePosY, setMousePosY] = useState(0);
  
  useEffect(() => {
    // Only run in browser, not during SSR
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate position relative to the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Calculate offset from center, apply sensitivity
      const offsetX = (e.clientX - centerX) * sensitivity;
      const offsetY = (e.clientY - centerY) * sensitivity;
      
      setMousePosX(offsetX);
      setMousePosY(offsetY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // Prevent scrolling behavior
        e.preventDefault();
        
        // Calculate position relative to the center of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Calculate offset from center, apply sensitivity
        const offsetX = (e.touches[0].clientX - centerX) * sensitivity;
        const offsetY = (e.touches[0].clientY - centerY) * sensitivity;
        
        setMousePosX(offsetX);
        setMousePosY(offsetY);
      }
    };
    
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Only use device orientation if we have gamma and beta values
      if (e.gamma !== null && e.beta !== null) {
        // gamma is left-to-right tilt in degrees, where right is positive
        // beta is front-to-back tilt in degrees, where front is positive
        
        // Limit the range to +/- 10 degrees and apply sensitivity
        const gammaLimit = Math.min(Math.max(e.gamma, -10), 10);
        const betaLimit = Math.min(Math.max(e.beta - 45, -10), 10);
        
        // Calculate offsets proportional to window size
        const offsetX = (gammaLimit / 10) * window.innerWidth * 0.05 * sensitivity;
        const offsetY = (betaLimit / 10) * window.innerHeight * 0.05 * sensitivity;
        
        setMousePosX(offsetX);
        setMousePosY(offsetY);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [sensitivity]);
  
  return { mousePosX, mousePosY };
};

export default useParallax;
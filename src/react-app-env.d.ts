/// <reference types="react-scripts" />

// Add custom window properties
interface Window {
  hasUserInteracted: boolean;
  backgroundAudio?: HTMLAudioElement;
}

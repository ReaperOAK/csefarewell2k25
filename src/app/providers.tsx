'use client';

import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import GlobalStyle from '../styles/GlobalStyles';
import ScrollHelper from '../components/common/ScrollHelper';
import Footer from '../components/common/Footer';
import AudioControl from '../components/common/AudioControl';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AudioProvider>
        <GlobalStyle />
        <div className="app-container">
          {children}
          <Footer />
          <ScrollHelper />
          <AudioControl />
        </div>
      </AudioProvider>
    </ThemeProvider>
  );
}
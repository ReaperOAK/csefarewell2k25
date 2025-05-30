import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Invitation from './components/Invitation';
import AmpStory from './components/AmpStory';
import AdminPage from './components/admin/AdminPage';
import GlobalStyle from './styles/GlobalStyles';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import './App.css';
import ScrollHelper from './components/common/ScrollHelper';
import Footer from './components/common/Footer';
import AudioContinuity from './components/common/AudioContinuity';
import AudioControl from './components/common/AudioControl';

// Fix mobile height issue
// This helps browsers correctly calculate viewport height on mobile
const setMobileHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

function App() {
  // Set initial height and update on resize
  React.useEffect(() => {
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);
    
    // Force body to be scrollable
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
    document.body.style.position = 'static';
    
    return () => window.removeEventListener('resize', setMobileHeight);
  }, []);
  
  return (
    <ThemeProvider>
      <AudioProvider>
        <BrowserRouter>
          <GlobalStyle />
          {/* Add AudioContinuity component to keep audio playing across routes */}
          <AudioContinuity />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/invitation" element={<Invitation />} />
              <Route path="/invitation/:id" element={<Invitation />} />
              <Route path="/amp-story/:id" element={<AmpStory />} />
              <Route path="/amp-story" element={<AmpStory />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <ScrollHelper />
            {/* Add audio control button */}
            <AudioControl />
          </div>
        </BrowserRouter>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;

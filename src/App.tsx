import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Home from './components/Home';
import Invitation from './components/Invitation';
import AmpStory from './components/AmpStory';
import AdminPage from './components/admin/AdminPage';
import './App.css';

// Global styles for the gothic theme
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Copperplate+Gothic&family=Caveat+Brush&family=Borel&family=Beth+Ellen&display=swap');
  
  :root {
    --primary-color: #1a0000;
    --secondary-color: #800000;
    --accent-color: #d4af37;
    --text-color: #e0e0e0;
    --text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    --border-color: #570000;
  }
  
  body {
    background-color: var(--primary-color);
    color: var(--text-color);
    font-family: 'Copperplate Gothic', serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    min-height: 100vh;
  }
  
  h1 {
    font-size: 36px;
    color: var(--accent-color);
    text-shadow: var(--text-shadow);
    letter-spacing: 0.27em;
  }
  
  h2 {
    font-family: 'Caveat Brush', cursive;
    font-size: 18px;
    color: var(--text-color);
  }
  
  p {
    font-family: 'Borel', sans-serif;
    font-size: 14px;
    line-height: 1.6;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invitation" element={<Invitation />} />
        <Route path="/invitation/:id" element={<Invitation />} />
        <Route path="/amp-story/:id" element={<AmpStory />} />
        <Route path="/amp-story" element={<AmpStory />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

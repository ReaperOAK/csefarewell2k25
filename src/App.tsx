import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Invitation from './components/Invitation';
import AmpStory from './components/AmpStory';
import AdminPage from './components/admin/AdminPage';
import GlobalStyle from './styles/GlobalStyles';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;

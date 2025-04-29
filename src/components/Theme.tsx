import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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
    font-family: 'mole', serif;
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
  
  .signature {
    font-family: 'Beth Ellen', cursive;
    font-size: 12px;
    color: var(--accent-color);
  }
  
  button {
    background-color: var(--secondary-color);
    color: var(--text-color);
    border: 1px solid var(--accent-color);
    padding: 10px 20px;
    margin: 10px 0;
    font-family: 'Copperplate Gothic', serif;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--accent-color);
      color: var(--primary-color);
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .video-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    opacity: 0.5;
  }
`;

export default GlobalStyle;
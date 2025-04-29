import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&family=Montserrat:wght@400;500;600&family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&display=swap');
  
  :root {
    --bg: #111111;
    --gold: #D4AF37;
    --crimson: #8B0000;
    --text: #EEEEEE;
    --text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    --border-color: rgba(212, 175, 55, 0.3);
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    min-height: 100vh;
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Unbounded', sans-serif;
    color: var(--gold);
    text-shadow: var(--text-shadow);
    letter-spacing: 0.1em;
    margin: 0 0 1rem 0;
  }
  
  h1 {
    font-size: 2.5rem;
    letter-spacing: 4px;
    
    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }
  
  p {
    margin: 0 0 1rem 0;
  }
  
  a {
    color: var(--gold);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #F5E7A3;
    }
  }
  
  button {
    background: transparent;
    color: var(--gold);
    border: 1px solid var(--gold);
    padding: 10px 20px;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    
    &:hover {
      background-color: rgba(212, 175, 55, 0.2);
      transform: scale(1.05);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  input, textarea, select {
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color);
    color: var(--text);
    padding: 10px;
    font-family: 'Montserrat', sans-serif;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: var(--gold);
    }
  }
  
  ::placeholder {
    color: rgba(238, 238, 238, 0.5);
  }
`;

export default GlobalStyle;
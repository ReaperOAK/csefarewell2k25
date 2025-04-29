import React, { createContext, useContext, ReactNode } from 'react';

type ThemeContextType = {
  colors: {
    background: string;
    gold: string;
    crimson: string;
    text: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = {
    colors: {
      background: '#111111',
      gold: '#D4AF37',
      crimson: '#8B0000',
      text: '#EEE'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
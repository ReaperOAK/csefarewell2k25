import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 1rem;
  text-align: center;
  margin-top: auto;
  font-family: 'Montserrat', sans-serif;
  color: var(--text);
  z-index: 10;
  position: relative;
`;

const FooterContent = styled(motion.p)`
  font-size: 0.9rem;
  opacity: 0.8;
  
  a {
    color: var(--gold);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: #f5e7a3;
      text-decoration: underline;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Made with &#10084; by <a href="https://www.instagram.com/being._owais/profilecard/?igsh=MWo5Nm45cjFuNzVobA==" target="_blank" rel="noopener noreferrer" className="hover:underline">Owais Khan</a>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
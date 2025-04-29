import React from 'react';
import { motion } from 'framer-motion';
import { ErrorContainer, NavButton } from '../../styles/InvitationStyles';

interface ErrorProps {
  message: string;
  onGoBack: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onGoBack }) => {
  return (
    <ErrorContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>An error has occurred</h2>
        <p>{message}</p>
        <NavButton onClick={onGoBack}>Return to the beginning</NavButton>
      </motion.div>
    </ErrorContainer>
  );
};

export default Error;
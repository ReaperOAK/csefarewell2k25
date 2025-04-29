import React from 'react';
import { LoadingContainer, LoadingSpinner, LoadingText } from '../../styles/InvitationStyles';

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingSpinner
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <LoadingText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        Summoning your invitation...
      </LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
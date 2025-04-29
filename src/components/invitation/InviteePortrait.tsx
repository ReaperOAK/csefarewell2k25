import React from 'react';
import { PortraitContainer, HexagonMask, Portrait } from '../../styles/InvitationStyles';

interface InviteePortraitProps {
  photoUrl: string;
  defaultPhoto: string;
}

const InviteePortrait: React.FC<InviteePortraitProps> = ({ photoUrl, defaultPhoto }) => {
  return (
    <PortraitContainer
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      <HexagonMask />
      <Portrait 
        photoUrl={photoUrl || defaultPhoto}
        onError={(e: React.SyntheticEvent<HTMLDivElement>) => {
          const target = e.target as HTMLDivElement;
          target.style.backgroundImage = `url(${defaultPhoto})`;
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
    </PortraitContainer>
  );
};

export default InviteePortrait;
import React from 'react';
import { PortraitContainer, HexagonMask, Portrait } from '../../styles/InvitationStyles';
import { encodeImageUrl } from '../../utils/imageUtils';

interface InviteePortraitProps {
  photoUrl: string;
  defaultPhoto: string;
}

const InviteePortrait: React.FC<InviteePortraitProps> = ({ photoUrl, defaultPhoto }) => {
  // Encode the URLs to properly handle spaces in filenames
  const encodedPhotoUrl = encodeImageUrl(photoUrl);
  const encodedDefaultPhoto = encodeImageUrl(defaultPhoto);
  
  return (
    <PortraitContainer
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      <HexagonMask />
      <Portrait 
        photoUrl={encodedPhotoUrl || encodedDefaultPhoto}
        onError={(e: React.SyntheticEvent<HTMLDivElement>) => {
          const target = e.target as HTMLDivElement;
          target.style.backgroundImage = `url(${encodedDefaultPhoto})`;
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
    </PortraitContainer>
  );
};

export default InviteePortrait;
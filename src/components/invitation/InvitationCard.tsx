import React, { ReactNode } from 'react';
import { 
  CardContainer,
  GothicFrame,
  TopLeftDiamond,
  TopRightDiamond,
  BottomLeftDiamond,
  BottomRightDiamond
} from '../../styles/InvitationStyles';

interface InvitationCardProps {
  children: ReactNode;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ children }) => {
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <GothicFrame>
        <TopLeftDiamond 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <TopRightDiamond 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <BottomLeftDiamond 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <BottomRightDiamond 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
        
        {children}
      </GothicFrame>
    </CardContainer>
  );
};

export default InvitationCard;
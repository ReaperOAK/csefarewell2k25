import React from 'react';
import { 
  ScrollContainer,
  Message,
  Signature
} from '../../styles/InvitationStyles';
import InvitationEventDetails from './InvitationEventDetails';

const InvitationContent: React.FC = () => {
  return (
    <ScrollContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <Message
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.5 }}
      >
        Your presence is requested at our solemn farewell gathering. 
        Join us for one final masquerade as we bid adieu to the haunted halls 
        that have held our spirits these past years.
      </Message>
      
      <InvitationEventDetails />
      
      <Signature
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.5 }}
      >
        Until we meet again in shadow and moonlight...
      </Signature>
    </ScrollContainer>
  );
};

export default InvitationContent;
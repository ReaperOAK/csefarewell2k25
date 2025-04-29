import React from 'react';
import { 
  EventDetails, 
  EventDate, 
  EventLocation 
} from '../../styles/InvitationStyles';

const InvitationEventDetails: React.FC = () => {
  return (
    <EventDetails
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <EventDate
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.3 }}
      >
        May 17th, 2025 • 7:00 PM
      </EventDate>
      <EventLocation
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.3 }}
      >
        STCET DIAS • Presented by CSE Juniors
      </EventLocation>
    </EventDetails>
  );
};

export default InvitationEventDetails;
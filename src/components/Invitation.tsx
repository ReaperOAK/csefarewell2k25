import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import RSVPForm from './RSVPForm';

const InvitationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
`;

const Card = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--accent-color);
  border-radius: 5px;
  padding: 2rem;
  margin: 2rem 0;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
`;

const InviteeImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid var(--accent-color);
  margin-bottom: 1.5rem;
  object-fit: cover;
`;

const Message = styled.p`
  font-family: 'Borel', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  margin: 1.5rem 0;
  text-align: center;
`;

const Signature = styled.p`
  font-family: 'Beth Ellen', cursive;
  font-size: 14px;
  color: var(--accent-color);
  text-align: right;
  margin-top: 2rem;
`;

const AmpStoryButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  padding: 10px 20px;
  margin: 20px 0;
  font-family: 'Copperplate Gothic', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--primary-color);
  }
`;

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.7;
`;

const NavButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  font-size: 14px;
`;

const Invitation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invitee, setInvitee] = useState<Invitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInviteeData = async () => {
      try {
        // If there's no ID, show the generic invitation
        if (!id) {
          setLoading(false);
          return;
        }

        const inviteeDoc = await getDoc(doc(db, 'invitees', id));
        
        if (inviteeDoc.exists()) {
          setInvitee({ id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee);
        } else {
          setError('Invitation not found');
        }
      } catch (err) {
        setError('Error loading invitation');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteeData();
  }, [id]);

  const viewAmpStory = () => {
    if (id) {
      navigate(`/amp-story/${id}`);
    } else {
      navigate('/amp-story/generic');
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div>Loading your invitation...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <InvitationContainer>
      <VideoBackground autoPlay muted loop>
        <source src="/video_of_a_blood_red_full_moon_breaking.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      <NavButton onClick={goBack}>← Back</NavButton>

      <Card>
        <h1>OBLIVION</h1>
        
        {invitee && (
          <>
            <InviteeImage 
              src={invitee.photoUrl} 
              alt={invitee.name} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/face pic/skull.png"; // Default to skull if image fails to load
              }}
            />
            <h2>Greetings, {invitee.name}</h2>
          </>
        )}
        
        {!invitee && <h2>Greetings, Dear Guest</h2>}

        <Message>
          Your presence is requested at our solemn farewell gathering. 
          Join us for one final masquerade as we bid adieu to the haunted halls 
          that have held our spirits these past years.
        </Message>

        <Message>
          May 17th, 2025 • 7:00 PM
          <br />
          STCET DIAS • Presented by CSE Juniors
        </Message>

        <Signature>Until we meet again in shadow and moonlight...</Signature>

        <AmpStoryButton onClick={viewAmpStory}>View Your Personal Invitation</AmpStoryButton>

        <RSVPForm inviteeId={id} />
      </Card>
    </InvitationContainer>
  );
};

export default Invitation;
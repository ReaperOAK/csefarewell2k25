import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import AudioPlayer from './common/AudioPlayer';
import ShapeCanvas from './common/ShapeCanvas';

// Styled components
const InvitationContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
`;

const InvitationCard = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const PortraitFrame = styled(motion.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const Portrait = styled.div<{ photoUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
`;

const NameBanner = styled(motion.div)`
  position: relative;
  padding: 0.6rem 3rem;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--gold);
    transform: translateY(-50%);
    z-index: -1;
  }
`;

const InviteeName = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 32px;
  color: white;
  background-color: var(--bg);
  padding: 0 1rem;
  margin: 0;
  display: inline-block;
`;

const ScrollContainer = styled(motion.div)`
  width: 80%;
  max-width: 600px;
  background-color: rgba(20, 20, 20, 0.7);
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: var(--bg);
    border: 1px solid var(--gold);
    border-radius: 50%;
  }
  
  &::before {
    top: -10px;
    left: calc(50% - 10px);
  }
  
  &::after {
    bottom: -10px;
    left: calc(50% - 10px);
  }
`;

const ScrollHeading = styled.h3`
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.5rem;
  color: var(--crimson);
  margin-bottom: 1rem;
`;

const ScrollContent = styled.div`
  text-align: center;
`;

const EventTitle = styled.h1`
  font-family: 'Cinzel Decorative', serif;
  font-size: 2.5rem;
  background: linear-gradient(to right, var(--gold) 0%, #f5e7a3 50%, var(--gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0.5rem 0;
`;

const EventDetails = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  color: var(--text);
  margin: 0.5rem 0;
`;

const RSVPSection = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
`;

const RSVPTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  color: var(--gold);
  margin-bottom: 1rem;
`;

const RSVPButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RSVPButton = styled(motion.button)<{ $selected?: boolean }>`
  width: 120px;
  padding: 0.8rem 0;
  background-color: ${props => props.$selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: ${props => props.$selected ? 'bold' : 'normal'};
  cursor: pointer;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.8rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: var(--gold);
  }
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  padding: 0.5rem 1rem;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  z-index: 20;
`;

const ThankYouOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 2rem;
  text-align: center;
`;

const ThankYouMessage = styled.h2`
  font-family: 'Cinzel Decorative', serif;
  font-size: 2rem;
  color: var(--gold);
  margin-bottom: 1rem;
`;

const ThankYouDetails = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  color: var(--text);
  max-width: 600px;
  margin-bottom: 2rem;
`;

const Invitation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invitee, setInvitee] = useState<Invitee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [attending, setAttending] = useState<boolean | null>(null);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Fetch invitee data
  useEffect(() => {
    const fetchInviteeData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          // Generic invitation
          setLoading(false);
          return;
        }
        
        const inviteeDoc = await getDoc(doc(db, 'invitees', id));
        
        if (inviteeDoc.exists()) {
          const inviteeData = { id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee;
          setInvitee(inviteeData);
          
          // Pre-fill form if they've already responded
          if (inviteeData.attending !== null) {
            setAttending(inviteeData.attending);
            setResponse(inviteeData.response || '');
          }
        } else {
          setError('Invitation not found');
        }
      } catch (err) {
        console.error('Error loading invitation:', err);
        setError('Failed to load invitation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInviteeData();
  }, [id]);
  
  // Handle RSVP submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attending === null) {
      return; // Require selection
    }
    
    try {
      setSubmitting(true);
      
      if (id) {
        // Update invitee in database
        await updateDoc(doc(db, 'invitees', id), {
          attending,
          response,
          timestamp: Date.now()
        });
        
        // Update local state
        if (invitee) {
          setInvitee({
            ...invitee,
            attending,
            response
          });
        }
      }
      
      // Show thank you message
      setShowThankYou(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      alert('Failed to submit your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const goBack = () => {
    navigate('/');
  };
  
  const defaultPhoto = '/fp/skull.png';
  
  // Loading state
  if (loading) {
    return (
      <InvitationContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ textAlign: 'center' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '3px solid rgba(212, 175, 55, 0.3)',
              borderTopColor: 'var(--gold)',
              margin: '0 auto 1rem'
            }}
          />
          <h2>Loading your invitation...</h2>
        </motion.div>
      </InvitationContainer>
    );
  }
  
  // Error state
  if (error) {
    return (
      <InvitationContainer>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ textAlign: 'center' }}
        >
          <h2>{error}</h2>
          <SubmitButton
            onClick={goBack}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            Return Home
          </SubmitButton>
        </motion.div>
      </InvitationContainer>
    );
  }
  
  return (
    <InvitationContainer>
      {/* Background shapes */}
      <ShapeCanvas shapeCount={10} />
      
      {/* Audio player */}
      <AudioPlayer src="/music.mp3" />
      
      {/* Back button */}
      <BackButton
        onClick={goBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </BackButton>
      
      <InvitationCard
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Portrait */}
        <PortraitFrame
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Portrait
            photoUrl={invitee?.photoUrl || defaultPhoto}
          />
        </PortraitFrame>
        
        {/* Name banner */}
        <NameBanner
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <InviteeName>
            {invitee ? invitee.name : 'Distinguished Guest'}
          </InviteeName>
        </NameBanner>
        
        {/* Scroll with invitation text */}
        <ScrollContainer
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        >
          <ScrollContent>
            <ScrollHeading>You Are Summoned, {invitee ? invitee.name : 'Honored Guest'}</ScrollHeading>
            <EventTitle>OBLIVION</EventTitle>
            <EventDetails>CSE Farewell 2025</EventDetails>
            <EventDetails>May 17 | STCET Dias</EventDetails>
          </ScrollContent>
        </ScrollContainer>
        
        {/* RSVP Form */}
        <RSVPSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit}>
            <RSVPTitle>Will you attend?</RSVPTitle>
            
            <RSVPButtonGroup>
              <RSVPButton
                type="button"
                $selected={attending === true}
                onClick={() => setAttending(true)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                animate={attending === null ? { scale: [1, 1.05, 1] } : {}}
                transition={attending === null ? { 
                  repeat: Infinity, 
                  repeatDelay: 1 
                } : {}}
              >
                Yes
              </RSVPButton>
              
              <RSVPButton
                type="button"
                $selected={attending === false}
                onClick={() => setAttending(false)}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                animate={attending === null ? { scale: [1, 1.05, 1] } : {}}
                transition={attending === null ? { 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  delay: 0.5
                } : {}}
              >
                No
              </RSVPButton>
            </RSVPButtonGroup>
            
            <ResponseTextarea
              placeholder="Leave a message (optional)"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            
            <SubmitButton
              type="submit"
              disabled={attending === null || submitting}
              whileHover={{ scale: !submitting ? 1.02 : 1, backgroundColor: !submitting ? 'rgba(212, 175, 55, 0.1)' : 'transparent' }}
              whileTap={{ scale: !submitting ? 0.98 : 1 }}
            >
              {submitting ? 'Submitting...' : invitee?.attending !== null ? 'Update Response' : 'Submit'}
            </SubmitButton>
          </form>
        </RSVPSection>
      </InvitationCard>
      
      {/* Thank you overlay */}
      <AnimatePresence>
        {showThankYou && (
          <ThankYouOverlay
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ThankYouMessage>Thank You!</ThankYouMessage>
            <ThankYouDetails>
              {attending 
                ? 'We look forward to your presence at OBLIVION. Prepare for a night of unforgettable memories.' 
                : 'We understand and appreciate your response. Your presence will be missed.'}
            </ThankYouDetails>
            <SubmitButton
              onClick={() => setShowThankYou(false)}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </SubmitButton>
          </ThankYouOverlay>
        )}
      </AnimatePresence>
    </InvitationContainer>
  );
};

export default Invitation;
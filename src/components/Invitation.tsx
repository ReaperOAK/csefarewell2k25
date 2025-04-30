import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Invitee } from '../types';
import ShapeCanvas from './common/ShapeCanvas';
import { encodeImageUrl } from '../utils/imageUtils';

// Mobile scroll-friendly container
const PageWrapper = styled.div`
  display: block;
  width: 100%;
  min-height: 100vh;
  position: static;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 80px; /* Add padding at bottom to ensure RSVP is visible */
`;

// Content container with static positioning for better scrolling
const InvitationContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 4rem 1rem 2rem; /* Increased top padding to account for nav buttons */
  position: static;
  overflow-x: hidden;
  overflow-y: visible;
  background-color: var(--bg);

  @media (min-width: 768px) {
    padding: 5rem 2rem 2rem;
  }
`;

// Replace fixed-position buttons with absolute positioning
const BackButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  padding: 0.4rem 0.8rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 20;
  
  @media (min-width: 768px) {
    top: 20px;
    left: 20px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
  
  /* Prevent any touch-related scrolling issues */
  touch-action: manipulation;
`;

// Simplified card container
const InvitationCard = styled(motion.div)`
  max-width: 800px;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PortraitFrame = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  overflow: hidden;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    width: 200px;
    height: 200px;
  }
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
  padding: 0.6rem 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 0.6rem 3rem;
    margin-bottom: 2rem;
  }
  
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
  font-size: 24px;
  color: white;
  background-color: var(--bg);
  padding: 0 1rem;
  margin: 0;
  display: inline-block;
  
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const ScrollContainer = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  background-color: rgba(20, 20, 20, 0.7);
  border-top: 1px solid var(--gold);
  border-bottom: 1px solid var(--gold);
  padding: 1.5rem 1rem;
  margin-bottom: 2rem;
  position: relative;
  
  @media (min-width: 768px) {
    width: 80%;
    padding: 2rem;
  }
  
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
  font-size: 1.2rem;
  color: var(--crimson);
  margin-bottom: 0.8rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ScrollContent = styled.div`
  text-align: center;
`;

const EventTitle = styled.h1`
  font-family: 'Cinzel Decorative', serif;
  font-size: 2rem;
  background: linear-gradient(to right, var(--gold) 0%, #f5e7a3 50%, var(--gold) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0.5rem 0;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
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
  margin-top: 3rem;
  padding-top: 1rem;
  
  @media (min-width: 768px) {
    margin-top: 3.5rem;
  }
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
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const RSVPButton = styled(motion.button)<{ $selected?: boolean }>`
  position: relative;
  width: 100px;
  padding: 0.7rem 0;
  background-color: ${props => props.$selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: ${props => props.$selected ? 'bold' : 'normal'};
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    width: 120px;
    padding: 0.8rem 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      rgba(212, 175, 55, 0.2), 
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
    text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  }
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
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(212, 175, 55, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }
  
  &:hover {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
    text-shadow: 0 0 5px rgba(212, 175, 55, 0.4);
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    20% {
      transform: scale(25, 25);
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 0.7rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  resize: none;
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    height: 100px;
    padding: 0.8rem;
    font-size: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: var(--gold);
  }
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
  padding: 1rem;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ThankYouMessage = styled.h2`
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.6rem;
  color: var(--gold);
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const ThankYouDetails = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: var(--text);
  max-width: 600px;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
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
  
  useEffect(() => {
    const fetchInviteeData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setLoading(false);
          return;
        }
        
        const inviteeDoc = await getDoc(doc(db, 'invitees', id));
        
        if (inviteeDoc.exists()) {
          const inviteeData = { id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee;
          setInvitee(inviteeData);
          
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (attending === null) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (id) {
        await updateDoc(doc(db, 'invitees', id), {
          attending,
          response,
          timestamp: Date.now()
        });
        
        if (invitee) {
          setInvitee({
            ...invitee,
            attending,
            response
          });
        }
      }
      
      setShowThankYou(true);
      
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
  
  const encodedPhotoUrl = encodeImageUrl(invitee?.photoUrl || defaultPhoto);
  
  return (
    <PageWrapper>
      <ShapeCanvas shapeCount={8} />
      
      <BackButton
        onClick={goBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </BackButton>

      <InvitationContainer>
        <InvitationCard
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <PortraitFrame
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Portrait
              photoUrl={encodedPhotoUrl}
            />
          </PortraitFrame>
          
          <NameBanner
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <InviteeName>
              {invitee ? invitee.name : 'Distinguished Guest'}
            </InviteeName>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1.5 }}
              style={{ 
                height: '2px', 
                background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
                marginTop: '8px' 
              }}
            />
          </NameBanner>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8, type: "spring" }}
            style={{
              fontSize: '28px',
              color: 'var(--gold)',
              margin: '-10px 0 15px',
              fontFamily: "'Cinzel Decorative', serif"
            }}
          >
            ✧ ✦ ✧
          </motion.div>
          
          <ScrollContainer
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.2 }}
          >
            <ScrollContent>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <ScrollHeading>You Are Summoned</ScrollHeading>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.3, duration: 0.8, type: "spring" }}
              >
                <EventTitle>OBLIVION</EventTitle>
              </motion.div>
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.7, duration: 0.6 }}
              >
                <EventDetails>CSE Farewell 2025</EventDetails>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.6 }}
              >
                <EventDetails style={{ fontStyle: 'italic' }}>May 17 | STCET Dias</EventDetails>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.3, duration: 1 }}
                style={{
                  marginTop: '20px',
                  padding: '0 20px',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                "Embrace the end, for in endings we celebrate the journey that was"
              </motion.div>
            </ScrollContent>
          </ScrollContainer>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 4, duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
              margin: '10px 0 25px'
            }}
          />
          
          <RSVPSection
            id="rsvp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.2, duration: 0.5 }}
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
      </InvitationContainer>
      
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
    </PageWrapper>
  );
};

export default Invitation;
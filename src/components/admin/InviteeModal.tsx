import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';

// Styled components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: #0a0a0a;
  border: 1px solid var(--gold);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 4px;
  position: relative;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: var(--gold);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;

const ModalTitle = styled.h2`
  font-family: 'Unbounded', sans-serif;
  color: var(--gold);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
  }
`;

const PhotoPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const PhotoPreview = styled.div<{ photoUrl: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  border: 2px solid var(--gold);
`;

const HelpText = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.2rem 0 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const CancelButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;
`;

const ErrorMessage = styled(motion.div)`
  color: #F44336;
  font-size: 14px;
  margin-bottom: 1rem;
  text-align: center;
`;

interface InviteeModalProps {
  invitee?: Invitee | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitee: Partial<Invitee>) => Promise<string | void>;
}

const InviteeModal: React.FC<InviteeModalProps> = ({
  invitee,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isEditMode = !!invitee;
  
  // Populate form when editing an existing invitee
  useEffect(() => {
    if (invitee) {
      setName(invitee.name || '');
      setEmail(invitee.email || '');
      setPhoneNumber(invitee.phoneNumber || '');
      setPhotoUrl(invitee.photoUrl || '');
    } else {
      // Reset form for new invitee
      setName('');
      setEmail('');
      setPhoneNumber('');
      setPhotoUrl('');
    }
    setError(null);
  }, [invitee, isOpen]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare invitee data
      const inviteeData: Partial<Invitee> = {
        name: name.trim(),
        email: email.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        photoUrl: photoUrl.trim() || '/fp/skull.png', // Default photo if none provided
      };
      
      // If editing, include the ID
      if (isEditMode && invitee?.id) {
        inviteeData.id = invitee.id;
      }
      
      // Submit to parent component
      await onSubmit(inviteeData);
      
      // Close modal on success
      onClose();
    } catch (err: any) {
      console.error('Error saving invitee:', err);
      setError(err?.message || 'Failed to save invitee. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const defaultPhoto = '/fp/skull.png';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </CloseButton>
            
            <ModalTitle>
              {isEditMode ? 'Edit Invitee' : 'Add New Invitee'}
            </ModalTitle>
            
            {error && (
              <ErrorMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </ErrorMessage>
            )}
            
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                />
              </InputGroup>
              
              <InputGroup>
                <Label htmlFor="photoUrl">Photo URL</Label>
                <Input
                  id="photoUrl"
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="URL to photo"
                />
                <HelpText>Leave empty to use default photo</HelpText>
                
                <PhotoPreviewContainer>
                  <PhotoPreview 
                    photoUrl={photoUrl || defaultPhoto} 
                  />
                </PhotoPreviewContainer>
              </InputGroup>
              
              <ButtonGroup>
                <CancelButton
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </CancelButton>
                
                <SubmitButton
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.05, backgroundColor: loading ? 'transparent' : 'rgba(212, 175, 55, 0.1)' }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default InviteeModal;
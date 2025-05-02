import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';
import { encodeImageUrl, fetchAvailableProfilePictures } from '../../utils/imageUtils';

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

const SearchableSelect = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
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

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: rgba(10, 10, 10, 0.95);
  border: 1px solid var(--gold);
  border-top: none;
  z-index: 10;
`;

const DropdownItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  
  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
  }
`;

const DropdownItemImage = styled.div<{ photoUrl: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  border: 1px solid var(--gold);
`;

const DropdownItemText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
`;

interface InviteeModalProps {
  invitee: Invitee | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitee: Partial<Invitee>) => Promise<void>;
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
  const [availablePhotos, setAvailablePhotos] = useState<string[]>([]);
  const [photoSearchTerm, setPhotoSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  
  const isEditMode = !!invitee;
  
  useEffect(() => {
    const loadPhotos = async () => {
      if (isOpen) {
        try {
          setLoadingPhotos(true);
          
          // Use our new dynamic photo loading function
          const photos = await fetchAvailableProfilePictures();
          
          if (photos.length > 0) {
            setAvailablePhotos(photos);
          } else {
            // Fallback if the manifest doesn't exist yet or is empty
            setAvailablePhotos(['/fp/default.png']);
          }
        } catch (error) {
          console.error('Error loading photos:', error);
          setAvailablePhotos(['/fp/default.png']);
        } finally {
          setLoadingPhotos(false);
        }
      }
    };
    
    loadPhotos();
  }, [isOpen]);
  
  const filteredPhotos = useMemo(() => {
    if (!photoSearchTerm) return availablePhotos;
    
    return availablePhotos.filter(photo => {
      const fileName = photo.split('/').pop()?.split('.')[0] || '';
      return fileName.toLowerCase().includes(photoSearchTerm.toLowerCase());
    });
  }, [availablePhotos, photoSearchTerm]);
  
  useEffect(() => {
    if (name && availablePhotos.length > 0 && !isEditMode) {
      const matchingPhoto = availablePhotos.find(photo => {
        const fileName = photo.split('/').pop()?.split('.')[0] || '';
        return fileName.toLowerCase() === name.toLowerCase();
      });
      
      if (matchingPhoto) {
        setPhotoUrl(matchingPhoto);
        return;
      }
      
      const partialMatch = availablePhotos.find(photo => {
        const fileName = photo.split('/').pop()?.split('.')[0] || '';
        return fileName.toLowerCase().includes(name.toLowerCase()) || 
               name.toLowerCase().includes(fileName.toLowerCase());
      });
      
      if (partialMatch) {
        setPhotoUrl(partialMatch);
      }
    }
  }, [name, availablePhotos, isEditMode]);
  
  useEffect(() => {
    if (invitee) {
      setName(invitee.name || '');
      setEmail(invitee.email || '');
      setPhoneNumber(invitee.phoneNumber || '');
      setPhotoUrl(invitee.photoUrl || '');
    } else {
      setName('');
      setEmail('');
      setPhoneNumber('');
      setPhotoUrl('/fp/default.png');
    }
    setError(null);
    setPhotoSearchTerm('');
  }, [invitee]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const inviteeData: Partial<Invitee> = {
        name: name.trim(),
        email: email.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        photoUrl: photoUrl.trim() || '/fp/default.png',
      };
      
      if (isEditMode && invitee?.id) {
        inviteeData.id = invitee.id;
      }
      
      await onSubmit(inviteeData);
      
      onClose();
    } catch (err: any) {
      console.error('Error saving invitee:', err);
      setError(err?.message || 'Failed to save invitee. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhotoSelect = (photo: string) => {
    setPhotoUrl(photo);
    setIsDropdownOpen(false);
  };
  
  const defaultPhoto = '/fp/default.png';
  const encodedPhotoUrl = encodeImageUrl(photoUrl || defaultPhoto);
  
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
                <Label htmlFor="photoUrl">Profile Picture</Label>
                <SearchableSelect>
                  <SearchInput
                    type="text"
                    placeholder="Search for a profile picture..."
                    value={photoSearchTerm}
                    onChange={(e) => setPhotoSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  />
                  
                  <DropdownContainer $isOpen={isDropdownOpen}>
                    {loadingPhotos ? (
                      <DropdownItem $isSelected={false}>
                        <DropdownItemText>Loading photos...</DropdownItemText>
                      </DropdownItem>
                    ) : filteredPhotos.length === 0 ? (
                      <DropdownItem $isSelected={false}>
                        <DropdownItemText>No matching photos found</DropdownItemText>
                      </DropdownItem>
                    ) : (
                      filteredPhotos.map((photo, index) => {
                        const photoName = photo.split('/').pop()?.split('.')[0] || '';
                        const encodedUrl = encodeImageUrl(photo);
                        return (
                          <DropdownItem
                            key={index}
                            $isSelected={photo === photoUrl}
                            onClick={() => handlePhotoSelect(photo)}
                          >
                            <DropdownItemImage photoUrl={encodedUrl} />
                            <DropdownItemText>{photoName}</DropdownItemText>
                          </DropdownItem>
                        );
                      })
                    )}
                  </DropdownContainer>
                </SearchableSelect>
                
                <HelpText>Search and select a profile picture</HelpText>
                
                <PhotoPreviewContainer>
                  <PhotoPreview 
                    photoUrl={encodedPhotoUrl} 
                  />
                  {photoUrl && (
                    <DropdownItemText>
                      {photoUrl.split('/').pop()?.split('.')[0] || ''}
                    </DropdownItemText>
                  )}
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
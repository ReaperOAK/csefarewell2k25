// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\InviteeForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';

const FormOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const FormContainer = styled(motion.div)`
  background-color: var(--primary-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
`;

const FormTitle = styled.h2`
  margin: 0;
  color: var(--accent-color);
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: var(--text-color);
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.3);
  color: var(--text-color);
  border-radius: 3px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
  }
`;

const PhotoPreviewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
`;

const PhotoPreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--accent-color);
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoUrlHelp = styled.p`
  margin: 5px 0 0;
  font-size: 12px;
  color: rgba(224, 224, 224, 0.7);
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 10px;
`;

const CancelButton = styled(motion.button)`
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Copperplate Gothic', serif;
`;

const SubmitButton = styled(motion.button)`
  background-color: var(--secondary-color);
  border: 1px solid var(--accent-color);
  color: var(--text-color);
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Copperplate Gothic', serif;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  font-size: 14px;
  margin: 0;
`;

const PhotoBrowserContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 20px;
`;

const PhotoBrowserContent = styled(motion.div)`
  background-color: var(--primary-color);
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const PhotoBrowserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
`;

const PhotoBrowserTitle = styled.h3`
  margin: 0;
  color: var(--accent-color);
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const PhotoItem = styled(motion.div)<{ selected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 3px solid ${props => props.selected ? 'var(--accent-color)' : 'transparent'};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoName = styled.div`
  font-size: 12px;
  color: var(--text-color);
  text-align: center;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PhotoSearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 3px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const BrowseButton = styled(motion.button)`
  background-color: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--border-color);
  color: var(--accent-color);
  padding: 8px 15px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  border-radius: 4px;
  margin-top: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

interface InviteeFormProps {
  invitee: Invitee | null;
  onSubmit: (invitee: any) => Promise<{ success: boolean, id?: string, error?: any }>;
  onCancel: () => void;
}

const InviteeForm: React.FC<InviteeFormProps> = ({
  invitee,
  onSubmit,
  onCancel
}) => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Photo browser state
  const [showPhotoBrowser, setShowPhotoBrowser] = useState(false);
  const [availablePhotos, setAvailablePhotos] = useState<string[]>([]);
  const [photoSearchTerm, setPhotoSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Populate form if editing existing invitee
  useEffect(() => {
    if (invitee) {
      setName(invitee.name || '');
      setEmail(invitee.email || '');
      setPhoneNumber(invitee.phoneNumber || '');
      setPhotoUrl(invitee.photoUrl || '');
    } else {
      // Default photo to first check if it's directly in the fp folder
      setPhotoUrl('/fp/skull.png');
    }
  }, [invitee]);

  // Fetch available photos from the fp folder
  const fetchAvailablePhotos = async () => {
    try {
      // This is a mock implementation
      // In a real app, you would call your backend API to get the list of files
      // For now, we'll simulate some photos based on the folder structure you provided
      
      // Simulate a delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate photo paths based on your folder structure
      const photos = [
        '/fp/skull.png',
        '/fp/Abir Chakraborty.png',
        '/fp/Agnibha Chakraborty.png',
        '/fp/Aindrila Chakraborty.png',
        '/fp/Aman Kumar Shah.png',
        '/fp/Anik Chakraborti.png',
        '/fp/ANKITA GHOSH.png',
        '/fp/Aranya Adhikary.png',
        '/fp/Aritra Ganguly.png',
        '/fp/Arka Prava De.png',
        '/fp/ARUNIMA KUNDU.png',
        '/fp/ashutosh dubey.png',
        '/fp/Azhan Shadique.png',
        '/fp/Bishal Ghosh.png',
        '/fp/BISWAJIT PATRA.png',
        '/fp/Debika Ray.png',
        '/fp/Dipan Dutta.png',
        '/fp/Dyutiprovo Sarkar.png',
        '/fp/Gitiparna Paul.png',
        '/fp/Ishita Kar.png',
        '/fp/Junaid Islam.png',
        '/fp/Koyena Chakrabarti.png',
        '/fp/KUMAR SAURAV.png',
        '/fp/Manash Das.png',
        // Add more photos as needed
      ];
      
      setAvailablePhotos(photos);
      
      // Set selected photo based on current photoUrl
      if (photoUrl) {
        setSelectedPhoto(photoUrl);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };
  
  // Open photo browser
  const openPhotoBrowser = () => {
    fetchAvailablePhotos();
    setShowPhotoBrowser(true);
  };
  
  // Close photo browser
  const closePhotoBrowser = () => {
    setShowPhotoBrowser(false);
  };
  
  // Select photo and close browser
  const confirmPhotoSelection = () => {
    if (selectedPhoto) {
      setPhotoUrl(selectedPhoto);
    }
    closePhotoBrowser();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    // Prepare invitee data
    const inviteeData = {
      name: name.trim(),
      email: email.trim() || null,
      phoneNumber: phoneNumber.trim() || null,
      photoUrl: photoUrl.trim(),
      attending: invitee?.attending ?? null,
      response: invitee?.response || '',
      ...(invitee ? { id: invitee.id } : {})
    };
    
    setLoading(true);
    
    try {
      const result = await onSubmit(inviteeData);
      
      if (!result.success) {
        setError('Failed to save invitee. Please try again.');
      }
    } catch (err) {
      console.error('Error saving invitee:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-suggest photo URL format based on name
  const suggestPhotoUrl = () => {
    if (!name.trim()) return;
    
    const formattedName = name.trim();
    setPhotoUrl(`/fp/${formattedName}.png`);
  };

  // Filter photos based on search term
  const filteredPhotos = photoSearchTerm
    ? availablePhotos.filter(photo => {
        const photoName = photo.split('/').pop()?.split('.')[0].toLowerCase() || '';
        return photoName.includes(photoSearchTerm.toLowerCase());
      })
    : availablePhotos;

  return (
    <FormOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <FormHeader>
          <FormTitle>
            {invitee ? 'Edit Invitee' : 'Add New Invitee'}
          </FormTitle>
          <CloseButton
            onClick={onCancel}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </CloseButton>
        </FormHeader>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={suggestPhotoUrl}
              required
              placeholder="Enter invitee's full name"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter invitee's email (optional)"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter invitee's phone number (optional)"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="photoUrl">Photo URL</Label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Input
                id="photoUrl"
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Enter path to invitee's photo"
                style={{ flex: 1 }}
              />
              <BrowseButton
                type="button"
                onClick={openPhotoBrowser}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                Browse...
              </BrowseButton>
            </div>
            <PhotoUrlHelp>
              Use format: /fp/[Name].png for photos in the fp folder
            </PhotoUrlHelp>
            
            {photoUrl && (
              <PhotoPreviewContainer>
                <PhotoPreview>
                  <PreviewImage
                    src={photoUrl}
                    alt={name || 'Invitee'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/fp/skull.png"; // Default to skull if image fails
                    }}
                  />
                </PhotoPreview>
                <span>Photo preview</span>
              </PhotoPreviewContainer>
            )}
          </InputGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonGroup>
            <CancelButton
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </CancelButton>
            
            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Saving...' : invitee ? 'Update Invitee' : 'Add Invitee'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
      
      {/* Photo Browser Modal */}
      <AnimatePresence>
        {showPhotoBrowser && (
          <PhotoBrowserContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PhotoBrowserContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <PhotoBrowserHeader>
                <PhotoBrowserTitle>Browse Profile Pictures</PhotoBrowserTitle>
                <CloseButton
                  onClick={closePhotoBrowser}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </CloseButton>
              </PhotoBrowserHeader>
              
              <PhotoSearchInput
                type="text"
                placeholder="Search photos by name..."
                value={photoSearchTerm}
                onChange={(e) => setPhotoSearchTerm(e.target.value)}
              />
              
              <PhotoGrid>
                {filteredPhotos.map((photo, index) => {
                  const photoName = photo.split('/').pop()?.split('.')[0] || '';
                  
                  return (
                    <div key={index}>
                      <PhotoItem
                        selected={selectedPhoto === photo}
                        onClick={() => setSelectedPhoto(photo)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <PhotoImage
                          src={photo}
                          alt={photoName}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/fp/skull.png";
                          }}
                        />
                      </PhotoItem>
                      <PhotoName title={photoName}>{photoName}</PhotoName>
                    </div>
                  );
                })}
              </PhotoGrid>
              
              <ButtonRow>
                <CancelButton
                  onClick={closePhotoBrowser}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </CancelButton>
                
                <SubmitButton
                  onClick={confirmPhotoSelection}
                  disabled={!selectedPhoto}
                  whileHover={{ scale: !selectedPhoto ? 1 : 1.05 }}
                  whileTap={{ scale: !selectedPhoto ? 1 : 0.98 }}
                >
                  Select Photo
                </SubmitButton>
              </ButtonRow>
            </PhotoBrowserContent>
          </PhotoBrowserContainer>
        )}
      </AnimatePresence>
    </FormOverlay>
  );
};

export default InviteeForm;
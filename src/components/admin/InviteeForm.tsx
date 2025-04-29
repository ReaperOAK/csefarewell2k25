// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\InviteeForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

  // Populate form if editing existing invitee
  useEffect(() => {
    if (invitee) {
      setName(invitee.name || '');
      setEmail(invitee.email || '');
      setPhoneNumber(invitee.phoneNumber || '');
      setPhotoUrl(invitee.photoUrl || '');
    } else {
      // Default photo to first check if it's directly in the face pic folder
      setPhotoUrl('/face pic/skull.png');
    }
  }, [invitee]);

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
    setPhotoUrl(`/face pic/${formattedName}.png`);
  };

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
            <Input
              id="photoUrl"
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Enter path to invitee's photo"
            />
            <PhotoUrlHelp>
              Use format: /face pic/[Name].png for photos in the face pic folder
            </PhotoUrlHelp>
            
            {photoUrl && (
              <PhotoPreviewContainer>
                <PhotoPreview>
                  <PreviewImage
                    src={photoUrl}
                    alt={name || 'Invitee'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/face pic/skull.png"; // Default to skull if image fails
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
    </FormOverlay>
  );
};

export default InviteeForm;
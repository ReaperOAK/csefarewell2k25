import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { RSVPFormData } from '../types';

const FormContainer = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--accent-color);
`;

const FormTitle = styled.h3`
  font-family: 'Copperplate Gothic', serif;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'Copperplate Gothic', serif;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RadioInput = styled.input`
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: rgba(30, 0, 0, 0.7);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  border-radius: 3px;
  font-family: 'Borel', sans-serif;
  resize: vertical;
  min-height: 100px;
`;

const SubmitButton = styled.button`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  padding: 12px 24px;
  margin: 10px 0;
  font-family: 'Copperplate Gothic', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 16px;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-color);
    color: var(--primary-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(0, 100, 0, 0.3);
  color: #b8e0b8;
  padding: 1rem;
  border: 1px solid #4caf50;
  border-radius: 3px;
  margin-top: 1rem;
`;

interface RSVPFormProps {
  inviteeId?: string;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ inviteeId }) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    attending: true,
    response: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkIfResponded = async () => {
      if (!inviteeId) return;

      try {
        const inviteeDoc = await getDoc(doc(db, 'invitees', inviteeId));
        if (inviteeDoc.exists()) {
          const data = inviteeDoc.data();
          if (data.attending !== null) {
            setHasResponded(true);
            setFormData({
              attending: data.attending,
              response: data.response || ''
            });
          }
        }
      } catch (err) {
        console.error('Error checking response status:', err);
      }
    };

    checkIfResponded();
  }, [inviteeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'attending') {
      setFormData({
        ...formData,
        attending: value === 'true'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteeId) {
      setError('No invitation ID found');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await updateDoc(doc(db, 'invitees', inviteeId), {
        attending: formData.attending,
        response: formData.response,
        timestamp: Date.now()
      });
      
      setSubmitted(true);
      setHasResponded(true);
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      setError('Failed to submit your response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        {hasResponded 
          ? 'Your Response' 
          : 'Will You Join Us in the Shadows?'}
      </FormTitle>
      
      {submitted && (
        <SuccessMessage>
          Your response has been received. We await your presence in the darkness.
        </SuccessMessage>
      )}
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Your Decision:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="attending"
                value="true"
                checked={formData.attending === true}
                onChange={handleChange}
                disabled={submitting || (!inviteeId)}
              />
              I shall attend
            </RadioLabel>
            
            <RadioLabel>
              <RadioInput
                type="radio"
                name="attending"
                value="false"
                checked={formData.attending === false}
                onChange={handleChange}
                disabled={submitting || (!inviteeId)}
              />
              I must decline
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        
        <FormGroup>
          <Label>Leave a message (optional):</Label>
          <TextArea
            name="response"
            value={formData.response}
            onChange={handleChange}
            placeholder="Share your final thoughts with us..."
            disabled={submitting || (!inviteeId)}
          />
        </FormGroup>
        
        <SubmitButton 
          type="submit" 
          disabled={submitting || (!inviteeId)}
        >
          {submitting ? 'Submitting...' : hasResponded ? 'Update Response' : 'Send Response'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default RSVPForm;
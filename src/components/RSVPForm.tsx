import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { RSVPFormData } from '../types';
import {
  FormContainer,
  FormTitle,
  FormGroup,
  Label,
  RadioGroup,
  RadioLabel,
  RadioInput,
  TextArea,
  SubmitButton,
  SuccessMessage
} from '../styles/RSVPFormStyles';

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
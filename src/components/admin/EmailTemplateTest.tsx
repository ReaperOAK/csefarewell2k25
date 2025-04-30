import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { testEmailSend } from '../../utils/emailUtils';
import emailjs from '@emailjs/browser';

// EmailJS configuration constants
const EMAILJS_SERVICE_ID = 'ReaperOAK';
const EMAILJS_TEMPLATE_ID = 'ReaperOAK';
const EMAILJS_PUBLIC_KEY = 'wsCefJMospSDh5hqJ';

const Container = styled.div`
  background-color: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
`;

const Input = styled.input`
  padding: 0.8rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  
  &:focus {
    outline: none;
    border-color: var(--gold);
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
`;

const StatusMessage = styled.div<{ success: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  background-color: ${props => props.success ? 'rgba(75, 181, 67, 0.1)' : 'rgba(181, 67, 67, 0.1)'};
  border: 1px solid ${props => props.success ? 'rgba(75, 181, 67, 0.3)' : 'rgba(181, 67, 67, 0.3)'};
  color: ${props => props.success ? '#4BB543' : '#B54343'};
`;

const JsonDisplay = styled.pre`
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  color: #e0e0e0;
  font-family: monospace;
  font-size: 0.8rem;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const EmailTemplateTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Reset status message after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testEmail) {
      setStatus({
        success: false,
        message: 'Please enter a valid email address'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await testEmailSend(testEmail);
      
      setStatus({
        success: true,
        message: `Test email sent successfully to ${testEmail}`
      });
    } catch (error: any) {
      setStatus({
        success: false,
        message: `Failed to send test email: ${error.message || 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const runTemplateValidation = async () => {
    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      // Create a test template parameters object
      const testParams = {
        email: "test@example.com",
        name: "Test User",
        link: `${window.location.origin}/invitation/test-id`,
      };
      
      setDebugInfo({
        validationParameters: testParams,
        emailjsServiceId: EMAILJS_SERVICE_ID,
        emailjsTemplateId: EMAILJS_TEMPLATE_ID
      });
      
      setStatus({
        success: true,
        message: 'Template validation successful! Parameters are ready for testing.'
      });
    } catch (error: any) {
      setStatus({
        success: false,
        message: `Validation error: ${error.message || 'Unknown error'}`
      });
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>Test Email Template</Title>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="testEmail">Send Test Email To:</Label>
          <Input
            id="testEmail"
            type="email"
            placeholder="Enter email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            required
          />
        </InputGroup>
        
        <ButtonGroup>
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Test Email'}
          </SubmitButton>
          
          <SubmitButton
            type="button"
            onClick={runTemplateValidation}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            Validate Template
          </SubmitButton>
        </ButtonGroup>
      </Form>
      
      {status && (
        <StatusMessage success={status.success}>
          {status.message}
        </StatusMessage>
      )}
      
      {debugInfo && (
        <JsonDisplay>
          {JSON.stringify(debugInfo, null, 2)}
        </JsonDisplay>
      )}
      
      <div style={{ marginTop: '1rem', color: '#888' }}>
        <p>Tips to fix email issues:</p>
        <ul>
          <li>Verify EmailJS service ID (ReaperOAK) and template ID (ReaperOAK) are correct</li>
          <li>Make sure your EmailJS template has the variable names: email, name, link, photo, message</li>
          <li>Check EmailJS dashboard for any error messages</li>
          <li>Ensure your EmailJS account is activated and has available email quota</li>
        </ul>
      </div>
    </Container>
  );
};

export default EmailTemplateTest;
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';

const EmailContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.8rem;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const InviteeSelector = styled.div`
  margin-bottom: 2rem;
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
`;

const SelectorTitle = styled.h2`
  font-size: 1.2rem;
  color: var(--gold);
  margin-bottom: 1rem;
`;

const SelectorOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Option = styled(motion.button)<{ $selected?: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.$selected ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  color: ${props => props.$selected ? 'var(--gold)' : 'var(--text)'};
  border: 1px solid ${props => props.$selected ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: ${props => props.$selected ? '600' : '400'};
  cursor: pointer;
`;

const InviteeListContainer = styled.div`
  margin-top: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--gold);
    border-radius: 3px;
  }
`;

const InviteeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  color: var(--gold);
  font-weight: 600;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  color: var(--text);
`;

const ToggleAllContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ToggleAllButton = styled(motion.button)`
  background-color: transparent;
  color: var(--gold);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.$checked ? 'var(--gold)' : 'rgba(212, 175, 55, 0.5)'};
  background-color: ${props => props.$checked ? 'var(--gold)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
  cursor: pointer;
`;

const EmailComposer = styled.div`
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ComposerTitle = styled.h2`
  font-size: 1.2rem;
  color: var(--gold);
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  color: var(--text);
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold);
  border-radius: 4px;
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--gold);
  border-radius: 4px;
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
  }
`;

const HelpText = styled.div`
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TokenButton = styled(motion.button)`
  background-color: rgba(212, 175, 55, 0.1);
  color: var(--gold);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const SendButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--crimson);
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--text);
  border: 1px solid var(--text);
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmailPreview = styled(motion.div)`
  margin-top: 2rem;
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
`;

const PreviewTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--gold);
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background-color: transparent;
  color: var(--gold);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewFrame = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 4px;
  color: #333;
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background-color: #2E7D32;
  color: white;
  border-radius: 4px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  
  &.error {
    background-color: #C62828;
  }
`;

const ToastProgress = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const ProgressOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ProgressContainer = styled.div`
  background-color: #111111;
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  text-align: center;
`;

const ProgressTitle = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: var(--gold);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  color: var(--text);
  font-size: 1rem;
  margin-bottom: 2rem;
`;

interface EmailManagerProps {
  invitees: Invitee[];
  baseUrl: string;
  onSendEmails: (invitees: Invitee[], subject: string, emailBody: string) => Promise<void>;
}

const EmailManager: React.FC<EmailManagerProps> = ({
  invitees,
  baseUrl,
  onSendEmails
}) => {
  // Selection state
  const [selectionType, setSelectionType] = useState<'all' | 'noresponse' | 'custom'>('all');
  const [selectedInvitees, setSelectedInvitees] = useState<{ [id: string]: boolean }>({});
  
  // Email content state
  const [subject, setSubject] = useState('Your Invitation to OBLIVION: CSE Farewell 2025');
  const [emailBody, setEmailBody] = useState(
    `Dear {{name}},\n\nYou are cordially invited to OBLIVION: CSE Farewell 2025.\n\nPlease RSVP using this personalized link: {{invitationLink}}\n\nWe look forward to your presence.\n\nRegards,\nCSE Farewell Committee`
  );
  
  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [previewInvitee, setPreviewInvitee] = useState<Invitee | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  // Filter invitees based on selection type
  const getFilteredInvitees = () => {
    switch (selectionType) {
      case 'all':
        return invitees;
      case 'noresponse':
        return invitees.filter(invitee => invitee.attending === null);
      default:
        return invitees;
    }
  };
  
  // Toggle selection for a single invitee
  const toggleInviteeSelection = (id: string) => {
    setSelectedInvitees(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Toggle selection for all filtered invitees
  const toggleAllInvitees = () => {
    const filtered = getFilteredInvitees();
    const allSelected = filtered.every(invitee => selectedInvitees[invitee.id]);
    
    const newSelectedInvitees = { ...selectedInvitees };
    
    filtered.forEach(invitee => {
      newSelectedInvitees[invitee.id] = !allSelected;
    });
    
    setSelectedInvitees(newSelectedInvitees);
  };
  
  // Initialize selection based on selection type
  React.useEffect(() => {
    const filtered = getFilteredInvitees();
    const newSelectedInvitees: { [id: string]: boolean } = {};
    
    filtered.forEach(invitee => {
      newSelectedInvitees[invitee.id] = true;
    });
    
    setSelectedInvitees(newSelectedInvitees);
  }, [selectionType, invitees]);
  
  // Count selected invitees
  const countSelectedInvitees = () => {
    return Object.keys(selectedInvitees).filter(id => selectedInvitees[id]).length;
  };
  
  // Insert token into email body at cursor position
  const insertToken = (token: string) => {
    const textarea = document.getElementById('emailBody') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    
    const textBefore = emailBody.substring(0, startPos);
    const textAfter = emailBody.substring(endPos);
    
    setEmailBody(textBefore + token + textAfter);
    
    // Set focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + token.length;
      textarea.selectionEnd = startPos + token.length;
    }, 10);
  };
  
  // Apply template to specific invitee
  const applyTemplate = (invitee: Invitee) => {
    const invitationLink = `${baseUrl}/invitation/${invitee.id}`;
    
    let result = emailBody
      .replace(/{{name}}/g, invitee.name)
      .replace(/{{invitationLink}}/g, invitationLink);
    
    if (invitee.email) {
      result = result.replace(/{{email}}/g, invitee.email);
    }
    
    if (invitee.phoneNumber) {
      result = result.replace(/{{phoneNumber}}/g, invitee.phoneNumber);
    }
    
    return result;
  };
  
  // Generate preview for email
  const generatePreview = () => {
    // Use first selected invitee for preview
    const selectedId = Object.keys(selectedInvitees).find(id => selectedInvitees[id]);
    if (!selectedId) {
      showToast('Please select at least one invitee', 'error');
      return;
    }
    
    const invitee = invitees.find(i => i.id === selectedId);
    if (!invitee) {
      showToast('Selected invitee not found', 'error');
      return;
    }
    
    setPreviewInvitee(invitee);
    setShowPreview(true);
  };
  
  // Close preview
  const closePreview = () => {
    setShowPreview(false);
    setTimeout(() => {
      setPreviewInvitee(null);
    }, 300);
  };
  
  // Show toast message
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      message,
      type,
      visible: true
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };
  
  // Send emails
  const sendEmails = async () => {
    const selectedIds = Object.keys(selectedInvitees).filter(id => selectedInvitees[id]);
    if (selectedIds.length === 0) {
      showToast('Please select at least one invitee', 'error');
      return;
    }
    
    if (!subject.trim()) {
      showToast('Please enter a subject', 'error');
      return;
    }
    
    if (!emailBody.trim()) {
      showToast('Please enter email content', 'error');
      return;
    }
    
    // Get selected invitees
    const selectedInviteesList = invitees.filter(invitee => selectedInvitees[invitee.id]);
    
    // Show progress
    setProgress({
      current: 0,
      total: selectedInviteesList.length
    });
    setShowProgress(true);
    
    try {
      // Mock progress updates
      const updateInterval = setInterval(() => {
        setProgress(prev => {
          const newCurrent = Math.min(prev.current + 1, prev.total);
          return {
            ...prev,
            current: newCurrent
          };
        });
      }, 300);
      
      // Call the send emails function
      await onSendEmails(selectedInviteesList, subject, emailBody);
      
      // Clear interval
      clearInterval(updateInterval);
      
      // Update UI
      setProgress(prev => ({ ...prev, current: prev.total }));
      
      // Show success after a short delay
      setTimeout(() => {
        setShowProgress(false);
        showToast(`Successfully sent ${selectedInviteesList.length} invitations`, 'success');
      }, 1000);
    } catch (error) {
      console.error('Error sending emails:', error);
      setShowProgress(false);
      showToast('Failed to send invitations', 'error');
    }
  };
  
  return (
    <EmailContainer>
      <Title>Send Invitations</Title>
      
      <InviteeSelector>
        <SelectorTitle>Select Recipients</SelectorTitle>
        
        <SelectorOptions>
          <Option
            $selected={selectionType === 'all'}
            onClick={() => setSelectionType('all')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All Invitees
          </Option>
          <Option
            $selected={selectionType === 'noresponse'}
            onClick={() => setSelectionType('noresponse')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            No Response
          </Option>
          <Option
            $selected={selectionType === 'custom'}
            onClick={() => setSelectionType('custom')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Custom Selection
          </Option>
        </SelectorOptions>
        
        <ToggleAllContainer>
          <ToggleAllButton
            onClick={toggleAllInvitees}
            whileHover={{ scale: 1.05 }}
          >
            {getFilteredInvitees().every(invitee => selectedInvitees[invitee.id])
              ? 'Deselect All'
              : 'Select All'}
          </ToggleAllButton>
        </ToggleAllContainer>
        
        <InviteeListContainer>
          <InviteeTable>
            <thead>
              <tr>
                <Th style={{ width: '50px' }}></Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {getFilteredInvitees().map(invitee => (
                <tr key={invitee.id}>
                  <Td>
                    <Checkbox
                      $checked={selectedInvitees[invitee.id] || false}
                      onClick={() => toggleInviteeSelection(invitee.id)}
                    >
                      {selectedInvitees[invitee.id] && '✓'}
                    </Checkbox>
                  </Td>
                  <Td>{invitee.name}</Td>
                  <Td>{invitee.email || 'N/A'}</Td>
                  <Td>
                    {invitee.attending === true
                      ? 'Attending'
                      : invitee.attending === false
                      ? 'Not Attending'
                      : 'No Response'}
                  </Td>
                </tr>
              ))}
            </tbody>
          </InviteeTable>
        </InviteeListContainer>
      </InviteeSelector>
      
      <EmailComposer>
        <ComposerTitle>Compose Email</ComposerTitle>
        
        <FormGroup>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject line"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="emailBody">Email Content</Label>
          <Textarea
            id="emailBody"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            placeholder="Compose your email..."
          />
          
          <HelpText>
            Use these tokens to personalize your email:
          </HelpText>
          
          <TokensContainer>
            <TokenButton
              onClick={() => insertToken('{{name}}')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'{{name}}'}
            </TokenButton>
            <TokenButton
              onClick={() => insertToken('{{invitationLink}}')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'{{invitationLink}}'}
            </TokenButton>
            <TokenButton
              onClick={() => insertToken('{{email}}')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'{{email}}'}
            </TokenButton>
            <TokenButton
              onClick={() => insertToken('{{phoneNumber}}')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {'{{phoneNumber}}'}
            </TokenButton>
          </TokensContainer>
        </FormGroup>
        
        <ActionButtons>
          <PreviewButton
            onClick={generatePreview}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📋</span> Preview
          </PreviewButton>
          
          <SendButton
            onClick={sendEmails}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={countSelectedInvitees() === 0}
          >
            <span>✉️</span> Send to {countSelectedInvitees()} Recipients
          </SendButton>
        </ActionButtons>
      </EmailComposer>
      
      {/* Email Preview */}
      <AnimatePresence>
        {showPreview && previewInvitee && (
          <EmailPreview
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <PreviewHeader>
              <PreviewTitle>Email Preview for {previewInvitee.name}</PreviewTitle>
              <CloseButton
                onClick={closePreview}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </CloseButton>
            </PreviewHeader>
            
            <PreviewFrame>
              <h3>{subject}</h3>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {applyTemplate(previewInvitee)}
              </div>
            </PreviewFrame>
          </EmailPreview>
        )}
      </AnimatePresence>
      
      {/* Progress Overlay */}
      <AnimatePresence>
        {showProgress && (
          <ProgressOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProgressContainer>
              <ProgressTitle>Sending Invitations</ProgressTitle>
              <ProgressBar>
                <ProgressFill
                  initial={{ width: '0%' }}
                  animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </ProgressBar>
              <ProgressText>
                Sent {progress.current} of {progress.total} invitations
              </ProgressText>
            </ProgressContainer>
          </ProgressOverlay>
        )}
      </AnimatePresence>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <Toast
            className={toast.type}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 0 }}
          >
            {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
            <ToastProgress
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </Toast>
        )}
      </AnimatePresence>
    </EmailContainer>
  );
};

export default EmailManager;
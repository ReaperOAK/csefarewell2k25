import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';
import Toast from '../common/Toast';
import { encodeImageUrl } from '../../utils/imageUtils';
import { sendBulkInvitationEmails, isValidEmail } from '../../utils/emailUtils';
import EmailTemplateTest from './EmailTemplateTest';

// Styled components
const Container = styled.div`
  background-color: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
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

const TestButton = styled(motion.button)`
  padding: 0.4rem 0.8rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
`;

const SelectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SelectionControls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const SelectionButton = styled(motion.button)`
  padding: 0.4rem 0.8rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
`;

const SendButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectedCount = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
`;

const InviteeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InviteeCard = styled(motion.div)<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.$selected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.$selected ? 'var(--gold)' : 'rgba(212, 175, 55, 0.1)'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$selected ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 0, 0, 0.3)'};
  }
`;

const InviteePhoto = styled.div<{ photoUrl: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
  border: 1px solid var(--gold);
`;

const InviteeInfo = styled.div`
  flex: 1;
`;

const InviteeName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.3rem;
`;

const InviteeEmail = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.7;
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border: 1px solid ${props => props.$checked ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  background-color: ${props => props.$checked ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  
  &::after {
    content: '✓';
    display: ${props => props.$checked ? 'block' : 'none'};
    color: var(--gold);
    font-size: 0.8rem;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text);
  opacity: 0.7;
  font-style: italic;
`;

const ProgressOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ProgressContainer = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0a0a0a;
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 2rem;
`;

const ProgressTitle = styled.h3`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0 0 1.5rem;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background-color: var(--gold);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 1.5rem;
`;

const CloseButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

// Props for the component
interface BulkEmailSenderProps {
  invitees: Invitee[];
  loading: boolean;
  onSendEmails: (inviteeIds: string[]) => Promise<void>;
}

const BulkEmailSender: React.FC<BulkEmailSenderProps> = ({
  invitees,
  loading,
  onSendEmails
}) => {
  const [selectedInvitees, setSelectedInvitees] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(0);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showTestTool, setShowTestTool] = useState(false);
  
  // Filter invitees to only show those with valid emails
  const inviteesWithEmail = invitees.filter(invitee => isValidEmail(invitee.email));
  
  // Toggle selection for a single invitee
  const toggleSelection = (inviteeId: string) => {
    const newSelection = new Set(selectedInvitees);
    
    if (newSelection.has(inviteeId)) {
      newSelection.delete(inviteeId);
    } else {
      newSelection.add(inviteeId);
    }
    
    setSelectedInvitees(newSelection);
  };
  
  // Select all invitees
  const selectAll = () => {
    const newSelection = new Set<string>();
    inviteesWithEmail.forEach(invitee => {
      newSelection.add(invitee.id);
    });
    setSelectedInvitees(newSelection);
  };
  
  // Deselect all invitees
  const deselectAll = () => {
    setSelectedInvitees(new Set());
  };
  
  // Send emails to selected invitees
  const sendEmails = async () => {
    if (selectedInvitees.size === 0) {
      setToast({
        message: 'Please select at least one invitee',
        type: 'error'
      });
      return;
    }
    
    try {
      setIsSending(true);
      setProgress(0);
      setSent(0);
      setTotal(selectedInvitees.size);
      
      const selectedIds = Array.from(selectedInvitees);
      
      // Get the full invitee objects for the selected IDs
      const selectedInviteesData = inviteesWithEmail.filter(invitee => 
        selectedIds.includes(invitee.id)
      );
      
      // Send emails with progress tracking
      await sendBulkInvitationEmails(selectedInviteesData, (sentCount) => {
        setSent(sentCount);
        setProgress((sentCount / selectedIds.length) * 100);
      });
      
      // Notify parent component (for any additional tracking or actions)
      await onSendEmails(selectedIds);
      
      // Show success message
      setToast({
        message: `Successfully sent ${selectedIds.length} invitation emails`,
        type: 'success'
      });
      
      // Clear selection after sending
      deselectAll();
    } catch (error) {
      console.error('Error sending emails:', error);
      setToast({
        message: 'Failed to send emails. Please try again.',
        type: 'error'
      });
    } finally {
      // Close progress modal after a short delay
      setTimeout(() => {
        setIsSending(false);
      }, 1000);
    }
  };

  // Toggle email test tool
  const toggleTestTool = () => {
    setShowTestTool(!showTestTool);
  };
  
  return (
    <Container>
      <Header>
        <Title>Send Invitation Emails</Title>
        <TestButton 
          onClick={toggleTestTool}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
          whileTap={{ scale: 0.98 }}
        >
          {showTestTool ? 'Hide Test Tool' : 'Test Email Template'}
        </TestButton>
      </Header>
      
      {showTestTool && <EmailTemplateTest />}
      
      {inviteesWithEmail.length === 0 ? (
        <EmptyMessage>
          No invitees with email addresses found.
        </EmptyMessage>
      ) : (
        <>
          <SelectionHeader>
            <SelectionControls>
              <SelectionButton
                onClick={selectAll}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                Select All
              </SelectionButton>
              
              <SelectionButton
                onClick={deselectAll}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedInvitees.size === 0}
              >
                Clear Selection
              </SelectionButton>
            </SelectionControls>
            
            <SelectedCount>
              {selectedInvitees.size} of {inviteesWithEmail.length} selected
            </SelectedCount>
          </SelectionHeader>
          
          <SendButton
            onClick={sendEmails}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            disabled={selectedInvitees.size === 0 || loading}
          >
            ✉️ Send Invitation Emails
          </SendButton>
          
          <InviteeList>
            {inviteesWithEmail.map(invitee => {
              // Encode photo URL to handle spaces in filenames
              const encodedPhotoUrl = encodeImageUrl(invitee.photoUrl);
              
              return (
                <InviteeCard
                  key={invitee.id}
                  $selected={selectedInvitees.has(invitee.id)}
                  onClick={() => toggleSelection(invitee.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <InviteePhoto photoUrl={encodedPhotoUrl} />
                  <InviteeInfo>
                    <InviteeName>{invitee.name}</InviteeName>
                    <InviteeEmail>{invitee.email}</InviteeEmail>
                  </InviteeInfo>
                  <Checkbox $checked={selectedInvitees.has(invitee.id)} />
                </InviteeCard>
              );
            })}
          </InviteeList>
        </>
      )}
      
      {/* Progress overlay */}
      <AnimatePresence>
        {isSending && (
          <ProgressOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProgressContainer>
              <ProgressTitle>Sending Invitations</ProgressTitle>
              
              <ProgressBarContainer>
                <ProgressBar
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </ProgressBarContainer>
              
              <ProgressText>
                Sent {sent} of {total} emails
              </ProgressText>
              
              {progress === 100 && (
                <CloseButton
                  onClick={() => setIsSending(false)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </CloseButton>
              )}
            </ProgressContainer>
          </ProgressOverlay>
        )}
      </AnimatePresence>
      
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default BulkEmailSender;
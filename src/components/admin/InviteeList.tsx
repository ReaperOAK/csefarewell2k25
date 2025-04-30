// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\InviteeList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';
import Toast from '../common/Toast';
import { encodeImageUrl } from '../../utils/imageUtils';

// Styled components
const ListContainer = styled.div`
  background-color: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ListTitle = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchBarContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: var(--gold);
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled(motion.button)<{ $active: boolean }>`
  padding: 0.4rem 0.8rem;
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
`;

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  border-radius: 4px;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 0.5rem;
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Tbody = styled.tbody``;

const Tr = styled(motion.tr)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Td = styled.td`
  padding: 1rem 0.5rem;
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
`;

const PhotoTd = styled(Td)`
  width: 60px;
`;

const InviteePhoto = styled.div<{ photoUrl: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  border: 1px solid var(--gold);
`;

const StatusIndicator = styled.span<{ $status: 'attending' | 'declined' | 'pending' }>`
  display: inline-flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background-color: ${props => {
      switch (props.$status) {
        case 'attending':
          return '#4CAF50';
        case 'declined':
          return '#F44336';
        default:
          return '#9E9E9E';
      }
    }};
  }
`;

const ActionButton = styled(motion.button)`
  background-color: transparent;
  border: none;
  color: var(--text);
  font-size: 1rem;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    color: var(--gold);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text);
  opacity: 0.7;
  font-style: italic;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text);
  opacity: 0.7;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const PageButton = styled(motion.button)<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  color: var(--text);
  border-radius: 4px;
  cursor: pointer;
`;

const ConfirmationModal = styled(motion.div)`
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

const ConfirmationContent = styled(motion.div)`
  background-color: #0a0a0a;
  border: 1px solid #F44336;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
`;

const ConfirmationTitle = styled.h3`
  font-family: 'Unbounded', sans-serif;
  color: #F44336;
  margin-bottom: 1rem;
`;

const ConfirmationText = styled.p`
  color: var(--text);
  margin-bottom: 2rem;
`;

const ConfirmButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const CancelDeleteButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  border-radius: 4px;
  cursor: pointer;
`;

const ConfirmDeleteButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid #F44336;
  color: #F44336;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
`;

// Type for filtering invitees
type FilterType = 'all' | 'attending' | 'declined' | 'pending';

// Props for the component
interface InviteeListProps {
  invitees: Invitee[];
  loading: boolean;
  onAddInvitee: () => void;
  onEditInvitee: (invitee: Invitee) => void;
  onDeleteInvitee: (inviteeId: string) => Promise<void>;
  onCopyInviteLink: (inviteeId: string) => void;
  onSendEmail: (inviteeId: string) => Promise<void>;
  onRefresh: () => void;
}

const InviteeList: React.FC<InviteeListProps> = ({
  invitees,
  loading,
  onAddInvitee,
  onEditInvitee,
  onDeleteInvitee,
  onCopyInviteLink,
  onSendEmail,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteInvitee, setDeleteInvitee] = useState<Invitee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const itemsPerPage = 10;

  // Reset to first page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  // Filter and search invitees
  const filteredInvitees = invitees.filter(invitee => {
    // Apply search term filter
    const matchesSearch = 
      invitee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invitee.email && invitee.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Apply status filter
    let matchesFilter = true;
    if (filter === 'attending') {
      matchesFilter = invitee.attending === true;
    } else if (filter === 'declined') {
      matchesFilter = invitee.attending === false;
    } else if (filter === 'pending') {
      matchesFilter = invitee.attending === null;
    }
    
    return matchesSearch && matchesFilter;
  });
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredInvitees.length / itemsPerPage));
  
  // Get current page of invitees
  const currentInvitees = filteredInvitees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Handle confirmation of invitee deletion
  const handleDeleteConfirm = async () => {
    if (!deleteInvitee) return;
    
    try {
      setDeleting(true);
      await onDeleteInvitee(deleteInvitee.id);
      setToast({
        message: `${deleteInvitee.name} has been deleted`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to delete invitee',
        type: 'error'
      });
    } finally {
      setDeleting(false);
      setDeleteInvitee(null);
    }
  };
  
  // Handle copying the invitation link
  const handleCopyLink = (invitee: Invitee) => {
    onCopyInviteLink(invitee.id);
    setToast({
      message: `Invitation link for ${invitee.name} copied to clipboard`,
      type: 'success'
    });
  };
  
  // Handle sending an email
  const handleSendEmail = async (invitee: Invitee) => {
    try {
      await onSendEmail(invitee.id);
      setToast({
        message: `Email sent to ${invitee.name}`,
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to send email',
        type: 'error'
      });
    }
  };
  
  // Get status text for an invitee
  const getStatusText = (invitee: Invitee) => {
    if (invitee.attending === true) {
      return { text: 'Attending', status: 'attending' as const };
    } else if (invitee.attending === false) {
      return { text: 'Declined', status: 'declined' as const };
    } else {
      return { text: 'Pending', status: 'pending' as const };
    }
  };

  return (
    <div>
      <ListContainer>
        <ListHeader>
          <ListTitle>Invitees</ListTitle>
          <ControlsContainer>
            <RefreshButton
              onClick={onRefresh}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              whileTap={{ scale: 0.98 }}
              title="Refresh List"
            >
              🔄
            </RefreshButton>
          </ControlsContainer>
        </ListHeader>
        
        <SearchBarContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search invitees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBarContainer>
        
        <FilterButtons>
          <FilterButton
            $active={filter === 'all'}
            onClick={() => setFilter('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            All
          </FilterButton>
          <FilterButton
            $active={filter === 'attending'}
            onClick={() => setFilter('attending')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Attending
          </FilterButton>
          <FilterButton
            $active={filter === 'declined'}
            onClick={() => setFilter('declined')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Declined
          </FilterButton>
          <FilterButton
            $active={filter === 'pending'}
            onClick={() => setFilter('pending')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Pending
          </FilterButton>
        </FilterButtons>
        
        {loading ? (
          <LoadingMessage>Loading invitees...</LoadingMessage>
        ) : filteredInvitees.length === 0 ? (
          <EmptyMessage>
            {searchTerm || filter !== 'all'
              ? 'No invitees match your filters'
              : 'No invitees yet. Click "Add Invitee" to get started.'}
          </EmptyMessage>
        ) : (
          <>
            <Table>
              <Thead>
                <tr>
                  <Th>Photo</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {currentInvitees.map((invitee) => {
                    const { text: statusText, status } = getStatusText(invitee);
                    const encodedPhotoUrl = encodeImageUrl(invitee.photoUrl);
                    return (
                      <Tr
                        key={invitee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PhotoTd>
                          <InviteePhoto photoUrl={encodedPhotoUrl} />
                        </PhotoTd>
                        <Td>{invitee.name}</Td>
                        <Td>{invitee.email || '-'}</Td>
                        <Td>
                          <StatusIndicator $status={status}>
                            {statusText}
                          </StatusIndicator>
                        </Td>
                        <Td>
                          <ActionsContainer>
                            <ActionButton
                              onClick={() => handleCopyLink(invitee)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Copy Invitation Link"
                            >
                              🔗
                            </ActionButton>
                            {invitee.email && (
                              <ActionButton
                                onClick={() => handleSendEmail(invitee)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Send Email"
                              >
                                ✉️
                              </ActionButton>
                            )}
                            <ActionButton
                              onClick={() => onEditInvitee(invitee)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit Invitee"
                            >
                              ✏️
                            </ActionButton>
                            <ActionButton
                              onClick={() => setDeleteInvitee(invitee)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete Invitee"
                            >
                              🗑️
                            </ActionButton>
                          </ActionsContainer>
                        </Td>
                      </Tr>
                    );
                  })}
                </AnimatePresence>
              </Tbody>
            </Table>
            
            {totalPages > 1 && (
              <PaginationContainer>
                {pageNumbers.map(number => (
                  <PageButton
                    key={number}
                    $active={currentPage === number}
                    onClick={() => setCurrentPage(number)}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {number}
                  </PageButton>
                ))}
              </PaginationContainer>
            )}
          </>
        )}
      </ListContainer>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteInvitee && (
          <ConfirmationModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConfirmationContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ConfirmationTitle>Delete Invitee</ConfirmationTitle>
              <ConfirmationText>
                Are you sure you want to delete {deleteInvitee.name}? This action cannot be undone.
              </ConfirmationText>
              <ConfirmButtonsContainer>
                <CancelDeleteButton
                  onClick={() => setDeleteInvitee(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={deleting}
                >
                  Cancel
                </CancelDeleteButton>
                <ConfirmDeleteButton
                  onClick={handleDeleteConfirm}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(244, 67, 54, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </ConfirmDeleteButton>
              </ConfirmButtonsContainer>
            </ConfirmationContent>
          </ConfirmationModal>
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
    </div>
  );
};

export default InviteeList;
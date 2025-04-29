import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';

const ManagerContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.8rem;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  
  svg {
    color: var(--text);
    margin-right: 0.5rem;
  }
  
  input {
    flex: 1;
    background: none;
    border: none;
    color: var(--text);
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9rem;
    outline: none;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.color || 'var(--gold)'};
  color: ${props => props.color ? 'var(--text)' : '#000'};
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

const RefreshButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  background-color: transparent;
  color: var(--gold);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TableContainer = styled.div`
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  color: var(--gold);
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  position: sticky;
  top: 0;
  background-color: rgba(10, 10, 10, 0.9);
  z-index: 1;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  color: var(--text);
  font-size: 0.9rem;
  vertical-align: middle;
`;

const StatusBadge = styled.span<{ $status: 'attending' | 'notAttending' | 'noResponse' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'attending':
        return `
          background-color: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
        `;
      case 'notAttending':
        return `
          background-color: rgba(244, 67, 54, 0.2);
          color: #F44336;
        `;
      case 'noResponse':
      default:
        return `
          background-color: rgba(158, 158, 158, 0.2);
          color: #9E9E9E;
        `;
    }
  }}
`;

const ActionCell = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const ActionButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  background-color: transparent;
  color: var(--text);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    color: var(--gold);
    border-color: var(--gold);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
`;

const PageInfo = styled.div`
  color: var(--text);
  font-size: 0.9rem;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled(motion.button)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  color: ${props => props.$active ? 'var(--gold)' : 'var(--text)'};
  border: 1px solid ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background-color: var(--bg);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gold);
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background-color: transparent;
  color: var(--text);
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

const Select = styled.select`
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--gold);
  color: #000;
  border: none;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #C62828;
  color: white;
  border: none;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  cursor: pointer;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-top: 3px solid var(--gold);
  border-radius: 50%;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: var(--text);
  opacity: 0.6;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LinkUrl = styled.input`
  flex: 1;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
`;

const CopyButton = styled(motion.button)`
  background-color: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;
`;

interface InviteeManagerProps {
  invitees: Invitee[];
  loading: boolean;
  onRefresh: () => void;
  onAdd: (invitee: Omit<Invitee, 'id'>) => Promise<any>;
  onEdit: (id: string, changes: Partial<Invitee>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  baseUrl: string;
}

const InviteeManager: React.FC<InviteeManagerProps> = ({
  invitees,
  loading,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  baseUrl
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedInvitee, setSelectedInvitee] = useState<Invitee | null>(null);
  const [formData, setFormData] = useState<Omit<Invitee, 'id'>>({
    name: '',
    email: '',
    phoneNumber: '',
    attending: null,
    additionalGuests: 0,
    notes: '',
    photoUrl: '/fp/skull.png', // Default photo URL
    timestamp: Date.now()
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  
  // Pagination settings
  const itemsPerPage = 10;
  
  // Filter invitees based on search query
  const filteredInvitees = useMemo(() => {
    if (!searchQuery.trim()) return invitees;
    
    const query = searchQuery.toLowerCase().trim();
    return invitees.filter(invitee => 
      invitee.name.toLowerCase().includes(query) ||
      (invitee.email && invitee.email.toLowerCase().includes(query)) ||
      (invitee.phoneNumber && invitee.phoneNumber.includes(query))
    );
  }, [invitees, searchQuery]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredInvitees.length / itemsPerPage);
  const paginatedInvitees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvitees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvitees, currentPage, itemsPerPage]);
  
  // Reset pagination when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  
  // Open modal for adding new invitee
  const handleAddNew = () => {
    setModalMode('add');
    setSelectedInvitee(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      attending: null,
      additionalGuests: 0,
      notes: '',
      photoUrl: '/fp/skull.png', // Default photo URL
      timestamp: Date.now()
    });
    setShowModal(true);
  };
  
  // Open modal for editing existing invitee
  const handleEdit = (invitee: Invitee) => {
    setModalMode('edit');
    setSelectedInvitee(invitee);
    setFormData({
      name: invitee.name,
      email: invitee.email || '',
      phoneNumber: invitee.phoneNumber || '',
      attending: invitee.attending,
      additionalGuests: invitee.additionalGuests || 0,
      notes: invitee.notes || '',
      photoUrl: invitee.photoUrl || '/fp/skull.png', // Default photo URL
      timestamp: invitee.timestamp
    });
    setShowModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    let parsedValue: any = value;
    
    // Parse specific field types
    if (name === 'additionalGuests') {
      parsedValue = parseInt(value) || 0;
    } else if (name === 'attending') {
      if (value === 'true') parsedValue = true;
      else if (value === 'false') parsedValue = false;
      else parsedValue = null;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (modalMode === 'add') {
        await onAdd({
          ...formData,
          timestamp: Date.now()
        });
      } else if (modalMode === 'edit' && selectedInvitee) {
        await onEdit(selectedInvitee.id, formData);
      }
      
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete invitee
  const handleDelete = async () => {
    if (!selectedInvitee) return;
    
    try {
      setIsSubmitting(true);
      await onDelete(selectedInvitee.id);
      setShowConfirmDelete(false);
      setShowModal(false);
      onRefresh();
    } catch (error) {
      console.error('Error deleting invitee:', error);
      alert('An error occurred while deleting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Copy invitation link
  const copyInvitationLink = (id: string) => {
    const link = `${baseUrl}/invitation/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedLink(id);
        setTimeout(() => setCopiedLink(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  return (
    <ManagerContainer>
      <Title>Invitee Management</Title>
      
      <ControlPanel>
        <SearchBar>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search invitees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>
        
        <ActionButtons>
          <RefreshButton
            onClick={onRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
          </RefreshButton>
          
          <Button
            onClick={handleAddNew}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Add New Invitee
          </Button>
        </ActionButtons>
      </ControlPanel>
      
      <TableContainer>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </LoadingContainer>
        ) : filteredInvitees.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👥</div>
            <div>
              {searchQuery.trim() 
                ? 'No invitees found matching your search' 
                : 'No invitees found. Add your first invitee!'}
            </div>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Contact</Th>
                <Th>Status</Th>
                <Th>Invitation Link</Th>
                <Th style={{ width: '100px', textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvitees.map(invitee => (
                <tr key={invitee.id}>
                  <Td>{invitee.name}</Td>
                  <Td>
                    {invitee.email && <div>{invitee.email}</div>}
                    {invitee.phoneNumber && <div>{invitee.phoneNumber}</div>}
                    {!invitee.email && !invitee.phoneNumber && 'N/A'}
                  </Td>
                  <Td>
                    <StatusBadge 
                      $status={
                        invitee.attending === true 
                          ? 'attending' 
                          : invitee.attending === false 
                            ? 'notAttending'
                            : 'noResponse'
                      }
                    >
                      {invitee.attending === true 
                        ? 'Attending' 
                        : invitee.attending === false 
                          ? 'Not Attending'
                          : 'No Response'}
                    </StatusBadge>
                    
                    {invitee.attending === true && (invitee.additionalGuests || 0) > 0 && (
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        +{invitee.additionalGuests || 0} additional guests
                      </div>
                    )}
                  </Td>
                  <Td>
                    <LinkContainer>
                      <LinkUrl 
                        readOnly 
                        value={`${baseUrl}/invitation/${invitee.id}`} 
                        onClick={(e) => e.currentTarget.select()}
                      />
                      <CopyButton
                        onClick={() => copyInvitationLink(invitee.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Copy invitation link"
                      >
                        {copiedLink === invitee.id ? 'Copied!' : 'Copy'}
                      </CopyButton>
                    </LinkContainer>
                  </Td>
                  <Td>
                    <ActionCell>
                      <ActionButton
                        onClick={() => handleEdit(invitee)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit invitee"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                      </ActionButton>
                    </ActionCell>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        
        {!loading && filteredInvitees.length > 0 && (
          <Pagination>
            <PageInfo>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvitees.length)} of {filteredInvitees.length} invitees
            </PageInfo>
            
            <PageButtons>
              <PageButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
              </PageButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Display pages around the current page
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const startPage = Math.max(1, currentPage - 2);
                  const endPage = Math.min(totalPages, currentPage + 2);
                  
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = startPage + i;
                  }
                }
                
                return (
                  <PageButton
                    key={pageNum}
                    $active={currentPage === pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}
              
              <PageButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </PageButton>
            </PageButtons>
          </Pagination>
        )}
      </TableContainer>
      
      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSubmitting && setShowModal(false)}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!showConfirmDelete ? (
                <>
                  <ModalHeader>
                    <ModalTitle>
                      {modalMode === 'add' ? 'Add New Invitee' : 'Edit Invitee'}
                    </ModalTitle>
                    <CloseButton 
                      onClick={() => !isSubmitting && setShowModal(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isSubmitting}
                    >
                      ×
                    </CloseButton>
                  </ModalHeader>
                  
                  <Form onSubmit={handleSubmit}>
                    <FormRow>
                      <FormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter full name"
                          required
                          disabled={isSubmitting}
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          disabled={isSubmitting}
                        />
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          disabled={isSubmitting}
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormRow>
                      <FormGroup>
                        <Label htmlFor="attending">Attendance Status</Label>
                        <Select
                          id="attending"
                          name="attending"
                          value={formData.attending === null ? 'null' : formData.attending.toString()}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        >
                          <option value="null">No Response</option>
                          <option value="true">Attending</option>
                          <option value="false">Not Attending</option>
                        </Select>
                      </FormGroup>
                      
                      <FormGroup>
                        <Label htmlFor="additionalGuests">Additional Guests</Label>
                        <Input
                          type="number"
                          id="additionalGuests"
                          name="additionalGuests"
                          value={formData.additionalGuests}
                          onChange={handleInputChange}
                          min="0"
                          max="10"
                          disabled={isSubmitting}
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormGroup>
                      <Label htmlFor="notes">Notes</Label>
                      <Input
                        type="text"
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any additional notes"
                        disabled={isSubmitting}
                      />
                    </FormGroup>
                    
                    <ModalActions>
                      {modalMode === 'edit' && (
                        <DeleteButton
                          type="button"
                          onClick={() => setShowConfirmDelete(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                        >
                          Delete
                        </DeleteButton>
                      )}
                      
                      <div style={{ flex: 1 }} />
                      
                      <CancelButton
                        type="button"
                        onClick={() => !isSubmitting && setShowModal(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </CancelButton>
                      
                      <SubmitButton
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : modalMode === 'add' ? 'Add Invitee' : 'Save Changes'}
                      </SubmitButton>
                    </ModalActions>
                  </Form>
                </>
              ) : (
                <>
                  <ModalHeader>
                    <ModalTitle>Confirm Delete</ModalTitle>
                    <CloseButton 
                      onClick={() => !isSubmitting && setShowConfirmDelete(false)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isSubmitting}
                    >
                      ×
                    </CloseButton>
                  </ModalHeader>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text)' }}>
                      Are you sure you want to delete {selectedInvitee?.name}? This action cannot be undone.
                    </p>
                  </div>
                  
                  <ModalActions>
                    <CancelButton
                      type="button"
                      onClick={() => !isSubmitting && setShowConfirmDelete(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </CancelButton>
                    
                    <DeleteButton
                      type="button"
                      onClick={handleDelete}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
                    </DeleteButton>
                  </ModalActions>
                </>
              )}
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </ManagerContainer>
  );
};

export default InviteeManager;
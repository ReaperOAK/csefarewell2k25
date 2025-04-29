// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\InviteeList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';

const ListContainer = styled.div`
  background-color: rgba(20, 0, 0, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 20px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ListTitle = styled.h2`
  margin: 0;
  color: var(--accent-color);
`;

const ActionButton = styled(motion.button)`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Copperplate Gothic', serif;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--primary-color);
  }
`;

const RefreshButton = styled(motion.button)`
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 8px 15px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
  color: var(--accent-color);
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid rgba(87, 0, 0, 0.3);
`;

const PhotoTd = styled(Td)`
  width: 60px;
`;

const InviteePhoto = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--accent-color);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--text-color);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: var(--text-color);
  font-style: italic;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionIconButton = styled(motion.button)`
  background-color: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.3);
  color: var(--text-color);
  border-radius: 3px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const AttendanceIndicator = styled.span<{ attending: boolean | null }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ attending }) => 
    attending === true ? '#5cb85c' : 
    attending === false ? '#d9534f' : 
    '#777'};
`;

const StatusText = styled.span`
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled(motion.button)<{ isActive?: boolean }>`
  background-color: ${({ isActive }) => isActive ? 'var(--secondary-color)' : 'transparent'};
  border: 1px solid ${({ isActive }) => isActive ? 'var(--accent-color)' : 'var(--border-color)'};
  color: var(--text-color);
  padding: 5px 10px;
  cursor: pointer;
  
  &:hover {
    border-color: var(--accent-color);
  }
`;

// Clipboard notification component
const CopyNotification = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid var(--accent-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

interface InviteeListProps {
  invitees: Invitee[];
  loading: boolean;
  onAddInvitee: () => void;
  onEditInvitee: (invitee: Invitee) => void;
  onDeleteInvitee: (id: string) => Promise<{ success: boolean }>;
  generateInvitationUrl: (id: string) => string;
  refreshList: () => void;
}

const InviteeList: React.FC<InviteeListProps> = ({
  invitees,
  loading,
  onAddInvitee,
  onEditInvitee,
  onDeleteInvitee,
  generateInvitationUrl,
  refreshList
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCopied, setShowCopied] = useState(false);
  const inviteesPerPage = 10;
  
  // Filter invitees based on search term
  const filteredInvitees = invitees.filter(invitee => 
    invitee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invitee.email && invitee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (invitee.phoneNumber && invitee.phoneNumber.includes(searchTerm))
  );
  
  // Paginate invitees
  const indexOfLastInvitee = currentPage * inviteesPerPage;
  const indexOfFirstInvitee = indexOfLastInvitee - inviteesPerPage;
  const currentInvitees = filteredInvitees.slice(indexOfFirstInvitee, indexOfLastInvitee);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredInvitees.length / inviteesPerPage);
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Copy invitation URL to clipboard
  const copyToClipboard = (id: string) => {
    const url = generateInvitationUrl(id);
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopied(true);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowCopied(false);
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  if (loading) {
    return (
      <ListContainer>
        <LoadingMessage>Loading invitees...</LoadingMessage>
      </ListContainer>
    );
  }
  
  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Invitees</ListTitle>
        <ButtonGroup>
          <ActionButton
            onClick={onAddInvitee}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Invitee
          </ActionButton>
          <RefreshButton
            onClick={refreshList}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Refresh
          </RefreshButton>
        </ButtonGroup>
      </ListHeader>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </SearchContainer>
      
      {currentInvitees.length === 0 ? (
        <EmptyMessage>
          {searchTerm ? 'No invitees found matching your search.' : 'No invitees added yet.'}
        </EmptyMessage>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Photo</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {currentInvitees.map((invitee) => (
                <tr key={invitee.id}>
                  <PhotoTd>
                    <InviteePhoto 
                      src={invitee.photoUrl} 
                      alt={invitee.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/face pic/skull.png"; // Default image
                      }}
                    />
                  </PhotoTd>
                  <Td>{invitee.name}</Td>
                  <Td>{invitee.email || '-'}</Td>
                  <Td>{invitee.phoneNumber || '-'}</Td>
                  <Td>
                    <AttendanceIndicator attending={invitee.attending} />
                    <StatusText>
                      {invitee.attending === true ? 'Attending' : 
                       invitee.attending === false ? 'Declined' : 
                       'No Response'}
                    </StatusText>
                  </Td>
                  <Td>
                    <ActionGroup>
                      <ActionIconButton
                        onClick={() => copyToClipboard(invitee.id)}
                        title="Copy invitation link"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        📋
                      </ActionIconButton>
                      <ActionIconButton
                        onClick={() => onEditInvitee(invitee)}
                        title="Edit invitee"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✏️
                      </ActionIconButton>
                      <ActionIconButton
                        onClick={() => onDeleteInvitee(invitee.id)}
                        title="Delete invitee"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        🗑️
                      </ActionIconButton>
                    </ActionGroup>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &laquo;
              </PageButton>
              
              <PageButton
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &lt;
              </PageButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show 5 page buttons centered around current page
                let pageNum: number; // Explicitly declaring type as number
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PageButton
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum}
                  </PageButton>
                );
              })}
              
              <PageButton
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &gt;
              </PageButton>
              
              <PageButton
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                &raquo;
              </PageButton>
            </Pagination>
          )}
        </>
      )}
      
      {/* Copy notification */}
      <AnimatePresence>
        {showCopied && (
          <CopyNotification
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Invitation link copied!
          </CopyNotification>
        )}
      </AnimatePresence>
    </ListContainer>
  );
};

export default InviteeList;
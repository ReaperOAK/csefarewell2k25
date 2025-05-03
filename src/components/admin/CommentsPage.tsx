import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';
import { encodeImageUrl } from '../../utils/imageUtils';

// Styled Components for Comments Page
const CommentsContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const FiltersSection = styled.section`
  background-color: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
`;

const FilterControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  margin-right: 0.5rem;
`;

const FilterButton = styled(motion.button)<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
`;

const SearchInput = styled.input`
  padding: 0.4rem 0.8rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  border-radius: 4px;
  margin-left: auto;
  width: 250px;

  &:focus {
    outline: none;
    border-color: var(--gold);
  }
`;

const InfoText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.7;
  margin-top: 1rem;
`;

const CommentsSection = styled.section`
  display: grid;
  gap: 1rem;
`;

const CommentCard = styled(motion.div)`
  background-color: rgba(10, 10, 10, 0.4);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
`;

const CommentPhoto = styled.div<{ photoUrl: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  margin-right: 1.2rem;
  border: 1px solid var(--gold);
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const CommentName = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gold);
  margin: 0;
`;

const CommentStatus = styled.span<{ $attending: boolean | null }>`
  font-size: 0.85rem;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  color: white;
  background-color: ${props => 
    props.$attending === true ? '#4CAF50' : 
    props.$attending === false ? '#F44336' : '#9E9E9E'};
`;

const CommentText = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: var(--text);
  line-height: 1.5;
  padding: 0.8rem 0;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  white-space: pre-wrap;
`;

const CommentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
`;

const CommentDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.6;
`;

const CommentContactInfo = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.6;
`;

const EmptyCommentsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text);
  opacity: 0.7;
  font-style: italic;
  background-color: rgba(10, 10, 10, 0.4);
  border-radius: 4px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
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

interface CommentsPageProps {
  invitees: Invitee[];
  loading: boolean;
}

const CommentsPage: React.FC<CommentsPageProps> = ({ invitees, loading }) => {
  // Filters and pagination state
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const itemsPerPage = 5;

  // Filter invitees to those with responses
  const inviteesWithComments = invitees.filter(invitee => 
    invitee.response && invitee.response.trim() !== ''
  );

  // Apply filters
  const filteredComments = inviteesWithComments.filter(invitee => {
    // Filter by attendance status
    if (filter === 'attending' && invitee.attending !== true) return false;
    if (filter === 'declined' && invitee.attending !== false) return false;
    
    // Search term filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        invitee.name.toLowerCase().includes(searchTermLower) ||
        (invitee.response && invitee.response.toLowerCase().includes(searchTermLower))
      );
    }
    
    return true;
  });

  // Sort by timestamp
  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.timestamp || 0) - (a.timestamp || 0);
    } else {
      return (a.timestamp || 0) - (b.timestamp || 0);
    }
  });

  // Pagination
  const totalComments = sortedComments.length;
  const totalPages = Math.max(1, Math.ceil(totalComments / itemsPerPage));
  
  // Ensure current page is valid
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
  
  const commentsToDisplay = sortedComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate pagination numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Format date helper
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <CommentsContainer>
      <FiltersSection>
        <FilterControls>
          <FilterGroup>
            <FilterLabel>Status:</FilterLabel>
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
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Sort:</FilterLabel>
            <FilterButton
              $active={sortBy === 'newest'}
              onClick={() => setSortBy('newest')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Newest
            </FilterButton>
            <FilterButton
              $active={sortBy === 'oldest'}
              onClick={() => setSortBy('oldest')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Oldest
            </FilterButton>
          </FilterGroup>

          <SearchInput
            type="text"
            placeholder="Search comments or names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterControls>

        <InfoText>
          Showing {commentsToDisplay.length} of {totalComments} comments
          {filter !== 'all' && ` (filtered by ${filter})`}
          {searchTerm && ` matching "${searchTerm}"`}
        </InfoText>
      </FiltersSection>

      <CommentsSection>
        <AnimatePresence>
          {loading ? (
            <EmptyCommentsMessage>Loading comments...</EmptyCommentsMessage>
          ) : commentsToDisplay.length === 0 ? (
            <EmptyCommentsMessage>
              {totalComments === 0
                ? 'No comments have been submitted yet'
                : 'No comments match your current filters'}
            </EmptyCommentsMessage>
          ) : (
            commentsToDisplay.map((invitee, index) => {
              const encodedPhotoUrl = encodeImageUrl(invitee.photoUrl);
              
              return (
                <CommentCard
                  key={`comment-${invitee.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CommentPhoto photoUrl={encodedPhotoUrl} />
                  <CommentContent>
                    <CommentHeader>
                      <CommentName>{invitee.name}</CommentName>
                      <CommentStatus $attending={invitee.attending}>
                        {invitee.attending === true ? 'Attending' : 
                          invitee.attending === false ? 'Declined' : 'Pending'}
                      </CommentStatus>
                    </CommentHeader>
                    
                    <CommentText>
                      {invitee.response}
                    </CommentText>
                    
                    <CommentFooter>
                      <CommentDate>
                        Responded on {formatDate(invitee.timestamp)}
                      </CommentDate>
                      <CommentContactInfo>
                        {invitee.email && `${invitee.email}`}
                        {invitee.email && invitee.phoneNumber && ' • '}
                        {invitee.phoneNumber && `${invitee.phoneNumber}`}
                      </CommentContactInfo>
                    </CommentFooter>
                  </CommentContent>
                </CommentCard>
              );
            })
          )}
        </AnimatePresence>
        
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
      </CommentsSection>
    </CommentsContainer>
  );
};

export default CommentsPage;
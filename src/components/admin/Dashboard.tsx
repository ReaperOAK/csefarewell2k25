import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Invitee } from '../../types';
import { encodeImageUrl } from '../../utils/imageUtils';

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const MetricsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const MetricCard = styled(motion.div)`
  background-color: rgba(10, 10, 10, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MetricTitle = styled.h3`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GaugeContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const GaugeBackground = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const GaugeFill = styled(motion.svg)`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const MetricValue = styled.div`
  position: relative;
  font-family: 'Unbounded', sans-serif;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--gold);
`;

const MetricPercentage = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.7;
`;

const ActivitySection = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0 0 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
`;

const ActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: rgba(10, 10, 10, 0.4);
  border-left: 3px solid;
  border-color: ${props => props.color || 'var(--gold)'};
`;

const ActivityPhoto = styled.div<{ photoUrl: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: ${props => `url(${props.photoUrl})`};
  background-size: cover;
  background-position: center;
  margin-right: 1rem;
  border: 1px solid var(--gold);
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityName = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.2rem;
`;

const ActivityDetail = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: var(--text);
  opacity: 0.7;
`;

const ActivityTime = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.5;
`;

const CommentsSection = styled.section`
  margin-top: 2rem;
`;

const CommentCard = styled(motion.div)`
  background-color: rgba(10, 10, 10, 0.4);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
`;

const CommentPhoto = styled.div<{ photoUrl: string }>`
  width: 50px;
  height: 50px;
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
  font-size: 1rem;
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
  font-size: 0.95rem;
  color: var(--text);
  line-height: 1.5;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
`;

const CommentDate = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.6;
  margin-top: 0.8rem;
  text-align: right;
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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CommentFilterButton = styled(motion.button)<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.3)'};
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  margin-left: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;

const Gauge: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = (value / 100) * circumference;
  
  return (
    <GaugeContainer>
      <GaugeBackground>
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
          fill="none"
        />
      </GaugeBackground>
      <GaugeFill
        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
        animate={{ 
          strokeDasharray: circumference, 
          strokeDashoffset: circumference - fillPercentage 
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
        />
      </GaugeFill>
      <MetricValue>{value}%</MetricValue>
    </GaugeContainer>
  );
};

interface DashboardProps {
  totalInvitees: number;
  totalResponded: number;
  totalAttending: number;
  totalDeclined: number;
  recentActivity: Array<{
    invitee: Invitee;
    action: string;
    timestamp: number;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalInvitees,
  totalResponded,
  totalAttending,
  totalDeclined,
  recentActivity
}) => {
  const [commentsFilter, setCommentsFilter] = useState<'all' | 'attending' | 'declined'>('all');

  const respondedPercentage = totalInvitees > 0 
    ? Math.round((totalResponded / totalInvitees) * 100) 
    : 0;
  
  const attendingPercentage = totalResponded > 0 
    ? Math.round((totalAttending / totalResponded) * 100) 
    : 0;
  
  const declinedPercentage = totalResponded > 0 
    ? Math.round((totalDeclined / totalResponded) * 100) 
    : 0;
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const guestsWithComments = recentActivity
    .filter(activity => 
      activity.invitee.response && 
      activity.invitee.response.trim() !== '' &&
      (commentsFilter === 'all' || 
       (commentsFilter === 'attending' && activity.invitee.attending === true) ||
       (commentsFilter === 'declined' && activity.invitee.attending === false))
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <DashboardContainer>
      <MetricsSection>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MetricTitle>Total Invitees</MetricTitle>
          <GaugeContainer>
            <MetricValue>{totalInvitees}</MetricValue>
          </GaugeContainer>
        </MetricCard>
        
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MetricTitle>Responses</MetricTitle>
          <Gauge value={respondedPercentage} color="#D4AF37" />
          <MetricPercentage>{totalResponded} of {totalInvitees}</MetricPercentage>
        </MetricCard>
        
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MetricTitle>Attending</MetricTitle>
          <Gauge value={attendingPercentage} color="#4CAF50" />
          <MetricPercentage>{totalAttending} of {totalResponded}</MetricPercentage>
        </MetricCard>
        
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MetricTitle>Declined</MetricTitle>
          <Gauge value={declinedPercentage} color="#F44336" />
          <MetricPercentage>{totalDeclined} of {totalResponded}</MetricPercentage>
        </MetricCard>
      </MetricsSection>
      
      <ActivitySection>
        <SectionTitle>Recent Activity</SectionTitle>
        
        <ActivityList>
          {recentActivity.length === 0 ? (
            <ActivityItem color="var(--gold)">
              <ActivityContent>
                <ActivityDetail>No recent activity to show</ActivityDetail>
              </ActivityContent>
            </ActivityItem>
          ) : (
            recentActivity.map((activity, index) => (
              <ActivityItem
                key={`${activity.invitee.id}-${activity.timestamp}`}
                color={activity.action.includes('attending') ? '#4CAF50' : '#F44336'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ActivityPhoto photoUrl={activity.invitee.photoUrl} />
                <ActivityContent>
                  <ActivityName>{activity.invitee.name}</ActivityName>
                  <ActivityDetail>{activity.action}</ActivityDetail>
                </ActivityContent>
                <ActivityTime>{formatDate(activity.timestamp)}</ActivityTime>
              </ActivityItem>
            ))
          )}
        </ActivityList>
      </ActivitySection>

      <CommentsSection>
        <SectionHeader>
          <SectionTitle>Guest Comments</SectionTitle>
          <div>
            <CommentFilterButton
              $active={commentsFilter === 'all'}
              onClick={() => setCommentsFilter('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              All
            </CommentFilterButton>
            <CommentFilterButton
              $active={commentsFilter === 'attending'}
              onClick={() => setCommentsFilter('attending')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Attending
            </CommentFilterButton>
            <CommentFilterButton
              $active={commentsFilter === 'declined'}
              onClick={() => setCommentsFilter('declined')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Declined
            </CommentFilterButton>
          </div>
        </SectionHeader>

        <AnimatePresence>
          {guestsWithComments.length === 0 ? (
            <EmptyCommentsMessage>
              No comments to display
            </EmptyCommentsMessage>
          ) : (
            guestsWithComments.map((activity, index) => {
              const encodedPhotoUrl = encodeImageUrl(activity.invitee.photoUrl);
              
              return (
                <CommentCard
                  key={`comment-${activity.invitee.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CommentPhoto photoUrl={encodedPhotoUrl} />
                  <CommentContent>
                    <CommentHeader>
                      <CommentName>{activity.invitee.name}</CommentName>
                      <CommentStatus $attending={activity.invitee.attending}>
                        {activity.invitee.attending === true ? 'Attending' : 
                          activity.invitee.attending === false ? 'Declined' : 'Pending'}
                      </CommentStatus>
                    </CommentHeader>
                    <CommentText>
                      {activity.invitee.response}
                    </CommentText>
                    <CommentDate>
                      {formatDate(activity.timestamp)}
                    </CommentDate>
                  </CommentContent>
                </CommentCard>
              );
            })
          )}
        </AnimatePresence>
      </CommentsSection>
    </DashboardContainer>
  );
};

export default Dashboard;
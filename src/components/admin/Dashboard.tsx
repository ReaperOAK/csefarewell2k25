import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Invitee } from '../../types';

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

// Gauge component that renders circular progress
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
  // Calculate percentages for gauges
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
    </DashboardContainer>
  );
};

export default Dashboard;
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Invitee } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.8rem;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled(motion.div)`
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: var(--text);
  margin: 0;
  margin-bottom: 0.5rem;
  opacity: 0.7;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 0.25rem;
`;

const StatTrend = styled.div<{ $positive?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: ${props => props.$positive ? '#4CAF50' : '#F44336'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const ChartCard = styled.div`
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 350px;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--gold);
  margin: 0;
  margin-bottom: 1.5rem;
`;

const ChartContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomTooltip = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 0.75rem;
  color: var(--text);
  font-size: 0.8rem;
  
  p {
    margin: 0;
    margin-bottom: 0.25rem;
  }
  
  .label {
    color: var(--gold);
    font-weight: 600;
  }
  
  .value {
    color: white;
  }
`;

const RecentUpdatesContainer = styled.div`
  background-color: rgba(10, 10, 10, 0.8);
  border: 1px solid var(--gold);
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const UpdatesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const UpdatesTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--gold);
  margin: 0;
`;

const UpdatesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UpdateItem = styled(motion.li)`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const UpdateIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(212, 175, 55, 0.1);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
`;

const UpdateContent = styled.div`
  flex: 1;
`;

const UpdateText = styled.p`
  margin: 0;
  color: var(--text);
`;

const UpdateTime = styled.span`
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.6;
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
  
  svg {
    margin-bottom: 1rem;
  }
`;

interface AdminDashboardProps {
  invitees: Invitee[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ invitees }) => {
  // Calculate statistics
  const totalInvitees = invitees.length;
  const attending = invitees.filter(invitee => invitee.attending === true).length;
  const notAttending = invitees.filter(invitee => invitee.attending === false).length;
  const noResponse = invitees.filter(invitee => invitee.attending === null).length;
  
  // Response rate
  const responseRate = totalInvitees > 0 
    ? Math.round(((attending + notAttending) / totalInvitees) * 100) 
    : 0;
  
  // Attendance rate
  const attendanceRate = (attending + notAttending) > 0 
    ? Math.round((attending / (attending + notAttending)) * 100) 
    : 0;
  
  // Data for attendance pie chart
  const attendanceData = [
    { name: 'Attending', value: attending, color: '#4CAF50' },
    { name: 'Not Attending', value: notAttending, color: '#F44336' },
    { name: 'No Response', value: noResponse, color: '#9E9E9E' },
  ];
  
  // Dummy data for engagement chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const engagementData = days.map(day => ({
    name: day,
    responses: Math.floor(Math.random() * 10)
  }));
  
  // Custom tooltip for charts
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <p className="label">{payload[0].name}</p>
          <p className="value">{payload[0].value}</p>
        </CustomTooltip>
      );
    }
    
    return null;
  };
  
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      
      <StatsGrid>
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatTitle>Total Invitations</StatTitle>
          <StatValue>{totalInvitees}</StatValue>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatTitle>Attendance Confirmations</StatTitle>
          <StatValue>{attending}</StatValue>
          <StatTrend $positive={true}>
            {attendanceRate}% attendance rate
          </StatTrend>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatTitle>Declined Invitations</StatTitle>
          <StatValue>{notAttending}</StatValue>
        </StatCard>
        
        <StatCard 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatTitle>Response Rate</StatTitle>
          <StatValue>{responseRate}%</StatValue>
          <StatTrend $positive={responseRate > 50}>
            {noResponse} pending responses
          </StatTrend>
        </StatCard>
      </StatsGrid>
      
      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Attendance Status</ChartTitle>
          <ChartContent>
            {totalInvitees > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState>
                <div>📊</div>
                <div>No data to display</div>
              </EmptyState>
            )}
          </ChartContent>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>Response Timeline</ChartTitle>
          <ChartContent>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis dataKey="name" stroke="var(--text)" />
                <YAxis stroke="var(--text)" />
                <Tooltip content={renderCustomTooltip} />
                <Bar dataKey="responses" fill="var(--gold)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContent>
        </ChartCard>
      </ChartsGrid>
      
      <RecentUpdatesContainer>
        <UpdatesHeader>
          <UpdatesTitle>Recent Updates</UpdatesTitle>
        </UpdatesHeader>
        
        <UpdatesList>
          {totalInvitees > 0 ? (
            <>
              <UpdateItem 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <UpdateIcon>📋</UpdateIcon>
                <UpdateContent>
                  <UpdateText>Dashboard has been refreshed with the latest data</UpdateText>
                  <UpdateTime>Today, 10:30 AM</UpdateTime>
                </UpdateContent>
              </UpdateItem>
              
              <UpdateItem 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <UpdateIcon>✉️</UpdateIcon>
                <UpdateContent>
                  <UpdateText>15 new invitation emails were sent</UpdateText>
                  <UpdateTime>Yesterday, 3:45 PM</UpdateTime>
                </UpdateContent>
              </UpdateItem>
              
              <UpdateItem 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <UpdateIcon>👤</UpdateIcon>
                <UpdateContent>
                  <UpdateText>5 new invitees have confirmed their attendance</UpdateText>
                  <UpdateTime>Apr 26, 2025</UpdateTime>
                </UpdateContent>
              </UpdateItem>
            </>
          ) : (
            <EmptyState>
              <div>📅</div>
              <div>No recent updates to display</div>
            </EmptyState>
          )}
        </UpdatesList>
      </RecentUpdatesContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard;
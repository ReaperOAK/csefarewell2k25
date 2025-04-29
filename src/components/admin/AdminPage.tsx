// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\AdminPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { db } from '../../firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Invitee } from '../../types';
import InviteeList from './InviteeList';
import InviteeForm from './InviteeForm';

const AdminContainer = styled.div`
  min-height: 100vh;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 20px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--accent-color);
`;

const LogoutButton = styled(motion.button)`
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
    border-color: var(--accent-color);
  }
`;

const DashboardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--primary-color);
`;

const LoginForm = styled(motion.form)`
  background-color: rgba(20, 0, 0, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: var(--accent-color);
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  background-color: rgba(0, 0, 0, 0.5);
  color: var(--text-color);
  border-radius: 3px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
  }
`;

const LoginButton = styled(motion.button)`
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
  padding: 10px 15px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--primary-color);
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff5555;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
`;

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled(motion.div)`
  background-color: rgba(20, 0, 0, 0.8);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.h2`
  font-size: 36px;
  color: var(--accent-color);
  margin: 0 0 10px;
`;

const StatLabel = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ErrorSection = styled.div`
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff5555;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ErrorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ErrorTitle = styled.h3`
  color: #ff5555;
  margin: 0;
`;

const RetryButton = styled(motion.button)`
  background-color: transparent;
  border: 1px solid #ff5555;
  color: #ff5555;
  padding: 5px 10px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
`;

const FirestoreErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
`;

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin@cse";
const ADMIN_PASSWORD = "byeseniors";

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitee, setSelectedInvitee] = useState<Invitee | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  
  // Fetch invitees from Firestore - defining this function before it's used in useEffect
  const fetchInvitees = useCallback(async () => {
    try {
      setLoading(true);
      setFirestoreError(null);
      
      const inviteesCollection = collection(db, 'invitees');
      const inviteesSnapshot = await getDocs(inviteesCollection);
      
      const inviteesList: Invitee[] = [];
      inviteesSnapshot.forEach((doc) => {
        inviteesList.push({ id: doc.id, ...doc.data() } as Invitee);
      });
      
      setInvitees(inviteesList);
    } catch (error) {
      console.error('Error fetching invitees:', error);
      setFirestoreError(`Failed to connect to database. ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Check if user is authenticated in local storage
  useEffect(() => {
    const authStatus = localStorage.getItem('cseFarewellAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    // Fetch invitees if authenticated
    if (isAuthenticated) {
      fetchInvitees();
    }
  }, [isAuthenticated, fetchInvitees]);
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('cseFarewellAdminAuth', 'true');
      setError(null);
      fetchInvitees();
    } else {
      setError('Invalid username or password');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cseFarewellAdminAuth');
  };
  
  // Add a new invitee
  const handleAddInvitee = async (invitee: Omit<Invitee, 'id'>) => {
    try {
      setFirestoreError(null);
      const docRef = await addDoc(collection(db, 'invitees'), {
        ...invitee,
        timestamp: serverTimestamp()
      });
      
      // Add the new invitee to the list with the generated ID
      setInvitees([...invitees, { ...invitee, id: docRef.id }]);
      setIsFormOpen(false);
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding invitee:', error);
      setFirestoreError(`Failed to add invitee: ${(error as Error).message}`);
      return { success: false, error };
    }
  };
  
  // Update an existing invitee
  const handleUpdateInvitee = async (invitee: Invitee) => {
    try {
      setFirestoreError(null);
      const inviteeRef = doc(db, 'invitees', invitee.id);
      await updateDoc(inviteeRef, {
        name: invitee.name,
        email: invitee.email,
        phoneNumber: invitee.phoneNumber,
        photoUrl: invitee.photoUrl
      });
      
      // Update the invitee in the list
      setInvitees(invitees.map(i => i.id === invitee.id ? invitee : i));
      setSelectedInvitee(null);
      setIsFormOpen(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating invitee:', error);
      setFirestoreError(`Failed to update invitee: ${(error as Error).message}`);
      return { success: false, error };
    }
  };
  
  // Delete an invitee
  const handleDeleteInvitee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invitee?')) {
      try {
        setFirestoreError(null);
        await deleteDoc(doc(db, 'invitees', id));
        
        // Remove the invitee from the list
        setInvitees(invitees.filter(i => i.id !== id));
        
        return { success: true };
      } catch (error) {
        console.error('Error deleting invitee:', error);
        setFirestoreError(`Failed to delete invitee: ${(error as Error).message}`);
        return { success: false, error };
      }
    }
    return { success: false };
  };
  
  // Open the form to add a new invitee
  const openAddForm = () => {
    setSelectedInvitee(null);
    setIsFormOpen(true);
  };
  
  // Open the form to edit an existing invitee
  const openEditForm = (invitee: Invitee) => {
    setSelectedInvitee(invitee);
    setIsFormOpen(true);
  };

  // Generate invitation URL for an invitee
  const generateInvitationUrl = (id: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/amp-story/${id}`;
  };
  
  // Calculate statistics for the dashboard
  const totalInvitees = invitees.length;
  const totalResponded = invitees.filter(i => i.attending !== null).length;
  const totalAttending = invitees.filter(i => i.attending === true).length;
  const totalDeclined = invitees.filter(i => i.attending === false).length;
  
  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginContainer>
        <LoginForm 
          onSubmit={handleLogin}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoginTitle>ADMIN LOGIN</LoginTitle>
          
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          
          <LoginButton
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </LoginButton>
          
          {error && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
        </LoginForm>
      </LoginContainer>
    );
  }
  
  // Render admin dashboard if authenticated
  return (
    <AdminContainer>
      <Header>
        <Title>OBLIVION - FAREWELL ADMIN</Title>
        <LogoutButton
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </LogoutButton>
      </Header>
      
      <DashboardSection>
        <Dashboard>
          {firestoreError && (
            <ErrorSection>
              <ErrorHeader>
                <ErrorTitle>Database Connection Error</ErrorTitle>
                <RetryButton 
                  onClick={fetchInvitees}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry Connection
                </RetryButton>
              </ErrorHeader>
              <FirestoreErrorMessage>{firestoreError}</FirestoreErrorMessage>
            </ErrorSection>
          )}
          
          <StatsSection>
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatNumber>{totalInvitees}</StatNumber>
              <StatLabel>Total Invitees</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatNumber>{totalResponded}</StatNumber>
              <StatLabel>Responses</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatNumber>{totalAttending}</StatNumber>
              <StatLabel>Attending</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatNumber>{totalDeclined}</StatNumber>
              <StatLabel>Declined</StatLabel>
            </StatCard>
          </StatsSection>
          
          {/* Invitee Management Section */}
          <InviteeList 
            invitees={invitees}
            loading={loading}
            onAddInvitee={openAddForm}
            onEditInvitee={openEditForm}
            onDeleteInvitee={handleDeleteInvitee}
            generateInvitationUrl={generateInvitationUrl}
            refreshList={fetchInvitees}
          />
          
          {/* Invitee Form (Add/Edit) */}
          {isFormOpen && (
            <InviteeForm 
              invitee={selectedInvitee}
              onSubmit={selectedInvitee ? handleUpdateInvitee : handleAddInvitee}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedInvitee(null);
              }}
            />
          )}
        </Dashboard>
      </DashboardSection>
    </AdminContainer>
  );
};

export default AdminPage;
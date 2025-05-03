// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Invitee } from '../../types';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import InviteeList from './InviteeList';
import InviteeModal from './InviteeModal';
import BulkEmailSender from './BulkEmailSender';
import CommentsPage from './CommentsPage';
import Toast from '../common/Toast';
import { sendInvitationEmail } from '../../utils/emailUtils';

const AdminPage: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Content management
  const [currentSection, setCurrentSection] = useState<'dashboard' | 'invitees' | 'emails' | 'comments' | 'settings'>('dashboard');
  
  // Invitee data
  const [invitees, setInvitees] = useState<Invitee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isInviteeModalOpen, setIsInviteeModalOpen] = useState(false);
  const [selectedInvitee, setSelectedInvitee] = useState<Invitee | null>(null);
  
  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Activity tracking
  const [recentActivity, setRecentActivity] = useState<Array<{
    invitee: Invitee;
    action: string;
    timestamp: number;
  }>>([]);
  
  // Check authentication on load
  useEffect(() => {
    const authToken = localStorage.getItem('cseFarewellAdminAuth');
    
    if (authToken) {
      // In a real app, validate the token with the server
      setIsAuthenticated(true);
    }
  }, []);
  
  // Fetch invitees data
  const fetchInvitees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snapshot = await getDocs(collection(db, 'invitees'));
      
      const inviteeData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invitee[];
      
      // Sort by name
      inviteeData.sort((a, b) => a.name.localeCompare(b.name));
      
      setInvitees(inviteeData);
      
      // Generate recent activity
      const activity = inviteeData
        .filter(invitee => invitee.timestamp)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 5)
        .map(invitee => ({
          invitee,
          action: invitee.attending === true 
            ? 'Confirmed attending' 
            : invitee.attending === false 
            ? 'Declined invitation'
            : 'Viewed invitation',
          timestamp: invitee.timestamp || Date.now()
        }));
      
      setRecentActivity(activity);
    } catch (err) {
      console.error('Error fetching invitees:', err);
      setError('Failed to load invitee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvitees();
    }
  }, [isAuthenticated]);
  
  // Handle successful authentication
  const handleLogin = (token: string) => {
    localStorage.setItem('cseFarewellAdminAuth', token);
    setIsAuthenticated(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('cseFarewellAdminAuth');
    setIsAuthenticated(false);
  };
  
  // Open add/edit invitee modal
  const openInviteeModal = (invitee: Invitee | null = null) => {
    setSelectedInvitee(invitee);
    setIsInviteeModalOpen(true);
  };
  
  // Handle add invitee
  const handleAddInvitee = async (inviteeData: Partial<Invitee>) => {
    try {
      // Create a new invitee document
      await addDoc(collection(db, 'invitees'), {
        ...inviteeData,
        attending: null,
        timestamp: serverTimestamp()
      });
      
      // Refresh invitees list
      fetchInvitees();
      
      // Show success message
      setToast({
        message: `${inviteeData.name} has been added successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error adding invitee:', err);
      throw new Error('Failed to add invitee');
    }
  };
  
  // Handle update invitee
  const handleUpdateInvitee = async (inviteeData: Partial<Invitee>) => {
    try {
      if (!inviteeData.id) {
        throw new Error('Invitee ID is required for updates');
      }
      
      // Update the invitee document
      await updateDoc(doc(db, 'invitees', inviteeData.id), {
        ...inviteeData,
        // Don't overwrite these if they exist
        attending: inviteeData.attending ?? null,
      });
      
      // Refresh invitees list
      fetchInvitees();
      
      // Show success message
      setToast({
        message: `${inviteeData.name} has been updated successfully`,
        type: 'success'
      });
    } catch (err) {
      console.error('Error updating invitee:', err);
      throw new Error('Failed to update invitee');
    }
  };
  
  // Handle delete invitee
  const handleDeleteInvitee = async (inviteeId: string) => {
    try {
      // Delete the invitee document
      await deleteDoc(doc(db, 'invitees', inviteeId));
      
      // Refresh invitees list
      fetchInvitees();
    } catch (err) {
      console.error('Error deleting invitee:', err);
      throw new Error('Failed to delete invitee');
    }
  };
  
  // Handle copy invite link
  const handleCopyInviteLink = (inviteeId: string) => {
    const inviteUrl = `${window.location.origin}/invitation/${inviteeId}`;
    
    navigator.clipboard.writeText(inviteUrl)
      .then(() => {
        setToast({
          message: 'Invitation link copied to clipboard',
          type: 'success'
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        setToast({
          message: 'Failed to copy invitation link',
          type: 'error'
        });
      });
  };
  
  // Handle send email
  const handleSendEmail = async (inviteeId: string) => {
    try {
      // Get the invitee data
      const inviteeDoc = await getDoc(doc(db, 'invitees', inviteeId));
      
      if (!inviteeDoc.exists()) {
        throw new Error('Invitee not found');
      }
      
      const inviteeData = { id: inviteeDoc.id, ...inviteeDoc.data() } as Invitee;
      
      if (!inviteeData.email) {
        throw new Error('Invitee does not have an email address');
      }
      
      // Send the email
      await sendInvitationEmail(inviteeData);
      
      setToast({
        message: `Email sent successfully to ${inviteeData.name}`,
        type: 'success'
      });
    } catch (error: any) {
      console.error('Failed to send email:', error);
      setToast({
        message: error.message || 'Failed to send email',
        type: 'error'
      });
    }
  };
  
  // Handle bulk email sending
  const handleBulkEmailSend = async (inviteeIds: string[]): Promise<void> => {
    try {
      // Record that emails were sent
      for (const inviteeId of inviteeIds) {
        // Update the invitee document to record that an email was sent
        await updateDoc(doc(db, 'invitees', inviteeId), {
          emailSent: true,
          emailSentTimestamp: serverTimestamp()
        });
      }
      
      // Refresh the invitees list to update UI
      await fetchInvitees();
      
      // Return void instead of boolean
    } catch (error) {
      console.error('Error recording email status:', error);
      throw new Error('Failed to update email records');
    }
  };
  
  // Calculate stats
  const totalInvitees = invitees.length;
  const totalResponded = invitees.filter(i => i.attending !== null).length;
  const totalAttending = invitees.filter(i => i.attending === true).length;
  const totalDeclined = invitees.filter(i => i.attending === false).length;
  
  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  // Render appropriate content based on current section
  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Dashboard
            totalInvitees={totalInvitees}
            totalResponded={totalResponded}
            totalAttending={totalAttending}
            totalDeclined={totalDeclined}
            recentActivity={recentActivity}
          />
        );
        
      case 'invitees':
        return (
          <InviteeList 
            invitees={invitees}
            loading={loading}
            onAddInvitee={() => openInviteeModal()}
            onEditInvitee={openInviteeModal}
            onDeleteInvitee={handleDeleteInvitee}
            onCopyInviteLink={handleCopyInviteLink}
            onSendEmail={handleSendEmail}
            onRefresh={fetchInvitees}
          />
        );
        
      case 'emails':
        return (
          <BulkEmailSender
            invitees={invitees}
            loading={loading}
            onSendEmails={handleBulkEmailSend}
          />
        );

      case 'comments':
        return (
          <CommentsPage
            invitees={invitees}
            loading={loading}
          />
        );
        
      case 'settings':
        return (
          <div>
            <h2>Settings</h2>
            <p>Settings panel coming soon.</p>
          </div>
        );
        
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };
  
  return (
    <>
      <AdminLayout
        title={
          currentSection === 'dashboard' ? 'Dashboard' :
          currentSection === 'invitees' ? 'Manage Invitees' :
          currentSection === 'emails' ? 'Send Emails' :
          currentSection === 'comments' ? 'Comments' :
          'Settings'
        }
        currentPage={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={handleLogout}
        onAddClick={() => openInviteeModal()}
        showAddButton={currentSection === 'invitees'}
      >
        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '1rem',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid #F44336',
            borderRadius: '4px'
          }}>
            <h3 style={{ color: '#F44336', margin: '0 0 0.5rem' }}>Error</h3>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}
        
        {renderContent()}
      </AdminLayout>
      
      {/* Invitee Modal */}
      <InviteeModal 
        invitee={selectedInvitee}
        isOpen={isInviteeModalOpen}
        onClose={() => setIsInviteeModalOpen(false)}
        onSubmit={selectedInvitee ? handleUpdateInvitee : handleAddInvitee}
      />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default AdminPage;
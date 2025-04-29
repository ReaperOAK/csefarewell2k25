import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: rgba(15, 15, 15, 0.9);
  border-right: 1px solid rgba(212, 175, 55, 0.3);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
`;

const Logo = styled.div`
  margin-bottom: 3rem;
  padding: 0 1.5rem;
  
  h1 {
    font-family: 'Unbounded', sans-serif;
    font-size: 1.5rem;
    color: var(--gold);
    margin: 0;
  }
  
  span {
    display: block;
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.7;
  }
`;

const Navigation = styled.nav`
  flex: 1;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const NavLink = styled(motion.button)<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: ${props => props.$active ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  color: ${props => props.$active ? 'var(--gold)' : 'var(--text)'};
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--gold);
    transform: scaleY(${props => props.$active ? 1 : 0});
    transition: transform 0.2s ease;
  }
  
  &:hover {
    background-color: rgba(212, 175, 55, 0.05);
    
    &::before {
      transform: scaleY(0.6);
    }
  }
`;

const Icon = styled.span`
  margin-right: 0.75rem;
  font-size: 1.2rem;
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  margin: 1rem;
  background-color: transparent;
  color: var(--text);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(212, 175, 55, 0.05);
  }
`;

interface AdminSidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection
}) => {
  // Navigation items with icons
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'invitees', label: 'Invitee Management', icon: '👥' },
    { id: 'emails', label: 'Send Invitations', icon: '✉️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];
  
  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    onSelectSection(sectionId);
  };
  
  // Handle logout (in a real app, this would call an auth service)
  const handleLogout = () => {
    // In a real app, this would log the user out
    console.log('Logout clicked');
  };
  
  return (
    <SidebarContainer>
      <Logo>
        <h1>OBLIVION</h1>
        <span>Admin Panel</span>
      </Logo>
      
      <Navigation>
        <NavMenu>
          {navItems.map(item => (
            <NavItem key={item.id}>
              <NavLink
                $active={activeSection === item.id}
                onClick={() => handleSectionChange(item.id)}
                whileTap={{ scale: 0.98 }}
              >
                <Icon>{item.icon}</Icon>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavMenu>
      </Navigation>
      
      <LogoutButton
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon>🚪</Icon>
        Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default AdminSidebar;
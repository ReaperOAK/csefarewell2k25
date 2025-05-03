import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled components for AdminLayout
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg);
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: #0a0a0a;
  border-right: 1px solid rgba(212, 175, 55, 0.2);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
`;

const LogoText = styled.h2`
  font-family: 'Unbounded', sans-serif;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const NavLink = styled(motion.a)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  margin: 0.3rem 0;
  color: ${props => props.$active ? 'var(--gold)' : 'var(--text)'};
  font-family: 'Montserrat', sans-serif;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1.5rem;
    height: 2px;
    width: ${props => props.$active ? '40px' : '0'};
    background-color: var(--gold);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 40px;
  }
`;

const NavIcon = styled.span`
  margin-right: 10px;
  font-size: 1.2rem;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  color: var(--gold);
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
`;

const LogoutButton = styled(motion.button)`
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  border: 1px solid rgba(212, 175, 55, 0.6);
  color: var(--text);
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
`;

// Admin Layout component
interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  currentPage: 'dashboard' | 'invitees' | 'emails' | 'comments' | 'settings';
  onSectionChange: (section: 'dashboard' | 'invitees' | 'emails' | 'comments' | 'settings') => void;
  onLogout: () => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  currentPage,
  onSectionChange,
  onLogout,
  onAddClick,
  showAddButton = false
}) => {
  const navTo = (page: string) => {
    const section = page === '' ? 'dashboard' : page as 'dashboard' | 'invitees' | 'emails' | 'comments' | 'settings';
    onSectionChange(section);
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>
          <LogoText>OBLIVION</LogoText>
        </Logo>
        
        <Nav>
          <NavLink 
            $active={currentPage === 'dashboard'} 
            onClick={() => navTo('')}
          >
            <NavIcon>📊</NavIcon> Dashboard
          </NavLink>
          
          <NavLink 
            $active={currentPage === 'invitees'} 
            onClick={() => navTo('invitees')}
          >
            <NavIcon>👥</NavIcon> Invitees
          </NavLink>
          
          <NavLink 
            $active={currentPage === 'emails'} 
            onClick={() => navTo('emails')}
          >
            <NavIcon>✉️</NavIcon> Send Emails
          </NavLink>
          
          <NavLink 
            $active={currentPage === 'comments'} 
            onClick={() => navTo('comments')}
          >
            <NavIcon>💬</NavIcon> Comments
          </NavLink>
          
          <NavLink 
            $active={currentPage === 'settings'} 
            onClick={() => navTo('settings')}
          >
            <NavIcon>⚙️</NavIcon> Settings
          </NavLink>
        </Nav>
      </Sidebar>
      
      <Content>
        <Header>
          <PageTitle>{title}</PageTitle>
          
          <HeaderControls>
            {showAddButton && (
              <AddButton
                onClick={onAddClick}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                + Add Invitee
              </AddButton>
            )}
            
            <LogoutButton
              onClick={onLogout}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </LogoutButton>
          </HeaderControls>
        </Header>
        
        {children}
      </Content>
    </LayoutContainer>
  );
};

export default AdminLayout;
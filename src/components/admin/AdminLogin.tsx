// filepath: c:\Owais\farewell 2025\csefarewell2k25\src\components\admin\AdminLogin.tsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoginContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--primary-color);
  padding: 20px;
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

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: var(--accent-color);
  text-shadow: var(--text-shadow);
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
  
  &:disabled {
    background-color: #444;
    border-color: #666;
    color: #999;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff5555;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
`;

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LoginForm 
        onSubmit={handleSubmit}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Title>OBLIVION ADMIN</Title>
        
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="username"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />
        </InputGroup>
        
        <LoginButton
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? 'Logging in...' : 'Sign In'}
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
};

export default AdminLogin;
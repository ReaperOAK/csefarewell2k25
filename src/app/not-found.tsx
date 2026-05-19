'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-family: 'Unbounded', sans-serif;
  font-size: 5rem;
  color: var(--crimson);
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
`;

const Subtitle = styled.p`
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin-bottom: 2rem;
`;

const HomeButton = styled.button`
  padding: 1rem 2rem;
  background: transparent;
  color: var(--gold);
  border: 1px solid var(--gold);
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(212, 175, 55, 0.2);
    transform: scale(1.05);
  }
`;

export default function NotFound() {
  const router = useRouter();
  
  return (
    <Container>
      <Title>404</Title>
      <Subtitle>This path does not exist in our realm</Subtitle>
      <HomeButton onClick={() => router.push('/')}>
        Return to OBLIVION
      </HomeButton>
    </Container>
  );
}
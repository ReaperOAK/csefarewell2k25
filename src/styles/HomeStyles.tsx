import styled from 'styled-components';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  position: relative;
`;

export const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 3rem;
  text-transform: uppercase;
  animation: fadeIn 2s ease-in-out;
`;

export const Subtitle = styled.h2`
  margin-bottom: 3rem;
  font-size: 1.5rem;
  animation: fadeIn 2.5s ease-in-out;
`;

export const Button = styled.a`
  background-color: var(--secondary-color);
  color: var(--text-color);
  text-decoration: none;
  padding: 15px 30px;
  margin: 20px 0;
  border: 1px solid var(--accent-color);
  font-family: 'Copperplate Gothic', serif;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeIn 3s ease-in-out;
  
  &:hover {
    background-color: var(--accent-color);
    color: var(--primary-color);
    transform: scale(1.05);
  }
`;

export const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.7;
`;
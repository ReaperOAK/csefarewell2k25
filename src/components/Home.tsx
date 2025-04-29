import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  position: relative;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  font-size: 3rem;
  text-transform: uppercase;
  animation: fadeIn 2s ease-in-out;
`;

const Subtitle = styled.h2`
  margin-bottom: 3rem;
  font-size: 1.5rem;
  animation: fadeIn 2.5s ease-in-out;
`;

const Button = styled(Link)`
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

const VideoBackground = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.7;
`;

const Home: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const videos = [
    '/black_with_drifting_golden_ember_particles_looped.mp4',
    '/looping_3_second_vaporous_smoke_swirling_into_a.mp4',
    '/full_screen_looped_video_of_gently_swirling_silver.mp4',
    '/pan_loop_of_a_dimly_lit_gothic_ballroom.mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 30000); // Change video every 30 seconds

    return () => clearInterval(interval);
  }, [videos.length]);

  return (
    <HomeContainer>
      <VideoBackground autoPlay muted loop key={currentVideoIndex}>
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>
      
      <Title>OBLIVION</Title>
      <Subtitle>Presented by CSE Juniors</Subtitle>
      
      <Button to="/invitation">Enter If You Dare</Button>
    </HomeContainer>
  );
};

export default Home;
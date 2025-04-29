import React from 'react';
import { ParticleContainer, Particle } from '../../styles/InvitationStyles';

const ParticleEffect: React.FC = () => {
  // Create gold diamond particles
  const particles = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    size: 5 + Math.random() * 8,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 20,
    x: Math.random() * 100
  }));

  return (
    <ParticleContainer>
      {particles.map(particle => (
        <Particle 
          key={particle.id}
          size={particle.size}
          delay={particle.delay}
          duration={particle.duration}
          x={particle.x}
        />
      ))}
    </ParticleContainer>
  );
};

export default ParticleEffect;
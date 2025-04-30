import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import useParallax from '../../hooks/useParallax';

// Styled components
const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

interface ShapeProps {
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: 'circle' | 'triangle' | 'square' | 'hexagon' | 'icosahedron' | 'star' | 'diamond';
  parallaxStrength: number;
  rotationSpeed: number;
  moveSpeed: number;
  moveDirection: number;
  pulseSpeed: number;
  glowIntensity: number;
}

interface ShapeCanvasProps {
  shapeCount?: number;
  opacity?: number;
}

const ShapeCanvas: React.FC<ShapeCanvasProps> = ({
  shapeCount = 15,
  opacity = 0.5
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { mousePosX, mousePosY } = useParallax(0.05);
  const { colors } = useTheme();
  const animationFrameIds = useRef<number[]>([]);

  // Generate random shapes
  const shapes = useRef<ShapeProps[]>([]);
  
  useEffect(() => {
    // Generate shapes on component mount
    shapes.current = Array.from({ length: shapeCount }, () => {
      // Random shape type
      const shapeTypes: ShapeProps['type'][] = [
        'circle', 'triangle', 'square', 'hexagon', 'icosahedron', 'star', 'diamond'
      ];
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      // Random position, size, and rotation
      return {
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 100 + 50, // 50-150px
        rotation: Math.random() * 360, // degrees
        type,
        parallaxStrength: Math.random() * 30 + 5, // 5-35
        rotationSpeed: (Math.random() * 0.2 + 0.05) * (Math.random() < 0.5 ? 1 : -1), // -0.25 to 0.25
        moveSpeed: Math.random() * 0.05 + 0.02, // 0.02-0.07
        moveDirection: Math.random() * Math.PI * 2, // 0-2π radians
        pulseSpeed: Math.random() * 0.01 + 0.005, // 0.005-0.015
        glowIntensity: Math.random() * 3 + 1 // 1-4
      };
    });
  }, [shapeCount]);
  
  useEffect(() => {
    // Only run in browser, not during SSR
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear canvas and animation frames
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    
    animationFrameIds.current.forEach(id => cancelAnimationFrame(id));
    animationFrameIds.current = [];
    
    // Create each shape as an SVG
    shapes.current.forEach(shape => {
      const svgNS = "http://www.w3.org/2000/svg";
      
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", `${shape.size}px`);
      svg.setAttribute("height", `${shape.size}px`);
      svg.setAttribute("viewBox", "0 0 100 100");
      
      let shapeElement;
      let glowFilter: SVGFilterElement;
      
      // Add filter for glow effect
      const defs = document.createElementNS(svgNS, "defs");
      glowFilter = document.createElementNS(svgNS, "filter");
      glowFilter.setAttribute("id", `glow-${Math.random().toString(36).substring(2, 11)}`);
      
      const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
      feGaussianBlur.setAttribute("stdDeviation", "2");
      feGaussianBlur.setAttribute("result", "blur");
      
      const feColorMatrix = document.createElementNS(svgNS, "feColorMatrix");
      feColorMatrix.setAttribute("in", "blur");
      feColorMatrix.setAttribute("type", "matrix");
      feColorMatrix.setAttribute("values", "0 0 0 0 1   0 0 0 0 0.8   0 0 0 0 0.3  0 0 0 3 0");
      
      const feMerge = document.createElementNS(svgNS, "feMerge");
      const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
      const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
      feMergeNode2.setAttribute("in", "SourceGraphic");
      
      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);
      
      glowFilter.appendChild(feGaussianBlur);
      glowFilter.appendChild(feColorMatrix);
      glowFilter.appendChild(feMerge);
      defs.appendChild(glowFilter);
      svg.appendChild(defs);
      
      switch (shape.type) {
        case 'circle':
          shapeElement = document.createElementNS(svgNS, "circle");
          shapeElement.setAttribute("cx", "50");
          shapeElement.setAttribute("cy", "50");
          shapeElement.setAttribute("r", "45");
          break;
          
        case 'triangle':
          shapeElement = document.createElementNS(svgNS, "polygon");
          shapeElement.setAttribute("points", "50,10 90,90 10,90");
          break;
          
        case 'square':
          shapeElement = document.createElementNS(svgNS, "rect");
          shapeElement.setAttribute("x", "10");
          shapeElement.setAttribute("y", "10");
          shapeElement.setAttribute("width", "80");
          shapeElement.setAttribute("height", "80");
          break;
          
        case 'hexagon':
          shapeElement = document.createElementNS(svgNS, "polygon");
          shapeElement.setAttribute("points", "50,10 90,30 90,70 50,90 10,70 10,30");
          break;
          
        case 'icosahedron':
          // Simplify icosahedron as a more complex polygon
          shapeElement = document.createElementNS(svgNS, "polygon");
          shapeElement.setAttribute("points", "50,10 85,30 85,70 50,90 15,70 15,30");
          const innerLine1 = document.createElementNS(svgNS, "line");
          innerLine1.setAttribute("x1", "50");
          innerLine1.setAttribute("y1", "10");
          innerLine1.setAttribute("x2", "50");
          innerLine1.setAttribute("y2", "90");
          innerLine1.setAttribute("stroke", colors.gold);
          innerLine1.setAttribute("stroke-width", "1");
          innerLine1.setAttribute("stroke-opacity", String(opacity));
          
          const innerLine2 = document.createElementNS(svgNS, "line");
          innerLine2.setAttribute("x1", "15");
          innerLine2.setAttribute("y1", "50");
          innerLine2.setAttribute("x2", "85");
          innerLine2.setAttribute("y2", "50");
          innerLine2.setAttribute("stroke", colors.gold);
          innerLine2.setAttribute("stroke-width", "1");
          innerLine2.setAttribute("stroke-opacity", String(opacity));
          
          svg.appendChild(innerLine1);
          svg.appendChild(innerLine2);
          break;
          
        case 'star':
          shapeElement = document.createElementNS(svgNS, "polygon");
          // Create a 5-pointed star
          const starPoints = [];
          for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? 45 : 20;
            const angle = Math.PI * i / 5;
            const x = 50 + radius * Math.sin(angle);
            const y = 50 - radius * Math.cos(angle);
            starPoints.push(`${x},${y}`);
          }
          shapeElement.setAttribute("points", starPoints.join(' '));
          break;
          
        case 'diamond':
          shapeElement = document.createElementNS(svgNS, "polygon");
          shapeElement.setAttribute("points", "50,10 90,50 50,90 10,50");
          break;
      }
      
      if (shapeElement) {
        shapeElement.setAttribute("fill", "none");
        shapeElement.setAttribute("stroke", colors.gold);
        shapeElement.setAttribute("stroke-width", "1");
        shapeElement.setAttribute("stroke-opacity", String(opacity));
        shapeElement.setAttribute("filter", `url(#${glowFilter.getAttribute('id')})`);
        svg.appendChild(shapeElement);
      }
      
      // Position the SVG absolutely
      const svgWrapper = document.createElement("div");
      svgWrapper.style.position = "absolute";
      svgWrapper.style.left = `${shape.x}%`;
      svgWrapper.style.top = `${shape.y}%`;
      svgWrapper.style.transform = `translate(-50%, -50%) rotate(${shape.rotation}deg)`;
      svgWrapper.style.transformOrigin = "center";
      svgWrapper.style.transition = "opacity 0.5s ease";
      
      // Add complex animation with JavaScript
      let angle = shape.rotation;
      let scale = 1;
      let scaleDirection = 1;
      let posX = shape.x;
      let posY = shape.y;
      let glowStrength = 2;
      let glowDirection = 1;
      
      const animate = () => {
        // Rotation
        angle += shape.rotationSpeed;
        
        // Pulsation (scale)
        if (scale > 1.1) scaleDirection = -1;
        else if (scale < 0.9) scaleDirection = 1;
        scale += shape.pulseSpeed * scaleDirection;
        
        // Glow effect animation
        if (glowStrength > shape.glowIntensity + 1) glowDirection = -1;
        else if (glowStrength < shape.glowIntensity - 1) glowDirection = 1;
        glowStrength += 0.02 * glowDirection;
        
        // Adjust the blur value in the filter
        if (glowFilter && glowFilter.querySelector('feGaussianBlur')) {
          const blur = glowFilter.querySelector('feGaussianBlur') as SVGElement;
          blur.setAttribute('stdDeviation', String(glowStrength));
        }
        
        // Movement
        posX += Math.cos(shape.moveDirection) * shape.moveSpeed;
        posY += Math.sin(shape.moveDirection) * shape.moveSpeed;
        
        // Wrap around edges
        if (posX < -10) posX = 110;
        if (posX > 110) posX = -10;
        if (posY < -10) posY = 110;
        if (posY > 110) posY = -10;
        
        // Apply parallax effect
        const translateX = (mousePosX * shape.parallaxStrength) / 100;
        const translateY = (mousePosY * shape.parallaxStrength) / 100;
        
        // Update element style
        svgWrapper.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) rotate(${angle}deg) scale(${scale})`;
        svgWrapper.style.left = `${posX}%`;
        svgWrapper.style.top = `${posY}%`;
        
        // Continue animation
        const frameId = requestAnimationFrame(animate);
        animationFrameIds.current.push(frameId);
      };
      
      const frameId = requestAnimationFrame(animate);
      animationFrameIds.current.push(frameId);
      
      svgWrapper.appendChild(svg);
      canvas.appendChild(svgWrapper);
    });
    
    // Add small particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '2px';
      particle.style.height = '2px';
      particle.style.backgroundColor = colors.gold;
      particle.style.borderRadius = '50%';
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Animate particles
      let particlePosX = parseFloat(particle.style.left);
      let particlePosY = parseFloat(particle.style.top);
      const particleSpeed = Math.random() * 0.03 + 0.01;
      const particleDirection = Math.random() * Math.PI * 2;
      const particleOpacityMin = parseFloat(particle.style.opacity) - 0.1;
      const particleOpacityMax = parseFloat(particle.style.opacity) + 0.1;
      let particleOpacity = parseFloat(particle.style.opacity);
      let particleOpacityDirection = Math.random() < 0.5 ? 1 : -1;
      
      const animateParticle = () => {
        // Movement
        particlePosX += Math.cos(particleDirection) * particleSpeed;
        particlePosY += Math.sin(particleDirection) * particleSpeed;
        
        // Wrap around edges
        if (particlePosX < -1) particlePosX = 101;
        if (particlePosX > 101) particlePosX = -1;
        if (particlePosY < -1) particlePosY = 101;
        if (particlePosY > 101) particlePosY = -1;
        
        // Opacity pulsing
        particleOpacity += 0.005 * particleOpacityDirection;
        if (particleOpacity >= particleOpacityMax) particleOpacityDirection = -1;
        if (particleOpacity <= particleOpacityMin) particleOpacityDirection = 1;
        
        // Apply parallax
        const translateX = (mousePosX * 5) / 100;
        const translateY = (mousePosY * 5) / 100;
        
        // Update element style
        particle.style.transform = `translate(${translateX}px, ${translateY}px)`;
        particle.style.left = `${particlePosX}%`;
        particle.style.top = `${particlePosY}%`;
        particle.style.opacity = String(particleOpacity);
        
        // Continue animation
        const frameId = requestAnimationFrame(animateParticle);
        animationFrameIds.current.push(frameId);
      };
      
      const frameId = requestAnimationFrame(animateParticle);
      animationFrameIds.current.push(frameId);
      
      canvas.appendChild(particle);
    }
    
    // Cleanup function
    return () => {
      animationFrameIds.current.forEach(id => cancelAnimationFrame(id));
      animationFrameIds.current = [];
      
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
    };
  }, [mousePosX, mousePosY, colors.gold, opacity]);
  
  return <CanvasContainer ref={canvasRef} />;
};

export default ShapeCanvas;
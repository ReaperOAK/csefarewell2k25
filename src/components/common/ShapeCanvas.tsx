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
  type: 'circle' | 'triangle' | 'square' | 'hexagon' | 'icosahedron';
  parallaxStrength: number;
  rotationSpeed: number;
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

  // Generate random shapes
  const shapes = useRef<ShapeProps[]>([]);
  
  useEffect(() => {
    // Generate shapes on component mount
    shapes.current = Array.from({ length: shapeCount }, () => {
      // Random shape type
      const shapeTypes: ShapeProps['type'][] = ['circle', 'triangle', 'square', 'hexagon', 'icosahedron'];
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      
      // Random position, size, and rotation
      return {
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 100 + 50, // 50-150px
        rotation: Math.random() * 360, // degrees
        type,
        parallaxStrength: Math.random() * 30 + 5, // 5-35
        rotationSpeed: (Math.random() * 0.2 + 0.05) * (Math.random() < 0.5 ? 1 : -1) // -0.25 to 0.25
      };
    });
  }, [shapeCount]);
  
  useEffect(() => {
    // Only run in browser, not during SSR
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear canvas
    while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
    }
    
    // Create each shape as an SVG
    shapes.current.forEach(shape => {
      const svgNS = "http://www.w3.org/2000/svg";
      
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", `${shape.size}px`);
      svg.setAttribute("height", `${shape.size}px`);
      svg.setAttribute("viewBox", "0 0 100 100");
      
      let shapeElement;
      
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
      }
      
      if (shapeElement) {
        shapeElement.setAttribute("fill", "none");
        shapeElement.setAttribute("stroke", colors.gold);
        shapeElement.setAttribute("stroke-width", "1");
        shapeElement.setAttribute("stroke-opacity", String(opacity));
        svg.appendChild(shapeElement);
      }
      
      // Position the SVG absolutely
      const svgWrapper = document.createElement("div");
      svgWrapper.style.position = "absolute";
      svgWrapper.style.left = `${shape.x}%`;
      svgWrapper.style.top = `${shape.y}%`;
      svgWrapper.style.transform = `translate(-50%, -50%) rotate(${shape.rotation}deg)`;
      svgWrapper.style.transformOrigin = "center";
      
      // Add animation with JavaScript rather than CSS to allow differing speeds
      let angle = shape.rotation;
      const animate = () => {
        angle += shape.rotationSpeed;
        const translateX = (mousePosX * shape.parallaxStrength) / 100;
        const translateY = (mousePosY * shape.parallaxStrength) / 100;
        svgWrapper.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) rotate(${angle}deg)`;
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
      
      svgWrapper.appendChild(svg);
      canvas.appendChild(svgWrapper);
    });
    
    // Cleanup function
    return () => {
      while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
      }
    };
  }, [mousePosX, mousePosY, colors.gold, opacity]);
  
  return <CanvasContainer ref={canvasRef} />;
};

export default ShapeCanvas;
import React from 'react';
import logoImage from '../assets/logo.jpg';

interface LogoSVGProps {
  width?: number;
  height?: number;
  className?: string;
}

const LogoSVG: React.FC<LogoSVGProps> = ({ width = 200, height = 200, className }) => {
  return (
    <img 
      src={logoImage} 
      alt="Shifra Logo" 
      width={width} 
      height={height}
      className={`object-cover ${className || ''}`}
      style={{ borderRadius: '50%' }}
    />
  );
};

export default LogoSVG;

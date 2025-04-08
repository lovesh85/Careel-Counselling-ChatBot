import React from 'react';

interface LogoSVGProps {
  width?: number;
  height?: number;
  className?: string;
}

const LogoSVG: React.FC<LogoSVGProps> = ({ width = 200, height = 200, className }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="100" cy="100" r="95" fill="#000000" stroke="rgba(201, 41, 116, 0.5)" strokeWidth="5" />
      <g>
        <path d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20Z" fill="#000000" />
        <path d="M140 80C140 69 131 60 120 60H100V100H120C131 100 140 91 140 80Z" fill="#1591CF" />
        <path d="M100 140V100H80C69 100 60 109 60 120C60 131 69 140 80 140H100Z" fill="#C92974" />
        <path d="M80 60H60V80C60 91 69 100 80 100V60Z" fill="#C92974" opacity="0.7" />
        <path d="M120 140C131 140 140 131 140 120V100H120V140Z" fill="#1591CF" opacity="0.7" />
        <path fillRule="evenodd" clipRule="evenodd" d="M100 170C139.8 170 172 137.8 172 98C172 58.2 139.8 26 100 26C60.2 26 28 58.2 28 98C28 137.8 60.2 170 100 170ZM100 180C145.3 180 182 143.3 182 98C182 52.7 145.3 16 100 16C54.7 16 18 52.7 18 98C18 143.3 54.7 180 100 180Z" fill="url(#gradient)" />
      </g>
      <defs>
        <linearGradient id="gradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1591CF" />
          <stop offset="1" stopColor="#C92974" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LogoSVG;

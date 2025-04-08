import React from 'react';

interface VoiceWaveSVGProps {
  width?: number;
  height?: number;
  className?: string;
  isActive?: boolean;
}

const VoiceWaveSVG: React.FC<VoiceWaveSVGProps> = ({ 
  width = 100, 
  height = 100, 
  className,
  isActive = false
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        stroke="rgba(43, 206, 212, 0.6)" 
        strokeWidth="2" 
        fill="rgba(43, 206, 212, 0.1)" 
      />
      
      {/* Animated glowing effect */}
      <circle 
        cx="50" 
        cy="50" 
        r="47" 
        stroke="rgba(43, 206, 212, 0.3)" 
        strokeWidth="1" 
        fill="none"
        opacity={isActive ? "1" : "0.5"}
        style={{
          animation: isActive ? "pulse 1.5s ease-in-out infinite" : "none"
        }}
      />
      
      {/* Animated inner circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="30" 
        stroke="rgba(43, 206, 212, 0.8)" 
        strokeWidth="3" 
        fill="rgba(43, 206, 212, 0.2)"
        opacity={isActive ? "1" : "0.7"}
        style={{
          animation: isActive ? "pulse 1.5s ease-in-out infinite alternate" : "none"
        }}
      />
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
        }
      `}</style>
    </svg>
  );
};

export default VoiceWaveSVG;

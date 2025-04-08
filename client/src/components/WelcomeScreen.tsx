import React from 'react';
import { Button } from '@/components/ui/button';
import LogoSVG from './LogoSVG';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-10 bg-black text-white p-5">
      <LogoSVG 
        width={240} 
        height={240} 
        className="shadow-glow"
      />
      
      <h1 className="font-bold text-4xl md:text-5xl max-w-3xl leading-tight">
        Hello there, I'm your career counseling assistant
        <span className="bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent block md:inline"> SHIFRA</span>
      </h1>
      
      <Button 
        onClick={onStart}
        className="px-10 py-6 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-white text-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        Start Chat
      </Button>
    </div>
  );
};

export default WelcomeScreen;

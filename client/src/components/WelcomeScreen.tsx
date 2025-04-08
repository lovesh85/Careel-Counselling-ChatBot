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
        width={200} 
        height={200} 
        className="border-4 border-[rgba(201,41,116,0.5)] shadow-[0_0_30px_rgba(21,145,207,0.7)] rounded-full"
      />
      
      <h1 className="font-['Protest_Guerrilla',sans-serif] text-4xl md:text-5xl max-w-3xl leading-tight">
        Hello there, I'm your career counseling assistant 
        <span className="text-[#D42B7A]"> SHIFRA</span>
      </h1>
      
      <Button 
        onClick={onStart}
        className="px-10 py-6 bg-gradient-to-r from-[#1591CF] to-[#C92974] rounded-full text-white text-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        Start Chat
      </Button>
    </div>
  );
};

export default WelcomeScreen;

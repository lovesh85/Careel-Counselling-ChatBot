import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import LogoSVG from '../components/LogoSVG';
import VoiceWaveSVG from '../components/VoiceWaveSVG';
import { Mic } from 'lucide-react';
import { Link } from 'wouter';
import { getGeminiResponse } from '../lib/gemini';
import { ChatMessage } from '../types';

const VirtualAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  
  // Start speech recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse('');
    };
    
    recognitionRef.current.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      
      // Process the transcript with Gemini
      const messages: ChatMessage[] = [
        {
          id: 1,
          chatId: 0,
          content: text,
          role: 'user',
          timestamp: new Date().toISOString()
        }
      ];
      
      try {
        const aiResponse = await getGeminiResponse(messages);
        setResponse(aiResponse);
        
        // Text-to-speech
        if ('speechSynthesis' in window) {
          const speech = new SpeechSynthesisUtterance(aiResponse);
          speech.lang = 'en-US';
          speech.rate = 1;
          speech.pitch = 1;
          window.speechSynthesis.speak(speech);
        }
      } catch (error) {
        console.error('Error getting response:', error);
        setResponse("I'm sorry, I encountered an error processing your request. Please try again.");
      }
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Error in speech recognition:', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };
  
  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center gap-8 flex-col p-6">
      <LogoSVG 
        width={150} 
        height={150} 
        className="border-3 border-[rgba(201,41,116,0.5)] shadow-[0_0_20px_rgba(21,145,207,0.5)] rounded-full"
      />
      
      <h1 className="text-white text-center font-['Protest_Guerrilla',sans-serif] text-2xl md:text-4xl">
        I'm <span className="text-[#D42B7A] text-3xl md:text-5xl">Shifra</span>, 
        Your <span className="text-[#2BCED4] text-3xl md:text-5xl">Virtual Assistant</span>
      </h1>
      
      {/* Voice visualization */}
      <VoiceWaveSVG 
        width={100} 
        height={100} 
        isActive={isListening} 
        className={isListening ? 'opacity-100' : 'opacity-0'}
      />
      
      {/* Transcript and response */}
      {transcript && (
        <div className="bg-[#202123]/50 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-[#8E8E9E] text-sm mb-2">You said:</h3>
          <p className="text-white">{transcript}</p>
        </div>
      )}
      
      {response && (
        <div className="bg-[#444654]/50 p-4 rounded-lg max-w-md w-full">
          <h3 className="text-[#8E8E9E] text-sm mb-2">Shifra's response:</h3>
          <p className="text-white">{response}</p>
        </div>
      )}
      
      {/* Voice control button */}
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`w-[250px] ${
          isListening 
            ? 'bg-[#C92974] hover:bg-[#C92974]/90' 
            : 'bg-gradient-to-r from-[#1591CF] to-[#C92974]'
        } py-3 flex items-center justify-center gap-3 text-white rounded-full shadow-lg transition-all`}
      >
        <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
        <span>{isListening ? 'Listening...' : 'Click to talk with me'}</span>
      </Button>
      
      {/* Back to chat link */}
      <Link href="/">
        <a className="text-[#1591CF] text-sm hover:underline mt-4">
          Return to chat interface
        </a>
      </Link>
    </div>
  );
};

export default VirtualAssistant;

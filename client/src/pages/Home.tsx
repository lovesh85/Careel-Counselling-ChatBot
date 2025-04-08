import React, { useState } from 'react';
import { useLocation } from 'wouter';
import WelcomeScreen from '../components/WelcomeScreen';
import Navbar from '../components/Navbar';
import ChatInterface from '../components/ChatInterface';
import { useParams } from 'wouter';

const Home: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [, navigate] = useLocation();
  const params = useParams<{ id?: string }>();
  const chatId = params?.id ? parseInt(params.id) : undefined;
  
  // Handle start button click
  const handleStart = () => {
    setShowWelcome(false);
  };
  
  // Handle new chat button click
  const handleNewChat = () => {
    navigate('/');
  };
  
  // Handle chat creation
  const handleChatCreated = (id: number) => {
    navigate(`/chat/${id}`);
  };
  
  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <div className="h-screen flex flex-col bg-black text-white">
          <Navbar onNewChat={handleNewChat} activeChatId={chatId} />
          <div className="flex-1 overflow-hidden">
            <ChatInterface 
              chatId={chatId} 
              onChatCreated={handleChatCreated} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

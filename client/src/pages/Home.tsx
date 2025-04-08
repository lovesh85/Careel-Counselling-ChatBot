import React, { useState } from 'react';
import { useLocation } from 'wouter';
import WelcomeScreen from '../components/WelcomeScreen';
import Sidebar from '../components/Sidebar';
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
        <div className="h-screen flex flex-col md:flex-row bg-black text-white">
          <Sidebar onNewChat={handleNewChat} activeChatId={chatId} />
          <ChatInterface 
            chatId={chatId} 
            onChatCreated={handleChatCreated} 
          />
        </div>
      )}
    </>
  );
};

export default Home;

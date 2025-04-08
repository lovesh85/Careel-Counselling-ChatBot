import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Card } from '@/components/ui/card';
import LogoSVG from './LogoSVG';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <LogoSVG width={40} height={40} className="rounded-full" />
        </div>
      )}
      
      <div 
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-r from-[#1591CF] to-[#C92974] text-white' 
            : 'bg-[#444654] text-white chat-assistant-message'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#1591CF] to-[#C92974] rounded-full flex items-center justify-center text-white">
          <span className="text-lg font-bold">U</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

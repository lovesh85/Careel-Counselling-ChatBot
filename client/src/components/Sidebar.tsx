import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Chat } from '../types';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoSVG from './LogoSVG';
import { Link, useLocation } from 'wouter';

interface SidebarProps {
  onNewChat: () => void;
  activeChatId?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, activeChatId }) => {
  const [, navigate] = useLocation();
  
  // Fetch chat history
  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ['/api/chat'],
  });

  return (
    <div className="w-full md:w-72 bg-[#202123] p-4 flex flex-col h-full border-r border-[#4D4D4F]">
      <Button 
        onClick={onNewChat}
        className="flex items-center gap-2 mb-5 bg-transparent text-white border border-[#4D4D4F] hover:bg-[#2b2c2f] w-full justify-start p-3"
      >
        <Plus size={18} />
        <span>New chat</span>
      </Button>
      
      <div className="mb-5">
        <h3 className="text-[#8E8E9E] text-xs font-medium mb-3 px-2">HISTORY</h3>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="text-[#8E8E9E] text-xs px-2">Loading...</div>
          ) : (
            chats && chats.length > 0 ? (
              chats.map(chat => (
                <Link 
                  key={chat.id} 
                  href={`/chat/${chat.id}`}
                >
                  <a 
                    className={`p-2 cursor-pointer text-xs truncate rounded flex items-center gap-2 ${
                      activeChatId === chat.id ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>{chat.title}</span>
                  </a>
                </Link>
              ))
            ) : (
              <div className="text-[#8E8E9E] text-xs px-2">No chat history yet</div>
            )
          )}
        </div>
      </div>
      
      <div className="mt-auto border-t border-[#4D4D4F] pt-3">
        <Link href="/virtual-assistant">
          <a className="p-2 flex items-center gap-3 cursor-pointer hover:bg-[#2b2c2f] rounded">
            <LogoSVG width={24} height={24} className="rounded-full" />
            <span className="text-sm">Virtual Assistant</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, MessageSquare, BrainCog, HelpCircle, User, ChevronDown, PanelLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoSVG from './LogoSVG';
import { useQuery } from '@tanstack/react-query';
import { Chat } from '../types';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  onNewChat: () => void;
  activeChatId?: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNewChat, activeChatId }) => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { toast } = useToast();
  
  // Fetch chat history
  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ['/api/chat'],
  });
  
  // Theme toggle functionality
  useEffect(() => {
    // Initialize theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
      document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light-theme', newTheme === 'light');
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme enabled`,
      description: "Your preference has been saved.",
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleChatHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChatHistory(!showChatHistory);
  };

  return (
    <nav className="bg-[#202123] border-b border-[#4D4D4F] px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Logo and Title (visible on all screen sizes) */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="flex items-center gap-2">
              <LogoSVG width={40} height={40} className="shadow-glow" />
              <span className="font-bold text-lg hidden md:block bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">Shifra</span>
            </a>
          </Link>
        </div>

        {/* Desktop Menu (hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm"
              onClick={toggleChatHistory}
            >
              <MessageSquare size={16} />
              <span>Chats</span>
              <ChevronDown size={14} className={`transition-transform ${showChatHistory ? 'rotate-180' : ''}`} />
            </Button>
            
            {/* Chat History Dropdown */}
            {showChatHistory && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-[#202123] border border-[#4D4D4F] rounded-md shadow-lg z-50">
                <div className="p-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onNewChat();
                      setShowChatHistory(false);
                    }}
                    className="w-full justify-start mb-2 bg-transparent text-white border border-[#4D4D4F] hover:bg-[#2b2c2f] p-2 text-sm"
                  >
                    <span>New chat</span>
                  </Button>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-[#8E8E9E] text-xs p-2">Loading...</div>
                    ) : (
                      chats && chats.length > 0 ? (
                        chats.map(chat => (
                          <Link 
                            key={chat.id} 
                            href={`/chat/${chat.id}`}
                          >
                            <a 
                              className={`p-2 block cursor-pointer text-xs truncate rounded flex items-center gap-2 ${
                                activeChatId === chat.id ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'
                              }`}
                              onClick={() => setShowChatHistory(false)}
                            >
                              <MessageSquare size={14} />
                              <span>{chat.title}</span>
                            </a>
                          </Link>
                        ))
                      ) : (
                        <div className="text-[#8E8E9E] text-xs p-2">No chat history yet</div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/assessment">
            <a className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${location === '/assessment' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}>
              <BrainCog size={16} />
              <span>Assessment</span>
            </a>
          </Link>

          <Link href="/help">
            <a className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${location === '/help' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}>
              <HelpCircle size={16} />
              <span>Help</span>
            </a>
          </Link>

          <Link href="/virtual-assistant">
            <a className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${location === '/virtual-assistant' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}>
              <User size={16} />
              <span>Virtual Assistant</span>
            </a>
          </Link>
          
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 p-0"
            title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>

        {/* Mobile Menu Button (visible only on small screens) */}
        <button 
          className="md:hidden text-white p-2"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (visible only when toggled on small screens) */}
      {isOpen && (
        <div className="md:hidden mt-2 pb-3 border-t border-[#4D4D4F] pt-2">
          <Button 
            onClick={() => {
              onNewChat();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 mb-2 w-full justify-start bg-transparent text-white border border-[#4D4D4F] hover:bg-[#2b2c2f] p-3"
          >
            <MessageSquare size={16} />
            <span>New chat</span>
          </Button>
          
          <div className="mb-2">
            <div 
              className="flex items-center justify-between py-2 px-3 text-[#8E8E9E] text-sm cursor-pointer"
              onClick={toggleChatHistory}
            >
              <span>Chat History</span>
              <ChevronDown size={14} className={`transition-transform ${showChatHistory ? 'rotate-180' : ''}`} />
            </div>
            
            {showChatHistory && (
              <div className="pl-3 pr-2 max-h-40 overflow-y-auto">
                {isLoading ? (
                  <div className="text-[#8E8E9E] text-xs px-2 py-1">Loading...</div>
                ) : (
                  chats && chats.length > 0 ? (
                    chats.map(chat => (
                      <Link 
                        key={chat.id} 
                        href={`/chat/${chat.id}`}
                      >
                        <a 
                          className={`p-2 block cursor-pointer text-xs truncate rounded flex items-center gap-2 ${
                            activeChatId === chat.id ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <MessageSquare size={14} />
                          <span>{chat.title}</span>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <div className="text-[#8E8E9E] text-xs px-2 py-1">No chat history yet</div>
                  )
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <Link href="/assessment">
              <a 
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${location === '/assessment' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}
                onClick={() => setIsOpen(false)}
              >
                <BrainCog size={16} />
                <span>Assessment</span>
              </a>
            </Link>
            
            <Link href="/help">
              <a 
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${location === '/help' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle size={16} />
                <span>Help</span>
              </a>
            </Link>
            
            <Link href="/virtual-assistant">
              <a 
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded ${location === '/virtual-assistant' ? 'bg-[#2b2c2f]' : 'hover:bg-[#2b2c2f]'}`}
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                <span>Virtual Assistant</span>
              </a>
            </Link>
            
            {/* Theme Toggle for Mobile */}
            <div 
              className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-[#2b2c2f] cursor-pointer"
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
            >
              {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkTheme ? "Light Theme" : "Dark Theme"}</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
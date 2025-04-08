import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import { QuickOption } from '../types';
import { useChat } from '../hooks/useChat';
import AptitudeTest from './AptitudeTest';
import AssessmentResults from './AssessmentResults';
import CareerDashboard from './CareerDashboard';
import MostAskedQuestions from './MostAskedQuestions';

interface ChatInterfaceProps {
  chatId?: number;
  onChatCreated?: (id: number) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onChatCreated }) => {
  const [showAptitudeTest, setShowAptitudeTest] = useState(false);
  const [showCareerDashboard, setShowCareerDashboard] = useState(false);
  const [showAssessmentResults, setShowAssessmentResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, number>>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    currentMessage,
    setCurrentMessage,
    sendMessage,
    isProcessing 
  } = useChat(chatId);
  
  // Fetch quick options
  const { data: quickOptions } = useQuery<QuickOption[]>({
    queryKey: ['/api/quick-options'],
  });
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (currentMessage.trim() && !isProcessing) {
      const newChatId = await sendMessage(currentMessage);
      if (newChatId && onChatCreated) {
        onChatCreated(newChatId);
      }
      
      // Check for specific commands
      if (currentMessage.toLowerCase().includes('aptitude test') || 
          currentMessage.toLowerCase().includes('assessment')) {
        setTimeout(() => setShowAptitudeTest(true), 1000);
      }
      // Removed career dashboard modal popup
    }
  };
  
  const handleQuickOptionClick = async (text: string) => {
    if (!isProcessing) {
      setCurrentMessage(text);
      await sendMessage(text);
      
      // Check for specific commands in quick options
      if (text.toLowerCase().includes('aptitude test') || 
          text.toLowerCase().includes('assessment')) {
        setTimeout(() => setShowAptitudeTest(true), 1000);
      }
      // Removed career dashboard modal popup
    }
  };
  
  return (
    <>
      <div className="flex-grow flex flex-col p-4 md:p-6 overflow-hidden">
        {/* Chat Container - Now with a visible border and fixed height */}
        <div className="border border-[#4D4D4F] rounded-lg mb-4 flex flex-col h-[60vh]">
          <div 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 flex flex-col gap-6"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isProcessing && (
              <div className="self-start flex items-center text-[#8E8E9E] gap-2 animate-pulse">
                <div className="w-2 h-2 bg-[#1591CF] rounded-full"></div>
                <div className="w-2 h-2 bg-[#1591CF] rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-[#1591CF] rounded-full animation-delay-400"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input Container */}
        <div className="relative flex items-center mb-6">
          <Input
            id="userInput"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about careers, education, or assessments..."
            className="flex-grow p-4 text-white bg-[#202123] border-[#4D4D4F] rounded-full"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isProcessing}
            className="absolute right-2 w-10 h-10 p-0 rounded-full bg-gradient-to-r from-[#1591CF] to-[#C92974]"
          >
            <SendIcon size={18} />
          </Button>
        </div>
        
        {/* Most Asked Questions - Moved below input */}
        <div className="mb-6">
          <MostAskedQuestions onQuestionClick={handleQuickOptionClick} disabled={isProcessing} />
        </div>
        
        {/* Quick Options - Positioned at the bottom */}
        <div className="mb-4">
          <h3 className="text-[#8E8E9E] text-xs font-medium mb-3">QUICK OPTIONS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickOptions ? (
              quickOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleQuickOptionClick(option.text)}
                  variant="outline"
                  className="p-3 bg-[#202123] border-[#4D4D4F] text-xs hover:bg-[#2b2c2f] hover:translate-y-[-2px] transition-all"
                  disabled={isProcessing}
                >
                  {option.text}
                </Button>
              ))
            ) : (
              <>
                <Button
                  onClick={() => handleQuickOptionClick("Best careers for 2024")}
                  variant="outline"
                  className="p-3 bg-[#202123] border-[#4D4D4F] text-xs hover:bg-[#2b2c2f] hover:translate-y-[-2px] transition-all"
                  disabled={isProcessing}
                >
                  Best careers for 2024
                </Button>
                <Button
                  onClick={() => handleQuickOptionClick("Engineering vs Medicine")}
                  variant="outline"
                  className="p-3 bg-[#202123] border-[#4D4D4F] text-xs hover:bg-[#2b2c2f] hover:translate-y-[-2px] transition-all"
                  disabled={isProcessing}
                >
                  Engineering vs Medicine
                </Button>
                <Button
                  onClick={() => handleQuickOptionClick("Top MBA colleges")}
                  variant="outline"
                  className="p-3 bg-[#202123] border-[#4D4D4F] text-xs hover:bg-[#2b2c2f] hover:translate-y-[-2px] transition-all"
                  disabled={isProcessing}
                >
                  Top MBA colleges
                </Button>
                <Button
                  onClick={() => handleQuickOptionClick("Take aptitude test")}
                  variant="outline"
                  className="p-3 bg-[#202123] border-[#4D4D4F] text-xs hover:bg-[#2b2c2f] hover:translate-y-[-2px] transition-all"
                  disabled={isProcessing}
                >
                  Take aptitude test
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Aptitude Test Modal */}
      {showAptitudeTest && (
        <AptitudeTest 
          onClose={() => setShowAptitudeTest(false)} 
          onComplete={(results) => {
            setShowAptitudeTest(false);
            setAssessmentResults(results);
            setShowAssessmentResults(true);
            
            // Add a message to the chat about completing the assessment
            sendMessage("I've completed the aptitude assessment. What do my results show about suitable career paths?");
          }} 
        />
      )}
      
      {/* Assessment Results Modal */}
      {showAssessmentResults && (
        <AssessmentResults 
          assessmentResults={assessmentResults}
          onClose={() => setShowAssessmentResults(false)} 
        />
      )}
      
      {/* Career Dashboard Modal */}
      {showCareerDashboard && (
        <CareerDashboard onClose={() => setShowCareerDashboard(false)} />
      )}
    </>
  );
};

export default ChatInterface;

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface MostAskedQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

const MostAskedQuestions: React.FC<MostAskedQuestionsProps> = ({ onQuestionClick, disabled }) => {
  // Define questions within the component - this ensures they don't disappear
  const [questions] = useState([
    "What are the highest paying careers for 2024?",
    "Which careers are best for work-life balance?",
    "What careers are suitable for introverts?",
    "How to transition to tech from non-tech background?",
    "What skills will be in-demand in 5 years?",
    "Best universities for computer science?",
    "Is an MBA worth it in today's economy?",
    "Best programming languages for beginners?"
  ]);

  return (
    <div className="w-full mb-4">
      <h3 className="text-[#8E8E9E] text-xs font-medium mb-3 flex items-center gap-2">
        <MessageCircle size={14} />
        MOST ASKED QUESTIONS
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            onClick={() => onQuestionClick(question)}
            variant="outline"
            className="p-2 h-auto bg-[#202123] border-[#4D4D4F] text-xs justify-start hover:bg-[#2b2c2f] hover:translate-y-[-1px] transition-all truncate"
            disabled={disabled}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MostAskedQuestions;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MostAskedQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

interface QAEntry {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const MostAskedQuestions: React.FC<MostAskedQuestionsProps> = ({ onQuestionClick, disabled }) => {
  // Fetch questions from the QA database
  const { data: qaEntries, isLoading } = useQuery<QAEntry[]>({
    queryKey: ['/api/qa'],
  });

  // Local state for questions
  const [questions, setQuestions] = useState([
    "How do I choose the right career path?",
    "What if I don't know what I want to do after graduation?",
    "Is it okay to switch career paths later?",
    "What are some top career options after a B.Tech in CSE?",
    "How important is competitive programming for tech jobs?",
    "Do I need a master's degree to get a good job in tech?",
    "What exams are required to study abroad?",
    "Which countries are best for tech careers?"
  ]);

  // Update questions when qaEntries are loaded
  useEffect(() => {
    if (qaEntries && qaEntries.length > 0) {
      const questionsList = qaEntries
        .slice(0, 8) // Limit to 8 questions
        .map(entry => entry.question);
      setQuestions(questionsList);
    }
  }, [qaEntries]);

  return (
    <div className="w-full">
      <h3 className="text-[#8E8E9E] text-xs font-medium mb-3 flex items-center gap-2">
        <MessageCircle size={14} />
        MOST ASKED QUESTIONS
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            onClick={() => onQuestionClick(question)}
            variant="outline"
            className="p-2 h-auto bg-[#202123] border-[#4D4D4F] text-xs justify-start hover:bg-[#2b2c2f] hover:translate-y-[-1px] transition-all truncate"
            disabled={disabled || isLoading}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MostAskedQuestions;
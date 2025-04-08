import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, GraduationCap, Briefcase, Award } from 'lucide-react';

interface MostAskedQuestionsProps {
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

const MostAskedQuestions: React.FC<MostAskedQuestionsProps> = ({ onQuestionClick, disabled }) => {
  const questions = [
    {
      category: 'Career Paths',
      icon: <Briefcase size={16} />,
      questions: [
        "What are the highest paying careers for 2024?",
        "Which careers are best for work-life balance?",
        "What careers are suitable for introverts?",
        "How to transition to tech from a non-tech background?"
      ]
    },
    {
      category: 'Education',
      icon: <GraduationCap size={16} />,
      questions: [
        "What degrees are most valuable in the job market?",
        "Online degree vs traditional university - pros and cons?",
        "Best universities for computer science?",
        "Is an MBA worth it in today's economy?"
      ]
    },
    {
      category: 'Skills Development',
      icon: <Award size={16} />,
      questions: [
        "What skills will be most in-demand in the next 5 years?",
        "How to develop leadership skills?",
        "Best programming languages to learn for beginners?",
        "How to showcase soft skills on a resume?"
      ]
    }
  ];

  return (
    <div className="w-full mb-4">
      <h3 className="text-[#8E8E9E] text-xs font-medium mb-3 flex items-center gap-2">
        <MessageCircle size={14} />
        MOST ASKED QUESTIONS
      </h3>
      
      <div className="space-y-4">
        {questions.map((category, index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-[#8E8E9E] text-xs flex items-center gap-1 pl-1">
              {category.icon}
              <span>{category.category}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.questions.map((question, qIndex) => (
                <Button
                  key={qIndex}
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
        ))}
      </div>
    </div>
  );
};

export default MostAskedQuestions;
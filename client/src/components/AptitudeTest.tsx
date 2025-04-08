import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAssessment } from '../hooks/useAssessment';
import { X } from 'lucide-react';

interface AptitudeTestProps {
  onClose: () => void;
  onComplete: () => void;
}

const AptitudeTest: React.FC<AptitudeTestProps> = ({ onClose, onComplete }) => {
  const {
    assessmentType,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    isComplete,
    isLoading,
    startAssessment
  } = useAssessment();

  // Handle test completion
  React.useEffect(() => {
    if (isComplete && !isLoading) {
      onComplete();
    }
  }, [isComplete, isLoading, onComplete]);

  // Start personality assessment by default
  React.useEffect(() => {
    startAssessment('personality');
  }, [startAssessment]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#202123] border border-[#4D4D4F] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {assessmentType === 'personality' ? 'Career Personality Assessment' : 'Career Aptitude Assessment'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 hover:bg-[#444654]/30 rounded-full"
          >
            <X size={24} />
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-[#444654]/30">
            <div className="h-full bg-gradient-to-r from-[#1591CF] to-[#C92974] rounded-full" style={{ width: `${progress}%` }}></div>
          </Progress>
        </div>
        
        {/* Current question */}
        {currentQuestion && (
          <div className="mb-8">
            <h3 className="text-lg mb-4">{currentQuestion.question}</h3>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={answerQuestion}
              className="flex flex-col gap-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 border border-[#4D4D4F] rounded-lg cursor-pointer hover:bg-[#444654]/20 transition-colors"
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${currentQuestion.id}-${index}`}
                    className="mr-3"
                  />
                  <Label
                    htmlFor={`option-${currentQuestion.id}-${index}`}
                    className="cursor-pointer flex-grow"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-[#4D4D4F] hover:bg-[#444654]/30 transition-colors"
          >
            Previous
          </Button>
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQuestion?.id || 0] || isLoading}
            className="px-6 py-2 bg-gradient-to-r from-[#1591CF] to-[#C92974] rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAssessment } from '@/hooks/useAssessment';
import { X } from 'lucide-react';

interface AptitudeTestProps {
  onClose: () => void;
  onComplete: (results: Record<string, number>) => void;
}

// Sample questions for the aptitude assessment
const aptitudeQuestions = [
  {
    id: 1,
    question: "I enjoy solving complex problems and puzzles.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "analytical"
  },
  {
    id: 2,
    question: "I find it easy to understand abstract concepts and theories.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "analytical"
  },
  {
    id: 3,
    question: "I am good at organizing information and creating systems.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "organizational"
  },
  {
    id: 4,
    question: "I enjoy working with numbers and statistical data.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "mathematical"
  },
  {
    id: 5,
    question: "I find it easy to express my ideas through writing.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "verbal"
  },
  {
    id: 6,
    question: "I am comfortable speaking in front of groups.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "verbal"
  },
  {
    id: 7,
    question: "I enjoy creating visual designs or artwork.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "creative"
  },
  {
    id: 8,
    question: "I'm good at understanding how mechanical or technical things work.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "technical"
  },
  {
    id: 9,
    question: "I enjoy helping others and solving their problems.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "interpersonal"
  },
  {
    id: 10,
    question: "I am good at influencing people and negotiating.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "interpersonal"
  },
  {
    id: 11,
    question: "I can quickly learn new software or digital tools.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "technical"
  },
  {
    id: 12,
    question: "I enjoy coming up with innovative solutions to problems.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    category: "creative"
  },
];

export default function AptitudeTest({ onClose, onComplete }: AptitudeTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { startAssessment } = useAssessment();
  
  const handleAnswer = (value: string) => {
    // Convert string value to number (0-4)
    const score = aptitudeQuestions[currentQuestion].options.indexOf(value);
    
    setAnswers(prev => ({
      ...prev,
      [aptitudeQuestions[currentQuestion].id]: score
    }));
    
    // Move to next question or submit if last question
    if (currentQuestion < aptitudeQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate category scores (0-100 scale)
      const categoryScores: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};
      
      // Count occurrences of each category
      aptitudeQuestions.forEach(q => {
        const category = q.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      // Sum up scores by category
      Object.entries(answers).forEach(([qId, score]) => {
        const question = aptitudeQuestions.find(q => q.id === parseInt(qId));
        if (question) {
          const category = question.category;
          categoryScores[category] = (categoryScores[category] || 0) + score;
        }
      });
      
      // Convert to percentage (0-100)
      Object.keys(categoryScores).forEach(category => {
        const maxPossible = categoryCounts[category] * 4; // 4 is max score per question
        categoryScores[category] = Math.round((categoryScores[category] / maxPossible) * 100);
      });
      
      // Save assessment in backend
      await startAssessment('aptitude');
      
      // Complete the test
      onComplete(categoryScores);
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const progress = Math.round(((currentQuestion + 1) / aptitudeQuestions.length) * 100);
  
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Aptitude Assessment</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Question {currentQuestion + 1} of {aptitudeQuestions.length}
          </CardDescription>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-medium">{aptitudeQuestions[currentQuestion].question}</h3>
            <RadioGroup onValueChange={handleAnswer}>
              {aptitudeQuestions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button 
            onClick={() => {
              if (currentQuestion < aptitudeQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={isSubmitting || !answers[aptitudeQuestions[currentQuestion].id]}
          >
            {currentQuestion < aptitudeQuestions.length - 1 ? 'Skip' : 'Complete Assessment'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
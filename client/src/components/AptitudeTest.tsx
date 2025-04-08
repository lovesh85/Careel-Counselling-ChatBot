import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AptitudeTestProps {
  onClose: () => void;
  onComplete: (results: Record<string, number>) => void;
}

// Define the question structure
interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

// Define the questions for the test
const questions: Question[] = [
  {
    id: 1,
    question: "You are given a complex problem with multiple solutions. What's your approach?",
    options: [
      "Break it down into smaller parts and solve each systematically",
      "Brainstorm all possible solutions before choosing the best one",
      "Look for similar problems that have been solved before",
      "Use intuition and experience to find the quickest path to a solution"
    ],
    category: "analytical"
  },
  {
    id: 2,
    question: "When learning a new skill, you prefer:",
    options: [
      "Reading detailed documentation and studying theory first",
      "Watching tutorials and demonstrations",
      "Diving in and learning through trial and error",
      "Working alongside someone who already knows the skill"
    ],
    category: "learning"
  },
  {
    id: 3,
    question: "In a group project, which role do you naturally gravitate toward?",
    options: [
      "The organizer who keeps everyone on track",
      "The creative who comes up with innovative ideas",
      "The implementer who gets things done",
      "The mediator who ensures everyone works well together"
    ],
    category: "teamwork"
  },
  {
    id: 4,
    question: "When debugging code or solving a technical issue, you:",
    options: [
      "Follow a structured process of elimination",
      "Create a mental model of how the system works to identify likely failure points",
      "Look for patterns in error messages and system behavior",
      "Ask others for insight or search for similar issues online"
    ],
    category: "technical"
  },
  {
    id: 5,
    question: "How do you approach a tight deadline?",
    options: [
      "Create a detailed schedule and stick to it rigorously",
      "Prioritize tasks and focus on the most important ones first",
      "Work longer hours to ensure everything gets done",
      "Delegate where possible and focus on what you do best"
    ],
    category: "time_management"
  },
  {
    id: 6,
    question: "When communicating complex information, you prefer to:",
    options: [
      "Use precise technical language to ensure accuracy",
      "Create visuals like diagrams or charts",
      "Use analogies and real-world examples",
      "Adapt your explanation based on the audience's background"
    ],
    category: "communication"
  },
  {
    id: 7,
    question: "You're asked to learn a new programming language quickly. You would:",
    options: [
      "Start by building a small project to learn the basics",
      "Read the language documentation thoroughly",
      "Find similarities with languages you already know",
      "Take an online course or follow a structured tutorial"
    ],
    category: "technical"
  },
  {
    id: 8,
    question: "When faced with conflicting priorities, you:",
    options: [
      "Assess the impact of each option before deciding",
      "Consult with stakeholders to understand their needs",
      "Follow established protocols or guidelines",
      "Make quick decisions based on immediate needs"
    ],
    category: "decision_making"
  },
  {
    id: 9,
    question: "How do you prefer to receive feedback?",
    options: [
      "Detailed and specific with examples",
      "Focused on the big picture and overall performance",
      "Balanced between strengths and areas for improvement",
      "Actionable with clear steps for improvement"
    ],
    category: "learning"
  },
  {
    id: 10,
    question: "Which aspect of a project gives you the most satisfaction?",
    options: [
      "Solving complex technical challenges",
      "Creating elegant, efficient solutions",
      "Seeing users benefit from your work",
      "Learning new skills and technologies"
    ],
    category: "motivation"
  },
  {
    id: 11,
    question: "When designing a user interface, what do you prioritize?",
    options: [
      "Aesthetic appeal and visual consistency",
      "Efficiency and minimal clicks to complete tasks",
      "Accessibility and inclusive design",
      "Familiarity and adherence to common patterns"
    ],
    category: "design"
  },
  {
    id: 12,
    question: "How do you approach data analysis?",
    options: [
      "Looking for patterns and trends in the data",
      "Testing hypotheses through statistical methods",
      "Visualizing data to identify insights",
      "Focusing on outliers and unexpected results"
    ],
    category: "analytical"
  }
];

// Category weights for scoring
const categoryWeights: Record<string, Record<string, number>> = {
  "analytical": {
    "software_development": 0.9,
    "data_science": 1.0,
    "ux_design": 0.6,
    "project_management": 0.7,
    "technical_writing": 0.5,
    "cybersecurity": 0.8,
    "ai_research": 0.9
  },
  "technical": {
    "software_development": 1.0,
    "data_science": 0.9,
    "ux_design": 0.7,
    "project_management": 0.5,
    "technical_writing": 0.6,
    "cybersecurity": 0.9,
    "ai_research": 0.8
  },
  "design": {
    "software_development": 0.6,
    "data_science": 0.5,
    "ux_design": 1.0,
    "project_management": 0.4,
    "technical_writing": 0.7,
    "cybersecurity": 0.3,
    "ai_research": 0.5
  },
  "teamwork": {
    "software_development": 0.7,
    "data_science": 0.6,
    "ux_design": 0.8,
    "project_management": 1.0,
    "technical_writing": 0.7,
    "cybersecurity": 0.6,
    "ai_research": 0.7
  },
  "communication": {
    "software_development": 0.7,
    "data_science": 0.6,
    "ux_design": 0.8,
    "project_management": 0.9,
    "technical_writing": 1.0,
    "cybersecurity": 0.7,
    "ai_research": 0.6
  },
  "time_management": {
    "software_development": 0.8,
    "data_science": 0.7,
    "ux_design": 0.7,
    "project_management": 1.0,
    "technical_writing": 0.8,
    "cybersecurity": 0.8,
    "ai_research": 0.7
  },
  "decision_making": {
    "software_development": 0.8,
    "data_science": 0.7,
    "ux_design": 0.8,
    "project_management": 0.9,
    "technical_writing": 0.6,
    "cybersecurity": 0.8,
    "ai_research": 0.7
  },
  "learning": {
    "software_development": 0.9,
    "data_science": 0.8,
    "ux_design": 0.7,
    "project_management": 0.6,
    "technical_writing": 0.7,
    "cybersecurity": 0.8,
    "ai_research": 0.9
  },
  "motivation": {
    "software_development": 0.8,
    "data_science": 0.8,
    "ux_design": 0.7,
    "project_management": 0.7,
    "technical_writing": 0.6,
    "cybersecurity": 0.7,
    "ai_research": 0.9
  }
};

export default function AptitudeTest({ onClose, onComplete }: AptitudeTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Calculate progress as a percentage
    const completedQuestions = Object.keys(answers).length;
    const progressPercentage = (completedQuestions / questions.length) * 100;
    setProgress(progressPercentage);
  }, [answers]);
  
  const handleAnswerSelect = (value: string) => {
    setCurrentAnswer(parseInt(value));
  };
  
  const handleContinue = () => {
    if (currentAnswer !== null) {
      // Save answer
      setAnswers({ ...answers, [currentQuestionIndex]: currentAnswer });
      
      // Move to next question or complete the test
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer(null);
      } else {
        // Calculate results
        const results = calculateResults(answers);
        onComplete(results);
      }
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // Restore previous answer if it exists
      const previousAnswer = answers[currentQuestionIndex - 1];
      setCurrentAnswer(previousAnswer !== undefined ? previousAnswer : null);
    }
  };
  
  const calculateResults = (answers: Record<number, number>) => {
    // Initialize category scores
    const categoryScores: Record<string, number> = {
      "analytical": 0,
      "technical": 0,
      "design": 0,
      "teamwork": 0,
      "communication": 0,
      "time_management": 0,
      "decision_making": 0,
      "learning": 0,
      "motivation": 0
    };
    
    // Track count per category for averaging
    const categoryCounts: Record<string, number> = {};
    
    // Calculate raw scores for each category
    Object.entries(answers).forEach(([questionIndex, optionIndex]) => {
      const question = questions[parseInt(questionIndex)];
      const category = question.category;
      
      // Initialize if first question of this category
      if (categoryCounts[category] === undefined) {
        categoryCounts[category] = 0;
        categoryScores[category] = 0;
      }
      
      // Add score based on answer (normalized to 0-1 range)
      // This is a simple scoring method, could be more sophisticated
      const score = 1 - (optionIndex / (question.options.length - 1));
      categoryScores[category] += score;
      categoryCounts[category]++;
    });
    
    // Average scores by category
    Object.keys(categoryScores).forEach(category => {
      if (categoryCounts[category] > 0) {
        categoryScores[category] = categoryScores[category] / categoryCounts[category];
      }
    });
    
    // Calculate field scores using category weights
    const fieldScores: Record<string, number> = {
      "software_development": 0,
      "data_science": 0,
      "ux_design": 0,
      "project_management": 0,
      "technical_writing": 0,
      "cybersecurity": 0,
      "ai_research": 0
    };
    
    Object.keys(fieldScores).forEach(field => {
      let weightedSum = 0;
      let weightSum = 0;
      
      Object.entries(categoryScores).forEach(([category, score]) => {
        const weight = categoryWeights[category]?.[field] || 0;
        weightedSum += score * weight;
        weightSum += weight;
      });
      
      if (weightSum > 0) {
        fieldScores[field] = (weightedSum / weightSum) * 100;
      }
    });
    
    return fieldScores;
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-[#202123] border-[#4D4D4F] text-white">
        <CardHeader className="relative pb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-[#8E8E9E] hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
          <CardTitle className="text-xl">Aptitude Assessment</CardTitle>
          <CardDescription className="text-[#8E8E9E]">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardDescription>
          <Progress value={progress} className="h-1 mt-2" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
            <RadioGroup value={currentAnswer?.toString()} onValueChange={handleAnswerSelect}>
              {currentQuestion.options.map((option, index) => (
                <div className="flex items-start space-x-2 mb-3 p-2 rounded hover:bg-[#2b2c2f]" key={index}>
                  <RadioGroupItem id={`option-${index}`} value={index.toString()} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="border-[#4D4D4F] text-white hover:bg-[#2b2c2f]"
          >
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={currentAnswer === null}
            className="bg-gradient-to-r from-[#1591CF] to-[#C92974]"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Complete Test'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
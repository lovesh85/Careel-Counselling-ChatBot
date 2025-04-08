import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Assessment, AssessmentType, AssessmentQuestion, CareerSuggestion } from '../types';

// Mock assessment questions (will be loaded from API in real implementation)
const personalityQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which activities do you enjoy most in your free time?",
    options: [
      "Working with technology and solving technical problems",
      "Helping and teaching others",
      "Creating art, writing or designing",
      "Analyzing data and solving complex problems",
      "Leading and organizing activities with others"
    ],
    type: 'personality'
  },
  {
    id: 2,
    question: "How do you prefer to work on projects?",
    options: [
      "Independently with minimal supervision",
      "In a collaborative team environment",
      "With a mix of independent and team work",
      "In a structured environment with clear guidelines",
      "In a flexible environment with room for creativity"
    ],
    type: 'personality'
  },
  {
    id: 3,
    question: "How do you typically react to challenges?",
    options: [
      "Analyze the problem systematically to find a solution",
      "Brainstorm creative approaches and think outside the box",
      "Seek advice from others before proceeding",
      "Follow established protocols and best practices",
      "Adapt quickly and improvise solutions"
    ],
    type: 'personality'
  }
];

const aptitudeQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: "A company's profit increased from $200,000 to $250,000. What is the percentage increase?",
    options: [
      "20%",
      "25%",
      "30%",
      "50%",
      "Cannot be determined"
    ],
    type: 'aptitude'
  },
  {
    id: 2,
    question: "If you had to explain a complex technical concept to someone with no technical background, which approach would you choose?",
    options: [
      "Use analogies and everyday examples to illustrate the concept",
      "Break down the concept into simpler components step by step",
      "Use visual aids like diagrams or drawings",
      "Explain the practical applications and benefits",
      "Start with the fundamentals and build up to the complex idea"
    ],
    type: 'aptitude'
  }
];

export function useAssessment() {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('personality');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [careerSuggestions, setCareerSuggestions] = useState<CareerSuggestion | null>(null);
  const queryClient = useQueryClient();

  // Get questions based on assessment type
  const questions = assessmentType === 'personality' 
    ? personalityQuestions 
    : assessmentType === 'aptitude' 
      ? aptitudeQuestions 
      : [];

  // Submit assessment to server
  const submitAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: { 
      type: AssessmentType; 
      answers: Record<number, string>;
    }) => {
      const res = await apiRequest('POST', '/api/assessment', assessmentData);
      return res.json();
    },
    onSuccess: (data: Assessment) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessment'] });
      setResults(data.scores);
      fetchCareerSuggestions(data.id);
    }
  });

  // Fetch career suggestions based on assessment results
  const careerSuggestionsMutation = useMutation({
    mutationFn: async (assessmentId: number) => {
      const res = await apiRequest('GET', `/api/career-suggestions?assessmentId=${assessmentId}`);
      return res.json();
    },
    onSuccess: (data: CareerSuggestion) => {
      setCareerSuggestions(data);
    }
  });

  // Update answer for current question
  const answerQuestion = useCallback((answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  }, [currentQuestionIndex, questions]);

  // Go to next question
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  }, [currentQuestionIndex, questions.length]);

  // Go to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Complete assessment and calculate results
  const completeAssessment = useCallback(() => {
    setIsComplete(true);
    
    // Submit assessment to server
    submitAssessmentMutation.mutateAsync({
      type: assessmentType,
      answers
    });
    
  }, [assessmentType, answers, submitAssessmentMutation]);

  // Fetch career suggestions based on assessment results
  const fetchCareerSuggestions = useCallback((assessmentId: number) => {
    careerSuggestionsMutation.mutateAsync(assessmentId);
  }, [careerSuggestionsMutation]);

  // Reset assessment
  const resetAssessment = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    setResults({});
    setCareerSuggestions(null);
  }, []);

  // Start a new assessment
  const startAssessment = useCallback((type: AssessmentType) => {
    setAssessmentType(type);
    resetAssessment();
  }, [resetAssessment]);

  return {
    assessmentType,
    questions,
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: questions.length,
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,
    answers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    isComplete,
    results,
    careerSuggestions,
    isLoading: submitAssessmentMutation.isPending || careerSuggestionsMutation.isPending,
    startAssessment,
    resetAssessment
  };
}

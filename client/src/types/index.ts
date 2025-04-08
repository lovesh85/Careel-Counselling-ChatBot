export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  educationLevel?: string;
  interests?: string[];
  createdAt: string;
}

export interface Chat {
  id: number;
  userId: number;
  title: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export type AssessmentType = 'personality' | 'aptitude' | 'interest';

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  type: AssessmentType;
}

export interface AssessmentAnswer {
  questionId: number;
  answer: string;
}

export interface Assessment {
  id: number;
  userId: number;
  type: AssessmentType;
  answers: Record<string, any>;
  scores: Record<string, number>;
  completedAt: string;
}

export interface Career {
  id: number;
  name: string;
  description: string;
  requiredSkills: string[];
  avgSalary: string;
  industries: string[];
}

export interface Course {
  id: number;
  careerId?: number;
  name: string;
  provider: string;
  link: string;
}

export interface CareerSuggestion {
  id: number;
  userId: number;
  recommendedCareers: RecommendedCareer[];
  dateGenerated: string;
}

export interface RecommendedCareer {
  careerId: number;
  name: string;
  description: string;
  matchPercentage: number;
  skills: string[];
  avgSalary: string;
}

export interface SkillScore {
  name: string;
  score: number;
  color: string;
}

export interface QuickOption {
  id: number;
  text: string;
  category: string;
  isActive: boolean;
}

export interface ErrorResponse {
  message: string;
}

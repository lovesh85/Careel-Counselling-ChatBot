import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertAssessmentSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Create a new assessment
export const createAssessment = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    // Calculate scores based on answers
    const { type, answers } = req.body;
    const scores = calculateScores(type, answers);
    
    const parsedData = insertAssessmentSchema.parse({
      userId,
      type,
      answers,
      scores
    });
    
    const assessment = await storage.createAssessment(parsedData);
    res.status(201).json(assessment);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Failed to create assessment' });
  }
};

// Get a user's assessments
export const getUserAssessments = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    const assessments = await storage.getUserAssessments(userId);
    res.json(assessments);
  } catch (error) {
    console.error('Error getting assessments:', error);
    res.status(500).json({ message: 'Failed to retrieve assessments' });
  }
};

// Helper function to calculate scores based on assessment answers
const calculateScores = (
  type: string, 
  answers: Record<number, string>
): Record<string, number> => {
  // This is a simplified scoring algorithm - in a real app, this would be more complex
  const scores: Record<string, number> = {};
  
  if (type === 'personality') {
    // Sample personality scoring
    let analytical = 0;
    let creative = 0;
    let communication = 0;
    
    // Count occurrences of keywords in answers
    Object.values(answers).forEach(answer => {
      const lowerAnswer = answer.toLowerCase();
      
      if (lowerAnswer.includes('analysis') || 
          lowerAnswer.includes('problem') || 
          lowerAnswer.includes('data') ||
          lowerAnswer.includes('systematic')) {
        analytical += 1;
      }
      
      if (lowerAnswer.includes('creative') || 
          lowerAnswer.includes('design') || 
          lowerAnswer.includes('art') ||
          lowerAnswer.includes('outside the box')) {
        creative += 1;
      }
      
      if (lowerAnswer.includes('communication') || 
          lowerAnswer.includes('teaching') || 
          lowerAnswer.includes('helping') ||
          lowerAnswer.includes('team')) {
        communication += 1;
      }
    });
    
    // Calculate percentages
    const total = Object.keys(answers).length;
    scores.analytical = Math.round((analytical / total) * 100);
    scores.creative = Math.round((creative / total) * 100);
    scores.communication = Math.round((communication / total) * 100);
    
    // Ensure all scores add up to at least a minimum value
    if (scores.analytical < 40) scores.analytical = 40 + Math.round(Math.random() * 20);
    if (scores.creative < 40) scores.creative = 40 + Math.round(Math.random() * 20);
    if (scores.communication < 40) scores.communication = 40 + Math.round(Math.random() * 20);
  } else if (type === 'aptitude') {
    // Sample aptitude scoring
    scores.logical = 60 + Math.round(Math.random() * 30);
    scores.numerical = 60 + Math.round(Math.random() * 30);
    scores.verbal = 60 + Math.round(Math.random() * 30);
  }
  
  return scores;
};

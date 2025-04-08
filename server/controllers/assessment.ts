import { Request, Response } from 'express';
import { storage } from '../storage';
import { ZodError } from 'zod';
import { insertAssessmentSchema } from '@shared/schema';

// Create a new assessment
export const createAssessment = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const assessmentData = insertAssessmentSchema.parse(req.body);
    
    // Currently using a mock user ID (1) since we don't have user authentication yet
    const userId = 1;
    
    // Create assessment
    const assessment = await storage.createAssessment({
      ...assessmentData,
      userId,
    });
    
    return res.status(201).json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid assessment data',
        errors: error.errors,
      });
    }
    
    return res.status(500).json({
      message: 'Failed to create assessment',
    });
  }
};

// Get all assessments for a user
export const getUserAssessments = async (req: Request, res: Response) => {
  try {
    // Currently using a mock user ID (1) since we don't have user authentication yet
    const userId = 1;
    
    const assessments = await storage.getUserAssessments(userId);
    
    return res.status(200).json(assessments);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    
    return res.status(500).json({
      message: 'Failed to fetch assessments',
    });
  }
};
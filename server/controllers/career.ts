import { Request, Response } from 'express';
import { storage } from '../storage';
import { ZodError } from 'zod';
import { insertCareerSuggestionSchema } from '@shared/schema';

// Get all careers
export const getCareers = async (req: Request, res: Response) => {
  try {
    const careers = await storage.getAllCareers();
    return res.status(200).json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return res.status(500).json({
      message: 'Failed to fetch careers',
    });
  }
};

// Get courses for a specific career
export const getCareerCourses = async (req: Request, res: Response) => {
  try {
    const careerId = parseInt(req.params.careerId);
    
    if (isNaN(careerId)) {
      return res.status(400).json({
        message: 'Invalid career ID',
      });
    }
    
    const courses = await storage.getCareerCourses(careerId);
    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching career courses:', error);
    return res.status(500).json({
      message: 'Failed to fetch courses',
    });
  }
};

// Create career suggestions based on assessment results
export const createCareerSuggestions = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const suggestionData = insertCareerSuggestionSchema.parse(req.body);
    
    // Currently using a mock user ID (1) since we don't have user authentication yet
    const userId = 1;
    
    // Create career suggestion
    const suggestion = await storage.createCareerSuggestion({
      ...suggestionData,
      userId,
    });
    
    return res.status(201).json(suggestion);
  } catch (error) {
    console.error('Error creating career suggestion:', error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid career suggestion data',
        errors: error.errors,
      });
    }
    
    return res.status(500).json({
      message: 'Failed to create career suggestion',
    });
  }
};

// Get the latest career suggestions for a user
export const getLatestCareerSuggestions = async (req: Request, res: Response) => {
  try {
    // Currently using a mock user ID (1) since we don't have user authentication yet
    const userId = 1;
    
    const suggestions = await storage.getUserCareerSuggestions(userId);
    
    if (suggestions.length === 0) {
      return res.status(404).json({
        message: 'No career suggestions found',
      });
    }
    
    // Return the most recent suggestion
    const latestSuggestion = suggestions.sort((a, b) => 
      new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime()
    )[0];
    
    return res.status(200).json(latestSuggestion);
  } catch (error) {
    console.error('Error fetching career suggestions:', error);
    return res.status(500).json({
      message: 'Failed to fetch career suggestions',
    });
  }
};

// Get quick options for chat interface
export const getQuickOptions = async (req: Request, res: Response) => {
  try {
    const quickOptions = await storage.getActiveQuickOptions();
    return res.status(200).json(quickOptions);
  } catch (error) {
    console.error('Error fetching quick options:', error);
    return res.status(500).json({
      message: 'Failed to fetch quick options',
    });
  }
};
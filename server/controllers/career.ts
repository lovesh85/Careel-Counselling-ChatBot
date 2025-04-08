import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertCareerSuggestionSchema } from '@shared/schema';
import { getCareerRecommendations } from '../services/gemini';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Get careers
export const getCareers = async (req: Request, res: Response) => {
  try {
    const careers = await storage.getAllCareers();
    res.json(careers);
  } catch (error) {
    console.error('Error getting careers:', error);
    res.status(500).json({ message: 'Failed to retrieve careers' });
  }
};

// Get courses for a career
export const getCareerCourses = async (req: Request, res: Response) => {
  try {
    const careerId = parseInt(req.params.id);
    if (isNaN(careerId)) {
      return res.status(400).json({ message: 'Invalid career ID' });
    }
    
    const courses = await storage.getCareerCourses(careerId);
    res.json(courses);
  } catch (error) {
    console.error('Error getting career courses:', error);
    res.status(500).json({ message: 'Failed to retrieve career courses' });
  }
};

// Create career suggestions based on assessment results
export const createCareerSuggestions = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    const assessmentId = parseInt(req.query.assessmentId as string);
    if (isNaN(assessmentId)) {
      return res.status(400).json({ message: 'Invalid assessment ID' });
    }
    
    // Get the user's assessments
    const assessments = await storage.getUserAssessments(userId);
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Get user profile (in a real app, this would be more complete)
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate career recommendations using Gemini API
    const interests = user.interests || ['technology', 'problem-solving'];
    const skills = ['programming', 'analysis', 'communication']; // Mock skills
    const education = user.educationLevel || 'undergraduate';
    
    const recommendationsJson = await getCareerRecommendations(
      interests,
      skills,
      education,
      assessment.scores
    );
    
    // Parse the JSON response
    let recommendedCareers;
    try {
      const recommendations = JSON.parse(recommendationsJson);
      recommendedCareers = recommendations.careers;
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      // Fallback to mock data if parsing fails
      recommendedCareers = [
        {
          name: "Data Scientist",
          description: "Analyze complex datasets to extract insights and build predictive models.",
          matchPercentage: 95,
          skills: ["Python", "Machine Learning", "Statistics", "SQL"],
          avgSalary: "₹12-18 LPA"
        },
        {
          name: "UX/UI Designer",
          description: "Design user interfaces and experiences for websites and applications.",
          matchPercentage: 88,
          skills: ["Figma", "User Research", "Wireframing", "HTML/CSS"],
          avgSalary: "₹8-15 LPA"
        }
      ];
    }
    
    // Save career suggestions to database
    const parsedData = insertCareerSuggestionSchema.parse({
      userId,
      recommendedCareers
    });
    
    const careerSuggestion = await storage.createCareerSuggestion(parsedData);
    res.status(201).json(careerSuggestion);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Error creating career suggestions:', error);
    res.status(500).json({ message: 'Failed to create career suggestions' });
  }
};

// Get latest career suggestions for a user
export const getLatestCareerSuggestions = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    const suggestions = await storage.getUserCareerSuggestions(userId);
    
    if (suggestions.length === 0) {
      return res.status(404).json({ message: 'No career suggestions found' });
    }
    
    // Return the most recent suggestions
    res.json(suggestions[0]);
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    res.status(500).json({ message: 'Failed to retrieve career suggestions' });
  }
};

// Get quick options
export const getQuickOptions = async (req: Request, res: Response) => {
  try {
    const quickOptions = await storage.getActiveQuickOptions();
    
    // If no options in the database, return default options
    if (quickOptions.length === 0) {
      return res.json([
        { id: 1, text: "Best careers for 2024", category: "careers", isActive: true },
        { id: 2, text: "Engineering vs Medicine", category: "education", isActive: true },
        { id: 3, text: "Top MBA colleges", category: "education", isActive: true },
        { id: 4, text: "Take aptitude test", category: "assessment", isActive: true }
      ]);
    }
    
    res.json(quickOptions);
  } catch (error) {
    console.error('Error getting quick options:', error);
    res.status(500).json({ message: 'Failed to retrieve quick options' });
  }
};

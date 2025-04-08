import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getUserChats, 
  getChat, 
  createChat, 
  getChatMessages, 
  createChatMessage 
} from "./controllers/chat";
import { 
  createAssessment, 
  getUserAssessments 
} from "./controllers/assessment";
import { 
  getCareers, 
  getCareerCourses, 
  createCareerSuggestions,
  getLatestCareerSuggestions,
  getQuickOptions
} from "./controllers/career";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  // Chat routes
  app.get('/api/chat', getUserChats);
  app.get('/api/chat/:id', getChat);
  app.post('/api/chat', createChat);
  app.get('/api/chat/:id/messages', getChatMessages);
  app.post('/api/chat/:id/message', createChatMessage);
  
  // Assessment routes
  app.get('/api/assessments', getUserAssessments);
  app.post('/api/assessments', createAssessment);
  
  // Career routes
  app.get('/api/careers', getCareers);
  app.get('/api/careers/:careerId/courses', getCareerCourses);
  app.post('/api/career-suggestions', createCareerSuggestions);
  app.get('/api/career-suggestions/latest', getLatestCareerSuggestions);
  
  // Quick options
  app.get('/api/quick-options', getQuickOptions);
  
  // Create a default user if none exists
  try {
    // This is for demo purposes - in a real app, user management would be more robust
    const demoUser = {
      name: "Demo User",
      email: "demo@example.com",
      interests: ["technology", "education", "design"],
      educationLevel: "undergraduate"
    };
    
    const existingUser = await storage.getUserByEmail(demoUser.email);
    if (!existingUser) {
      await storage.createUser(demoUser);
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
  }

  const httpServer = createServer(app);

  return httpServer;
}

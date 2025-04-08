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
  
  // User routes
  app.get('/api/user/check', async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        return res.status(200).json({ exists: true, user });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post('/api/user', async (req, res) => {
    try {
      const userData = {
        name: req.body.name,
        email: req.body.email
      };
      
      if (!userData.name || !userData.email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(200).json({ user: existingUser, message: "User already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      return res.status(201).json({ user: newUser, message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
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

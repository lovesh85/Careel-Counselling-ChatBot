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
import {
  getAllQA,
  findAnswer,
  createQA
} from "./controllers/qa";

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
  
  // QA Database routes
  app.get('/api/qa', getAllQA);
  app.get('/api/qa/answer', findAnswer);
  app.post('/api/qa', createQA);
  
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
    
    // Seed QA database with the provided questions and answers
    const qaData = [
      {
        question: "How do I choose the right career path?",
        answer: "Identify your interests, strengths, and long-term goals. Consider taking career aptitude tests and speak to professionals or mentors in different fields.",
        category: "career"
      },
      {
        question: "What if I don't know what I want to do after graduation?",
        answer: "Start by exploring internships, volunteering, or short-term courses. This will help you discover what you enjoy and are good at.",
        category: "career"
      },
      {
        question: "Is it okay to switch career paths later?",
        answer: "Yes! Many people switch careers. Gaining transferable skills and continuous learning makes transitions smoother.",
        category: "career"
      },
      {
        question: "What are some top career options after a B.Tech in CSE?",
        answer: "Software Developer, Data Scientist, AI/ML Engineer, Cybersecurity Analyst, DevOps Engineer, or pursue higher studies like M.Tech or MS.",
        category: "education"
      },
      {
        question: "How important is competitive programming for tech jobs?",
        answer: "It helps with problem-solving and improves your chances in coding interviews, especially for product-based companies.",
        category: "skills"
      },
      {
        question: "Do I need a master's degree to get a good job in tech?",
        answer: "Not necessarily. Many top companies value skills and experience more than degrees. Certifications and projects also add value.",
        category: "education"
      },
      {
        question: "What exams are required to study abroad?",
        answer: "Common exams include GRE, TOEFL, IELTS, and sometimes GMAT depending on your course and country.",
        category: "education"
      },
      {
        question: "Which countries are best for tech careers?",
        answer: "The USA, Canada, Germany, and Australia have strong tech job markets and good post-study work opportunities.",
        category: "career"
      },
      {
        question: "Which is better: a government job or a private job?",
        answer: "Government jobs offer stability and perks, while private jobs offer faster growth and innovation. It depends on your priorities.",
        category: "career"
      },
      {
        question: "How can I prepare for government exams?",
        answer: "Start early, follow a daily routine, use NCERT books for basics, and refer to reliable coaching content online/offline.",
        category: "education"
      },
      {
        question: "Can I become an entrepreneur right after college?",
        answer: "Yes, but it's risky. Gain some experience, build a network, and understand your market well. Start small and validate your idea.",
        category: "career"
      },
      {
        question: "What career options are available apart from technical fields?",
        answer: "You can explore careers in design, digital marketing, management, civil services, content creation, or teaching.",
        category: "career"
      }
    ];
    
    // Check if QA database is empty before seeding
    const existingQA = await storage.getAllQA();
    if (existingQA.length === 0) {
      for (const qa of qaData) {
        await storage.createQA(qa);
      }
      console.log('QA database seeded successfully');
    }
  } catch (error) {
    console.error('Error creating demo user or seeding QA database:', error);
  }

  const httpServer = createServer(app);

  return httpServer;
}

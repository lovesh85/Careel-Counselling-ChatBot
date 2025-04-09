import { Request, Response } from "express";
import { storage } from "../storage";
import { like } from "drizzle-orm";

// Get all Q&A entries
export const getAllQA = async (_req: Request, res: Response) => {
  try {
    const qaEntries = await storage.getAllQA();
    return res.status(200).json(qaEntries);
  } catch (error) {
    console.error("Error retrieving QA entries:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Find answer for a question
export const findAnswer = async (req: Request, res: Response) => {
  try {
    const { question } = req.query;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ message: "Question is required" });
    }
    
    // Try to find exact match first
    const exactMatch = await storage.getQAByQuestion(question);
    
    if (exactMatch) {
      return res.status(200).json({ answer: exactMatch.answer });
    }
    
    // If no exact match, try to find similar questions
    const similarQuestions = await storage.findSimilarQuestions(question);
    
    if (similarQuestions.length > 0) {
      // Return the answer from the first similar question
      return res.status(200).json({ 
        answer: similarQuestions[0].answer,
        note: "Based on a similar question in our database"
      });
    }
    
    // Default response if no match found
    return res.status(404).json({ 
      message: "I don't have a specific answer for that question. Please try rephrasing or ask something else about career paths, education options, or job requirements."
    });
  } catch (error) {
    console.error("Error finding answer:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a new Q&A entry
export const createQA = async (req: Request, res: Response) => {
  try {
    const { question, answer, category } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }
    
    const newQA = await storage.createQA({
      question,
      answer,
      category: category || "general"
    });
    
    return res.status(201).json(newQA);
  } catch (error) {
    console.error("Error creating QA entry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
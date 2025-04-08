import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertChatSchema, insertChatMessageSchema } from '@shared/schema';
import { getGeminiResponse } from '../services/gemini';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Get user's chat history
export const getUserChats = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    const chats = await storage.getUserChats(userId);
    res.json(chats);
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({ message: 'Failed to retrieve chat history' });
  }
};

// Get a specific chat
export const getChat = async (req: Request, res: Response) => {
  try {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    
    const chat = await storage.getChat(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ message: 'Failed to retrieve chat' });
  }
};

// Create a new chat
export const createChat = async (req: Request, res: Response) => {
  try {
    // For now, using a mock user ID (in a real app, this would come from authentication)
    const userId = 1;
    
    const parsedData = insertChatSchema.parse({
      userId,
      title: req.body.title
    });
    
    const chat = await storage.createChat(parsedData);
    res.status(201).json(chat);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    
    const messages = await storage.getChatMessages(chatId);
    res.json(messages);
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({ message: 'Failed to retrieve chat messages' });
  }
};

// Create a new message in a chat
export const createChatMessage = async (req: Request, res: Response) => {
  try {
    const chatId = parseInt(req.params.id);
    if (isNaN(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    
    const { content, role } = req.body;
    
    const parsedData = insertChatMessageSchema.parse({
      chatId,
      content,
      role: role || 'user'
    });
    
    const message = await storage.createChatMessage(parsedData);
    
    // If this is a user message, generate an AI response
    if (role === 'user' || !role) {
      try {
        // Get all messages in the chat for context
        const chatMessages = await storage.getChatMessages(chatId);
        
        // Generate AI response
        const aiResponse = await getGeminiResponse(chatMessages);
        
        // Save AI response to database
        const aiMessage = await storage.createChatMessage({
          chatId,
          content: aiResponse,
          role: 'assistant'
        });
        
        // Return both messages
        return res.status(201).json({
          userMessage: message,
          aiMessage
        });
      } catch (aiError) {
        // If AI response fails, still return the user message
        console.error('Error generating AI response:', aiError);
        return res.status(201).json({
          userMessage: message,
          error: 'Failed to generate AI response'
        });
      }
    }
    
    // If it's not a user message (e.g., it's already an assistant message being saved)
    res.status(201).json(message);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Error creating chat message:', error);
    res.status(500).json({ message: 'Failed to create chat message' });
  }
};

import { 
  users, chats, chatMessages, assessments, careers, courses, careerSuggestions, quickOptions, qaDatabase,
  type User, type InsertUser, type Chat, type InsertChat, type ChatMessage, type InsertChatMessage,
  type Assessment, type InsertAssessment, type Career, type InsertCareer, type Course, type InsertCourse,
  type CareerSuggestion, type InsertCareerSuggestion, type QuickOption, type InsertQuickOption,
  type QADatabase, type InsertQADatabase
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  // QA Database operations
  getAllQA(): Promise<QADatabase[]>;
  getQAByQuestion(question: string): Promise<QADatabase | undefined>;
  findSimilarQuestions(question: string): Promise<QADatabase[]>;
  createQA(qaItem: InsertQADatabase): Promise<QADatabase>;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat operations
  getChat(id: number): Promise<Chat | undefined>;
  getUserChats(userId: number): Promise<Chat[]>;
  createChat(chat: InsertChat): Promise<Chat>;
  
  // Chat message operations
  getChatMessages(chatId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Assessment operations
  getUserAssessments(userId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Career operations
  getCareer(id: number): Promise<Career | undefined>;
  getAllCareers(): Promise<Career[]>;
  createCareer(career: InsertCareer): Promise<Career>;
  
  // Course operations
  getCareerCourses(careerId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Career suggestion operations
  getUserCareerSuggestions(userId: number): Promise<CareerSuggestion[]>;
  createCareerSuggestion(suggestion: InsertCareerSuggestion): Promise<CareerSuggestion>;
  
  // Quick option operations
  getActiveQuickOptions(): Promise<QuickOption[]>;
  createQuickOption(option: InsertQuickOption): Promise<QuickOption>;
}

export class DatabaseStorage implements IStorage {
  // QA Database operations
  async getAllQA(): Promise<QADatabase[]> {
    return await db.select().from(qaDatabase);
  }

  async getQAByQuestion(question: string): Promise<QADatabase | undefined> {
    const [qaItem] = await db.select().from(qaDatabase).where(eq(qaDatabase.question, question));
    return qaItem;
  }
  
  async findSimilarQuestions(question: string): Promise<QADatabase[]> {
    // Split the question into words (excluding common words)
    const words = question.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !['what', 'when', 'where', 'which', 'who', 'why', 'how', 'that', 'this', 'will', 'with', 'about', 'have'].includes(word)
      );
    
    if (words.length === 0) {
      return [];
    }
    
    // Create an OR condition for each keyword
    const conditions = words.map(word => ilike(qaDatabase.question, `%${word}%`));
    
    // Find questions that contain any of the keywords
    const results = await db
      .select()
      .from(qaDatabase)
      .where(or(...conditions))
      .limit(5);
    
    return results;
  }

  async createQA(qaItem: InsertQADatabase): Promise<QADatabase> {
    const [newQAItem] = await db.insert(qaDatabase).values(qaItem).returning();
    return newQAItem;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Chat operations
  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat;
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt));
  }

  async createChat(chat: InsertChat): Promise<Chat> {
    const [newChat] = await db.insert(chats).values(chat).returning();
    return newChat;
  }

  // Chat message operations
  async getChatMessages(chatId: number): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  // Assessment operations
  async getUserAssessments(userId: number): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt));
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  // Career operations
  async getCareer(id: number): Promise<Career | undefined> {
    const [career] = await db.select().from(careers).where(eq(careers.id, id));
    return career;
  }

  async getAllCareers(): Promise<Career[]> {
    return await db.select().from(careers);
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const [newCareer] = await db.insert(careers).values(career).returning();
    return newCareer;
  }

  // Course operations
  async getCareerCourses(careerId: number): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.careerId, careerId));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Career suggestion operations
  async getUserCareerSuggestions(userId: number): Promise<CareerSuggestion[]> {
    return await db
      .select()
      .from(careerSuggestions)
      .where(eq(careerSuggestions.userId, userId))
      .orderBy(desc(careerSuggestions.dateGenerated));
  }

  async createCareerSuggestion(suggestion: InsertCareerSuggestion): Promise<CareerSuggestion> {
    const [newSuggestion] = await db.insert(careerSuggestions).values(suggestion).returning();
    return newSuggestion;
  }

  // Quick option operations
  async getActiveQuickOptions(): Promise<QuickOption[]> {
    return await db.select().from(quickOptions).where(eq(quickOptions.isActive, true));
  }

  async createQuickOption(option: InsertQuickOption): Promise<QuickOption> {
    const [newOption] = await db.insert(quickOptions).values(option).returning();
    return newOption;
  }
}

export const storage = new DatabaseStorage();

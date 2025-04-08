import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  age: integer("age"),
  educationLevel: text("education_level"),
  interests: text("interests").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  assessments: many(assessments),
  careerSuggestions: many(careerSuggestions),
}));

// Chats
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(users, { fields: [chats.userId], references: [users.id] }),
  messages: many(chatMessages),
}));

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const chatMessageRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, { fields: [chatMessages.chatId], references: [chats.id] }),
}));

// Assessment Types Enum
export const assessmentTypeEnum = pgEnum("assessment_type", ["personality", "aptitude", "interest"]);

// Assessments
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: assessmentTypeEnum("type").notNull(),
  answers: jsonb("answers").notNull(),
  scores: jsonb("scores").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const assessmentRelations = relations(assessments, ({ one }) => ({
  user: one(users, { fields: [assessments.userId], references: [users.id] }),
}));

// Careers
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  requiredSkills: text("required_skills").array(),
  avgSalary: text("avg_salary").notNull(),
  industries: text("industries").array(),
});

export const careerRelations = relations(careers, ({ many }) => ({
  courses: many(courses),
}));

// Courses
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  careerId: integer("career_id").references(() => careers.id),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  link: text("link").notNull(),
});

export const courseRelations = relations(courses, ({ one }) => ({
  career: one(careers, { fields: [courses.careerId], references: [careers.id] }),
}));

// Career Suggestions
export const careerSuggestions = pgTable("career_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  recommendedCareers: jsonb("recommended_careers").notNull(),
  dateGenerated: timestamp("date_generated").defaultNow().notNull(),
});

export const careerSuggestionRelations = relations(careerSuggestions, ({ one }) => ({
  user: one(users, { fields: [careerSuggestions.userId], references: [users.id] }),
}));

// Quick Options
export const quickOptions = pgTable("quick_options", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Schema Definitions for Zod
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, completedAt: true });
export const insertCareerSchema = createInsertSchema(careers).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertCareerSuggestionSchema = createInsertSchema(careerSuggestions).omit({ id: true, dateGenerated: true });
export const insertQuickOptionSchema = createInsertSchema(quickOptions).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Chat = typeof chats.$inferSelect;
export type InsertChat = z.infer<typeof insertChatSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Career = typeof careers.$inferSelect;
export type InsertCareer = z.infer<typeof insertCareerSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type CareerSuggestion = typeof careerSuggestions.$inferSelect;
export type InsertCareerSuggestion = z.infer<typeof insertCareerSuggestionSchema>;

export type QuickOption = typeof quickOptions.$inferSelect;
export type InsertQuickOption = z.infer<typeof insertQuickOptionSchema>;

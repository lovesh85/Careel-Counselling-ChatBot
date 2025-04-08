import { ChatMessage } from '@shared/schema';

// API key from environment
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCO6Q_LnuY4hBxC4_0gv8C_wUcgdpoOsyM';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// System prompt for career counseling
const SYSTEM_PROMPT = `You are SHIFRA, an AI-powered career counseling assistant. Your primary role is to help students and professionals 
explore suitable career paths based on their interests, strengths, qualifications, and personality traits. 
You provide guidance on streams, careers, colleges, courses, and skill development opportunities.
Your responses should be informative, helpful, and personalized. Always maintain a supportive and encouraging tone.
Focus on providing actionable advice and insights rather than vague suggestions.`;

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface GeminiMessage {
  role: string;
  parts: {
    text: string;
  }[];
}

// Process conversation history for Gemini API
const formatMessages = (messages: ChatMessage[]) => {
  // Start with the system prompt
  const formattedMessages: GeminiMessage[] = [
    {
      role: "model",
      parts: [{ text: SYSTEM_PROMPT }]
    }
  ];

  // Add conversation history
  messages.forEach(message => {
    formattedMessages.push({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }]
    });
  });

  return formattedMessages;
};

// Get response from Gemini API
export const getGeminiResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const formattedMessages = formatMessages(messages);
    
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const messageText = data.candidates[0].content.parts.map(part => part.text).join('');
    return messageText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again in a moment.";
  }
};

// Get career recommendations based on user profile
export const getCareerRecommendations = async (
  interests: string[], 
  skills: string[], 
  education: string,
  assessmentResults?: Record<string, number>
): Promise<string> => {
  try {
    const prompt = `Based on the following user profile, recommend suitable career paths:
    
    Interests: ${interests.join(', ')}
    Skills: ${skills.join(', ')}
    Education: ${education}
    ${assessmentResults ? `Assessment Results: ${JSON.stringify(assessmentResults)}` : ''}
    
    Provide 3-5 career options with descriptions, required skills, and average salary ranges. Format your response as JSON with the following structure:
    {
      "careers": [
        {
          "name": "Career Name",
          "description": "Brief description of the career",
          "matchPercentage": 95,
          "skills": ["Skill 1", "Skill 2", "Skill 3"],
          "avgSalary": "Salary range"
        }
      ]
    }`;

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const rawResponse = data.candidates[0].content.parts.map(part => part.text).join('');
    return rawResponse;
  } catch (error) {
    console.error('Error getting career recommendations:', error);
    throw error;
  }
};

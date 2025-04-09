import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ChatMessage, Chat, ErrorResponse } from '../types';

export function useChat(chatId?: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // Get chat messages if chatId is provided
  const { data: chatMessagesData, isLoading: isLoadingMessages } = useQuery<ChatMessage[], ErrorResponse>({
    queryKey: chatId ? ['/api/chat/messages', chatId] : [],
    enabled: !!chatId,
  });

  // Create a new chat
  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest('POST', '/api/chat', { title });
      return res.json();
    },
    onSuccess: (data: Chat) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat'] });
      return data;
    },
  });

  // Send a chat message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      chatId, content, role = 'user' 
    }: { 
      chatId: number; 
      content: string; 
      role?: 'user' | 'assistant';
    }) => {
      const res = await apiRequest('POST', `/api/chat/${chatId}/message`, { 
        content, 
        role
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', chatId] });
      return data;
    },
  });

  // Initialize chat with welcome message or load existing messages
  useEffect(() => {
    if (chatId && chatMessagesData) {
      setMessages(chatMessagesData);
    } else if (!chatId) {
      setMessages([
        { 
          id: 0, 
          chatId: 0, 
          content: "Hello there! I'm SHIFRA, your career counseling assistant. How can I help you today? I can assist with career suggestions, aptitude assessments, and educational guidance.", 
          role: 'assistant', 
          timestamp: new Date().toISOString() 
        }
      ]);
    }
  }, [chatId, chatMessagesData]);

  // Start a new chat
  const startNewChat = useCallback(async () => {
    setMessages([
      { 
        id: 0, 
        chatId: 0, 
        content: "Hello there! I'm SHIFRA, your career counseling assistant. How can I help you today? I can assist with career suggestions, aptitude assessments, and educational guidance.", 
        role: 'assistant', 
        timestamp: new Date().toISOString() 
      }
    ]);
    return null;
  }, []);

  // Send a message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        chatId: chatId || 0,
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setCurrentMessage('');
      
      // Create a new chat if there isn't one
      let activeChatId = chatId;
      if (!activeChatId) {
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        const newChat = await createChatMutation.mutateAsync(title);
        activeChatId = newChat.id;
      }
      
      // Save user message to database
      await sendMessageMutation.mutateAsync({
        chatId: activeChatId,
        content,
        role: 'user'
      });
      
      // Get answer from the QA database
      let aiResponse = "";
      try {
        // Ask the database for an answer to the question
        const res = await fetch(`/api/qa/answer?question=${encodeURIComponent(content)}`);
        const data = await res.json();
        
        if (res.ok && data.answer) {
          aiResponse = data.answer;
        } else {
          aiResponse = "I don't have specific information about that. Please ask me about career paths, education options, or job requirements.";
        }
      } catch (error) {
        console.error('Error getting answer from database:', error);
        aiResponse = "I'm sorry, I encountered an error retrieving information. Please try a different question.";
      }
      
      // Add AI message to UI
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        chatId: activeChatId,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save AI message to database
      await sendMessageMutation.mutateAsync({
        chatId: activeChatId,
        content: aiResponse,
        role: 'assistant'
      });
      
      return activeChatId;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now() + 2,
        chatId: chatId || 0,
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      setMessages([...messages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [chatId, messages, createChatMutation, sendMessageMutation]);

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    startNewChat,
    isLoading: isLoadingMessages,
    isProcessing
  };
}

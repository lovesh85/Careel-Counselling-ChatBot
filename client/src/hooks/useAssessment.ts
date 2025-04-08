import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Assessment, AssessmentType, CareerSuggestion } from '../types';
import { useCallback } from 'react';

export function useAssessment() {
  const queryClient = useQueryClient();

  // Get all assessments for the current user
  const { data: assessments, isLoading: isLoadingAssessments } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Get latest career suggestions
  const { data: careerSuggestion, isLoading: isLoadingCareerSuggestions } = useQuery<CareerSuggestion>({
    queryKey: ['/api/career-suggestions/latest'],
  });

  // Create new assessment
  const createAssessmentMutation = useMutation({
    mutationFn: async (params: {
      type: AssessmentType; 
      answers: Record<string, any>;
      scores: Record<string, number>;
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/assessments',
        params
      );
      return response.json() as Promise<Assessment>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assessments'] });
    }
  });

  // Create career suggestion based on assessment results
  const createCareerSuggestionMutation = useMutation({
    mutationFn: async (params: {
      assessmentId: number;
      results: Record<string, number>;
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/career-suggestions',
        params
      );
      return response.json() as Promise<CareerSuggestion>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/career-suggestions/latest'] });
    }
  });

  // Start a new assessment
  const startAssessment = useCallback(async (type: AssessmentType) => {
    const mockAnswers = { completed: true };
    const mockScores = { overall: 85 };
    
    // For now, just create a basic assessment record
    try {
      const result = await createAssessmentMutation.mutateAsync({
        type,
        answers: mockAnswers,
        scores: mockScores,
      });
      return result;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error;
    }
  }, [createAssessmentMutation]);

  return {
    assessments,
    careerSuggestion,
    isLoadingAssessments,
    isLoadingCareerSuggestions,
    startAssessment,
    createCareerSuggestion: createCareerSuggestionMutation.mutateAsync,
    isCreatingAssessment: createAssessmentMutation.isPending,
    isCreatingCareerSuggestion: createCareerSuggestionMutation.isPending,
  };
}
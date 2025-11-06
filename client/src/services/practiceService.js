import { apiClient } from './api';
import { authService } from './authService';

export const practiceService = {
  // Get all sections with nodes
  getSections: async () => {
    const token = authService.getToken();
    const response = await apiClient.get('/practice/sections', token);
    return response;
  },

  // Get completed nodes
  getCompletedNodes: async () => {
    const token = authService.getToken();
    const response = await apiClient.get('/practice/completed', token);
    return response;
  },

  // Get questions for node
  getQuestions: async (sectionId, nodeId) => {
    const token = authService.getToken();
    const response = await apiClient.get(`/practice/questions/${sectionId}/${nodeId}`, token);
    return response;
  },

  // Complete node
  completeNode: async (sectionId, nodeId, score = 100, timeSpent = 0) => {
    const token = authService.getToken();
    const response = await apiClient.post('/practice/complete',
      { sectionId, nodeId, score, timeSpent },
      token
    );

    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  // ✅ REMOVED updateHearts method
};
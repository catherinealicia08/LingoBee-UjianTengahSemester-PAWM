import { apiClient } from './api.js';

export const dashboardService = {
  // Get featured news
  getFeaturedNews: async (token) => {
    return await apiClient.get('/dashboard/featured-news', token);
  },

  // Get materials with optional filters
  getMaterials: async (token, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.chapter) params.append('chapter', filters.chapter);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/dashboard/materials?${queryString}` : '/dashboard/materials';
    
    return await apiClient.get(endpoint, token);
  },

  // Get dashboard stats
  getStats: async (token) => {
    return await apiClient.get('/dashboard/stats', token);
  },

  // Get material filters
  getMaterialFilters: async (token) => {
    return await apiClient.get('/dashboard/material-filters', token);
  }
};
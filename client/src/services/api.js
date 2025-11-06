const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  post: async (endpoint, data, token) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('POST Error:', error);
      return { success: false, error: error.message };
    }
  },

  get: async (endpoint, token) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      return await response.json();
    } catch (error) {
      console.error('GET Error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ Add PUT method
  put: async (endpoint, data, token) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error('PUT Error:', error);
      return { success: false, error: error.message };
    }
  },

  // ✅ Add DELETE method
  delete: async (endpoint, token) => {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      return await response.json();
    } catch (error) {
      console.error('DELETE Error:', error);
      return { success: false, error: error.message };
    }
  }
};
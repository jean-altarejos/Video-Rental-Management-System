// src/api/axiosClient.ts
import axios from 'axios';

export const axiosClient = axios.create({
  // Uses Vite's proxy route or environment variable
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptor for global error handling or passing auth tokens
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log backend ProblemDetails or server errors
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
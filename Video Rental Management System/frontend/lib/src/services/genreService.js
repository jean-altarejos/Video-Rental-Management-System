// src/services/genreService.js
import axios from 'axios';

const API_URL = 'https://localhost:7065/api/Movies'; // Adjust port to match your .NET backend

export const genreService = {
  getAll: () => axios.get(`${API_URL}/genres`),
};
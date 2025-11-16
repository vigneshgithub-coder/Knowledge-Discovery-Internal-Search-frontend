import axios from 'axios';
// @ts-ignore
import { userStorage } from '../utils/userStorage';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export const uploadDocument = async (file: File, projectName: string, tags: string, options?: { category?: string; team?: string; userId?: string }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectName', projectName);
  formData.append('tags', tags);
  
  // Get userId from localStorage or options
  const userId = options?.userId || localStorage.getItem('userId');
  if (userId) {
    formData.append('userId', userId);
  }

  // Add category and team if provided
  if (options?.category) {
    formData.append('category', options.category);
  }
  if (options?.team) {
    formData.append('team', options.team);
  }

  const response = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const searchDocuments = async (query: string, projectName?: string) => {
  // Get userId using userStorage
  const userId = userStorage.getUserId();

  const requestBody: any = {
    query,
    projectName: projectName || null,
  };
  
  if (userId) {
    requestBody.userId = userId;
  }

  const response = await apiClient.post('/search', requestBody);
  return response.data.results; // Extract results array from response
};

export const getDocuments = async (projectName?: string, userId?: string) => {
  const params = new URLSearchParams();
  if (projectName) params.append('projectName', projectName);
  if (userId) params.append('userId', userId);
  
  const response = await apiClient.get(`/documents${params.toString() ? '?' + params.toString() : ''}`);

  return response.data.documents;
};

export const getProjects = async () => {
  const response = await apiClient.get('/documents/projects');
  return response.data.projects;
};

export const deleteDocument = async (id: string) => {
  const response = await apiClient.delete(`/documents/${id}`);
  return response.data;
};

export const getDocumentChunks = async (id: string) => {
  const response = await apiClient.get(`/documents/${id}/chunks`);
  return response.data;
};

export const getSuggestions = async (q: string) => {
  const response = await apiClient.get('/search/suggestions', { params: { q } });
  return response.data;
};

export const getAdminAnalytics = async () => {
  const response = await apiClient.get('/admin/analytics');
  return response.data.data;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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

export const uploadDocument = async (file: File, projectName: string, tags: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectName', projectName);
  formData.append('tags', tags);

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const searchDocuments = async (query: string, projectName?: string) => {
  const response = await apiClient.post('/search', {
    query,
    projectName: projectName || null,
  });

  return response.data;
};

export const getDocuments = async (projectName?: string) => {
  const params = projectName ? `?projectName=${projectName}` : '';
  const response = await apiClient.get(`/documents${params}`);

  return response.data;
};

export const getProjects = async () => {
  const response = await apiClient.get('/documents/projects');
  return response.data;
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

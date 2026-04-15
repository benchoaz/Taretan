import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth service
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Disposisi service
export const disposisiService = {
  create: async (disposisiData) => {
    const response = await api.post('/disposisi', disposisiData);
    return response.data;
  },
  getMonitoring: async (params = {}) => {
    const response = await api.get('/disposisi/monitoring', { params });
    return response.data;
  },
  getSuratMasuk: async () => {
    const response = await api.get('/surat-masuk');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

// Laporan service
export const laporanService = {
  upload: async (formData) => {
    const response = await api.post('/laporan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
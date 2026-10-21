import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: automatically attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('qr_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: clean error handling and token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('qr_admin_token');
        localStorage.removeItem('qr_admin_user');
        window.dispatchEvent(new Event('qr_auth_expired'));
      }
      return Promise.reject(error.response.data || { message: 'Server returned an error' });
    } else if (error.request) {
      return Promise.reject({ message: 'No response received from server. Check your network or server status.' });
    }
    return Promise.reject({ message: error.message || 'An unexpected error occurred' });
  }
);

// Health API
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Auth API
export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// QR API
export const qrApi = {
  list: async (params = {}) => {
    const res = await api.get('/qr', { params });
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/qr/stats');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/qr/${id}`);
    return res.data;
  },
  create: async ({ title, destinationUrl, folder }) => {
    const res = await api.post('/qr', { title, destinationUrl, folder });
    return res.data;
  },
  update: async (id, { title, destinationUrl, folder }) => {
    const res = await api.patch(`/qr/${id}`, { title, destinationUrl, folder });
    return res.data;
  },
  toggleStatus: async (id) => {
    const res = await api.patch(`/qr/${id}/status`);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/qr/${id}`);
    return res.data;
  },
  downloadUrl: (id) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    return `${baseUrl}/qr/${id}/download`;
  },
};

export default api;

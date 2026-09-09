import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't wipe if we are attempting login
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

// Patient Services
export const patientService = {
  getPatients: async () => {
    const res = await api.get('/patients');
    return res.data;
  },
  getPatient: async (id) => {
    const res = await api.get(`/patients/${id}`);
    return res.data;
  },
  createPatient: async (patientData) => {
    const res = await api.post('/patients', patientData);
    return res.data;
  },
  updatePatient: async (id, patientData) => {
    const res = await api.put(`/patients/${id}`, patientData);
    return res.data;
  },
  deletePatient: async (id) => {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  },
  getPatientAssessments: async (id) => {
    const res = await api.get(`/patients/${id}/assessments`);
    return res.data;
  },
};

// Prediction Services
export const predictionService = {
  predict: async (ctgData) => {
    const res = await api.post('/predictions', ctgData);
    return res.data;
  },
  getMetadata: async () => {
    const res = await api.get('/predictions/metadata');
    return res.data;
  },
};

// Assessment Services
export const assessmentService = {
  getAssessments: async () => {
    const res = await api.get('/assessments');
    return res.data;
  },
  getAssessment: async (id) => {
    const res = await api.get(`/assessments/${id}`);
    return res.data;
  },
  createAssessment: async (data) => {
    const res = await api.post('/assessments', data);
    return res.data;
  },
  getDashboardStats: async () => {
    const res = await api.get('/assessments/stats/summary');
    return res.data;
  },
  generateExplanation: async (id) => {
    const res = await api.post(`/assessments/${id}/explanation`);
    return res.data;
  },
  getReportDownloadUrl: (id) => {
    return `${API_BASE_URL}/assessments/${id}/report`;
  },
  downloadReport: async (id) => {
    const res = await api.get(`/assessments/${id}/report`, {
      responseType: 'blob',
    });
    return res.data;
  },
};

export default api;

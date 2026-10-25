import axios from 'axios'

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
}

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  getRecent: () => api.get('/transactions/recent'),
  create: (data) => api.post('/transactions', data),
  getById: (id) => api.get(`/transactions/${id}`),
}

export const beneficiaryAPI = {
  getAll: () => api.get('/beneficiaries'),
  create: (data) => api.post('/beneficiaries', data),
  delete: (id) => api.delete(`/beneficiaries/${id}`),
}

export const alertAPI = {
  getAll: () => api.get('/alerts'),
  markAsRead: (id) => api.put(`/alerts/${id}/read`),
}

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getBalance: () => api.get('/users/balance'),
}

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getFraudLogs: () => api.get('/admin/fraud-logs'),
  getLiveTransactions: () => api.get('/admin/live-transactions'),
}

export default api
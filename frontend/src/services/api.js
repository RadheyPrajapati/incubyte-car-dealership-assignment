import axios from 'axios';

// Create configured Axios instance pointing to backend REST API
const API = axios.create({
  baseURL: 'https://incubyte-car-dealership-assignment.onrender.com/api'
});

// Request Interceptor: Automatically attach Bearer token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dealership_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Helper Methods
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

export const vehicleAPI = {
  getAll: () => API.get('/vehicles'),
  search: (params) => API.get('/vehicles/search', { params }),
  create: (data) => API.post('/vehicles', data),
  update: (id, data) => API.put(`/vehicles/${id}`, data),
  delete: (id) => API.delete(`/vehicles/${id}`)
};

export const inventoryAPI = {
  purchase: (id) => API.post(`/vehicles/${id}/purchase`),
  restock: (id, count) => API.post(`/vehicles/${id}/restock`, { count })
};

export default API;

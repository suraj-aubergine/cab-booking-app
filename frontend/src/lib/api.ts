import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Adding auth token:', token)
  } else {
    console.log('No auth token available')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data)
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPath = ['/login', '/register'].includes(currentPath);
      
      if (!isAuthPath) {
        const store = useAuthStore.getState();
        store.clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error)
  }
)

// Remove the second export
// export { api } 
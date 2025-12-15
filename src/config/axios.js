/**
 * Configuration Axios - ARO Assurance
 * @version FINALE OPTIMISÉE
 */

import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// ✅ REQUEST INTERCEPTOR
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logs en dev uniquement
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token
      });
    }

    // Désactiver timeout pour uploads
    if (config.headers['Content-Type']?.includes('multipart/form-data') || 
        config.url?.includes('/upload') ||
        config.url?.includes('/photo')) {
      config.timeout = 0;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
instance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message;

    console.error('❌ API Error:', { status, url, message });

    // Déconnexion UNIQUEMENT si token invalide
    if (status === 401 && 
        message && 
        (message.toLowerCase().includes('token invalide') || 
         message.toLowerCase().includes('token expiré') ||
         message.toLowerCase().includes('non autorisé'))) {
      
      console.log('🚪 Token invalide - Déconnexion');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirection selon contexte
      const path = window.location.pathname;
      if (path.includes('/assure')) {
        window.location.href = '/login-assure';
      } else if (path.includes('/admin')) {
        window.location.href = '/login-admin';
      }
    }

    // Fichier trop volumineux
    if (status === 413) {
      alert('❌ Fichier(s) trop volumineux. Limite: 10 Mo par fichier');
    }

    return Promise.reject(error);
  }
);

export default instance;

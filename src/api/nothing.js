/**
 * Configuration Axios - VERSION PRODUCTION
 * Instance Axios avec intercepteurs
 * ARO Assurance Madagascar
 */

import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Intercepteur de requête
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // ✅ LOGS EN DEV UNIQUEMENT
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
      });
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse
 */
instance.interceptors.response.use(
  (response) => {
    // ✅ LOGS EN DEV UNIQUEMENT
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
      });
    }
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    };

    // ✅ LOGS EN DEV UNIQUEMENT
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', errorDetails);
    }

    // Gestion 401 - Token invalide/expiré
    if (error.response?.status === 401) {
      const tokenErrors = ['Token invalide', 'Token expiré', 'jwt expired', 'invalid token'];
      const hasTokenError = tokenErrors.some(msg => 
        error.response?.data?.message?.toLowerCase().includes(msg.toLowerCase())
      );

      if (hasTokenError) {
        console.log('🚪 Déconnexion - Token invalide');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirection basée sur le rôle précédent
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const loginPath = user.role === 'admin' ? '/login-admin' : '/login-assure';
        
        window.location.href = loginPath;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

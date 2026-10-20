/**
 * Configuration Axios
 * Instance API configurée pour l'application
 * ARO Assurance Madagascar - Frontend Vite + React
 * 
 * @author Équipe ARO
 * @version 1.0.0
 */

import axios from 'axios';

/**
 * Configuration de l'URL de base selon l'environnement
 * - Production: URL backend déployée sur Render
 * - Development: localhost:5000
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

/**
 * Instance Axios configurée
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
  withCredentials: false, // Important pour CORS
});

/**
 * Intercepteur de requêtes
 * Ajoute automatiquement le token JWT à chaque requête
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de la requête en mode développement
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponses
 * Gère les erreurs globales (401, 403, 500, etc.)
 */
api.interceptors.response.use(
  (response) => {
    // Log de la réponse en mode développement
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Extraction des informations d'erreur
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const url = error.config?.url;

    console.error(`[API Error] ${status || 'Network Error'} on ${url}`, {
      message,
      error: error.response?.data,
    });

    // Gestion des erreurs par code HTTP
    switch (status) {
      case 401:
        // Non authentifié - Redirection vers login
        handleUnauthorized();
        break;

      case 403:
        // Accès interdit
        console.warn('[403] Accès refusé à cette ressource');
        break;

      case 404:
        // Ressource introuvable
        console.warn('[404] Ressource introuvable:', url);
        break;

      case 500:
        // Erreur serveur
        console.error('[500] Erreur interne du serveur');
        break;

      case 503:
        // Service indisponible
        console.error('[503] Service temporairement indisponible');
        break;

      default:
        // Erreur réseau ou autre
        if (!error.response) {
          console.error('[Network Error] Impossible de contacter le serveur');
        }
    }

    return Promise.reject(error);
  }
);

/**
 * Gère la déconnexion en cas d'erreur 401
 */
function handleUnauthorized() {
  console.warn('[401] Token invalide ou expiré - Déconnexion');
  
  // Nettoyage du localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');

  // Redirection vers la page de connexion
  const currentPath = window.location.pathname;
  
  // Évite les redirections infinies
  if (!currentPath.includes('/login')) {
    // Détermine la page de login selon le rôle
    const isAdminRoute = currentPath.includes('/admin');
    const loginRoute = isAdminRoute ? '/login-admin' : '/login';
    
    window.location.href = loginRoute;
  }
}

/**
 * Helper pour vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Helper pour récupérer les informations utilisateur
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Helper pour déconnexion manuelle
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  window.location.href = '/login';
};

export default api;

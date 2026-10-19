/**
 * API d'authentification
 * Endpoints pour login, logout, réinitialisation mot de passe
 * ARO Assurance Madagascar
 */

import axios from '../config/axios';

export const authApi = {
  /**
   * Connexion assuré avec 4 identifiants
   */
  loginAssure: async (credentials) => {
    const response = await axios.post('/auth/login-assure', credentials);
    return response.data;
  },

  /**
   * Connexion administrateur
   */
  loginAdmin: async (credentials) => {
    const response = await axios.post('/auth/login-admin', credentials);
    return response.data;
  },

  /**
   * Demande de réinitialisation mot de passe (OTP)
   */
  requestPasswordReset: async (identifier) => {
    const response = await axios.post('/auth/request-password-reset', {
      identifier,
    });
    return response.data;
  },

  /**
   * Vérifier le code OTP
   */
  verifyOTP: async (email, otpCode) => {
    const response = await axios.post('/auth/verify-otp', {
      identifier: email,
      code_otp: otpCode,
    });
    return response.data;
  },

  /**
   * Réinitialiser le mot de passe avec code OTP
   */
  resetPassword: async (data) => {
    const response = await axios.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  /**
   * Vérifier la validité du token
   */
  verifyToken: async () => {
    const response = await axios.get('/auth/verify-token');
    return response.data;
  },

  /**
   * Obtenir les informations de l'utilisateur connecté
   */
  getMe: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },
};

export default authApi;

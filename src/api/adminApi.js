/**
 * API administrateur - VERSION CORRIGÉE
 * Endpoints pour la gestion admin
 * ARO Assurance Madagascar
 */

import axios from './nothing';

export const adminApi = {
  // ========== GESTION DES ASSURÉS ==========
  
  createAssure: async (data) => {
    const response = await axios.post('/admin/assures', data);
    return response.data;
  },

  getAllAssures: async (params = {}) => {
    const response = await axios.get('/admin/assures', { params });
    return response.data;
  },

  getAssureById: async (id) => {
    const response = await axios.get(`/admin/assures/${id}`);
    return response.data;
  },

  updateAssure: async (id, data) => {
    const response = await axios.patch(`/admin/assures/${id}`, data);
    return response.data;
  },

  updateStatutContrat: async (id, data) => {
    const response = await axios.patch(`/admin/assures/${id}/statut`, data);
    return response.data;
  },

  addAyantDroit: async (id, data) => {
    const response = await axios.post(`/admin/assures/${id}/ayants-droit`, data);
    return response.data;
  },

  // ========== GESTION DES DÉCLARATIONS ==========
  
  getAllDeclarations: async (params = {}) => {
    const response = await axios.get('/admin/declarations', { params });
    return response.data;
  },

  getDeclarationDetails: async (id) => {
    const response = await axios.get(`/admin/declarations/${id}`);
    return response.data;
  },

  updateDeclarationStatut: async (id, data) => {
    const response = await axios.patch(`/admin/declarations/${id}/statut`, data);
    return response.data;
  },

  addCommentaire: async (id, data) => {
    const response = await axios.post(`/admin/declarations/${id}/commentaire`, data);
    return response.data;
  },

  // ========== STATISTIQUES ==========
  
  /**
   * ✅ CORRIGÉ : /admin/dashboard/stats au lieu de /statistiques
   */
  getDashboardStats: async () => {
    const response = await axios.get('/admin/dashboard/stats');
    return response.data;
  },

  // ========== RAPPORTS ==========
  
  getDeclarationsReport: async (params = {}) => {
    const response = await axios.get('/admin/rapports/declarations', { params });
    return response.data;
  },

  getAssuresReport: async (params = {}) => {
    const response = await axios.get('/admin/rapports/assures', { params });
    return response.data;
  },
};

export default adminApi;
